import { Trash2 } from 'lucide-react';

const TransactionItem = ({ transaction, onDelete }) => {
    // Функция для получения информации о категории
    const getCategoryInfo = () => {
        const categories = {
            food: { emoji: '🍕', label: 'Еда', color: 'bg-red-100 text-red-800' },
            transport: { emoji: '🚕', label: 'Транспорт', color: 'bg-blue-100 text-blue-800' },
            // ... другие категории
        };
        return categories[transaction.category] || categories.other;
    };

    const categoryInfo = getCategoryInfo();
    const isExpense = transaction.type === 'expense';

    // Форматирование даты
    const date = new Date(transaction.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
    });

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm mb-2">
            {/* Левая часть: иконка и информация */}
            <div className="flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${categoryInfo.color}`}>
                    <span className="text-2xl">{categoryInfo.emoji}</span>
                </div>
                <div>
                    <h4 className="font-medium">{transaction.description}</h4>
                    <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-xs ${categoryInfo.color}`}>
              {categoryInfo.label}
            </span>
                        <span className="text-gray-500 text-sm">{date}</span>
                    </div>
                </div>
            </div>

            {/* Правая часть: сумма и кнопка удаления */}
            <div className="flex items-center gap-3">
        <span className={`text-lg font-bold ${
            isExpense ? 'text-red-600' : 'text-green-600'
        }`}>
          {isExpense ? '-' : '+'} {transaction.amount.toLocaleString()} ₽
        </span>
                <button
                    onClick={() => onDelete(transaction.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                    aria-label="Удалить операцию"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;