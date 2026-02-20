import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/UI/PasswordInput';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!agreed) {
            return setError('Необходимо согласие с политикой конфиденциальности');
        }
        if (password !== confirmPassword) {
            return setError('Пароли не совпадают');
        }
        if (password.length < 6) {
            return setError('Пароль должен быть не менее 6 символов');
        }

        setLoading(true);
        try {
            await register(email, password, name.trim() || undefined);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Имя (необязательно)
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Пароль
                        </label>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="минимум 6 символов"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Латиница, цифры, минимум 6 символов</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Подтвердите пароль
                        </label>
                        <PasswordInput
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="agree"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1"
                        />
                        <label htmlFor="agree" className="text-sm text-gray-600">
                            Я принимаю{' '}
                            <Link to="/privacy" target="_blank" className="text-blue-600 hover:underline">
                                Политику конфиденциальности
                            </Link>{' '}
                            и{' '}
                            <Link to="/terms" target="_blank" className="text-blue-600 hover:underline">
                                Пользовательское соглашение
                            </Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !agreed}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-500">
                            Войти
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;