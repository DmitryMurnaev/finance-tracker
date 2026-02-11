import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TransactionForm = ({ isOpen, onClose, onAddTransaction }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Сокращенные категории для мобильных (чтобы поместились без прокрутки)
  const categories = {
    expense: [
      { value: 'food', label: '🍕 Еда', color: 'bg-red-100 text-red-800' },
      { value: 'transport', label: '🚕 Транспорт', color: 'bg-blue-100 text-blue-800' },
      { value: 'shopping', label: '🛍️ Покупки', color: 'bg-purple-100 text-purple-800' },
      { value: 'entertainment', label: '🎬 Кино', color: 'bg-pink-100 text-pink-800' },
      { value: 'bills', label: '🏠 Счета', color: 'bg-orange-100 text-orange-800' },
      { value: 'other', label: '📝 Другое', color: 'bg-gray-100 text-gray-800' }
    ],
    income: [
      { value: 'salary', label: '💰 Зарплата', color: 'bg-green-100 text-green-800' },
      { value: 'freelance', label: '💼 Фриланс', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'gift', label: '🎁 Подарок', color: 'bg-rose-100 text-rose-800' },
      { value: 'other', label: '📝 Другое', color: 'bg-gray-100 text-gray-800' }
    ]
  };

  // Полные категории для десктопа
  const desktopCategories = {
    expense: [
      { value: 'food', label: '🍕 Еда', color: 'bg-red-100 text-red-800' },
      { value: 'transport', label: '🚕 Транспорт', color: 'bg-blue-100 text-blue-800' },
      { value: 'shopping', label: '🛍️ Покупки', color: 'bg-purple-100 text-purple-800' },
      { value: 'entertainment', label: '🎬 Развлечения', color: 'bg-pink-100 text-pink-800' },
      { value: 'health', label: '🏥 Здоровье', color: 'bg-indigo-100 text-indigo-800' },
      { value: 'bills', label: '🏠 Счета', color: 'bg-orange-100 text-orange-800' },
      { value: 'education', label: '📚 Образование', color: 'bg-teal-100 text-teal-800' },
      { value: 'other', label: '📝 Другое', color: 'bg-gray-100 text-gray-800' }
    ],
    income: [
      { value: 'salary', label: '💰 Зарплата', color: 'bg-green-100 text-green-800' },
      { value: 'freelance', label: '💼 Фриланс', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'investment', label: '📈 Инвестиции', color: 'bg-emerald-100 text-emerald-800' },
      { value: 'gift', label: '🎁 Подарок', color: 'bg-rose-100 text-rose-800' },
      { value: 'bonus', label: '⭐ Премия', color: 'bg-amber-100 text-amber-800' },
      { value: 'other', label: '📝 Другое', color: 'bg-gray-100 text-gray-800' }
    ]
  };

  // Выбираем категории в зависимости от устройства
  const currentCategories = window.innerWidth >= 768 ? desktopCategories : categories;

  useEffect(() => {
    if (type === 'expense') {
      setCategory('food');
    } else {
      setCategory('salary');
    }
  }, [type]);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        throw new Error('Введите корректную сумму (больше 0)');
      }

      if (!description.trim()) {
        throw new Error('Введите описание операции');
      }

      const transactionData = {
        amount: parseFloat(amount),
        description: description.trim(),
        type,
        category,
        date
      };

      await onAddTransaction(transactionData);
      resetForm();
      onClose();

    } catch (error) {
      setError(error.message || 'Не удалось добавить операцию');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setType('expense');
    setCategory('food');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50">
        {/* Затемнение */}
        <div
            className="fixed inset-0 bg-black/50"
            onClick={handleClose}
        />

        {/* Форма - адаптивная без прокрутки */}
        <div className="
        fixed
        bottom-0 left-0 right-0
        md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
      ">
          {/* Контейнер - высота определяется содержимым */}
          <div className="
          bg-white
          rounded-t-3xl md:rounded-2xl
          w-full max-w-md md:max-w-lg
          mx-auto
          flex flex-col
          md:shadow-xl
        ">
            {/* Заголовок */}
            <div className="
            bg-white border-b border-gray-100
            p-4
            flex justify-between items-center
          ">
              <h2 className="text-xl font-bold text-gray-900">Новая операция</h2>
              <button
                  onClick={handleClose}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            {/* Форма без прокрутки */}
            <form onSubmit={handleSubmit} className="p-4">

              {/* Сумма */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Сумма (₽)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full text-3xl font-bold border-0 focus:outline-none p-0"
                    autoFocus
                    disabled={isSubmitting}
                    step="0.01"
                    min="0.01"
                />
                <div className="h-1 bg-gray-200 rounded-full mt-1"></div>
              </div>

              {/* Описание */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Описание</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Краткое описание"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={isSubmitting}
                    maxLength={50}
                />
              </div>

              {/* Тип операции */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Тип операции</label>
                <div className="flex gap-2">
                  <button
                      type="button"
                      onClick={() => setType('expense')}
                      disabled={isSubmitting}
                      className={`flex-1 py-3 rounded-xl font-medium ${
                          type === 'expense'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    Расход
                  </button>
                  <button
                      type="button"
                      onClick={() => setType('income')}
                      disabled={isSubmitting}
                      className={`flex-1 py-3 rounded-xl font-medium ${
                          type === 'income'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    Доход
                  </button>
                </div>
              </div>

              {/* Категория - на мобиле меньше категорий */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Категория</label>
                <div className="grid grid-cols-3 gap-2">
                  {currentCategories[type].map((cat) => (
                      <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          disabled={isSubmitting}
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

              {/* Дата */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Дата</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={isSubmitting}
                    max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Ошибка */}
              {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <div className="flex items-center">
                      <span className="mr-2">⚠️</span>
                      <span>{error}</span>
                    </div>
                  </div>
              )}

              {/* Кнопка */}
              <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Добавление...' : 'Добавить'}
                </button>
              </div>


            </form>
          </div>
        </div>
      </div>
  );
};

export default TransactionForm;