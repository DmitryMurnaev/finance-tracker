import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Target, BarChart3, MoreHorizontal, Plus } from 'lucide-react';

const GlassNavigation = ({ activeTab, setActiveTab, showTypeMenu, setShowTypeMenu }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const navRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

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

    // Основные пункты: сначала home, plans, потом плюс отдельно, потом stats, more
    const leftItems = [
        { id: 'home', icon: Home, label: 'Главная', path: '/home' },
        { id: 'plans', icon: Target, label: 'Планы', path: '/plans' },
    ];
    const rightItems = [
        { id: 'stats', icon: BarChart3, label: 'Аналитика', path: '/home' },
        { id: 'more', icon: MoreHorizontal, label: 'Ещё', path: '/more' },
    ];

    const leftRefs = useRef([]);
    const rightRefs = useRef([]);
    const plusRef = useRef(null);

    // Обновление позиции индикатора
    useEffect(() => {
        // Определяем, какой пункт активен и в какой группе он находится
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

    // Обработчик клика на левый пункт
    const handleLeftClick = (item) => {
        setActiveTab(item.id);
        if (item.id === 'home') {
            if (location.pathname !== '/home') navigate('/home');
        } else if (item.id === 'plans') {
            navigate('/plans');
        }
    };

    // Обработчик клика на правый пункт
    const handleRightClick = (item) => {
        setActiveTab(item.id);
        if (item.id === 'stats') {
            if (location.pathname !== '/home') navigate('/home');
        } else if (item.id === 'more') {
            navigate('/more');
        }
    };

    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
            <div
                ref={navRef}
                className="relative backdrop-blur-xl bg-gray-900/80 border border-gray-700 shadow-2xl rounded-2xl py-2 px-4 flex items-center gap-2 pointer-events-auto w-full max-w-md"
            >
                {/* Индикатор активного пункта (более тёмный) */}
                <div
                    className="absolute bottom-1 top-1 bg-blue-500/60 backdrop-blur-sm rounded-xl transition-all duration-300 ease-out"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                    }}
                />

                {/* Левые пункты */}
                {leftItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            ref={el => leftRefs.current[index] = el}
                            onClick={() => handleLeftClick(item)}
                            className={`relative flex flex-col items-center px-3 py-1 rounded-lg transition-colors z-10 ${
                                activeTab === item.id ? 'text-white' : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            <Icon size={24} />
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    );
                })}

                {/* Кнопка "+" по центру */}
                <div className="flex items-center justify-center w-16">
                    <button
                        ref={plusRef}
                        onClick={() => setShowTypeMenu(true)}
                        className="relative flex flex-col items-center -mt-8 z-20"
                    >
                        <div className={`bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-500/30 transition-transform duration-300 ${showTypeMenu ? 'rotate-45' : 'rotate-0'}`}>
                            <Plus size={28} />
                        </div>
                    </button>
                </div>

                {/* Правые пункты */}
                {rightItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            ref={el => rightRefs.current[index] = el}
                            onClick={() => handleRightClick(item)}
                            className={`relative flex flex-col items-center px-3 py-1 rounded-lg transition-colors z-10 ${
                                activeTab === item.id ? 'text-white' : 'text-gray-300 hover:text-white'
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