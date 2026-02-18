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
                <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md mx-auto flex flex-col md:shadow-xl">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-bold">{editingPlan ? 'Редактировать цель' : 'Новая цель'}</h2>
                        <button onClick={onClose}><X size={24} /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4">
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Название</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Например, Машина"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Целевая сумма (₽)</label>
                            <input
                                type="number"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                className="w-full p-3 border rounded-lg"
                                placeholder="1000000"
                                min="1"
                                step="0.01"
                                disabled={isSubmitting}
                            />
                        </div>
                        {/* Иконки */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 font-medium">Иконка</label>
                            <div className="grid grid-cols-4 gap-2">
                                {planIconOptions.map(icon => (
                                    <button
                                        key={icon.id}
                                        type="button"
                                        onClick={() => setIconId(icon.id)}
                                        className={`p-2 rounded-lg flex flex-col items-center ${
                                            iconId === icon.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-2xl">{icon.emoji}</span>
                                        <span className="text-xs mt-1">{icon.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Цвета */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 font-medium">Цвет</label>
                            <div className="grid grid-cols-4 gap-2">
                                {planColorOptions.map(color => (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => setColorId(color.id)}
                                        className={`p-2 rounded-lg flex flex-col items-center ${
                                            colorId === color.id ? 'ring-2 ring-blue-500' : ''
                                        } ${color.bg}`}
                                    >
                                        <span className={`text-sm font-medium ${color.text}`}>{color.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Дедлайн (необязательно)</label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full p-3 border rounded-lg"
                                disabled={isSubmitting}
                            />
                        </div>
                        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 py-3 rounded-lg">Отмена</button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50">
                                {isSubmitting ? 'Сохранение...' : (editingPlan ? 'Сохранить' : 'Создать')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlanForm;