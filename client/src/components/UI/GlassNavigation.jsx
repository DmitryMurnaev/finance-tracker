import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Target, BarChart3, MoreHorizontal, Plus } from 'lucide-react';

const GlassNavigation = ({ activeTab, setActiveTab, showTypeMenu, setShowTypeMenu }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const navRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    const leftItems = useMemo(() => [
        { id: 'home', icon: Home, label: 'Главная', path: '/home' },
        { id: 'plans', icon: Target, label: 'Планы', path: '/plans' },
    ], []);

    const rightItems = useMemo(() => [
        { id: 'stats', icon: BarChart3, label: 'Аналитика', path: '/home' },
        { id: 'more', icon: MoreHorizontal, label: 'Ещё', path: '/more' },
    ], []);

    const leftRefs = useRef([]);
    const rightRefs = useRef([]);

    useEffect(() => {
        const path = location.pathname;
        if (path === '/plans') setActiveTab('plans');
        else if (path === '/more') setActiveTab('more');
    }, [location.pathname, setActiveTab]);

    useEffect(() => {
        let activeEl = null;
        if (activeTab === 'home' || activeTab === 'plans') {
            const idx = leftItems.findIndex(i => i.id === activeTab);
            if (idx !== -1) activeEl = leftRefs.current[idx];
        } else if (activeTab === 'stats' || activeTab === 'more') {
            const idx = rightItems.findIndex(i => i.id === activeTab);
            if (idx !== -1) activeEl = rightRefs.current[idx];
        }

        const navEl = navRef.current;
        if (activeEl && navEl) {
            const navRect = navEl.getBoundingClientRect();
            const activeRect = activeEl.getBoundingClientRect();
            setIndicatorStyle({
                left: activeRect.left - navRect.left,
                width: activeRect.width,
            });
        }
    }, [activeTab, leftItems, rightItems]);

    const handleLeftClick = (item) => {
        setActiveTab(item.id);
        navigate(item.path);
    };

    const handleRightClick = (item) => {
        setActiveTab(item.id);
        navigate(item.path);
    };

    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
            <div
                ref={navRef}
                className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-700 shadow-2xl rounded-2xl py-2 px-2 flex items-center pointer-events-auto w-full max-w-md"
            >
                <div
                    className="absolute bottom-1 top-1 bg-gray-200/70 dark:bg-gray-600/70 rounded-xl transition-all duration-300 ease-out"
                    style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
                />

                {leftItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            ref={el => (leftRefs.current[index] = el)}
                            onClick={() => handleLeftClick(item)}
                            className="flex-1 flex flex-col items-center py-1 px-1 rounded-lg transition-colors z-10"
                        >
                            <Icon size={24} className={activeTab === item.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'} />
                            <span className={`text-xs mt-1 ${activeTab === item.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}

                <div className="flex items-center justify-center w-16">
                    <button
                        onClick={() => setShowTypeMenu(true)}
                        className="relative flex flex-col items-center -mt-8 z-20"
                    >
                        <div className={`bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-500/30 transition-transform duration-300 ${showTypeMenu ? 'rotate-45' : 'rotate-0'}`}>
                            <Plus size={28} />
                        </div>
                    </button>
                </div>

                {rightItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            ref={el => (rightRefs.current[index] = el)}
                            onClick={() => handleRightClick(item)}
                            className="flex-1 flex flex-col items-center py-1 px-1 rounded-lg transition-colors z-10"
                        >
                            <Icon size={24} className={activeTab === item.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'} />
                            <span className={`text-xs mt-1 ${activeTab === item.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GlassNavigation;