import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
    const navigate = useNavigate();
    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold">Политика конфиденциальности</h1>
            </div>
            <p className="mb-2">Мы уважаем вашу конфиденциальность и обязуемся защищать ваши персональные данные.</p>
            <p className="mb-2">Ваши данные (email, пароль в хешированном виде, информация о транзакциях) хранятся в зашифрованном виде и не передаются третьим лицам.</p>
            <p className="mb-2">Вы можете в любой момент удалить свой аккаунт, написав в поддержку.</p>
            <p className="text-sm text-gray-500 mt-6">Последнее обновление: 18 февраля 2026</p>
        </div>
    );
};

export default Privacy;