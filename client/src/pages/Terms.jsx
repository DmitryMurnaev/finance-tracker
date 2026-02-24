import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
    const navigate = useNavigate();
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Пользовательское соглашение</h1>
            </div>
            <p className="mb-2 text-gray-700 dark:text-gray-300">Используя данное приложение, вы соглашаетесь с тем, что:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Вы несёте полную ответственность за вводимые данные и операции.</li>
                <li>Приложение предоставляется "как есть" и не гарантирует безошибочной работы.</li>
                <li>Мы имеем право изменять условия соглашения без предварительного уведомления.</li>
                <li>Запрещено использовать приложение для незаконных целей.</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Последнее обновление: 20 февраля 2026</p>
        </div>
    );
};

export default Terms;