import { useState, useEffect, useMemo } from 'react';
import { accountAPI, transactionAPI } from '../services/api';
import TransactionForm from '../components/Transactions/TransactionForm';
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

    useEffect(() => {
        fetchAccounts();
    }, []);


    // Функция сохранения счета (создание/обновление)
    const handleSaveAccount = async (accountData, accountId) => {
        if (accountId) {
            await accountAPI.updateAccount(accountId, accountData);
        } else {
            await accountAPI.createAccount(accountData);
        }
        await fetchAccounts(); // обновляем список счетов
    };

    // Функция открытия формы для создания
    const handleAddAccount = () => {
        setEditingAccount(null);
        setIsAccountFormOpen(true);
    };

// Функция открытия формы для редактирования
    const handleEditAccount = (account) => {
        setEditingAccount(account);
        setIsAccountFormOpen(true);
    };

// Функция удаления счета (пока не реализована, можно добавить позже)
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

    return (
        <>
            <MobileLayout
                accounts={accounts}
                onAddAccount={handleAddAccount}
                transactions={filteredTransactions}
                allTransactions={transactions}
                loading={loading}
                error={error}
                fetchTransactions={fetchTransactions}
                deleteTransaction={deleteTransaction}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                totalBalance={totalBalance}         // ✅ передаём общий баланс
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsFormOpen={setIsFormOpen}
                periods={periods}
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
                onEditTransaction={handleEdit}
            />
            <DesktopLayout
                accounts={accounts}
                onAddAccount={handleAddAccount}
                transactions={filteredTransactions}
                allTransactions={transactions}
                loading={loading}
                error={error}
                fetchTransactions={fetchTransactions}
                deleteTransaction={deleteTransaction}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                totalBalance={totalBalance}         // ✅ передаём общий баланс
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
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingTransaction(null);
                }}
                onAddTransaction={addTransaction}
                onUpdateTransaction={updateTransaction}
                editingTransaction={editingTransaction}
            />
            <BalanceCard balance={totalBalance} totalIncome={totalIncome} />
            <ScrollToTopButton />
        </>
    );
}

export default Home;