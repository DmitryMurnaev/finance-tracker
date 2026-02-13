// Конфигурация категорий: по имени категории (из БД) определяем иконку, цвет и отображаемое имя
export const categoryConfig = {
    // Английские названия (как в БД)
    food: {
        icon: '🍔',
        color: 'bg-orange-100 text-orange-800',
        name: 'Еда'
    },
    transport: {
        icon: '🚖',
        color: 'bg-blue-100 text-blue-800',
        name: 'Транспорт'
    },
    freelance: {
        icon: '💻',
        color: 'bg-indigo-100 text-indigo-800',
        name: 'Фриланс'
    },
    salary: {
        icon: '💰',
        color: 'bg-green-100 text-green-800',
        name: 'Зарплата'
    },
    shopping: {
        icon: '🛒',
        color: 'bg-purple-100 text-purple-800',
        name: 'Шоппинг'
    },
    bills: {
        icon: '📄',
        color: 'bg-yellow-100 text-yellow-800',
        name: 'Счета'
    },
    entertainment: {
        icon: '🎬',
        color: 'bg-pink-100 text-pink-800',
        name: 'Развлечения'
    },
    // Русские названия (если есть)
    'Заниматься': {
        icon: '📚',
        color: 'bg-teal-100 text-teal-800',
        name: 'Обучение'
    },
    // Можно добавить другие русские варианты по мере появления
    // Категория по умолчанию, если имя не найдено
    default: {
        icon: '📌',
        color: 'bg-gray-100 text-gray-800',
        name: 'Другое'
    }
};

// Вспомогательная функция для получения конфига по имени
export const getCategoryConfig = (categoryName) => {
    return categoryConfig[categoryName] || categoryConfig.default;
};