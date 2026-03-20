import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="p-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Политика конфиденциальности
                    </h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        Мы уважаем вашу конфиденциальность и обязуемся защищать ваши персональные данные.
                    </p>

                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        Ваши данные (email, пароль в хешированном виде, информация о транзакциях) хранятся
                        в зашифрованном виде и не передаются третьим лицам.
                    </p>

                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                        Вы можете в любой момент удалить свой аккаунт, написав в поддержку.
                    </p>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Последнее обновление: 18 февраля 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;