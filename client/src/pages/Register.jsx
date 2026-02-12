import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/UI/PasswordInput';
import VerificationCodeInput from '../components/UI/VerificationCodeInput';
import { authAPI } from '../services/api';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState('email'); // 'email' → 'code' → 'register'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Введите email');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authAPI.sendVerificationCode(email);
            setMessage('Код отправлен на вашу почту');
            setStep('code');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка отправки кода');
        } finally {
            setLoading(false);
        }
    };

    const handleCodeComplete = (value) => {
        setCode(value);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Пароли не совпадают');
        }
        if (password.length < 6) {
            return setError('Пароль должен быть не менее 6 символов');
        }
        if (!code) {
            return setError('Введите код подтверждения');
        }

        setLoading(true);
        setError('');
        try {
            await register(email, password, name.trim() || undefined, code);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'email') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>
                    <form onSubmit={handleSendCode}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
                        {message && <div className="mb-4 text-green-500 text-sm">{message}</div>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Отправка...' : 'Получить код'}
                        </button>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Уже есть аккаунт?{' '}
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                                Войти
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-2">Подтверждение email</h2>
                <p className="text-center text-gray-600 mb-6">
                    Код отправлен на <span className="font-medium">{email}</span>
                </p>

                <VerificationCodeInput onComplete={handleCodeComplete} />

                {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}

                <button
                    onClick={handleRegister}
                    disabled={!code || loading}
                    className="w-full mt-6 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Регистрация...' : 'Завершить регистрацию'}
                </button>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setStep('email')}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Изменить email
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;