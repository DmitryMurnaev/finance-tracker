import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, Shield, Zap } from 'lucide-react';

const Welcome = ({ onFinish }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const slides = [
        {
            icon: <Smartphone className="w-24 h-24 text-blue-500" />,
            title: 'Управляйте финансами легко',
            description: 'Добавляйте доходы и расходы, следите за бюджетом в пару касаний'
        },
        {
            icon: <Shield className="w-24 h-24 text-blue-500" />,
            title: 'Безопасно и надёжно',
            description: 'Ваши данные защищены, а счета всегда под контролем'
        },
        {
            icon: <Zap className="w-24 h-24 text-blue-500" />,
            title: 'Готовы начать?',
            description: 'Зарегистрируйтесь и начните вести учёт уже сегодня'
        }
    ];

    const nextStep = () => {
        if (step < slides.length - 1) {
            setStep(step + 1);
        } else {
            onFinish();
            navigate('/register');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="mb-8">
                    {slides[step].icon}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {slides[step].title}
                </h1>
                <p className="text-gray-600 mb-8">
                    {slides[step].description}
                </p>
                <div className="flex justify-center gap-2 mb-8">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all ${
                                i === step ? 'bg-blue-500 w-6' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
                <button
                    onClick={nextStep}
                    className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                    {step === slides.length - 1 ? 'Начать' : 'Далее'}
                    <ArrowRight size={20} />
                </button>
                {step === 0 && (
                    <p className="mt-4 text-sm text-gray-500">
                        Уже есть аккаунт?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-500 font-medium"
                        >
                            Войти
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Welcome;