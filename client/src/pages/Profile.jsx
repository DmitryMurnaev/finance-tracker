import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PasswordInput from "../components/UI/PasswordInput.jsx";
const Profile = () => {
    const { user, logout, changePassword } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (newPassword !== confirmPassword) {
            return setMessage({ text: 'Пароли не совпадают', type: 'error' });
        }
        if (newPassword.length < 6) {
            return setMessage({ text: 'Пароль должен быть не менее 6 символов', type: 'error' });
        }

        setLoading(true);
        try {
            await changePassword(oldPassword, newPassword);
            setMessage({ text: 'Пароль успешно изменён', type: 'success' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage({
                text: err.response?.data?.error || 'Ошибка при смене пароля',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    to="/"
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    aria-label="Назад"
                >
                    <ArrowLeft size={24} className="text-gray-700"/>
                </Link>
                <h1 className="text-2xl font-bold">Профиль</h1>
            </div>


            {/* Информация о пользователе */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Личные данные</h2>
                <div className="space-y-2">
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Имя:</span> {user.name || '—'}</p>
                    <p><span className="font-medium">Дата регистрации:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Смена пароля */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Сменить пароль</h2>

                {message.text && (
                    <div className={`mb-4 p-3 rounded ${
                        message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Текущий пароль
                        </label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Новый пароль
                        </label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Подтвердите новый пароль
                        </label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Сохранение...' : 'Изменить пароль'}
                    </button>
                </form>

                <button
                    onClick={handleLogout}
                    className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >
                    Выйти из аккаунта
                </button>
            </div>
        </div>
    );
};

export default Profile;