import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';

const Statistics = ({ transactions }) => {
    const [activeType, setActiveType] = useState('expense');

    // Группировка по категориям и подсчёт сумм
    const categoryStats = useMemo(() => {
        const filtered = transactions.filter(t => t.type === activeType);
        const stats = {};

        filtered.forEach(t => {
            const cat = t.category || 'other';
            stats[cat] = (stats[cat] || 0) + parseFloat(t.amount);
        });

        // Преобразуем в массив и сортируем по убыванию
        return Object.entries(stats)
            .map(([category, total]) => ({ category, total }))
            .sort((a, b) => b.total - a.total);
    }, [transactions, activeType]);

    // Словарь с названиями и цветами категорий (можно расширить)
    const categoryLabels = {
        food: { name: '🍕 Еда', color: 'bg-red-100 text-red-800' },
        transport: { name: '🚕 Транспорт', color: 'bg-blue-100 text-blue-800' },
        shopping: { name: '🛍️ Покупки', color: 'bg-purple-100 text-purple-800' },
        entertainment: { name: '🎬 Развлечения', color: 'bg-pink-100 text-pink-800' },
        bills: { name: '🏠 Счета', color: 'bg-orange-100 text-orange-800' },
        health: { name: '🏥 Здоровье', color: 'bg-indigo-100 text-indigo-800' },
        education: { name: '📚 Образование', color: 'bg-teal-100 text-teal-800' },
        salary: { name: '💰 Зарплата', color: 'bg-green-100 text-green-800' },
        freelance: { name: '💼 Фриланс', color: 'bg-yellow-100 text-yellow-800' },
        investment: { name: '📈 Инвестиции', color: 'bg-emerald-100 text-emerald-800' },
        gift: { name: '🎁 Подарок', color: 'bg-rose-100 text-rose-800' },
        bonus: { name: '⭐ Премия', color: 'bg-amber-100 text-amber-800' },
        other: { name: '📝 Другое', color: 'bg-gray-100 text-gray-800' }
    };

    const totalAmount = categoryStats.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-4">
                <PieChart size={20} className="text-gray-600" />
                <h2 className="font-semibold">Статистика по категориям</h2>
            </div>

            {/* Переключатель доходов/расходов */}
            <div className="flex gap-2 mb-6">
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

            {/* Список категорий */}
            {categoryStats.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                    Нет операций по {activeType === 'expense' ? 'расходам' : 'доходам'}
                </p>
            ) : (
                <div className="space-y-3">
                    {categoryStats.map(({ category, total }) => {
                        const info = categoryLabels[category] || categoryLabels.other;
                        const percentage = ((total / totalAmount) * 100).toFixed(1);

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
            )}
        </div>
    );
};

export default Statistics;