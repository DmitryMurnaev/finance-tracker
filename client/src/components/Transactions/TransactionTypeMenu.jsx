import React from 'react';
import { ArrowDown, ArrowUp, Repeat, X } from 'lucide-react';

const TransactionTypeMenu = ({ onSelectType, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Затемнение */}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />

            {/* Панель с кнопками */}
            <div className="relative bg-transparent w-full max-w-md p-6 pb-12 z-10">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <button
                        onClick={() => onSelectType('expense')}
                        className="flex flex-col items-center text-red-600 hover:text-red-700 transition"
                    >
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
                            <ArrowDown size={32} className="text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Расход</span>
                    </button>
                    <button
                        onClick={() => onSelectType('income')}
                        className="flex flex-col items-center text-green-600 hover:text-green-700 transition"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                            <ArrowUp size={32} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Доход</span>
                    </button>
                    <button
                        onClick={() => onSelectType('transfer')}
                        className="flex flex-col items-center text-blue-600 hover:text-blue-700 transition"
                    >
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <Repeat size={32} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Перевод</span>
                    </button>
                </div>

                {/* Кнопка закрытия (крестик) */}
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
                    >
                        <X size={28} className="text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionTypeMenu;