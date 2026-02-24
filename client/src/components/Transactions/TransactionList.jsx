import { History as HistoryIcon } from 'lucide-react';
import TransactionItem from './TransactionItem';
import Loader from '../UI/Loader';

const TransactionList = ({ transactions, loading, error, onDelete, onRetry, onEdit }) => {
    if (loading) {
        return (
            <div className="py-10">
                <Loader text="Загрузка операций..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <div className="text-red-500 dark:text-red-400 text-lg mb-2">⚠️ {error}</div>
                <button
                    onClick={onRetry}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
                >
                    Повторить
                </button>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <HistoryIcon className="text-gray-400 dark:text-gray-500" size={32} />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Операций пока нет</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Нажмите «Добавить» в меню
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {transactions.map((transaction) => (
                <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
};
export default TransactionList;