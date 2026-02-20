import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { accountAPI, transactionAPI } from '../services/api';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionTypeMenu from '../components/Transactions/TransactionTypeMenu';
import AccountsSlider from '../components/Accounts/AccountsSlider';
import BalanceCard from '../components/Layout/BalanceCard';
import StatsBlocks from '../components/Layout/StatsBlocks';
import TransactionList from '../components/Transactions/TransactionList';
import Statistics from '../components/Statistics/Statistics';
import PeriodSelector from '../components/UI/PeriodSelector';
import { History as HistoryIcon } from 'lucide-react';
import ScrollToTopButton from '../components/UI/ScrollToTopButton';
import AccountForm from '../components/Accounts/AccountForm';
import { useModal } from "../context/ModalContext.jsx";
import '../index.css';

function Home({ isMenuOpen, onCloseMenu }) { // ✅ принимаем пропсы
    const { activeTab, setActiveTab, showTypeMenu, setShowTypeMenu } = useOutletContext();
    const { showConfirm, showToast } = useModal();
    const [transactions, setTransactions] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    useEffect(() => {
        fetchAccounts();
        fetchTransactions();
    }, []);

    const fetchAccounts = async () => {
        setAccountsLoading(true);
        try {
            const data = await accountAPI.getAccounts();
            setAccounts(data);
        } catch (err) {
            console.error('Ошибка загрузки счетов', err);
        } finally {
            setAccountsLoading(false);
        }
    };
    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transactionAPI.getTransactions();
            setTransactions(data);
        } catch {
            setError('Не удалось загрузить данные');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Обработчики транзакций
    const addTransaction = async (newTransaction) => {
        try {
            await transactionAPI.createTransaction(newTransaction);
            await fetchTransactions();
            await fetchAccounts();
            setIsFormOpen(false);
            setSelectedType(null);
            showToast({ message: 'Операция добавлена', type: 'success' });
        } catch {
            showToast({ message: 'Не удалось добавить операцию', type: 'error' });
        }
    };

    const updateTransaction = async (id, updateData) => {
        try {
            await transactionAPI.updateTransaction(id, updateData);
            await fetchTransactions();
            await fetchAccounts();
            setEditingTransaction(null);
            setIsFormOpen(false);
            showToast({ message: 'Операция обновлена', type: 'success' });
        } catch {
            showToast({ message: 'Не удалось обновить операцию', type: 'error' });
        }
    };

    const deleteTransaction = async (id) => {
        showConfirm({
            title: 'Удаление операции',
            message: 'Вы уверены, что хотите удалить эту операцию?',
            onConfirm: async () => {
                try {
                    await transactionAPI.deleteTransaction(id);
                    await fetchTransactions();
                    await fetchAccounts();
                } catch {
                    showToast({ message: 'Не удалось удалить операцию', type: 'error' });
                }
            },
        });
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsFormOpen(true);
    };

    // Обработчики счетов
    const handleAddAccount = () => {
        setEditingAccount(null);
        setIsAccountFormOpen(true);
    };

    const handleEditAccount = (account) => {
        setEditingAccount(account);
        setIsAccountFormOpen(true);
    };

    const handleDeleteAccount = async (id) => {
        showConfirm({
            title: 'Удаление счета',
            message: 'Удалить счет ?',
            onConfirm: async () => {
                try {
                    await accountAPI.deleteAccount(id);
                    await fetchAccounts();
                } catch {
                    showToast({ message: 'Не удалось удалить счёт', type: 'error' });
                }
            },
        });
    };

    const handleSaveAccount = async (accountData, accountId) => {
        try {
            if (accountId) {
                await accountAPI.updateAccount(accountId, accountData);
                showToast({ message: 'Счёт обновлён', type: 'success' });
            } else {
                await accountAPI.createAccount(accountData);
                showToast({ message: 'Счёт создан', type: 'success' });
            }
            await fetchAccounts();
        } catch {
            showToast({ message: 'Ошибка сохранения счёта', type: 'error' });
        }
    };

    // Статистика
    const calculateStats = () => {
        const totalIncome = transactions
            .filter(t => t?.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalExpenses = transactions
            .filter(t => t?.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return { totalIncome, totalExpenses };
    };
    const { totalIncome, totalExpenses } = calculateStats();

    const periods = useMemo(() => {
        const dates = transactions.map(t => t.date).filter(Boolean);
        const unique = [...new Set(dates.map(d => d.slice(0, 7)))];
        return unique.sort().reverse();
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        if (selectedPeriod === 'all') return transactions;
        return transactions.filter(t => t.date && t.date.startsWith(selectedPeriod));
    }, [transactions, selectedPeriod]);

    const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

    const handleAddClick = () => {
        setShowTypeMenu(true);
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setShowTypeMenu(false);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedType(null);
        setEditingTransaction(null);
    };

    const handleCloseMenu = () => {
        setShowTypeMenu(false);
        if (onCloseMenu) onCloseMenu();
    };

    return (
        <>
            {/* Основной контент */}
            <div className="p-4">
                {activeTab === 'home' && (
                    <>
                        <AccountsSlider
                            accounts={accounts}
                            onAddClick={handleAddAccount}
                            onEditAccount={handleEditAccount}
                            onDeleteAccount={handleDeleteAccount}
                        />
                        <BalanceCard balance={totalBalance} totalIncome={totalIncome} />
                        <StatsBlocks totalIncome={totalIncome} totalExpenses={totalExpenses} />
                    </>
                )}

                {activeTab === 'home' ? (
                    <>
                        <div className="bg-white rounded-xl shadow border border-gray-100 p-3 sm:p-4 mb-4">
                            <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between gap-3">
                                <div className="flex items-center gap-1">
                                    <HistoryIcon size={20} className="text-gray-600" />
                                    <h2 className="font-semibold text-sm sm:text-base">
                                        Последние операции
                                    </h2>
                                </div>
                                <PeriodSelector
                                    periods={periods}
                                    selectedPeriod={selectedPeriod}
                                    onChange={setSelectedPeriod}
                                    className="flex flex-wrap gap-1 sm:gap-2 min-[380px]:justify-end"
                                />
                            </div>
                        </div>
                        <TransactionList
                            transactions={filteredTransactions}
                            loading={loading}
                            error={error}
                            onDelete={deleteTransaction}
                            onRetry={fetchTransactions}
                            onEdit={handleEdit}
                        />
                    </>
                ) : (
                    <Statistics transactions={transactions} />
                )}
            </div>

            {/* Модальные окна */}
            <TransactionForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onAddTransaction={addTransaction}
                onUpdateTransaction={updateTransaction}
                editingTransaction={editingTransaction}
                mode={selectedType}
            />
            {showTypeMenu && (
                <TransactionTypeMenu
                    onSelectType={handleTypeSelect}
                    onClose={handleCloseMenu}
                />
            )}
            <ScrollToTopButton />
            <AccountForm
                isOpen={isAccountFormOpen}
                onClose={() => setIsAccountFormOpen(false)}
                onSave={handleSaveAccount}
                onDelete={handleDeleteAccount}
                editingAccount={editingAccount}
            />
        </>
    );
}

export default Home;