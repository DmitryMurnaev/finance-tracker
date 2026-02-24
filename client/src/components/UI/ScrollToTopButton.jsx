import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 300);
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return isVisible ? (
        <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 opacity-90 hover:opacity-100 dark:bg-blue-600 dark:hover:bg-blue-700"
            aria-label="Наверх"
        >
            <ArrowUp size={24} />
        </button>
    ) : null;
};

export default ScrollToTopButton;