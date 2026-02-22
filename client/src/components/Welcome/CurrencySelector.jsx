import { useState } from 'react';

const currencies = [
    { code: 'RUB', name: 'Российский рубль', flag: '🇷🇺' },
    { code: 'USD', name: 'Доллар США', flag: '🇺🇸' },
    { code: 'EUR', name: 'Евро', flag: '🇪🇺' },
];

const CurrencySelector = ({ onSelect, initialCurrency = 'RUB' }) => {
    const [selected, setSelected] = useState(initialCurrency);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Выберите основную валюту</h2>
            <p className="text-center text-gray-500 mb-6">
                Все суммы будут отображаться в выбранной валюте
            </p>
            <div className="grid grid-cols-3 gap-4">
                {currencies.map((cur) => (
                    <button
                        key={cur.code}
                        onClick={() => setSelected(cur.code)}
                        className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                            selected === cur.code
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                        }`}
                    >
                        <span className="text-4xl mb-2">{cur.flag}</span>
                        <span className="text-lg font-bold">{cur.code}</span>
                        <span className="text-xs text-gray-500 text-center mt-1">{cur.name}</span>
                    </button>
                ))}
            </div>
            <button
                onClick={() => onSelect(selected)}
                className="w-full mt-6 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition"
            >
                Далее →
            </button>
        </div>
    );
};

export default CurrencySelector;