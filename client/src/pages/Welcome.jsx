import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, Shield, Zap } from 'lucide-react';
import CurrencySelector from '../components/Welcome/CurrencySelector';
import PWAInstallPrompt from '../components/Welcome/PWAInstallPrompt';

const Welcome = ({ onFinish }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState('RUB');

    const slides = [
        {
            icon: <Smartphone className="w-24 h-24 text-blue-500" />,
            title: 'Управляйте финансами легко',
            description: 'Добавляйте доходы и расходы, следите за бюджетом в пару касаний',
        },
        {
            icon: <Shield className="w-24 h-24 text-blue-500" />,
            title: 'Безопасно и надёжно',
            description: 'Ваши данные защищены, а счета всегда под контролем',
        },
        {
            component: (
                <CurrencySelector
                    onSelect={(currency) => {
                        setSelectedCurrency(currency);
                        setStep(step + 1);
                    }}
                />
            ),
        },
        {
            component: (
                <PWAInstallPrompt
                    onNext={() => {
                        onFinish();
                        // можно передать выбранную валюту при регистрации через localStorage или контекст
                        localStorage.setItem('preferredCurrency', selectedCurrency);
                        navigate('/register');
                    }}
                />
            ),
        },
    ];

    const current = slides[step];

    if (step < 2) {
        // Обычные слайды с иконками
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                    <div className="mb-8">{current.icon}</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{current.title}</h1>
                    <p className="text-gray-600 mb-8">{current.description}</p>
                    <div className="flex justify-center gap-2 mb-8">
                        {slides.slice(0, 2).map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 w-2 rounded-full transition-all ${
                                    i === step ? 'bg-blue-500 w-6' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => setStep(step + 1)}
                        className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                        Далее <ArrowRight size={20} />
                    </button>
                    {step === 0 && (
                        <p className="mt-4 text-sm text-gray-500">
                            Уже есть аккаунт?{' '}
                            <button onClick={() => navigate('/login')} className="text-blue-500 font-medium">
                                Войти
                            </button>
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Шаги с кастомными компонентами (выбор валюты и установка PWA)
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
                {current.component}
            </div>
        </div>
    );
};

export default Welcome;