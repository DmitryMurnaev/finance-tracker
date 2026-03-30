import { useTheme } from '../../context/ThemeContext';

const Header = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <header className="flex items-center gap-3 mb-6">
            <img
                src={isDark ? '/logo-dark.svg' : '/logo-light.svg'}
                alt="Финикон"
                className="h-10 w-auto"
            />
            <div>
                <h1
                    className="text-2xl font-bold"
                    style={{ color: isDark ? '#F9FAFB' : '#3B82F6' }}
                >
                    Финикон
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Учёт доходов и расходов
                </p>
            </div>
        </header>
    );
};

export default Header;