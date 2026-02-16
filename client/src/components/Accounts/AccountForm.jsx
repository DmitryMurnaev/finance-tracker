import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { iconOptions, colorOptions } from '../../config/accountsConfig';

const AccountForm = ({
                         isOpen,
                         onClose,
                         onSave,
                         editingAccount,
                     }) => {
    const [name, setName] = useState('');
    const [iconId, setIconId] = useState(1);
    const [colorId, setColorId] = useState(1);
    const [balance, setBalance] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Заполнение формы при редактировании
    useEffect(() => {
        if (editingAccount) {
            setName(editingAccount.name);
            setIconId(editingAccount.icon_id);
            setColorId(editingAccount.color_id);
            setBalance(''); // баланс не редактируем
        } else {
            setName('');
            setIconId(1);
            setColorId(1);
            setBalance('');
        }
    }, [editingAccount, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (!name.trim()) {
                throw new Error('Введите название счета');
            }

            const accountData = {
                name: name.trim(),
                icon_id: iconId,
                color_id: colorId,
            };

            // При редактировании передаём текущий статус активности (не меняем его)
            if (editingAccount) {
                accountData.is_active = editingAccount.is_active;
            }

            // Только при создании можно передать начальный баланс
            if (!editingAccount && balance && !isNaN(parseFloat(balance))) {
                accountData.balance = parseFloat(balance);
            }

            await onSave(accountData, editingAccount?.id);
            onClose();
        } catch (err) {
            setError(err.message || 'Ошибка при сохранении счета');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const modalTitle = editingAccount ? 'Редактировать счёт' : 'Новый счёт';
    const submitText = isSubmitting
        ? (editingAccount ? 'Сохранение...' : 'Создание...')
        : (editingAccount ? 'Сохранить' : 'Создать');

    console.log('AccountForm loaded');
    console.log('AccountForm rendering, isOpen =', isOpen);

    return (
        <div className="fixed inset-0 z-60">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md mx-auto flex flex-col md:shadow-xl">
                    <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">{modalTitle}</h2>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4">
                        {/* Название */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 font-medium">Название</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="например, Сбербанк, Наличные"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>

                        {/* Иконка */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 font-medium">Иконка</label>
                            <div className="grid grid-cols-4 gap-2">
                                {iconOptions.map((icon) => (
                                    <button
                                        key={icon.id}
                                        type="button"
                                        onClick={() => setIconId(icon.id)}
                                        className={`p-2 rounded-lg flex flex-col items-center ${
                                            iconId === icon.id
                                                ? 'ring-2 ring-blue-500 bg-blue-50'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-2xl">{icon.emoji}</span>
                                        <span className="text-xs mt-1">{icon.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Цвет */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 font-medium">Цвет</label>
                            <div className="grid grid-cols-4 gap-2">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => setColorId(color.id)}
                                        className={`p-2 rounded-lg flex flex-col items-center ${
                                            colorId === color.id
                                                ? 'ring-2 ring-blue-500'
                                                : ''
                                        } ${color.bg}`}
                                    >
                                        <span className={`text-sm font-medium ${color.text}`}>
                                            {color.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Начальный баланс (только при создании) */}
                        {!editingAccount && (
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Начальный баланс (₽, необязательно)
                                </label>
                                <input
                                    type="number"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    placeholder="0"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    disabled={isSubmitting}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                            >
                                {submitText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountForm;