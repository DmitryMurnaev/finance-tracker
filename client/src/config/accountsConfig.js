// Иконки для счетов (эмодзи)
export const iconOptions = [
    { id: 1, emoji: '💰', name: 'Деньги' },
    { id: 2, emoji: '🏦', name: 'Банк' },
    { id: 3, emoji: '💳', name: 'Карта' },
    { id: 4, emoji: '💵', name: 'Наличные' },
    { id: 5, emoji: '📱', name: 'Телефон' },
    { id: 6, emoji: '🪙', name: 'Монета' },
    { id: 7, emoji: '💼', name: 'Кошелёк' },
];

// Цветовые схемы (Tailwind классы)
export const colorOptions = [
    { id: 1, bg: 'bg-red-100', text: 'text-red-800', name: 'Красный' },
    { id: 2, bg: 'bg-blue-100', text: 'text-blue-800', name: 'Синий' },
    { id: 3, bg: 'bg-green-100', text: 'text-green-800', name: 'Зелёный' },
    { id: 4, bg: 'bg-yellow-100', text: 'text-yellow-800', name: 'Жёлтый' },
    { id: 5, bg: 'bg-purple-100', text: 'text-purple-800', name: 'Фиолетовый' },
    { id: 6, bg: 'bg-pink-100', text: 'text-pink-800', name: 'Розовый' },
    { id: 7, bg: 'bg-gray-100', text: 'text-gray-800', name: 'Серый' },
];

// Вспомогательные функции
export const getIconById = (id) => iconOptions.find(i => i.id === id) || iconOptions[0];
export const getColorById = (id) => colorOptions.find(c => c.id === id) || colorOptions[0];