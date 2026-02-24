import { useState } from 'react';
import { X } from 'lucide-react';

const currencies = [
    { code: 'RUB', name: 'Российский рубль', flag: '🇷🇺' },
    { code: 'USD', name: 'Доллар США', flag: '🇺🇸' },
    { code: 'EUR', name: 'Евро', flag: '🇪🇺' },
];

const CurrencyModal = ({ isOpen, onClose, onSelect, currentCurrency }) => {
    const [selected, setSelected] = useState(currentCurrency || 'RUB');

    if (!isOpen) return null;

    const handleSelect = () => {
        onSelect(selected);
    };

    return (
        <div className="fixed inset-0 z-60">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                <div className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl w-full max-w-md mx-auto flex flex-col dark:shadow-xl">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Выберите основную валюту</h2>
                        <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-4 space-y-2">
                        {currencies.map((currency) => (
                            <label
                                key={currency.code}
                                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border ${
                                    selected === currency.code
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 dark:border-blue-400 shadow-sm'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="currency"
                                    value={currency.code}
                                    checked={selected === currency.code}
                                    onChange={() => setSelected(currency.code)}
                                    className="mr-3 accent-blue-500 dark:accent-blue-400"
                                />
                                <span className="text-3xl mr-3">{currency.flag}</span>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{currency.code}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{currency.name}</p>
                                </div>
                                {selected === currency.code && (
                                    <span className="text-blue-500 dark:text-blue-400 text-sm font-medium">Выбрано</span>
                                )}
                            </label>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            onClick={handleSelect}
                            disabled={selected === currentCurrency}
                            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyModal;