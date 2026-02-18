// Иконки для планов (можно те же, что и для счетов)
export const planIconOptions = [
    { id: 1, emoji: '🏠', name: 'Дом' },
    { id: 2, emoji: '🚗', name: 'Машина' },
    { id: 3, emoji: '✈️', name: 'Путешествие' },
    { id: 4, emoji: '📚', name: 'Образование' },
    { id: 5, emoji: '💻', name: 'Техника' },
    { id: 6, emoji: '🏥', name: 'Здоровье' },
    { id: 7, emoji: '🎁', name: 'Подарок' },
    { id: 8, emoji: '💰', name: 'Накопления' },
];

// Цветовые схемы (Tailwind классы)
export const planColorOptions = [
    { id: 1, bg: 'bg-red-100', text: 'text-red-800', name: 'Красный' },
    { id: 2, bg: 'bg-blue-100', text: 'text-blue-800', name: 'Синий' },
    { id: 3, bg: 'bg-green-100', text: 'text-green-800', name: 'Зелёный' },
    { id: 4, bg: 'bg-yellow-100', text: 'text-yellow-800', name: 'Жёлтый' },
    { id: 5, bg: 'bg-purple-100', text: 'text-purple-800', name: 'Фиолетовый' },
    { id: 6, bg: 'bg-pink-100', text: 'text-pink-800', name: 'Розовый' },
    { id: 7, bg: 'bg-gray-100', text: 'text-gray-800', name: 'Серый' },
];

export const getPlanIconById = (id) => planIconOptions.find(i => i.id === id) || planIconOptions[0];
export const getPlanColorById = (id) => planColorOptions.find(c => c.id === id) || planColorOptions[0];