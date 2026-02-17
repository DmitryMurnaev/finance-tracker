import { useState, useEffect, useMemo } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionTypeMenu from '../components/Transactions/TransactionTypeMenu';
import MobileLayout from '../components/Layout/MobileLayout';
import DesktopLayout from '../components/Layout/DesktopLayout';
import ScrollToTopButton from '../components/UI/ScrollToTopButton';
import BalanceCard from '../components/Layout/BalanceCard';
import AccountForm from '../components/Accounts/AccountForm';
import '../index.css';

function Home() {
    const [transactions, setTransactions] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(false);
    const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    // Новые состояния для меню выбора типа
    const [showTypeMenu, setShowTypeMenu] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        console.log('isAccountFormOpen =', isAccountFormOpen);
    }, [isAccountFormOpen]);

    // отслеживать состояние меню
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleSaveAccount = async (accountData, accountId) => {
        try {
            if (accountId) {
                await accountAPI.updateAccount(accountId, accountData);
            } else {
                await accountAPI.createAccount(accountData);
            }
            await fetchAccounts();
        } catch (err) {
            console.error('Ошибка сохранения счета:', err);
            alert('Ошибка при сохранении счета: ' + (err.response?.data?.error || err.message));
            throw err;
        }
    };

    const handleAddAccount = () => {
        console.log('📝 handleAddAccount вызван');
        setEditingAccount(null);
        setIsAccountFormOpen(true);
    };

    const handleEditAccount = (account) => {
        setEditingAccount(account);
        setIsAccountFormOpen(true);
    };

    const handleDeleteAccount = async (id) => {
        if (!window.confirm('Удалить счёт? Все транзакции этого счета останутся без привязки.')) return;
        try {
            await accountAPI.deleteAccount(id);
            await fetchAccounts();
        } catch (err) {
            alert('Не удалось удалить счёт');
        }
    };

    const fetchAccounts = async () => {
        setAccountsLoading(true);
        try {
            const data = await accountAPI.getAccounts();
            console.log('📥 fetchAccounts получил данные:', data);
            setAccounts(data);
        } catch (err) {
            console.error('Ошибка загрузки счетов', err);
        } finally {
            setAccountsLoading(false);
        }
    };

    // Обработчики транзакций
    const updateTransaction = async (id, updateData) => {
        try {
            await transactionAPI.updateTransaction(id, updateData);
            await fetchTransactions();
            await fetchAccounts();
            setEditingTransaction(null);
            setIsFormOpen(false);
        } catch {
            alert('Не удалось обновить операцию');
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsFormOpen(true);
    };

    const [selectedPeriod, setSelectedPeriod] = useState('all');

    useEffect(() => { fetchTransactions(); }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transactionAPI.getTransactions();
            setTransactions(data);
        } catch {
            setError('Не удалось загрузить данные');
            setTransactions([]);
        } finally { setLoading(false); }
    };

    const addTransaction = async (newTransaction) => {
        try {
            await transactionAPI.createTransaction(newTransaction);
            await fetchTransactions();
            await fetchAccounts();
            setIsFormOpen(false);
            setSelectedType(null);
        } catch { alert('Не удалось добавить операцию'); }
    };

    const deleteTransaction = async (id) => {
        if (!window.confirm('Удалить операцию?')) return;
        try {
            await transactionAPI.deleteTransaction(id);
            await fetchTransactions();
            await fetchAccounts();
        } catch { alert('Не удалось удалить операцию'); }
    };

    const calculateStats = () => {
        if (!Array.isArray(transactions)) return { totalIncome: 0, totalExpenses: 0 };
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

    // Обработчик открытия меню добавления
    const handleAddClick = () => {
        setIsMenuOpen(true);
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
        setIsMenuOpen(false);
        setShowTypeMenu(false);
    };

    return (
        <>
            <MobileLayout
                accounts={accounts}
                onEditAccount={handleEditAccount}
                onDeleteAccount={handleDeleteAccount}
                onAddAccount={handleAddAccount}
                onAddClick={handleAddClick}  // передаём открытие меню
                transactions={filteredTransactions}
                allTransactions={transactions}
                loading={loading}
                error={error}
                fetchTransactions={fetchTransactions}
                deleteTransaction={deleteTransaction}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                totalBalance={totalBalance}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsFormOpen={setIsFormOpen} // возможно не нужно
                periods={periods}
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
                onEditTransaction={handleEdit}
                isMenuOpen={isMenuOpen}
            />
            <DesktopLayout
                isMenuOpen={isMenuOpen}
                accounts={accounts}
                onAddAccount={handleAddAccount}
                onEditAccount={handleEditAccount}
                onDeleteAccount={handleDeleteAccount}
                onAddClick={handleAddClick}
                transactions={filteredTransactions}
                allTransactions={transactions}
                loading={loading}
                error={error}
                fetchTransactions={fetchTransactions}
                deleteTransaction={deleteTransaction}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                totalBalance={totalBalance}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsFormOpen={setIsFormOpen}
                periods={periods}
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
                onEditTransaction={handleEdit}
            />
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