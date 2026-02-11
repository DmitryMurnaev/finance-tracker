import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, Calendar } from 'lucide-react';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Statistics = ({ transactions }) => {
    const [activeType, setActiveType] = useState('expense');
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    // --- 1. Получаем все доступные периоды (YYYY-MM) ---
    const periods = useMemo(() => {
        const dates = transactions.map(t => t.date).filter(Boolean);
        const unique = [...new Set(dates.map(d => d.slice(0, 7)))];
        return unique.sort().reverse();
    }, [transactions]);

    // --- 2. Фильтруем транзакции по выбранному периоду ---
    const filteredTransactions = useMemo(() => {
        if (selectedPeriod === 'all') return transactions;
        return transactions.filter(t => t.date && t.date.startsWith(selectedPeriod));
    }, [transactions, selectedPeriod]);

    // --- 3. Суммарные доходы/расходы/баланс за период ---
    const periodStats = useMemo(() => {
        const income = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const expense = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        return { income, expense, balance: income - expense };
    }, [filteredTransactions]);

    // --- 4. Группировка по категориям для выбранного типа (доход/расход) ---
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

    // --- 5. Словарь категорий (названия, цвета) ---
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

    // --- 6. Данные для круговой диаграммы ---
    const pieData = useMemo(() => {
        return categoryStats.map(({ category, total }) => ({
            name: categoryLabels[category]?.name || 'Другое',
            value: total,
            color: categoryLabels[category]?.chartColor || '#9CA3AF'
        }));
    }, [categoryStats]);

    const totalAmount = categoryStats.reduce((sum, item) => sum + item.total, 0);

    // --- 7. Форматирование периода для отображения ---
    const formatPeriod = (period) => {
        if (period === 'all') return 'За всё время';
        const [year, month] = period.split('-');
        return new Date(year, month - 1).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' });
    };

    return (
        <div className="space-y-6">
            {/* Шапка с выбором периода и итогами */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={20} className="text-gray-600" />
                        <h2 className="font-semibold">Статистика</h2>
                    </div>

                    {/* Селект периода */}
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">📅 За всё время</option>
                        {periods.map(period => (
                            <option key={period} value={period}>
                                {new Date(period + '-01').toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Карточки итогов за период */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-green-600 text-xs">Доходы</div>
                        <div className="font-bold text-green-700">+{periodStats.income.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                        <div className="text-red-600 text-xs">Расходы</div>
                        <div className="font-bold text-red-700">-{periodStats.expense.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-blue-600 text-xs">Баланс</div>
                        <div className={`font-bold ${periodStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                    <p>Нет операций по {activeType === 'expense' ? 'расходам' : 'доходам'} за выбранный период</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <PieChartIcon size={20} className="text-gray-600" />
                        <h3 className="font-medium">Распределение по категориям</h3>
                    </div>

                    {/* Адаптивный контейнер: на десктопе диаграмма и список в ряд */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Круговая диаграмма */}
                        <div className="w-full lg:w-1/2 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Список категорий (такой же, как был) */}
                        <div className="w-full lg:w-1/2 space-y-3">
                            {categoryStats.map(({ category, total }) => {
                                const info = categoryLabels[category] || categoryLabels.other;
                                const percentage = totalAmount ? ((total / totalAmount) * 100).toFixed(1) : 0;
                                return (
                                    <div key={category} className="flex items-center">
                                        <div className={`w-24 sm:w-32 px-2 py-1 rounded-full text-xs font-medium ${info.color} truncate`}>
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
                            {/* Итог */}
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