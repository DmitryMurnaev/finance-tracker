import React from 'react';
import { ArrowDown, ArrowUp, Repeat } from 'lucide-react';

const TransactionTypeMenu = ({ onSelectType, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="bg-white rounded-t-3xl w-full max-w-md p-6 z-10 animate-slide-up">
                <h3 className="text-lg font-semibold mb-4">Выберите тип операции</h3>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => onSelectType('expense')}
                        className="flex flex-col items-center p-4 bg-red-50 text-red-700 rounded-xl font-medium hover:bg-red-100"
                    >
                        <ArrowDown size={24} />
                        <span className="mt-1">Расход</span>
                    </button>
                    <button
                        onClick={() => onSelectType('income')}
                        className="flex flex-col items-center p-4 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100"
                    >
                        <ArrowUp size={24} />
                        <span className="mt-1">Доход</span>
                    </button>
                    <button
                        onClick={() => onSelectType('transfer')}
                        className="flex flex-col items-center p-4 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100"
                    >
                        <Repeat size={24} />
                        <span className="mt-1">Перевод</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionTypeMenu;