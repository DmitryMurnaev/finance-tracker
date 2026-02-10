import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, History, Plus } from 'lucide-react';
import TransactionForm from './components/Transactions/TransactionForm';
import TransactionItem from './components/Transactions/TransactionItem';
import './index.css';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home');

    // Загрузка из localStorage при монтировании компонента
    useEffect(() => {
        console.log('🔄 Инициализация приложения...');

        try {
            // Получаем данные из localStorage
            const savedData = localStorage.getItem('finance-transactions');
            console.log('📥 Получено из localStorage:', savedData);

            // Проверяем, что данные существуют и корректны
            if (savedData && savedData !== 'undefined' && savedData !== 'null') {
                // Парсим JSON
                const parsedData = JSON.parse(savedData);
                console.log('✅ Данные распарсены:', parsedData);

                // Проверяем, что это массив
                if (Array.isArray(parsedData)) {
                    setTransactions(parsedData);
                    console.log(`📊 Загружено ${parsedData.length} операций`);
                } else {
                    console.warn('⚠️ Данные не являются массивом, устанавливаю пустой массив');
                    setTransactions([]);
                    localStorage.setItem('finance-transactions', JSON.stringify([]));
                }
            } else {
                // Если данных нет или они некорректны, инициализируем пустым массивом
                console.log('📭 localStorage пуст, инициализирую пустым массивом');
                setTransactions([]);
                localStorage.setItem('finance-transactions', JSON.stringify([]));
            }
        } catch (error) {
            console.error('❌ Ошибка при загрузке из localStorage:', error);
            // При ошибке инициализируем пустым массивом
            setTransactions([]);
            localStorage.setItem('finance-transactions', JSON.stringify([]));
        }
    }, []);

    // Автосохранение при изменении транзакций
    useEffect(() => {
        // Сохраняем только если есть транзакции
        if (transactions.length > 0) {
            console.log(`💾 Сохраняю ${transactions.length} операций в localStorage...`);

            try {
                const dataString = JSON.stringify(transactions);
                localStorage.setItem('finance-transactions', dataString);
                console.log('✅ Данные успешно сохранены');
            } catch (error) {
                console.error('❌ Ошибка при сохранении в localStorage:', error);
            }
        } else {
            // Если массив пуст, сохраняем пустой массив
            localStorage.setItem('finance-transactions', JSON.stringify([]));
        }
    }, [transactions]);

    // Функция добавления новой операции
    const addTransaction = (newTransaction) => {
        console.log('➕ Добавляю операцию:', newTransaction);

        // Создаем копию массива и добавляем новую операцию в начало
        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);

        console.log(`📊 Теперь ${updatedTransactions.length} операций`);
    };

    // Функция удаления операции
    const deleteTransaction = (id) => {
        console.log('🗑️ Пытаюсь удалить операцию ID:', id);

        // Подтверждение удаления
        if (window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
            // Фильтруем массив, оставляя все кроме удаляемой
            const filteredTransactions = transactions.filter(
                transaction => transaction.id !== id
            );

            setTransactions(filteredTransactions);
            console.log(`✅ Операция удалена. Осталось ${filteredTransactions.length} операций`);
        }
    };

    // Расчет статистики
    const calculateStatistics = () => {
        // Доходы (type === 'income')
        const totalIncome = transactions
            .filter(transaction => transaction.type === 'income')
            .reduce((total, transaction) => total + transaction.amount, 0);

        // Расходы (type === 'expense')
        const totalExpenses = transactions
            .filter(transaction => transaction.type === 'expense')
            .reduce((total, transaction) => total + transaction.amount, 0);

        // Баланс
        const balance = totalIncome - totalExpenses;

        return { totalIncome, totalExpenses, balance };
    };

    // Получаем статистику
    const { totalIncome, totalExpenses, balance } = calculateStatistics();

    // Получаем последние 5 операций для отображения
    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Шапка приложения */}
            <header className="sticky top-0 z-10 p-4 bg-white shadow-sm border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">💰 Финансовый трекер</h1>
                <p className="text-gray-500 text-sm mt-1">Учет доходов и расходов</p>
            </header>

            {/* Основной контент */}
            <main className="p-4">
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

                {/* Статистика доходов/расходов */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-green-500 font-bold text-2xl">
                            + {totalIncome.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-gray-700 text-sm mt-1">Общие доходы</div>
                        <div className="text-gray-400 text-xs mt-1">
                            {transactions.filter(t => t.type === 'income').length} операций
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-red-500 font-bold text-2xl">
                            - {totalExpenses.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-gray-700 text-sm mt-1">Общие расходы</div>
                        <div className="text-gray-400 text-xs mt-1">
                            {transactions.filter(t => t.type === 'expense').length} операций
                        </div>
                    </div>
                </div>

                {/* Список последних операций */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <History className="mr-2 text-gray-600" size={20} />
                            <h2 className="font-semibold text-gray-800">Последние операции</h2>
                        </div>

                        {transactions.length > 0 && (
                            <div className="text-gray-500 text-sm">
                                Всего: {transactions.length}
                            </div>
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

                            {transactions.length > 5 && (
                                <div className="text-center pt-4">
                                    <button
                                        onClick={() => console.log('Показать все операции')}
                                        className="text-blue-500 text-sm font-medium hover:text-blue-600"
                                    >
                                        Показать все {transactions.length} операций →
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Состояние "нет операций"
                        <div className="text-center py-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                <History className="text-gray-400" size={32} />
                            </div>
                            <p className="text-gray-500 font-medium text-lg">Операций пока нет</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Нажмите "+" чтобы добавить первую запись
                            </p>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                            >
                                Добавить операцию
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Модальное окно формы добавления операции */}
            <TransactionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onAddTransaction={addTransaction}
            />

            {/* Плавающая кнопка добавления */}
            <button
                onClick={() => setIsFormOpen(true)}
                className="fixed bottom-24 right-6 w-16 h-16 bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-600 transition-colors active:scale-95"
                aria-label="Добавить операцию"
            >
                <Plus size={28} />
            </button>

            {/* Нижняя панель навигации */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-3 pb-6 flex justify-around shadow-inner">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center transition-colors ${
                        activeTab === 'home'
                            ? 'text-blue-500'
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <Wallet size={24} />
                    <span className="text-xs mt-1">Главная</span>
                </button>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex flex-col items-center -mt-6"
                >
                    <div className="bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors">
                        <Plus size={26} />
                    </div>
                    <span className="text-xs mt-2 text-gray-700 font-medium">Добавить</span>
                </button>

                <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex flex-col items-center transition-colors ${
                        activeTab === 'stats'
                            ? 'text-blue-500'
                            : 'text-gray-400 hover:text-gray-600'
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