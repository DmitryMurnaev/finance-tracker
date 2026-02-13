import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categoryAPI } from '../../services/api'; // импорт

const TransactionForm = ({
                           isOpen,
                           onClose,
                           onAddTransaction,
                           onUpdateTransaction,
                           editingTransaction,
                         }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [categoryId, setCategoryId] = useState(null);
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Загрузка категорий при открытии формы
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
          const data = await categoryAPI.getCategories();
          setCategories(data);
          // Если редактирование – выбранная категория уже установлена
          if (!editingTransaction) {
            // По умолчанию выбираем первую категорию подходящего типа
            const defaultCat = data.find(c => c.type === type || c.type === 'both');
            if (defaultCat) setCategoryId(defaultCat.id);
          }
        } catch (err) {
          console.error('Ошибка загрузки категорий:', err);
        } finally {
          setLoadingCategories(false);
        }
      };
      fetchCategories();
    }
  }, [isOpen, type, editingTransaction]);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description || '');
      setType(editingTransaction.type);
      setCategoryId(editingTransaction.category_id);
      setDate(editingTransaction.date);
    } else {
      setAmount('');
      setDescription('');
      setType('expense');
      setCategoryId(null);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingTransaction, isOpen]);

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
      if (!categoryId) {
        throw new Error('Выберите категорию');
      }

      const transactionData = {
        amount: parseFloat(amount),
        description: description.trim(),
        type,
        category_id: categoryId,
        date
      };

      if (editingTransaction) {
        await onUpdateTransaction(editingTransaction.id, transactionData);
      } else {
        await onAddTransaction(transactionData);
      }

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
    setCategoryId(null);
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const modalTitle = editingTransaction ? 'Редактировать операцию' : 'Новая операция';
  const submitButtonText = isSubmitting
      ? (editingTransaction ? 'Сохранение...' : 'Добавление...')
      : (editingTransaction ? 'Сохранить' : 'Добавить');

  // Фильтруем категории по типу
  const filteredCategories = categories.filter(
      cat => cat.type === type || cat.type === 'both'
  );

  return (
      <div className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md md:max-w-lg mx-auto flex flex-col md:shadow-xl">
            <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{modalTitle}</h2>
              <button onClick={handleClose} className="p-2 text-gray-500 hover:text-gray-700" disabled={isSubmitting}>
                <X size={24} />
              </button>
            </div>

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
                          type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    Расход
                  </button>
                  <button
                      type="button"
                      onClick={() => setType('income')}
                      disabled={isSubmitting}
                      className={`flex-1 py-3 rounded-xl font-medium ${
                          type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    Доход
                  </button>
                </div>
              </div>

              {/* Категории (загруженные из БД) */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Категория</label>
                {loadingCategories ? (
                    <div className="text-center py-4">Загрузка категорий...</div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {filteredCategories.map((cat) => (
                          <button
                              key={cat.id}
                              type="button"
                              onClick={() => setCategoryId(cat.id)}
                              disabled={isSubmitting}
                              className={`p-3 rounded-xl flex flex-col items-center ${
                                  categoryId === cat.id
                                      ? `ring-2 ring-blue-500 ${cat.color || 'bg-gray-100'}`
                                      : cat.color || 'bg-gray-100'
                              }`}
                          >
                            <span className="text-lg">{cat.icon || '📝'}</span>
                            <span className="text-xs mt-1">{cat.name}</span>
                          </button>
                      ))}
                    </div>
                )}
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

              {/* Кнопки */}
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
                  {submitButtonText}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default TransactionForm;