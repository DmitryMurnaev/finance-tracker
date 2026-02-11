import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const PeriodSelector = ({ periods, selectedPeriod, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getFullLabel = (p) => {
        if (p === 'all') return '📅 За всё время';
        const [y, m] = p.split('-');
        return new Date(y, m - 1).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' });
    };

    const getShortLabel = (p) => {
        if (p === 'all') return '📅 Всё время'; // короче!
        const [y, m] = p.split('-');
        return new Date(y, m - 1).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' });
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm flex items-center justify-between gap-1 sm:gap-2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
                {/* На мобильных (до 640px) — короткий текст, на десктопе — полный */}
                <span className="hidden sm:inline">{getFullLabel(selectedPeriod)}</span>
                <span className="inline sm:hidden">{getShortLabel(selectedPeriod)}</span>
                <ChevronDown size={14} className={`sm:size-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-30 mt-1 w-full sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <button
                        onClick={() => { onChange('all'); setIsOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 ${
                            selectedPeriod === 'all' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                    >
                        <span className="sm:hidden">📅 Всё время</span>
                        <span className="hidden sm:inline">📅 За всё время</span>
                    </button>
                    {periods.map(p => (
                        <button
                            key={p}
                            onClick={() => { onChange(p); setIsOpen(false); }}
                            className={`w-full px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 ${
                                selectedPeriod === p ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                            }`}
                        >
              <span className="sm:hidden">
                {new Date(p + '-01').toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })}
              </span>
                            <span className="hidden sm:inline">
                {new Date(p + '-01').toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}
              </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PeriodSelector;