import './index.css';

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Шапка */}
            <div className="bg-blue-600 text-white p-4">
                <h1 className="text-2xl font-bold">💰 Финансы</h1>
                <p className="text-blue-100">Учет доходов и расходов</p>
            </div>

            {/* Основной контент */}
            <div className="p-4">
                {/* Баланс */}
                <div className="bg-white rounded-xl shadow p-6 mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Баланс</h2>
                        <span className="text-sm text-gray-500">Все счета</span>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-gray-800">0 ₽</div>
                        <p className="text-gray-500 mt-2">Начните отслеживать финансы</p>
                    </div>
                </div>

                {/* Доходы/Расходы */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-xl">
                        <div className="text-green-600 font-bold text-xl">+ 0 ₽</div>
                        <div className="text-green-800 text-sm">Доходы</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl">
                        <div className="text-red-600 font-bold text-xl">- 0 ₽</div>
                        <div className="text-red-800 text-sm">Расходы</div>
                    </div>
                </div>

                {/* Последние операции */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="font-bold text-lg mb-4">Последние операции</h3>
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-lg mb-2">Пусто</p>
                        <p className="text-sm">Добавьте первую запись</p>
                    </div>
                </div>
            </div>

            {/* Кнопка добавления */}
            <button className="fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg text-2xl">
                +
            </button>

            {/* Нижнее меню */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around">
                <button className="text-blue-600 font-medium">Главная</button>
                <button className="text-gray-500">Статистика</button>
                <button className="text-gray-500">История</button>
            </div>
        </div>
    );
}

export default App;