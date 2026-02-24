import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { accountAPI } from '../../services/api';
import { getPlanIconById, getPlanColorById } from '../../config/plansConfig';
import { useModal } from '../../context/ModalContext';

const ContributeForm = ({ isOpen, onClose, onContribute, plan }) => {
    const { showToast } = useModal();
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState(null);
    const [description, setDescription] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchAccounts = async () => {
                setLoading(true);
                try {
                    const data = await accountAPI.getAccounts();
                    setAccounts(data);
                    if (data.length > 0) setAccountId(data[0].id);
                } catch (err) {
                    console.error('Ошибка загрузки счетов', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchAccounts();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!amount || amount <= 0) throw new Error('Введите корректную сумму');
            if (!accountId) throw new Error('Выберите счёт');

            await onContribute(parseFloat(amount), accountId, description.trim() || 'Пополнение плана');
            showToast({ message: 'Средства внесены', type: 'success' });
            onClose();
        } catch (err) {
            showToast({ message: err.message, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !plan) return null;

    const icon = getPlanIconById(plan.icon_id);
    const color = getPlanColorById(plan.color_id);

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
                <div className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl w-full max-w-md mx-auto flex flex-col md:shadow-xl dark:shadow-gray-900">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Внести в план</h2>
                        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4">
                        <div className={`mb-4 p-3 rounded-lg flex items-center gap-3 ${color.bg}`}>
                            <span className="text-3xl">{icon.emoji}</span>
                            <div>
                                <div className={`font-bold ${color.text}`}>{plan.name}</div>
                                <div className={`text-sm ${color.text}`}>
                                    {plan.current_amount.toLocaleString('ru-RU')} ₽ из {plan.target_amount.toLocaleString('ru-RU')} ₽
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Сумма (₽)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                placeholder="5000"
                                min="1"
                                step="0.01"
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Счёт списания</label>
                            {loading ? (
                                <div className="text-center py-2 text-gray-500 dark:text-gray-400">Загрузка счетов...</div>
                            ) : accounts.length === 0 ? (
                                <div className="text-red-500 dark:text-red-400">Создайте хотя бы один счёт</div>
                            ) : (
                                <select
                                    value={accountId || ''}
                                    onChange={(e) => setAccountId(Number(e.target.value))}
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                                >
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.name} (баланс: {acc.balance.toLocaleString('ru-RU')} ₽)
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Описание (необязательно)</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                placeholder="Например, откладываю на машину"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                                Отмена
                            </button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition">
                                {isSubmitting ? 'Обработка...' : 'Внести'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContributeForm;