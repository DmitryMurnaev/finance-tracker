import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Target, BarChart3, MoreHorizontal, Plus } from 'lucide-react';

const GlassNavigation = ({ activeTab, setActiveTab, showTypeMenu, setShowTypeMenu }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const navRef = useRef(null);
    const itemRefs = useRef({});
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    // Синхронизация activeTab с путём
    useEffect(() => {
        const path = location.pathname;
        if (path === '/home' || path === '/') {
            // На главной оставляем как есть
        } else if (path === '/plans') {
            setActiveTab('plans');
        } else if (path === '/more') {
            setActiveTab('more');
        }
    }, [location.pathname, setActiveTab]);

    const items = [
        { id: 'home', icon: Home, label: 'Главная', path: '/home' },
        { id: 'plans', icon: Target, label: 'Планы', path: '/plans' },
        { id: 'stats', icon: BarChart3, label: 'Аналитика', path: '/home' },
        { id: 'more', icon: MoreHorizontal, label: 'Ещё', path: '/more' },
    ];

    // Обновление позиции индикатора
    useEffect(() => {
        const activeEl = itemRefs.current[activeTab];
        const navEl = navRef.current;
        if (activeEl && navEl) {
            const navRect = navEl.getBoundingClientRect();
            const activeRect = activeEl.getBoundingClientRect();
            setIndicatorStyle({
                left: activeRect.left - navRect.left,
                width: activeRect.width,
            });
        }
    }, [activeTab, location.pathname]);

    const handleItemClick = (item) => {
        if (item.id === 'home' || item.id === 'stats') {
            setActiveTab(item.id);
            if (location.pathname !== '/home') {
                navigate('/home');
            }
        } else {
            setActiveTab(item.id);
            navigate(item.path);
        }
    };

    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <div
                ref={navRef}
                className="relative backdrop-blur-xl bg-white/30 border border-white/20 shadow-2xl rounded-2xl px-4 py-2 flex items-center gap-2 pointer-events-auto"
                style={{ maxWidth: '90%' }}
            >
                {/* Индикатор активного пункта (стеклянный) */}
                <div
                    className="absolute bottom-1 top-1 bg-white/40 backdrop-blur-md rounded-xl transition-all duration-300 ease-out"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                    }}
                />

                {/* Главная */}
                <button
                    ref={el => itemRefs.current.home = el}
                    onClick={() => handleItemClick(items[0])}
                    className={`relative flex flex-col items-center px-3 py-1 rounded-lg transition-colors z-10 ${
                        activeTab === 'home' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                    <Home size={24} />
                    <span className="text-xs mt-1">Главная</span>
                </button>

                {/* Планы */}
                <button
                    ref={el => itemRefs.current.plans = el}
                    onClick={() => handleItemClick(items[1])}
                    className={`relative flex flex-col items-center px-3 py-1 rounded-lg transition-colors z-10 ${
                        activeTab === 'plans' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                    <Target size={24} />
                    <span className="text-xs mt-1">Планы</span>
                </button>

                {/* Центральная кнопка «+» (между планами и аналитикой) */}
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

                {/* Аналитика */}
                <button
                    ref={el => itemRefs.current.stats = el}
                    onClick={() => handleItemClick(items[2])}
                    className={`relative flex flex-col items-center px-3 py-1 rounded-lg transition-colors z-10 ${
                        activeTab === 'stats' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                    <BarChart3 size={24} />
                    <span className="text-xs mt-1">Аналитика</span>
                </button>

                {/* Ещё */}
                <button
                    ref={el => itemRefs.current.more = el}
                    onClick={() => handleItemClick(items[3])}
                    className={`relative flex flex-col items-center px-3 py-1 rounded-lg transition-colors z-10 ${
                        activeTab === 'more' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                    <MoreHorizontal size={24} />
                    <span className="text-xs mt-1">Ещё</span>
                </button>
            </div>
        </div>
    );
};

export default GlassNavigation;