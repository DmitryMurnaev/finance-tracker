import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
        >
            {theme === 'light' ? (
                <Moon size={24} className="text-gray-700 dark:text-gray-300" />
            ) : (
                <Sun size={24} className="text-gray-700 dark:text-gray-300" />
            )}
            <span className="font-medium text-gray-900 dark:text-gray-100">
                {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
            </span>
        </button>
    );
};

export default ThemeToggle;