import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categoryAPI, accountAPI } from '../../services/api';
import { getCategoryConfig } from '../../config/categoryConfig';
import { getIconById, getColorById } from '../../config/accountsConfig';
import NumericKeyboard from './NumericKeyboard';
import CategoryCarousel from './CategoryCarousel';

const TransactionForm = ({
                           isOpen,
                           onClose,
                           onAddTransaction,
                           onUpdateTransaction,
                           editingTransaction,
                           mode,
                         }) => {
  // ... все хуки (без изменений)

  return (
      <div className="fixed inset-0 z-50">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md md:max-w-lg mx-auto flex flex-col max-h-[90vh]">
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
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full text-3xl font-bold border-0 focus:outline-none p-0 bg-transparent"
                    readOnly
                    disabled={isSubmitting}
                />
                <div className="h-1 bg-gray-200 rounded-full mt-1"></div>
                <NumericKeyboard
                    value={amount}
                    onChange={setAmount}
                />
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
                          <div className="flex gap-2 overflow-x-auto px-2 py-2 scrollbar-hide">
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
                          <div className="flex gap-2 overflow-x-auto px-2 py-2 scrollbar-hide">
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
                          <div className="flex gap-2 overflow-x-auto px-2 py-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex-shrink-0 w-24 h-12 bg-gray-200 animate-pulse rounded-lg"></div>
                            ))}
                          </div>
                      ) : (
                          <div className="flex gap-2 overflow-x-auto px-2 py-2 scrollbar-hide">
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
                          <div className="flex gap-2 overflow-x-auto px-2 py-2">
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
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:opacity-50"
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