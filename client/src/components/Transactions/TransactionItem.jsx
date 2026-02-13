import { Pencil, Trash2 } from 'lucide-react';


const TransactionItem = ({ transaction, onDelete, onEdit }) => {
    // Функция для получения информации о категории
    const getCategoryInfo = () => {
        const categories = {
            food: { emoji: '🍕', label: 'Еда', color: 'bg-red-100 text-red-800' },
            transport: { emoji: '🚕', label: 'Транспорт', color: 'bg-blue-100 text-blue-800' },
            shopping: { emoji: '🛍️', label: 'Покупки', color: 'bg-purple-100 text-purple-800' },
            salary: { emoji: '💰', label: 'Зарплата', color: 'bg-green-100 text-green-800' },
            freelance: { emoji: '💼', label: 'Фриланс', color: 'bg-yellow-100 text-yellow-800' },
            entertainment: { emoji: '🎬', label: 'Развлечения', color: 'bg-pink-100 text-pink-800' },
            health: { emoji: '🏥', label: 'Здоровье', color: 'bg-indigo-100 text-indigo-800' },
            education: { emoji: '📚', label: 'Образование', color: 'bg-teal-100 text-teal-800' },
            bills: { emoji: '🏠', label: 'Счета', color: 'bg-orange-100 text-orange-800' },
            other: { emoji: '📝', label: 'Другое', color: 'bg-gray-100 text-gray-800' }
        };

        return categories[transaction.category] || categories.other;
    };

    if (!transaction) {
        console.warn('TransactionItem: transaction is undefined');
        return null;
    }

    const categoryInfo = getCategoryInfo();
    const isExpense = transaction.type === 'expense';

    // Форматирование даты
    let formattedDate = 'Дата не указана';
    try {
        if (transaction.date) {
            formattedDate = new Date(transaction.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
            });
        }
    } catch (error) {
        console.warn('Ошибка форматирования даты:', error);
    }

    // Форматирование суммы
    const formattedAmount = transaction.amount
        ? transaction.amount.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
        : '0.00';
    console.log('🔥 TransactionItem props:', { onEdit, onDelete, transaction });
    return (
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl shadow-sm mb-2 hover:shadow-md transition-shadow">
            {/* Левая часть: иконка и информация */}
            <div className="flex items-center min-w-0 flex-1">
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mr-3 sm:mr-4 ${categoryInfo.color}`}>
                    <span className="text-xl sm:text-2xl">{categoryInfo.emoji}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                        {transaction.description || 'Без описания'}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 sm:mt-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${categoryInfo.color} flex-shrink-0`}>
                            {categoryInfo.label}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0">{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Правая часть: сумма и кнопка удаления */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                <span className={`text-sm sm:text-lg font-bold whitespace-nowrap ${
                    isExpense ? 'text-red-600' : 'text-green-600'
                }`}>
                    {isExpense ? '-' : '+'} {formattedAmount} ₽
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={() => onEdit(transaction)}  // передаём всю транзакцию
                        className="p-1 sm:p-2 text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
                        title="Редактировать"
                    >
                        <Pencil size={18}/>
                    </button>
                    <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Удалить операцию"
                    >
                        <Trash2 size={16} className="sm:w-4 sm:h-4"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionItem;