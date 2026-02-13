export const categoryConfig = {
    food: {
        icon: '🍔',
        color: 'bg-orange-100 text-orange-800',
        name: 'Еда',
        chartColor: '#F97316' // оранжевый
    },
    transport: {
        icon: '🚖',
        color: 'bg-blue-100 text-blue-800',
        name: 'Транспорт',
        chartColor: '#3B82F6' // синий
    },
    freelance: {
        icon: '💻',
        color: 'bg-indigo-100 text-indigo-800',
        name: 'Фриланс',
        chartColor: '#6366F1' // индиго
    },
    salary: {
        icon: '💰',
        color: 'bg-green-100 text-green-800',
        name: 'Зарплата',
        chartColor: '#10B981' // зелёный
    },
    shopping: {
        icon: '🛒',
        color: 'bg-purple-100 text-purple-800',
        name: 'Шоппинг',
        chartColor: '#A855F7' // фиолетовый
    },
    bills: {
        icon: '📄',
        color: 'bg-yellow-100 text-yellow-800',
        name: 'Счета',
        chartColor: '#EAB308' // жёлтый
    },
    entertainment: {
        icon: '🎬',
        color: 'bg-pink-100 text-pink-800',
        name: 'Развлечения',
        chartColor: '#EC4899' // розовый
    },
    'Заниматься': {
        icon: '📚',
        color: 'bg-teal-100 text-teal-800',
        name: 'Обучение',
        chartColor: '#14B8A6' // бирюзовый
    },
    default: {
        icon: '📌',
        color: 'bg-gray-100 text-gray-800',
        name: 'Другое',
        chartColor: '#6B7280' // серый
    }
};

export const getCategoryConfig = (categoryName) => {
    return categoryConfig[categoryName] || categoryConfig.default;
};