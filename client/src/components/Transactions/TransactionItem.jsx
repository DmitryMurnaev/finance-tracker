import { Trash2 } from 'lucide-react';

const TransactionItem = ({ transaction, onDelete }) => {
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

        // Возвращаем информацию по категории или "other" если не найдено
        return categories[transaction.category] || categories.other;
    };

    // Защита от undefined
    if (!transaction) {
        console.warn('TransactionItem: transaction is undefined');
        return null;
    }

    const categoryInfo = getCategoryInfo();
    const isExpense = transaction.type === 'expense';

    // Форматирование даты с защитой от ошибок
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

    // Форматирование суммы с защитой
    const formattedAmount = transaction.amount
        ? transaction.amount.toLocaleString('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
        : '0.00';

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm mb-2 hover:shadow-md transition-shadow">
            {/* Левая часть: иконка и информация */}
            <div className="flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${categoryInfo.color}`}>
                    <span className="text-2xl">{categoryInfo.emoji}</span>
                </div>
                <div>
                    <h4 className="font-medium text-gray-800">
                        {transaction.description || 'Без описания'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${categoryInfo.color}`}>
                            {categoryInfo.label}
                        </span>
                        <span className="text-gray-500 text-sm">{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Правая часть: сумма и кнопка удаления */}
            <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${
                    isExpense ? 'text-red-600' : 'text-green-600'
                }`}>
                    {isExpense ? '-' : '+'} {formattedAmount} ₽
                </span>
                <button
                    onClick={() => onDelete(transaction.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Удалить операцию"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;