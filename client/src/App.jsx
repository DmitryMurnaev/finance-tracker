import { useState, useEffect } from 'react';
import TransactionForm from './components/Transactions/TransactionForm';
import MobileLayout from './components/Layout/MobileLayout';
import DesktopLayout from './components/Layout/DesktopLayout';
import { transactionAPI } from './services/api';
import './index.css';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transactionAPI.getTransactions();
            setTransactions(data);
        } catch (error) {
            setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const addTransaction = async (newTransaction) => {
        try {
            await transactionAPI.createTransaction(newTransaction);
            await fetchTransactions();
            setIsFormOpen(false);
        } catch (error) {
            alert('Не удалось добавить операцию. Проверьте подключение к серверу.');
        }
    };

    const deleteTransaction = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
            try {
                await transactionAPI.deleteTransaction(id);
                await fetchTransactions();
            } catch (error) {
                alert('Не удалось удалить операцию. Проверьте подключение к серверу.');
            }
        }
    };

    const calculateStatistics = () => {
        if (!Array.isArray(transactions)) return { totalIncome: 0, totalExpenses: 0, balance: 0 };
        const totalIncome = transactions
            .filter(t => t?.type === 'income')
            .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0);
        const totalExpenses = transactions
            .filter(t => t?.type === 'expense')
            .reduce((total, t) => total + (parseFloat(t.amount) || 0), 0);
        return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
    };

    const { totalIncome, totalExpenses, balance } = calculateStatistics();

    return (
        <>
            {/* Мобильная версия */}
            <MobileLayout
                transactions={transactions}
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
            />

            {/* Десктопная версия */}
            <DesktopLayout
                transactions={transactions}
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
            />

            {/* Форма добавления — один раз для всех */}
            <TransactionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onAddTransaction={addTransaction}
            />
        </>
    );
}

export default App;