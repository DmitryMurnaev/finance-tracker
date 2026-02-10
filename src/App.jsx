import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, History, Plus } from 'lucide-react';
import TransactionForm from './components/Transactions/TransactionForm';
import TransactionItem from './components/Transactions/TransactionItem';
import './index.css';

function App() {
    // Основное состояние приложения
    const [transactions, setTransactions] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    // Эффект для загрузки данных из localStorage
    useEffect(() => {
        const saved = localStorage.getItem('finance-transactions');
        if (saved) {
            try {
                setTransactions(JSON.parse(saved));
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        }
    }, []);

    // Эффект для сохранения данных в localStorage
    useEffect(() => {
        localStorage.setItem('finance-transactions', JSON.stringify(transactions));
    }, [transactions]);

    // Функция добавления операции
    const addTransaction = (transaction) => {
        setTransactions([transaction, ...transactions]); // Новые операции в начало
    };

    // Функция удаления операции
    const deleteTransaction = (id) => {
        if (window.confirm('Удалить эту операцию?')) {
            setTransactions(transactions.filter(t => t.id !== id));
        }
    };

    // Вычисление статистики
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Последние 5 операций для главного экрана
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Шапка приложения */}
            <header className="sticky top-0 z-10 p-4 bg-white shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">💰 Финансы</h1>
                <p className="text-gray-500 text-sm mt-1">Учет доходов и расходов</p>
            </header>

            {/* Основной контент */}
            <main className="p-4">
                {/* Карточка баланса */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Wallet className="mr-3" size={24} />
                            <h2 className="text-lg font-semibold">Текущий баланс</h2>
                        </div>
                        <div className="text-blue-100 text-sm bg-white/20 px-3 py-1 rounded-full">
                            {balance >= 0 ? '+' : ''}{balance.toLocaleString()} ₽
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-5xl font-bold mb-2">{balance.toLocaleString()} ₽</div>
                        <div className="text-blue-100">
                            Доходы: +{totalIncome.toLocaleString()} ₽
                        </div>
                    </div>
                </div>

                {/* Статистика доходов/расходов */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
                        <div className="text-green-500 font-bold text-2xl">
                            + {totalIncome.toLocaleString()} ₽
                        </div>
                        <div className="text-gray-700 text-sm">Доходы</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
                        <div className="text-red-500 font-bold text-2xl">
                            - {totalExpenses.toLocaleString()} ₽
                        </div>
                        <div className="text-gray-700 text-sm">Расходы</div>
                    </div>
                </div>

                {/* Список последних операций */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <History className="mr-2 text-gray-600" size={20} />
                            <h2 className="font-semibold">Последние операции</h2>
                        </div>
                        {transactions.length > 0 && (
                            <span className="text-gray-500 text-sm">
                {transactions.length} всего
              </span>
                        )}
                    </div>

                    {recentTransactions.length > 0 ? (
                        <div>
                            {recentTransactions.map((transaction) => (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    onDelete={deleteTransaction}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <History className="text-gray-400" size={28} />
                            </div>
                            <p className="text-gray-500 font-medium">Операций пока нет</p>
                            <p className="text-gray-400 text-sm mt-1">Нажмите "+" чтобы добавить</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Форма добавления операции (условный рендеринг) */}
            <TransactionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onAddTransaction={addTransaction}
            />

            {/* Кнопка добавления */}
            <button
                onClick={() => setIsFormOpen(true)}
                className="fixed bottom-24 right-6 w-16 h-16 bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Добавить операцию"
            >
                <Plus size={28} />
            </button>

            {/* Нижняя навигация */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-3 pb-6 flex justify-around">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center ${
                        activeTab === 'home' ? 'text-blue-500' : 'text-gray-400'
                    }`}
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
                    className={`flex flex-col items-center ${
                        activeTab === 'stats' ? 'text-blue-500' : 'text-gray-400'
                    }`}
                >
                    <TrendingUp size={24} />
                    <span className="text-xs mt-1">Статистика</span>
                </button>
            </nav>
        </div>
    );
}

export default App;