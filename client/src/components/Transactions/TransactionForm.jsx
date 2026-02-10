import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TransactionForm = ({ isOpen, onClose, onAddTransaction }) => {
  // Состояние формы
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense'); // 'expense' или 'income'
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Массив категорий с метаданными
  const categories = {
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

  // Инициализация категории при изменении типа
  useEffect(() => {
    if (type === 'expense') {
      setCategory('food');
    } else {
      setCategory('salary');
    }
  }, [type]);

  // Инициализация даты при открытии формы
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setError('');
    }
  }, [isOpen]);

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Валидация
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        throw new Error('Введите корректную сумму (больше 0)');
      }

      if (!description.trim()) {
        throw new Error('Введите описание операции');
      }

      if (!date) {
        throw new Error('Выберите дату');
      }

      // Создание объекта операции для БД
      const transactionData = {
        amount: parseFloat(amount),
        description: description.trim(),
        type,
        category,
        date
      };

      console.log('📝 Отправляю транзакцию в БД:', transactionData);

      // Вызов callback-функции (которая отправит на сервер)
      await onAddTransaction(transactionData);

      // Сброс формы
      resetForm();

    } catch (error) {
      console.error('❌ Ошибка при добавлении транзакции:', error);
      setError(error.message || 'Не удалось добавить операцию. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Сброс формы
  const resetForm = () => {
    setAmount('');
    setDescription('');
    setType('expense');
    setCategory('food');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  // Обработчик закрытия формы
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Если форма закрыта - не рендерим
  if (!isOpen) return null;

  return (
      // Модальное окно с полупрозрачным фоном
      <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
        <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
          {/* Заголовок с кнопкой закрытия */}
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
            <h2 className="text-xl font-bold text-gray-900">Новая операция</h2>
            <button
                onClick={handleClose}
                className="p-2 text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>

          {/* Основная форма */}
          <form onSubmit={handleSubmit} className="p-4">
            {/* Поле суммы с акцентом */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Сумма (₽)</label>
              <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full text-4xl font-bold border-0 focus:outline-none"
                  autoFocus
                  disabled={isSubmitting}
                  step="0.01"
                  min="0.01"
              />
              <div className="h-1 bg-gray-200 rounded-full"></div>
            </div>

            {/* Поле описания */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Описание</label>
              <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="На что потратили или откуда деньги?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  disabled={isSubmitting}
                  maxLength={100}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {description.length}/100
              </div>
            </div>

            {/* Селектор типа операции */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Тип операции</label>
              <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setType('expense')}
                    disabled={isSubmitting}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        type === 'expense'
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Расход
                </button>
                <button
                    type="button"
                    onClick={() => setType('income')}
                    disabled={isSubmitting}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        type === 'income'
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Доход
                </button>
              </div>
            </div>

            {/* Выбор категории с сеткой иконок */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Категория</label>
              <div className="grid grid-cols-3 gap-2">
                {categories[type].map((cat) => (
                    <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        disabled={isSubmitting}
                        className={`p-3 rounded-xl flex flex-col items-center transition-all ${
                            category === cat.value
                                ? 'ring-2 ring-blue-500 shadow-sm ' + cat.color
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                      <span className="text-lg">{cat.label.split(' ')[0]}</span>
                      <span className="text-xs mt-1">{cat.label.split(' ')[1]}</span>
                    </button>
                ))}
              </div>
            </div>

            {/* Поле даты */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">Дата</label>
              <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  disabled={isSubmitting}
                  max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Сообщение об ошибке */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="mr-2">⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
            )}

            {/* Кнопка отправки */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                } text-white shadow-sm`}
            >
              {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Добавление...
                  </div>
              ) : (
                  'Добавить операцию'
              )}
            </button>

            {/* Информация о заполнении */}
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Операция будет сохранена в базе данных PostgreSQL</p>
            </div>
          </form>
        </div>
      </div>
  );
};

export default TransactionForm;