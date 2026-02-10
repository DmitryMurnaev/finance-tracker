import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const TransactionForm = ({ isOpen, onClose, onAddTransaction }) => {
  // Состояние формы
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Массив категорий
  const categories = {
    expense: [
      { value: 'food', label: '🍕 Еда', color: 'bg-red-100 text-red-800 border-red-200' },
      { value: 'transport', label: '🚕 Транспорт', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      { value: 'shopping', label: '🛍️ Покупки', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      { value: 'entertainment', label: '🎬 Развлечения', color: 'bg-pink-100 text-pink-800 border-pink-200' },
      { value: 'health', label: '🏥 Здоровье', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
      { value: 'bills', label: '🏠 Счета', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      { value: 'education', label: '📚 Образование', color: 'bg-teal-100 text-teal-800 border-teal-200' },
      { value: 'other', label: '📝 Другое', color: 'bg-gray-100 text-gray-800 border-gray-200' }
    ],
    income: [
      { value: 'salary', label: '💰 Зарплата', color: 'bg-green-100 text-green-800 border-green-200' },
      { value: 'freelance', label: '💼 Фриланс', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      { value: 'investment', label: '📈 Инвестиции', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      { value: 'gift', label: '🎁 Подарок', color: 'bg-rose-100 text-rose-800 border-rose-200' },
      { value: 'bonus', label: '⭐ Премия', color: 'bg-amber-100 text-amber-800 border-amber-200' },
      { value: 'other', label: '📝 Другое', color: 'bg-gray-100 text-gray-800 border-gray-200' }
    ]
  };

  // Инициализация
  useEffect(() => {
    if (type === 'expense') {
      setCategory('food');
    } else {
      setCategory('salary');
    }
  }, [type]);

  // Инициализация даты
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setError('');
    }
  }, [isOpen]);

  // Обработчик отправки
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

      // Подготовка данных для БД
      const transactionData = {
        amount: parseFloat(amount),
        description: description.trim(),
        type,
        category,
        date: date || new Date().toISOString().split('T')[0]
      };

      // Отправка через callback (который вызовет API)
      await onAddTransaction(transactionData);

      // Сброс формы и закрытие
      resetForm();
      onClose();

    } catch (error) {
      console.error('❌ Ошибка формы:', error);
      setError(error.message || 'Ошибка при добавлении операции');
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
    setDate('');
    setError('');
  };

  // Обработчик закрытия
  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50">
        {/* Затемнение фона */}
        <div
            className="fixed inset-0 bg-black/50 transition-opacity duration-300"
            onClick={handleClose}
        />

        {/* Форма */}
        <div className="fixed bottom-0 left-0 right-0 transform transition-transform duration-300 ease-out translate-y-0">
          <div className="bg-white rounded-t-2xl shadow-2xl max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            {/* Заголовок */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">
                Новая операция
              </h2>
              <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Содержимое формы */}
            <form onSubmit={handleSubmit} className="p-4 space-y-5">
              {/* Сумма */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сумма (₽)
                </label>
                <div className="relative">
                  <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full text-3xl font-bold border-0 focus:outline-none focus:ring-0 p-0"
                      autoFocus
                      disabled={isSubmitting}
                      step="0.01"
                      min="0.01"
                  />
                  <div className="h-0.5 bg-gray-200 mt-2" />
                </div>
              </div>

              {/* Описание */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="На что потратили или откуда деньги?"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    maxLength={100}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {description.length}/100
                </div>
              </div>

              {/* Тип операции */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип операции
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                      type="button"
                      onClick={() => setType('expense')}
                      disabled={isSubmitting}
                      className={`py-3 rounded-lg font-medium transition-colors ${
                          type === 'expense'
                              ? 'bg-red-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50`}
                  >
                    Расход
                  </button>
                  <button
                      type="button"
                      onClick={() => setType('income')}
                      disabled={isSubmitting}
                      className={`py-3 rounded-lg font-medium transition-colors ${
                          type === 'income'
                              ? 'bg-green-500 text-white shadow-sm'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-50`}
                  >
                    Доход
                  </button>
                </div>
              </div>

              {/* Категория */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {categories[type].map((cat) => (
                      <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          disabled={isSubmitting}
                          className={`
                      p-2.5 rounded-lg flex flex-col items-center justify-center 
                      border transition-all duration-150 min-h-[80px]
                      ${category === cat.value
                              ? `ring-2 ring-blue-500 ring-offset-1 ${cat.color} border-transparent`
                              : 'border-gray-200 bg-white hover:bg-gray-50'
                          }
                      disabled:opacity-50
                    `}
                      >
                        <span className="text-xl mb-1">{cat.label.split(' ')[0]}</span>
                        <span className="text-xs text-gray-600 font-medium">
                      {cat.label.split(' ')[1]}
                    </span>
                      </button>
                  ))}
                </div>
              </div>

              {/* Дата */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    disabled={isSubmitting}
                    max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Ошибка */}
              {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2 mt-0.5">⚠️</span>
                      <span className="text-sm text-red-700">{error}</span>
                    </div>
                  </div>
              )}

              {/* Кнопка отправки */}
              <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                w-full py-3.5 rounded-lg font-semibold text-white
                transition-colors duration-200 flex items-center justify-center
                ${isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                  }
                disabled:opacity-50
              `}
              >
                {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Добавление...
                    </>
                ) : (
                    'Добавить операцию'
                )}
              </button>

              {/* Подсказка */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Операция будет сохранена в базе данных
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default TransactionForm;