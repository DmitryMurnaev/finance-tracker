import { Wallet, TrendingUp, Plus } from 'lucide-react';

const DesktopNavigation = ({ activeTab, setActiveTab, onAddClick }) => (
    <nav className="grid grid-cols-3 bg-white border-t border-gray-200 px-4 pt-3 pb-3">
        <div className="flex justify-center">
            <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-500' : 'text-gray-400'}`}
            >
                <Wallet size={24} />
                <span className="text-xs mt-1">Главная</span>
            </button>
        </div>
        <div className="flex justify-center">
            <button
                onClick={onAddClick}
                className="flex flex-col items-center"
            >
                <div className="bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-500/30">
                    <Plus size={28} />
                </div>
                <span className="text-xs mt-2 text-gray-700">Добавить</span>
            </button>
        </div>
        <div className="flex justify-center">
            <button
                onClick={() => setActiveTab('stats')}
                className={`flex flex-col items-center ${activeTab === 'stats' ? 'text-blue-500' : 'text-gray-400'}`}
            >
                <TrendingUp size={24} />
                <span className="text-xs mt-1">Статистика</span>
            </button>
        </div>
    </nav>
);

export default DesktopNavigation;