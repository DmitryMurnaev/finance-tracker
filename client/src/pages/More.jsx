import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MessageSquare, Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import CurrencyModal from '../components/UI/CurrencyModal';

const More = () => {
    const { user, updatePreferredCurrency } = useAuth();
    const { showToast } = useModal();
    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

    const handleCurrencySelect = async (currency) => {
        try {
            await updatePreferredCurrency(currency);
            showToast({ message: 'Валюта успешно обновлена', type: 'success' });
            setIsCurrencyModalOpen(false);
        } catch {
            showToast({ message: 'Ошибка при обновлении валюты', type: 'error' });
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Ещё</h1>
            <div className="space-y-2">
                <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50"
                >
                    <User size={24} className="text-blue-500" />
                    <span className="font-medium">Профиль</span>
                </Link>

                <button
                    onClick={() => setIsCurrencyModalOpen(true)}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50"
                >
                    <Globe size={24} className="text-purple-500" />
                    <span className="font-medium">Валюта</span>
                    <span className="ml-auto text-sm text-gray-500">
                        {user?.preferred_currency || 'RUB'}
                    </span>
                </button>

                <Link
                    to="/support"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50"
                >
                    <MessageSquare size={24} className="text-green-500" />
                    <span className="font-medium">Поддержка</span>
                </Link>

                <Link
                    to="/privacy"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50"
                >
                    <Shield size={24} className="text-gray-500" />
                    <span className="font-medium">Конфиденциальность</span>
                </Link>
            </div>

            <CurrencyModal
                isOpen={isCurrencyModalOpen}
                onClose={() => setIsCurrencyModalOpen(false)}
                onSelect={handleCurrencySelect}
                currentCurrency={user?.preferred_currency}
            />
        </div>
    );
};

export default More;