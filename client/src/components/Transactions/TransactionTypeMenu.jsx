import React from 'react';
import { ArrowDown, ArrowUp, Repeat, X } from 'lucide-react';

const TransactionTypeMenu = ({ onSelectType, onClose }) => {
    return (
        <div className="fixed inset-0 z-60 flex items-end justify-center">
            <div className="fixed inset-0 bg-black/70" onClick={onClose} />
            <div className="relative bg-transparent w-full max-w-md p-6 pb-5 z-10">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <button
                        onClick={() => onSelectType('expense')}
                        className="flex flex-col items-center group"
                    >
                        <div className="w-16 h-16 rounded-full bg-red-100 group-hover:bg-red-200 flex items-center justify-center mb-2 transition">
                            <ArrowDown size={32} className="text-red-600" />
                        </div>
                        <span className="text-sm font-semibold text-white drop-shadow-lg">Расход</span>
                    </button>
                    <button
                        onClick={() => onSelectType('income')}
                        className="flex flex-col items-center group"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center mb-2 transition">
                            <ArrowUp size={32} className="text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-white drop-shadow-lg">Доход</span>
                    </button>
                    <button
                        onClick={() => onSelectType('transfer')}
                        className="flex flex-col items-center group"
                    >
                        <div className="w-16 h-16 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-2 transition">
                            <Repeat size={32} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-semibold text-white drop-shadow-lg">Перевод</span>
                    </button>
                </div>
                <div className="flex justify-center -mt-2">
                    <button
                        onClick={onClose}
                        className="w-14.5 h-14.5 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-transform duration-300 rotate-0 active:rotate-90"
                    >
                        <X size={28} className="text-gray-600"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionTypeMenu;