import { Pencil, Trash2, TrendingUp } from 'lucide-react';
import { getPlanIconById, getPlanColorById } from '../../config/plansConfig';
import { useCurrency } from '../../context/CurrencyContext';

const PlanCard = ({ plan, onEdit, onDelete, onContribute }) => {
    const { formatCurrency } = useCurrency();
    const icon = getPlanIconById(plan.icon_id);
    const color = getPlanColorById(plan.color_id);
    const progress = (plan.current_amount / plan.target_amount) * 100;
    const remaining = plan.target_amount - plan.current_amount;

    // Функция для определения цвета текста в зависимости от фона
    const getTextColor = (bgClass) => {
        if (bgClass.includes('bg-yellow-100') ||
            bgClass.includes('bg-gray-100') ||
            bgClass.includes('bg-blue-100') ||
            bgClass.includes('bg-green-100') ||
            bgClass.includes('bg-red-100') ||
            bgClass.includes('bg-purple-100') ||
            bgClass.includes('bg-pink-100')) {
            return 'text-gray-800';
        }
        return 'text-white';
    };

    const textColor = getTextColor(color.bg);

    return (
        <div
            onClick={() => onContribute(plan)}
            className={`p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${color.bg} dark:bg-opacity-90 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-3xl">{icon.emoji}</span>
                    <span className={`font-bold text-lg ${textColor}`}>{plan.name}</span>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onContribute(plan)} className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                        <TrendingUp size={20} />
                    </button>
                    <button onClick={() => onEdit(plan)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                        <Pencil size={20} />
                    </button>
                    <button onClick={() => onDelete(plan.id)} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
            <div className={`flex justify-between text-sm mb-1 ${textColor}`}>
                <span className="font-medium">{formatCurrency(plan.current_amount)}</span>
                <span>из {formatCurrency(plan.target_amount)}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            {remaining > 0 ? (
                <p className={`text-xs mt-2 ${textColor === 'text-white' ? 'text-gray-200' : 'text-gray-600'}`}>
                    Осталось {formatCurrency(remaining)}
                </p>
            ) : (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">Цель достигнута! 🎉</p>
            )}
        </div>
    );
};

export default PlanCard;