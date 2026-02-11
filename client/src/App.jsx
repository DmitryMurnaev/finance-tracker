import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, History, Plus } from 'lucide-react';
import TransactionForm from './components/Transactions/TransactionForm';
import TransactionItem from './components/Transactions/TransactionItem';
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
        <div className="bg-gray-50 min-h-screen pb-32">
            {/* Шапка */}
            <header className="sticky top-0 z-20 p-4 bg-white shadow-sm border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">💰 Финансовый трекер</h1>
                <p className="text-gray-500 text-sm mt-1">Учет доходов и расходов</p>
            </header>

            {/* Основной контент */}
            <div className="p-4">
                {/* Карточка баланса */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Wallet className="mr-3" size={24} />
                            <h2 className="text-lg font-semibold">Текущий баланс</h2>
                        </div>
                        <div className="text-blue-100 text-sm bg-white/20 px-3 py-1 rounded-full">
                            {balance >= 0 ? '+' : ''}{balance.toLocaleString('ru-RU')} ₽
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-bold mb-2">
                            {balance.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-blue-100">
                            Доходы: +{totalIncome.toLocaleString('ru-RU')} ₽
                        </div>
                    </div>
                </div>

                {/* Блоки доходов/расходов */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                    <div className="bg-white p-3 sm:p-5 rounded-xl shadow border border-gray-100 overflow-hidden">
                        <div className="text-green-500 font-bold text-lg sm:text-xl md:text-2xl truncate">
                            + {totalIncome.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-gray-700 text-xs sm:text-sm mt-1">Доходы</div>
                    </div>
                    <div className="bg-white p-3 sm:p-5 rounded-xl shadow border border-gray-100 overflow-hidden">
                        <div className="text-red-500 font-bold text-lg sm:text-xl md:text-2xl truncate">
                            - {totalExpenses.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-gray-700 text-xs sm:text-sm mt-1">Расходы</div>
                    </div>
                </div>

                {/* Заголовок списка операций */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <History className="mr-2 text-gray-600" size={20} />
                            <h2 className="font-semibold">Последние операции</h2>
                        </div>
                        {transactions.length > 0 && (
                            <div className="text-gray-500 text-sm">Всего: {transactions.length}</div>
                        )}
                    </div>
                </div>

                {/* Список транзакций */}
                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Загрузка данных...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <div className="text-red-500 text-lg mb-2">⚠️ {error}</div>
                        <button
                            onClick={fetchTransactions}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Повторить
                        </button>
                    </div>
                ) : transactions.length > 0 ? (
                    <div className="space-y-2">
                        {transactions.map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                onDelete={deleteTransaction}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                            <History className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 font-medium text-lg">Операций пока нет</p>
                        <p className="text-gray-400 text-sm mt-2">
                            Нажмите «Добавить» в меню
                        </p>
                    </div>
                )}
            </div>

            {/* Форма добавления */}
            <TransactionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onAddTransaction={addTransaction}
            />

            {/* Нижняя навигация — фиксированная, прижата к низу */}
            <nav className="
                fixed bottom-0 left-0 right-0
                bg-white border-t border-gray-200
                px-4 pt-3
                pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))]
                flex justify-around
                z-20
            ">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-500' : 'text-gray-400'}`}
                >
                    <Wallet size={24}/>
                    <span className="text-xs mt-1">Главная</span>
                </button>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex flex-col items-center -mt-8"
                >
                    <div className="bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-500/30">
                        <Plus size={28}/>
                    </div>
                    <span className="text-xs mt-2 text-gray-700">Добавить</span>
                </button>

                <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex flex-col items-center ${activeTab === 'stats' ? 'text-blue-500' : 'text-gray-400'}`}
                >
                    <TrendingUp size={24}/>
                    <span className="text-xs mt-1">Статистика</span>
                </button>
            </nav>
        </div>
    );
}

export default App;