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
    { id: 1, bg: 'bg-red-300', text: 'text-white', name: 'Красный' },
    { id: 2, bg: 'bg-blue-300', text: 'text-white', name: 'Синий' },
    { id: 3, bg: 'bg-green-300', text: 'text-white', name: 'Зелёный' },
    { id: 4, bg: 'bg-yellow-300', text: 'text-white', name: 'Жёлтый' },
    { id: 5, bg: 'bg-purple-300', text: 'text-white', name: 'Фиолетовый' },
    { id: 6, bg: 'bg-pink-300', text: 'text-white', name: 'Розовый' },
    { id: 7, bg: 'bg-gray-300', text: 'text-white', name: 'Серый' },
];

// Вспомогательные функции
export const getIconById = (id) => iconOptions.find(i => i.id === id) || iconOptions[0];
export const getColorById = (id) => colorOptions.find(c => c.id === id) || colorOptions[0];