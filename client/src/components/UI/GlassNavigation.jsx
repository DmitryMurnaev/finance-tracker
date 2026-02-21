import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Target, BarChart3, MoreHorizontal, Plus } from 'lucide-react';

const GlassNavigation = ({ activeTab, setActiveTab, showTypeMenu, setShowTypeMenu }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const navRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    const items = [
        { id: 'home', icon: Home, label: 'Главная', path: '/home' },
        { id: 'plans', icon: Target, label: 'Планы', path: '/plans' },
        { id: 'plus', isPlus: true },
        { id: 'stats', icon: BarChart3, label: 'Аналитика', path: '/home' },
        { id: 'more', icon: MoreHorizontal, label: 'Ещё', path: '/more' },
    ];

    const itemRefs = useRef([]);

    // Синхронизация activeTab с путём
    useEffect(() => {
        const path = location.pathname;
        if (path === '/home' || path === '/') {
            // остаёмся на текущем activeTab (home/stats)
        } else if (path === '/plans') {
            setActiveTab('plans');
        } else if (path === '/more') {
            setActiveTab('more');
        }
    }, [location.pathname, setActiveTab]);

    // Обновление позиции индикатора
    useEffect(() => {
        const activeIndex = items.findIndex(item => !item.isPlus && item.id === activeTab);
        if (activeIndex === -1) return;

        const activeEl = itemRefs.current[activeIndex];
        const navEl = navRef.current;
        if (activeEl && navEl) {
            const navRect = navEl.getBoundingClientRect();
            const activeRect = activeEl.getBoundingClientRect();
            setIndicatorStyle({
                left: activeRect.left - navRect.left,
                width: activeRect.width,
            });
        }
    }, [activeTab, items]);

    const handleItemClick = (item) => {
        if (item.isPlus) {
            setShowTypeMenu(true);
            return;
        }
        console.log(`Navigating to ${item.path} with activeTab=${item.id}`);
        setActiveTab(item.id);
        navigate(item.path);
    };

    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
            <div
                ref={navRef}
                className="relative backdrop-blur-xl bg-white/30 border border-white/30 shadow-2xl rounded-2xl py-2 px-2 flex items-center pointer-events-auto w-full max-w-md"
            >
                {/* Индикатор активного пункта (полупрозрачный) */}
                <div
                    className="absolute bottom-1 top-1 bg-white/40 backdrop-blur-sm rounded-xl transition-all duration-300 ease-out"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                    }}
                />

                {items.map((item, index) => {
                    if (item.isPlus) {
                        return (
                            <div key="plus" className="flex items-center justify-center w-16">
                                <button
                                    onClick={() => handleItemClick(item)}
                                    className="relative flex flex-col items-center -mt-8 z-20"
                                >
                                    <div className={`bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-500/30 transition-transform duration-300 ${showTypeMenu ? 'rotate-45' : 'rotate-0'}`}>
                                        <Plus size={28} />
                                    </div>
                                </button>
                            </div>
                        );
                    }

                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            ref={el => itemRefs.current[index] = el}
                            onClick={() => handleItemClick(item)}
                            className={`flex-1 flex flex-col items-center py-1 px-1 rounded-lg transition-colors z-10 ${
                                activeTab === item.id ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <Icon size={24} />
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GlassNavigation;