import { Pencil, Trash2, TrendingUp } from 'lucide-react';
import { getPlanIconById, getPlanColorById } from '../../config/plansConfig';
import { useCurrency } from '../../context/CurrencyContext';

const PlanCard = ({ plan, onEdit, onDelete, onContribute }) => {
    const { formatCurrency } = useCurrency();
    const icon = getPlanIconById(plan.icon_id);
    const color = getPlanColorById(plan.color_id);
    const progress = (plan.current_amount / plan.target_amount) * 100;
    const remaining = plan.target_amount - plan.current_amount;

    return (
        <div className={`p-4 rounded-xl shadow-sm border border-gray-100 ${color.bg}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-3xl">{icon.emoji}</span>
                    <span className={`font-bold text-lg ${color.text}`}>{plan.name}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => onContribute(plan)} className="text-green-600 hover:text-green-700">
                        <TrendingUp size={20} />
                    </button>
                    <button onClick={() => onEdit(plan)} className="text-gray-500 hover:text-blue-600">
                        <Pencil size={20} />
                    </button>
                    <button onClick={() => onDelete(plan.id)} className="text-gray-500 hover:text-red-600">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{formatCurrency(plan.current_amount)}</span>
                <span className="text-gray-600">из {formatCurrency(plan.target_amount)}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            {remaining > 0 ? (
                <p className="text-xs text-gray-600 mt-2">Осталось {formatCurrency(remaining)}</p>
            ) : (
                <p className="text-xs text-green-600 mt-2">Цель достигнута! 🎉</p>
            )}
        </div>
    );
};

export default PlanCard;