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

    // Загрузка данных с API при монтировании компонента
    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔄 Загружаю транзакции с API...');
            const data = await transactionAPI.getTransactions();

            // Отладочный вывод
            console.log('📥 Полученные данные:', data);
            console.log('📊 Тип данных:', typeof data);
            console.log('🔢 Это массив?', Array.isArray(data));

            setTransactions(data);
            console.log(`✅ Загружено ${data.length} транзакций`);
        } catch (error) {
            console.error('❌ Ошибка загрузки транзакций:', error);
            setError('Не удалось загрузить данные. Проверьте подключение к серверу.');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Функция добавления новой операции
    const addTransaction = async (newTransaction) => {
        try {
            console.log('➕ Отправляю новую операцию на API...');

            await transactionAPI.createTransaction(newTransaction);
            await fetchTransactions();

            console.log('✅ Операция успешно добавлена');
            setIsFormOpen(false);
        } catch (error) {
            console.error('❌ Ошибка при добавлении операции:', error);
            alert('Не удалось добавить операцию. Проверьте подключение к серверу.');
        }
    };

    // Функция удаления операции
    const deleteTransaction = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
            try {
                console.log(`🗑️ Удаляю операцию ${id}...`);

                await transactionAPI.deleteTransaction(id);
                await fetchTransactions();

                console.log('✅ Операция удалена');
            } catch (error) {
                console.error('❌ Ошибка при удалении операции:', error);
                alert('Не удалось удалить операцию. Проверьте подключение к серверу.');
            }
        }
    };

    // Расчет статистики
    const calculateStatistics = () => {
        // Проверяем что transactions - массив
        if (!Array.isArray(transactions)) {
            console.error('transactions is not an array:', transactions);
            return { totalIncome: 0, totalExpenses: 0, balance: 0 };
        }

        const totalIncome = transactions
            .filter(transaction => transaction && transaction.type === 'income')
            .reduce((total, transaction) => total + (parseFloat(transaction.amount) || 0), 0);

        const totalExpenses = transactions
            .filter(transaction => transaction && transaction.type === 'expense')
            .reduce((total, transaction) => total + (parseFloat(transaction.amount) || 0), 0);

        const balance = totalIncome - totalExpenses;

        return { totalIncome, totalExpenses, balance };
    };

    const { totalIncome, totalExpenses, balance } = calculateStatistics();
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Вся верхняя часть - фиксированная */}
            <div className="flex-shrink-0">
                {/* Шапка приложения */}
                <header className="sticky top-0 z-20 p-4 bg-white shadow-sm border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900">💰 Финансовый трекер</h1>
                    <p className="text-gray-500 text-sm mt-1">Учет доходов и расходов</p>
                </header>

                {/* Весь основной контент ВЕРХНЕЙ части */}
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

                    {/* Статистика - тоже фиксированная */}
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
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
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
                </div>
            </div>

            {/* ТОЛЬКО список транзакций прокручивается */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                {loading ? (
                    <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
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
                ) : recentTransactions.length > 0 ? (
                    <div className="space-y-2 mt-4">
                        {recentTransactions.map((transaction) => (
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
                            Нажмите "+" чтобы добавить первую запись
                        </p>
                    </div>
                )}
            </div>

            {/* Форма */}
            <TransactionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onAddTransaction={addTransaction}
            />

            {/* Кнопка добавления */}
            <button
                onClick={() => setIsFormOpen(true)}
                className="fixed bottom-24 right-6 w-16 h-16 bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-600 z-10"
            >
                <Plus size={28} />
            </button>

            {/* Навигация */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-3 pb-6 flex justify-around z-20">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-500' : 'text-gray-400'}`}
                >
                    <Wallet size={24} />
                    <span className="text-xs mt-1">Главная</span>
                </button>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex flex-col items-center -mt-8"
                >
                    <div className="bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-500/30">
                        <Plus size={28} />
                    </div>
                    <span className="text-xs mt-2 text-gray-700">Добавить</span>
                </button>

                <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex flex-col items-center ${activeTab === 'stats' ? 'text-blue-500' : 'text-gray-400'}`}
                >
                    <TrendingUp size={24} />
                    <span className="text-xs mt-1">Статистика</span>
                </button>
            </nav>
        </div>
    );
}

export default App;