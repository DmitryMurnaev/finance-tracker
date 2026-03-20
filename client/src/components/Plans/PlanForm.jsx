import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { planIconOptions, planColorOptions } from '../../config/plansConfig';

const PlanForm = ({ isOpen, onClose, onSave, editingPlan }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [iconId, setIconId] = useState(1);
    const [colorId, setColorId] = useState(1);
    const [deadline, setDeadline] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingPlan) {
            setName(editingPlan.name);
            setTargetAmount(editingPlan.target_amount);
            setIconId(editingPlan.icon_id);
            setColorId(editingPlan.color_id);
            setDeadline(editingPlan.deadline || '');
        } else {
            setName('');
            setTargetAmount('');
            setIconId(1);
            setColorId(1);
            setDeadline('');
        }
    }, [editingPlan, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (!name.trim()) throw new Error('Введите название цели');
            if (!targetAmount || targetAmount <= 0) throw new Error('Введите корректную целевую сумму');

            const planData = {
                name: name.trim(),
                target_amount: parseFloat(targetAmount),
                icon_id: iconId,
                color_id: colorId,
                deadline: deadline || null,
            };

            await onSave(planData, editingPlan?.id);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                <div className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl w-full max-w-md mx-auto flex flex-col max-h-[85vh] md:max-h-[90vh] overflow-hidden">
                    {/* Заголовок */}
                    <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {editingPlan ? 'Редактировать цель' : 'Новая цель'}
                        </h2>
                        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Контент с прокруткой */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Название</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                    placeholder="Например, Машина"
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Целевая сумма (₽)</label>
                                <input
                                    type="number"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                    placeholder="1000000"
                                    min="1"
                                    step="0.01"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Иконки */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Иконка</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {planIconOptions.map(icon => (
                                        <button
                                            key={icon.id}
                                            type="button"
                                            onClick={() => setIconId(icon.id)}
                                            className={`p-2 rounded-lg flex flex-col items-center ${
                                                iconId === icon.id
                                                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900'
                                                    : 'bg-gray-100 dark:bg-gray-700'
                                            }`}
                                        >
                                            <span className="text-2xl">{icon.emoji}</span>
                                            <span className="text-xs mt-1 dark:text-gray-300">{icon.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Цвета */}
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Цвет</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {planColorOptions.map(color => (
                                        <button
                                            key={color.id}
                                            type="button"
                                            onClick={() => setColorId(color.id)}
                                            className={`p-2 rounded-lg flex flex-col items-center ${
                                                colorId === color.id ? 'ring-2 ring-blue-500' : ''
                                            } ${color.bg} dark:bg-opacity-80`}
                                        >
                                            <span className={`text-sm font-medium ${color.text}`}>{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Дедлайн (необязательно)</label>
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                    disabled={isSubmitting}
                                />
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                                    {error}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Фиксированные кнопки */}
                    <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition"
                            >
                                {isSubmitting ? 'Сохранение...' : (editingPlan ? 'Сохранить' : 'Создать')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanForm;