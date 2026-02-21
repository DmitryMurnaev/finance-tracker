import { Pencil, Trash2 } from 'lucide-react';
import { getCategoryConfig } from '../../config/categoryConfig';
import { useCurrency } from '../../context/CurrencyContext';

const TransactionItem = ({ transaction, onDelete, onEdit }) => {
    const { formatCurrency } = useCurrency();
    if (!transaction) return null;

    const isExpense = transaction.type === 'expense';
    const config = getCategoryConfig(transaction.category_name);

    const formattedDate = transaction.date
        ? new Date(transaction.date).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
        })
        : 'Дата не указана';

    return (
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl shadow-sm mb-2 hover:shadow-md transition-shadow">
            <div className="flex items-center min-w-0 flex-1">
                <div
                    className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 sm:mr-4 ${config.color}`}
                >
                    <span className="text-xl sm:text-2xl">{config.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                        {transaction.description || 'Без описания'}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 sm:mt-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${config.color} flex-shrink-0`}>
                            {config.name}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0">{formattedDate}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                <span
                    className={`text-sm sm:text-lg font-bold whitespace-nowrap ${
                        isExpense ? 'text-red-600' : 'text-green-600'
                    }`}
                >
                    {isExpense ? '-' : '+'} {formatCurrency(transaction.amount)}
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={() => onEdit(transaction)}
                        className="p-1 sm:p-2 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                        title="Редактировать"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Удалить операцию"
                    >
                        <Trash2 size={16} className="sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionItem;