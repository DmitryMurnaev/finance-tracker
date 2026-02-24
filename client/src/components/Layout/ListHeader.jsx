import { History as HistoryIcon } from 'lucide-react';

const ListHeader = ({ title, count }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4 mb-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <HistoryIcon className="mr-2 text-gray-600 dark:text-gray-400" size={20} />
                <h2 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
            </div>
            {count > 0 && <div className="text-gray-500 dark:text-gray-400 text-sm">Всего: {count}</div>}
        </div>
    </div>
);
export default ListHeader;