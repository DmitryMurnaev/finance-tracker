import { useState } from 'react';
import { X } from 'lucide-react';

const TransactionForm = ({ isOpen, onClose, onAddTransaction }) => {
  // Состояние формы
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense'); // 'expense' или 'income'
  const [category, setCategory] = useState('food');

  // Массив категорий с метаданными
  const categories = {
    expense: [
      { value: 'food', label: '🍕 Еда', color: 'bg-red-100 text-red-800' },
      { value: 'transport', label: '🚕 Транспорт', color: 'bg-blue-100 text-blue-800' },
      // ... остальные категории
    ],
    income: [
      // ... категории доходов
    ]
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    // Валидация
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Введите корректную сумму');
      return;
    }

    // Создание объекта операции
    const transaction = {
      id: Date.now(), // Простой способ генерации ID
      amount: Number(amount),
      description: description || 'Без описания',
      type,
      category,
      date: new Date().toISOString(),
    };

    // Вызов callback-функции
    onAddTransaction(transaction);

    // Сброс формы
    setAmount('');
    setDescription('');
    onClose();
  };

  // Если форма закрыта - не рендерим
  if (!isOpen) return null;

  return (
      // Модальное окно с полупрозрачным фоном
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Заголовок с кнопкой закрытия */}
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Новая операция</h2>
            <button onClick={onClose} className="p-2">
              <X size={24} />
            </button>
          </div>

          {/* Основная форма */}
          <form onSubmit={handleSubmit} className="p-4">
            {/* Поле суммы с акцентом */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Сумма (₽)</label>
              <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full text-4xl font-bold border-0 focus:outline-none"
                  autoFocus
              />
              <div className="h-1 bg-gray-200 rounded-full"></div>
            </div>

            {/* Селектор типа операции */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Тип операции</label>
              <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-3 rounded-xl font-medium ${
                        type === 'expense'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  Расход
                </button>
                {/* ... кнопка для доходов */}
              </div>
            </div>

            {/* Выбор категории с сеткой иконок */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Категория</label>
              <div className="grid grid-cols-3 gap-2">
                {categories[type].map((cat) => (
                    <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`p-3 rounded-xl flex flex-col items-center ${
                            category === cat.value
                                ? 'ring-2 ring-blue-500 ' + cat.color
                                : 'bg-gray-100'
                        }`}
                    >
                      <span className="text-lg">{cat.label.split(' ')[0]}</span>
                      <span className="text-xs mt-1">{cat.label.split(' ')[1]}</span>
                    </button>
                ))}
              </div>
            </div>

            {/* Кнопка отправки */}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-lg"
            >
              Добавить операцию
            </button>
          </form>
        </div>
      </div>
  );
};

export default TransactionForm;