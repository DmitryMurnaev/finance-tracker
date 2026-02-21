import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PasswordInput from '../components/UI/PasswordInput';

const Profile = () => {
    const { user, logout, changePassword, updatePreferredCurrency } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(user?.preferred_currency || 'RUB');
    const [currencyUpdating, setCurrencyUpdating] = useState(false);
    const [currencyMessage, setCurrencyMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    // ... существующая функция handleChangePassword (без изменений)
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        if (!oldPassword || !newPassword || !confirmPassword) {
            return setMessage({ text: 'Заполните все поля', type: 'error' });
        }
        if (newPassword !== confirmPassword) {
            return setMessage({ text: 'Пароли не совпадают', type: 'error' });
        }
        if (newPassword.length < 6) {
            return setMessage({ text: 'Пароль должен быть не менее 6 символов', type: 'error' });
        }
        setLoading(true);
        try {
            await changePassword(oldPassword, newPassword);
            setMessage({ text: '✅ Пароль успешно изменён. Сейчас вы будете перенаправлены на страницу входа.', type: 'success' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (err) {
            setMessage({ text: err.response?.data?.error || '❌ Ошибка при смене пароля', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCurrencyChange = async () => {
        setCurrencyMessage({ text: '', type: '' });
        setCurrencyUpdating(true);
        try {
            await updatePreferredCurrency(selectedCurrency);
            setCurrencyMessage({ text: 'Валюта успешно обновлена', type: 'success' });
        } catch {
            setCurrencyMessage({ text: 'Ошибка при обновлении валюты', type: 'error' });
        } finally {
            setCurrencyUpdating(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Шапка */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/more" className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-semibold text-gray-900">Профиль</h1>
            </div>

            {/* Карточка пользователя */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-xl">
                        {user.name?.[0] || user.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-medium text-gray-900">
                            {user.name || 'Пользователь'}
                        </h2>
                        <p className="text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            Зарегистрирован {new Date(user.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Смена пароля */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-5">Сменить пароль</h2>
                {message.text && (
                    <div className={`mb-5 p-3 rounded-lg text-sm ${
                        message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleChangePassword} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Текущий пароль</label>
                        <PasswordInput
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Новый пароль</label>
                        <PasswordInput
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="минимум 6 символов"
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Подтвердите пароль</label>
                        <PasswordInput
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition disabled:opacity-50 shadow-sm"
                    >
                        {loading ? 'Сохранение...' : 'Обновить пароль'}
                    </button>
                </form>
            </div>

            {/* Основная валюта (НОВЫЙ БЛОК) */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-5">Основная валюта</h2>
                <div className="flex gap-4 mb-4">
                    {['RUB', 'USD', 'EUR'].map(curr => (
                        <label key={curr} className="flex items-center gap-2">
                            <input
                                type="radio"
                                value={curr}
                                checked={selectedCurrency === curr}
                                onChange={() => setSelectedCurrency(curr)}
                                disabled={currencyUpdating}
                            />
                            <span>{curr}</span>
                        </label>
                    ))}
                </div>
                {currencyMessage.text && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${
                        currencyMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                        {currencyMessage.text}
                    </div>
                )}
                <button
                    onClick={handleCurrencyChange}
                    disabled={currencyUpdating || selectedCurrency === user?.preferred_currency}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    Сохранить валюту
                </button>
            </div>

            {/* Выход */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <button
                    onClick={handleLogout}
                    className="w-full bg-white hover:bg-gray-50 text-red-600 font-medium py-2.5 px-4 rounded-xl transition shadow-sm border border-gray-200"
                >
                    Выйти из аккаунта
                </button>
            </div>
        </div>
    );
};

export default Profile;