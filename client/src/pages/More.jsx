import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MessageSquare, Shield, Globe, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useModal } from '../context/ModalContext';
import CurrencyModal from '../components/UI/CurrencyModal';

const More = () => {
    const { user, updatePreferredCurrency } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
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
            <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Ещё</h1>
            <div className="space-y-2">
                <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    <User size={24} className="text-blue-500" />
                    <span className="font-medium dark:text-gray-100">Профиль</span>
                </Link>

                <button
                    onClick={() => setIsCurrencyModalOpen(true)}
                    className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    <Globe size={24} className="text-purple-500" />
                    <span className="font-medium dark:text-gray-100">Валюта</span>
                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {user?.preferred_currency || 'RUB'}
                    </span>
                </button>

                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    {isDark ? <Sun size={24} className="text-yellow-500" /> : <Moon size={24} className="text-gray-700 dark:text-gray-300" />}
                    <span className="font-medium dark:text-gray-100">Тема</span>
                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {isDark ? 'Тёмная' : 'Светлая'}
                    </span>
                </button>

                <Link
                    to="/support"
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    <MessageSquare size={24} className="text-green-500" />
                    <span className="font-medium dark:text-gray-100">Поддержка</span>
                </Link>

                <Link
                    to="/privacy"
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    <Shield size={24} className="text-gray-500 dark:text-gray-400" />
                    <span className="font-medium dark:text-gray-100">Конфиденциальность</span>
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