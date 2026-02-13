import { useState, useEffect, useMemo } from 'react';
import TransactionForm from '../components/Transactions/TransactionForm';
import MobileLayout from '../components/Layout/MobileLayout';
import DesktopLayout from '../components/Layout/DesktopLayout';
import ScrollToTopButton from '../components/UI/ScrollToTopButton';
import { transactionAPI } from '../services/api';
import '../index.css';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Функция обновления транзакции
    const updateTransaction = async (id, updateData) => {
        try {
            await transactionAPI.updateTransaction(id, updateData);
            await fetchTransactions();
            setEditingTransaction(null);
            setIsFormOpen(false);
        } catch {
            alert('Не удалось обновить операцию')
        }
    };

    // При клике на редактирование в дочерних компонентах
    const handleEdit = (transactions) => {
        setEditingTransaction(transactions);
        setIsFormOpen(true);
    };


    // --- Фильтр периода для главной ---
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    // --- Загрузка данных ---
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

    // --- CRUD ---
    const addTransaction = async (newTransaction) => {
        try {
            await transactionAPI.createTransaction(newTransaction);
            await fetchTransactions();
            setIsFormOpen(false);
        } catch { alert('Не удалось добавить операцию'); }
    };

    const deleteTransaction = async (id) => {
        if (!window.confirm('Удалить операцию?')) return;
        try {
            await transactionAPI.deleteTransaction(id);
            await fetchTransactions();
        } catch { alert('Не удалось удалить операцию'); }
    };

    // --- Статистика для баланса ---
    const calculateStats = () => {
        if (!Array.isArray(transactions)) return { totalIncome: 0, totalExpenses: 0, balance: 0 };
        const totalIncome = transactions
            .filter(t => t?.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalExpenses = transactions
            .filter(t => t?.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
    };
    const { totalIncome, totalExpenses, balance } = calculateStats();

    // --- Доступные периоды (YYYY-MM) ---
    const periods = useMemo(() => {
        const dates = transactions.map(t => t.date).filter(Boolean);
        const unique = [...new Set(dates.map(d => d.slice(0, 7)))];
        return unique.sort().reverse();
    }, [transactions]);

    // --- Фильтрованные транзакции для главной ---
    const filteredTransactions = useMemo(() => {
        if (selectedPeriod === 'all') return transactions;
        return transactions.filter(t => t.date && t.date.startsWith(selectedPeriod));
    }, [transactions, selectedPeriod]);

    return (
        <>
            <MobileLayout
                transactions={filteredTransactions}       // ← фильтрованные для списка
                allTransactions={transactions}           // ← все для баланса (не фильтруем!)
                loading={loading}
                error={error}
                fetchTransactions={fetchTransactions}
                deleteTransaction={deleteTransaction}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                balance={balance}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsFormOpen={setIsFormOpen}
                periods={periods}                       // ← для PeriodSelector
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
                onEditTransaction={handleEdit}
            />
            <DesktopLayout
                transactions={filteredTransactions}
                allTransactions={transactions}
                loading={loading}
                error={error}
                fetchTransactions={fetchTransactions}
                deleteTransaction={deleteTransaction}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                balance={balance}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsFormOpen={setIsFormOpen}
                periods={periods}
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
                onEditTransaction{handleEdit}
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
            <ScrollToTopButton />   {/* ← плавающая кнопка */}
        </>
    );
}

export default App;