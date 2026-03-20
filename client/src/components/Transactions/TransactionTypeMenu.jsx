import React, { useEffect } from 'react';
import { ArrowDown, ArrowUp, Repeat, X } from 'lucide-react';

const TransactionTypeMenu = ({ onSelectType, onClose }) => {
    // Закрытие по Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-60 flex items-end justify-center">
            {/* Затемнённый фон с анимацией */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Контейнер для кнопок */}
            <div className="relative w-full max-w-md px-6 pb-8 animate-slide-up">
                <div className="flex items-center justify-center gap-4 mb-6">
                    {/* Расход — слева, меньшего размера */}
                    <button
                        onClick={() => onSelectType('expense')}
                        className="group flex flex-col items-center transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <div className="w-14 h-14 rounded-full bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center transition-all">
                            <ArrowDown size={28} className="text-red-500" />
                        </div>
                        <span className="text-sm font-medium text-white/90 mt-2 drop-shadow-lg">
                            Расход
                        </span>
                    </button>

                    {/* Доход — центр, увеличенный */}
                    <button
                        onClick={() => onSelectType('income')}
                        className="group flex flex-col items-center transition-all duration-200 hover:scale-105 active:scale-95 -mt-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30 flex items-center justify-center transition-all group-hover:shadow-xl group-hover:shadow-green-500/40">
                            <ArrowUp size={36} className="text-white" />
                        </div>
                        <span className="text-sm font-semibold text-white/90 mt-3 drop-shadow-lg">
                            Доход
                        </span>
                    </button>

                    {/* Перевод — справа, меньшего размера */}
                    <button
                        onClick={() => onSelectType('transfer')}
                        className="group flex flex-col items-center transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <div className="w-14 h-14 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center transition-all">
                            <Repeat size={28} className="text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-white/90 mt-2 drop-shadow-lg">
                            Перевод
                        </span>
                    </button>
                </div>

                {/* Кнопка закрытия */}
                <div className="flex justify-center mt-2">
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionTypeMenu;