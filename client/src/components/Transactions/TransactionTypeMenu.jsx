import React from 'react';

const TransactionTypeMenu = ({ onSelectType, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="bg-white rounded-t-3xl w-full max-w-md p-6 z-10 animate-slide-up">
                <h3 className="text-lg font-semibold mb-4">Выберите тип операции</h3>
                <div className="space-y-3">
                    <button
                        onClick={() => onSelectType('expense')}
                        className="w-full p-4 bg-red-50 text-red-700 rounded-xl font-medium hover:bg-red-100"
                    >
                        Расход
                    </button>
                    <button
                        onClick={() => onSelectType('income')}
                        className="w-full p-4 bg-green-50 text-green-700 rounded-xl font-medium hover:bg-green-100"
                    >
                        Доход
                    </button>
                    <button
                        onClick={() => onSelectType('transfer')}
                        className="w-full p-4 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100"
                    >
                        Перевод
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionTypeMenu;