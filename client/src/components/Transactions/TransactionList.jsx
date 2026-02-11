import { History as HistoryIcon } from 'lucide-react';
import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions, loading, error, onDelete, onRetry }) => {
    if (loading) {
        return (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">Загрузка данных...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <div className="text-red-500 text-lg mb-2">⚠️ {error}</div>
                <button
                    onClick={onRetry}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Повторить
                </button>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <HistoryIcon className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500 font-medium text-lg">Операций пока нет</p>
                <p className="text-gray-400 text-sm mt-2">
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
                />
            ))}
        </div>
    );
};
export default TransactionList;