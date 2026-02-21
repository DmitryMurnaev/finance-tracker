import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Target, BarChart3, MoreHorizontal, Plus } from 'lucide-react';

const GlassNavigation = ({ activeTab, setActiveTab, showTypeMenu, setShowTypeMenu }) => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        setActiveTab('home');
        // Остаёмся на текущем URL – не делаем navigate
    };

    const handleStatsClick = () => {
        setActiveTab('stats');
    };

    const handlePlansClick = () => {
        navigate('/plans');
    };

    const handleMoreClick = () => {
        navigate('/more');
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-lg border-t border-white/20 shadow-lg" />
            <div className="relative flex justify-around items-center py-2 px-1">
                <button
                    onClick={handleHomeClick}
                    className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                        activeTab === 'home' ? 'text-blue-500' : 'text-gray-500'
                    }`}
                >
                    <Home size={24} />
                    <span className="text-xs mt-1">Главная</span>
                </button>

                <button
                    onClick={handlePlansClick}
                    className="flex flex-col items-center py-1 px-3 rounded-lg transition-colors text-gray-500"
                >
                    <Target size={24} />
                    <span className="text-xs mt-1">Планы</span>
                </button>

                <button
                    onClick={() => setShowTypeMenu(true)}
                    className="flex flex-col items-center -mt-8"
                >
                    <div className={`bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-500/30 transition-transform duration-300 ${showTypeMenu ? 'rotate-45' : 'rotate-0'}`}>
                        <Plus size={28} />
                    </div>
                </button>

                <button
                    onClick={handleStatsClick}
                    className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                        activeTab === 'stats' ? 'text-blue-500' : 'text-gray-500'
                    }`}
                >
                    <BarChart3 size={24} />
                    <span className="text-xs mt-1">Аналитика</span>
                </button>

                <button
                    onClick={handleMoreClick}
                    className="flex flex-col items-center py-1 px-3 rounded-lg transition-colors text-gray-500"
                >
                    <MoreHorizontal size={24} />
                    <span className="text-xs mt-1">Ещё</span>
                </button>
            </div>
        </nav>
    );
};

export default GlassNavigation;