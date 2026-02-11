import { History as HistoryIcon } from 'lucide-react';  // ← переименовали

const ListHeader = ({ title, count }) => (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4 mb-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <HistoryIcon className="mr-2 text-gray-600" size={20} />  {/* ← заменили */}
                <h2 className="font-semibold">{title}</h2>
            </div>
            {count > 0 && <div className="text-gray-500 text-sm">Всего: {count}</div>}
        </div>
    </div>
);
export default ListHeader;