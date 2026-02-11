import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    PieChart as PieChartIcon,
    ChevronDown
} from 'lucide-react';

const Statistics = ({ transactions }) => {
    const [activeType, setActiveType] = useState('expense');
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [isPeriodOpen, setIsPeriodOpen] = useState(false);
    const periodRef = useRef(null);

    // Закрытие селекта при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (periodRef.current && !periodRef.current.contains(event.target)) {
                setIsPeriodOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Все доступные периоды (YYYY-MM) ---
    const periods = useMemo(() => {
        const dates = transactions.map(t => t.date).filter(Boolean);
        const unique = [...new Set(dates.map(d => d.slice(0, 7)))];
        return unique.sort().reverse();
    }, [transactions]);

    // --- Фильтрация по периоду ---
    const filteredTransactions = useMemo(() => {
        if (selectedPeriod === 'all') return transactions;
        return transactions.filter(t => t.date && t.date.startsWith(selectedPeriod));
    }, [transactions, selectedPeriod]);

    // --- Суммарные доходы/расходы/баланс за период ---
    const periodStats = useMemo(() => {
        const income = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const expense = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return { income, expense, balance: income - expense };
    }, [filteredTransactions]);

    // --- Группировка по категориям (для активного типа) ---
    const categoryStats = useMemo(() => {
        const filtered = filteredTransactions.filter(t => t.type === activeType);
        const stats = {};
        filtered.forEach(t => {
            const cat = t.category || 'other';
            stats[cat] = (stats[cat] || 0) + parseFloat(t.amount);
        });
        return Object.entries(stats)
            .map(([category, total]) => ({ category, total }))
            .sort((a, b) => b.total - a.total);
    }, [filteredTransactions, activeType]);

    // --- Словарь категорий (с цветами) ---
    const categoryLabels = {
        food: { name: '🍕 Еда', color: 'bg-red-100 text-red-800', chartColor: '#F87171' },
        transport: { name: '🚕 Транспорт', color: 'bg-blue-100 text-blue-800', chartColor: '#60A5FA' },
        shopping: { name: '🛍️ Покупки', color: 'bg-purple-100 text-purple-800', chartColor: '#C084FC' },
        entertainment: { name: '🎬 Развлечения', color: 'bg-pink-100 text-pink-800', chartColor: '#F472B6' },
        bills: { name: '🏠 Счета', color: 'bg-orange-100 text-orange-800', chartColor: '#FB923C' },
        health: { name: '🏥 Здоровье', color: 'bg-indigo-100 text-indigo-800', chartColor: '#818CF8' },
        education: { name: '📚 Образование', color: 'bg-teal-100 text-teal-800', chartColor: '#2DD4BF' },
        salary: { name: '💰 Зарплата', color: 'bg-green-100 text-green-800', chartColor: '#4ADE80' },
        freelance: { name: '💼 Фриланс', color: 'bg-yellow-100 text-yellow-800', chartColor: '#FBBF24' },
        investment: { name: '📈 Инвестиции', color: 'bg-emerald-100 text-emerald-800', chartColor: '#34D399' },
        gift: { name: '🎁 Подарок', color: 'bg-rose-100 text-rose-800', chartColor: '#FDA4AF' },
        bonus: { name: '⭐ Премия', color: 'bg-amber-100 text-amber-800', chartColor: '#FCD34D' },
        other: { name: '📝 Другое', color: 'bg-gray-100 text-gray-800', chartColor: '#9CA3AF' }
    };

    // --- Данные для круговой диаграммы ---
    const pieData = useMemo(() => {
        return categoryStats.map(({ category, total }) => ({
            name: categoryLabels[category]?.name || 'Другое',
            value: total,
            color: categoryLabels[category]?.chartColor || '#9CA3AF'
        }));
    }, [categoryStats]);

    const totalAmount = categoryStats.reduce((sum, item) => sum + item.total, 0);

    // --- Форматирование периода для отображения ---
    const getPeriodLabel = (period) => {
        if (period === 'all') return '📅 За всё время';
        const [year, month] = period.split('-');
        return new Date(year, month - 1).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long'
        });
    };

    const formatPeriod = (period) => {
        if (period === 'all') return 'За всё время';
        const [year, month] = period.split('-');
        return new Date(year, month - 1).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long'
        });
    };

    // --- Кастомная SVG-круговая диаграмма ---
    const CustomPieChart = ({ data }) => {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        if (total === 0) return null;

        let cumulativeAngle = 0;
        const colors = data.map(d => d.color);

        return (
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {data.map((item, index) => {
                    const percentage = item.value / total;
                    const angle = percentage * 360;
                    const startAngle = cumulativeAngle;
                    const endAngle = cumulativeAngle + angle;
                    cumulativeAngle += angle;

                    const startRad = (startAngle - 90) * Math.PI / 180;
                    const endRad = (endAngle - 90) * Math.PI / 180;

                    const x1 = 50 + 40 * Math.cos(startRad);
                    const y1 = 50 + 40 * Math.sin(startRad);
                    const x2 = 50 + 40 * Math.cos(endRad);
                    const y2 = 50 + 40 * Math.sin(endRad);

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    return (
                        <path
                            key={index}
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={colors[index % colors.length]}
                            stroke="white"
                            strokeWidth="0.5"
                        >
                            <title>{`${item.name}: ${((item.value / total) * 100).toFixed(1)}%`}</title>
                        </path>
                    );
                })}
                <circle cx="50" cy="50" r="20" fill="white" />
            </svg>
        );
    };

    return (
        <div className="space-y-6">
            {/* Шапка с выбором периода и итогами */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <PieChartIcon size={20} className="text-gray-600" />
                        <h2 className="font-semibold">Статистика</h2>
                    </div>

                    {/* Кастомный селект периода */}
                    <div className="relative" ref={periodRef}>
                        <button
                            type="button"
                            onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm flex items-center justify-between gap-2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            <span>{getPeriodLabel(selectedPeriod)}</span>
                            <ChevronDown
                                size={16}
                                className={`text-gray-500 transition-transform ${
                                    isPeriodOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {/* Выпадающий список */}
                        {isPeriodOpen && (
                            <div className="absolute z-30 mt-1 w-full sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                <button
                                    onClick={() => {
                                        setSelectedPeriod('all');
                                        setIsPeriodOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                                        selectedPeriod === 'all'
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    📅 За всё время
                                </button>
                                {periods.map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => {
                                            setSelectedPeriod(period);
                                            setIsPeriodOpen(false);
                                        }}
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                                            selectedPeriod === period
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {getPeriodLabel(period)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Адаптивные карточки итогов за период */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {/* Доходы */}
                    <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-green-600 text-xs uppercase tracking-wider mb-1">
                            Доходы
                        </div>
                        <div className="font-bold text-green-700 text-sm sm:text-base lg:text-lg truncate">
                            +{periodStats.income.toLocaleString('ru-RU')} ₽
                        </div>
                    </div>

                    {/* Расходы */}
                    <div className="bg-red-50 rounded-lg p-3">
                        <div className="text-red-600 text-xs uppercase tracking-wider mb-1">
                            Расходы
                        </div>
                        <div className="font-bold text-red-700 text-sm sm:text-base lg:text-lg truncate">
                            -{periodStats.expense.toLocaleString('ru-RU')} ₽
                        </div>
                    </div>

                    {/* Баланс — на мобилке во всю ширину, на sm+ треть колонки */}
                    <div className="col-span-2 sm:col-span-1 bg-blue-50 rounded-lg p-3">
                        <div className="text-blue-600 text-xs uppercase tracking-wider mb-1">
                            Баланс
                        </div>
                        <div
                            className={`font-bold text-sm sm:text-base lg:text-lg truncate text-blue-600`}
                        >
                            {periodStats.balance.toLocaleString('ru-RU')} ₽
                        </div>
                    </div>
                </div>

                <div className="text-xs text-gray-500 mt-2 text-right">
                    {formatPeriod(selectedPeriod)}
                </div>
            </div>

            {/* Переключатель доходов/расходов */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveType('expense')}
                    className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-1 ${
                        activeType === 'expense'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    <TrendingDown size={18} />
                    Расходы
                </button>
                <button
                    onClick={() => setActiveType('income')}
                    className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-1 ${
                        activeType === 'income'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    <TrendingUp size={18} />
                    Доходы
                </button>
            </div>

            {/* Блок с круговой диаграммой и списком категорий */}
            {categoryStats.length === 0 ? (
                <div className="bg-white rounded-xl shadow border border-gray-100 p-8 text-center text-gray-500">
                    <PieChartIcon size={32} className="mx-auto mb-2 text-gray-400" />
                    <p>
                        Нет операций по {activeType === 'expense' ? 'расходам' : 'доходам'} за
                        выбранный период
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <PieChartIcon size={20} className="text-gray-600" />
                        <h3 className="font-medium">Распределение по категориям</h3>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Круговая диаграмма */}
                        <div className="w-full lg:w-1/2 h-64 flex items-center justify-center">
                            <div className="w-64 h-64">
                                <CustomPieChart data={pieData} />
                            </div>
                        </div>

                        {/* Список категорий */}
                        <div className="w-full lg:w-1/2 space-y-3">
                            {categoryStats.map(({ category, total }) => {
                                const info = categoryLabels[category] || categoryLabels.other;
                                const percentage = totalAmount
                                    ? ((total / totalAmount) * 100).toFixed(1)
                                    : 0;
                                return (
                                    <div key={category} className="flex items-center">
                                        <div
                                            className={`w-24 sm:w-32 px-2 py-1 rounded-full text-xs font-medium ${info.color} truncate`}
                                        >
                                            {info.name}
                                        </div>
                                        <div className="flex-1 mx-3">
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium whitespace-nowrap">
                                            {total.toLocaleString('ru-RU')} ₽
                                        </div>
                                        <div className="text-xs text-gray-500 ml-2 w-12 text-right">
                                            {percentage}%
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between font-bold">
                                <span>Итого:</span>
                                <span>{totalAmount.toLocaleString('ru-RU')} ₽</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Statistics;