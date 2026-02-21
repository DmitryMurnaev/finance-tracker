import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categoryAPI, accountAPI } from '../../services/api';
import { getCategoryConfig } from '../../config/categoryConfig';
import { getIconById, getColorById } from '../../config/accountsConfig';
import NumericKeyboard from './NumericKeyboard';
import CategoryCarousel from './CategoryCarousel';
import { useModal } from '../../context/ModalContext';

const TransactionForm = ({
                           isOpen,
                           onClose,
                           onAddTransaction,
                           onUpdateTransaction,
                           editingTransaction,
                           mode,
                           onTransfer,
                         }) => {
  const [amount, setAmount] = useState('');
  const { showToast } = useModal();
  const [description, setDescription] = useState('');
  const [type, setType] = useState(mode === 'expense' ? 'expense' : 'income');
  const [categoryId, setCategoryId] = useState(null);
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountId, setAccountId] = useState(null);

  // Для перевода
  const [fromAccountId, setFromAccountId] = useState(null);
  const [toAccountId, setToAccountId] = useState(null);

  // Загрузка данных при открытии
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoadingCategories(true);
        setLoadingAccounts(true);
        try {
          const [categoriesData, accountsData] = await Promise.all([
            categoryAPI.getCategories(),
            accountAPI.getAccounts()
          ]);
          setCategories(categoriesData);
          setAccounts(accountsData);

          // Автовыбор, если не редактируем
          if (!editingTransaction) {
            // Счёт
            if (!accountId && accountsData.length > 0) {
              setAccountId(accountsData[0].id);
            }
            // Категория
            if (!categoryId && mode !== 'transfer') {
              const defaultCat = categoriesData.find(c => c.type === type || c.type === 'both');
              if (defaultCat) setCategoryId(defaultCat.id);
            }
            // Для перевода
            if (mode === 'transfer' && accountsData.length > 0) {
              setFromAccountId(accountsData[0].id);
              setToAccountId(accountsData[1]?.id || accountsData[0].id);
            }
          }
        } catch (err) {
          console.error('Ошибка загрузки данных', err);
        } finally {
          setLoadingCategories(false);
          setLoadingAccounts(false);
        }
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode, type, editingTransaction]);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setError('');
    }
  }, [isOpen]);

  // Заполнение при редактировании
  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description || '');
      setType(editingTransaction.type);
      setCategoryId(editingTransaction.category_id);
      setAccountId(editingTransaction.account_id);
      setDate(editingTransaction.date);
    } else {
      setAmount('');
      setDescription('');
      setType(mode === 'expense' ? 'expense' : 'income');
      setCategoryId(null);
      setAccountId(null);
      setFromAccountId(null);
      setToAccountId(null);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingTransaction, mode, isOpen]);

  useEffect(() => {
    console.log('Accounts loaded:', accounts);
    console.log('Categories loaded:', categories);
    console.log('accountId:', accountId, 'categoryId:', categoryId);
  }, [accounts, categories, accountId, categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleSubmit called', { amount, categoryId, accountId, dataReady });
    setError('');
    setIsSubmitting(true);

    try {
      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        throw new Error('Введите корректную сумму (больше 0)');
      }

      if (mode === 'transfer') {
        if (!fromAccountId || !toAccountId) {
          throw new Error('Выберите счета');
        }
        if (fromAccountId === toAccountId) {
          throw new Error('Счета должны отличаться');
        }
        await onTransfer({
          fromAccountId,
          toAccountId,
          amount: parseFloat(amount),
          description: description.trim() || undefined,
        });
        resetForm();
        onClose();
        return;
      }

      const transactionData = {
        amount: parseFloat(amount),
        description: description.trim(),
        type,
        category_id: categoryId,
        account_id: accountId,
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
    setCategoryId(null);
    setAccountId(null);
    setFromAccountId(null);
    setToAccountId(null);
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const modalTitle = editingTransaction ? 'Редактировать операцию' :
      mode === 'transfer' ? 'Перевод' :
          mode === 'expense' ? 'Расход' : 'Доход';
  const submitButtonText = isSubmitting ? 'Сохранение...' : (editingTransaction ? 'Сохранить' : 'Добавить');

  const filteredCategories = categories.filter(
      cat => cat.type === type || cat.type === 'both'
  );

  // Флаг готовности данных (для блокировки кнопки)
  const dataReady = mode === 'transfer'
      ? fromAccountId && toAccountId
      : categoryId && accountId;


  // useEffect(() => {
  //   console.log('dataReady:', dataReady, 'accountId:', accountId, 'categoryId:', categoryId);
  // }, [dataReady, accountId, categoryId]);

  console.log('Button disabled:', isSubmitting || !dataReady);
  console.log('isSubmitting:', isSubmitting, 'dataReady:', dataReady);

  return (
      <div className="fixed inset-0 z-60">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md md:max-w-lg mx-auto flex flex-col max-h-[90vh] overflow-x-hidden">
            {/* Заголовок */}
            <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 truncate">{modalTitle}</h2>
              <button onClick={handleClose} className="p-2 text-gray-500 hover:text-gray-700 flex-shrink-0" disabled={isSubmitting}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
              {/* Сумма */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Сумма (₽)</label>
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Разрешаем только цифры и одну точку
                      if (/^\d*\.?\d*$/.test(value) || value === '') {
                        setAmount(value);
                      }
                    }}
                    placeholder="0"
                    className="w-full text-3xl font-bold border-0 focus:outline-none p-0 bg-transparent"
                    disabled={isSubmitting}
                    inputMode="decimal"
                />
                <div className="h-1 bg-gray-200 rounded-full mt-1"></div>
                <div className="md:hidden">
                  <NumericKeyboard
                      value={amount}
                      onChange={setAmount}
                  />
                </div>
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

              {/* Для перевода */}
              {mode === 'transfer' ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Счёт списания</label>
                      {loadingAccounts ? (
                          <div className="h-12 bg-gray-200 animate-pulse rounded-lg"></div>
                      ) : (
                          <div className="flex overflow-x-auto gap-2 pl-2 py-2 scrollbar-hide flex-nowrap">
                            {accounts.map((acc) => {
                              const icon = getIconById(acc.icon_id);
                              const color = getColorById(acc.color_id);
                              return (
                                  <button
                                      key={acc.id}
                                      type="button"
                                      onClick={() => setFromAccountId(acc.id)}
                                      className={`flex-shrink-0 p-2 rounded-lg flex items-center gap-1 ${
                                          fromAccountId === acc.id ? `ring-2 ring-blue-500 ${color.bg}` : color.bg
                                      }`}
                                  >
                                    <span className="text-xl">{icon.emoji}</span>
                                    <span className={`text-sm font-medium whitespace-nowrap ${color.text}`}>
                                                            {acc.name}
                                                        </span>
                                  </button>
                              );
                            })}
                          </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Счёт пополнения</label>
                      {loadingAccounts ? (
                          <div className="h-12 bg-gray-200 animate-pulse rounded-lg"></div>
                      ) : (
                          <div className="flex overflow-x-auto gap-2 pl-2 py-2 scrollbar-hide flex-nowrap">
                            {accounts.map((acc) => {
                              const icon = getIconById(acc.icon_id);
                              const color = getColorById(acc.color_id);
                              return (
                                  <button
                                      key={acc.id}
                                      type="button"
                                      onClick={() => setToAccountId(acc.id)}
                                      className={`flex-shrink-0 p-2 rounded-lg flex items-center gap-1 ${
                                          toAccountId === acc.id ? `ring-2 ring-blue-500 ${color.bg}` : color.bg
                                      }`}
                                  >
                                    <span className="text-xl">{icon.emoji}</span>
                                    <span className={`text-sm font-medium whitespace-nowrap ${color.text}`}>
                                                            {acc.name}
                                                        </span>
                                  </button>
                              );
                            })}
                          </div>
                      )}
                    </div>
                  </>
              ) : (
                  <>
                    {/* Выбор счёта */}
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Счёт</label>
                      {loadingAccounts ? (
                          <div className="flex gap-2 overflow-x-auto pl-2 py-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex-shrink-0 w-24 h-12 bg-gray-200 animate-pulse rounded-lg"></div>
                            ))}
                          </div>
                      ) : (
                          <div className="flex gap-2 overflow-x-auto pl-2 py-2 scrollbar-hide flex-nowrap">
                            {accounts.map((acc) => {
                              const icon = getIconById(acc.icon_id);
                              const color = getColorById(acc.color_id);
                              return (
                                  <button
                                      key={acc.id}
                                      type="button"
                                      onClick={() => setAccountId(acc.id)}
                                      className={`flex-shrink-0 p-2 rounded-lg flex items-center gap-1 ${
                                          accountId === acc.id ? `ring-2 ring-blue-500 ${color.bg}` : color.bg
                                      }`}
                                  >
                                    <span className="text-xl">{icon.emoji}</span>
                                    <span className={`text-sm font-medium whitespace-nowrap ${color.text}`}>
                                                            {acc.name}
                                                        </span>
                                  </button>
                              );
                            })}
                          </div>
                      )}
                    </div>

                    {/* Категории */}
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-medium">Категория</label>
                      {loadingCategories ? (
                          <div className="flex gap-2 overflow-x-auto pl-2 py-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex-shrink-0 w-20 h-20 bg-gray-200 animate-pulse rounded-xl"></div>
                            ))}
                          </div>
                      ) : filteredCategories.length === 0 ? (
                          <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                            Нет категорий. Сначала создайте категорию.
                          </div>
                      ) : (
                          <CategoryCarousel
                              categories={filteredCategories}
                              selectedCategoryId={categoryId}
                              onSelect={setCategoryId}
                          />
                      )}
                    </div>
                  </>
              )}

              {/* Дата */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Дата</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full min-w-0 max-w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 box-border"
                    disabled={isSubmitting}
                    max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
              )}
            </form>

            {/* Фиксированные кнопки */}
            <div className="p-4 border-t border-gray-100">
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
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !dataReady}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg transition ${
                        dataReady && !isSubmitting
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {submitButtonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TransactionForm;