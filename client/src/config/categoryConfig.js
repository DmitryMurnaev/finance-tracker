export const categoryConfig = {
    // Расходы
    groceries: {
        icon: '🥦',
        color: 'bg-green-100 text-green-800',
        name: 'Продукты',
        chartColor: '#22C55E'
    },
    cafe: {
        icon: '☕',
        color: 'bg-yellow-100 text-yellow-800',
        name: 'Кафе и рестораны',
        chartColor: '#EAB308'
    },
    transport: {
        icon: '🚖',
        color: 'bg-blue-100 text-blue-800',
        name: 'Транспорт',
        chartColor: '#3B82F6'
    },
    health: {
        icon: '💊',
        color: 'bg-red-100 text-red-800',
        name: 'Здоровье',
        chartColor: '#EF4444'
    },
    education: {
        icon: '📚',
        color: 'bg-indigo-100 text-indigo-800',
        name: 'Образование',
        chartColor: '#6366F1'
    },
    entertainment: {
        icon: '🎬',
        color: 'bg-pink-100 text-pink-800',
        name: 'Развлечения',
        chartColor: '#EC4899'
    },
    clothing: {
        icon: '👕',
        color: 'bg-purple-100 text-purple-800',
        name: 'Одежда',
        chartColor: '#A855F7'
    },
    travel: {
        icon: '✈️',
        color: 'bg-sky-100 text-sky-800',
        name: 'Путешествия',
        chartColor: '#0EA5E9'
    },
    sport: {
        icon: '⚽',
        color: 'bg-lime-100 text-lime-800',
        name: 'Спорт',
        chartColor: '#84CC16'
    },
    beauty: {
        icon: '💅',
        color: 'bg-rose-100 text-rose-800',
        name: 'Красота',
        chartColor: '#F43F5E'
    },
    car: {
        icon: '🚗',
        color: 'bg-gray-100 text-gray-800',
        name: 'Автомобиль',
        chartColor: '#6B7280'
    },
    electronics: {
        icon: '💻',
        color: 'bg-cyan-100 text-cyan-800',
        name: 'Электроника',
        chartColor: '#06B6D4'
    },
    gifts: {
        icon: '🎁',
        color: 'bg-orange-100 text-orange-800',
        name: 'Подарки',
        chartColor: '#F97316'
    },
    hobby: {
        icon: '🎨',
        color: 'bg-fuchsia-100 text-fuchsia-800',
        name: 'Хобби',
        chartColor: '#D946EF'
    },
    repair: {
        icon: '🔧',
        color: 'bg-stone-100 text-stone-800',
        name: 'Ремонт',
        chartColor: '#78716C'
    },
    utilities: {
        icon: '💡',
        color: 'bg-amber-100 text-amber-800',
        name: 'ЖКУ',
        chartColor: '#F59E0B'
    },
    home: {
        icon: '🏠',
        color: 'bg-emerald-100 text-emerald-800',
        name: 'Покупки для дома',
        chartColor: '#10B981'
    },
    credit: {
        icon: '💳',
        color: 'bg-red-100 text-red-800',
        name: 'Кредит',
        chartColor: '#DC2626'
    },
    // Доходы
    salary: {
        icon: '💰',
        color: 'bg-green-100 text-green-800',
        name: 'Зарплата',
        chartColor: '#22C55E'
    },
    gift: {
        icon: '🎁',
        color: 'bg-orange-100 text-orange-800',
        name: 'Подарок',
        chartColor: '#F97316'
    },
    cashback: {
        icon: '💸',
        color: 'bg-blue-100 text-blue-800',
        name: 'Кэшбэк',
        chartColor: '#3B82F6'
    },
    business: {
        icon: '💼',
        color: 'bg-purple-100 text-purple-800',
        name: 'Бизнес',
        chartColor: '#A855F7'
    },
    // Общая категория «Другое»
    other: {
        icon: '📌',
        color: 'bg-gray-100 text-gray-800',
        name: 'Другое',
        chartColor: '#6B7280'
    }
};

export const getCategoryConfig = (categoryName) => {
    return categoryConfig[categoryName] || categoryConfig.other;
};