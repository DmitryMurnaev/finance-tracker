import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-700">
                    Мы используем cookies, чтобы сделать наш сайт удобнее и персонализированнее для вас.
                    Продолжая использование, вы соглашаетесь с политикой использования cookies.
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={accept}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                    >
                        Принять
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;