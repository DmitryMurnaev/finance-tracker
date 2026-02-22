const PWAInstallPrompt = ({ onNext }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Установите приложение</h2>
            <p className="text-center text-gray-500">
                Добавьте на главный экран для быстрого доступа
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center text-center">
                    <span className="text-4xl mb-2">🤖</span>
                    <h3 className="font-bold">Android</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Нажмите «⋮» → «Установить приложение»
                    </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center text-center">
                    <span className="text-4xl mb-2">🍎</span>
                    <h3 className="font-bold">iOS</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Нажмите «Поделиться» → «На экран «Домой»»
                    </p>
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700">
                💡 После установки приложение будет работать как родное и откроется в полноэкранном режиме.
            </div>

            <button
                onClick={onNext}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition"
            >
                Начать →
            </button>
        </div>
    );
};

export default PWAInstallPrompt;