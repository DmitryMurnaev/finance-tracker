import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Target, BarChart3, MoreHorizontal, Plus } from 'lucide-react';

const GlassNavigation = ({ activeTab, setActiveTab, showTypeMenu, setShowTypeMenu }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const navRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    // Мемоизируем массивы, чтобы они не менялись при каждом рендере
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

    // Синхронизация activeTab с путём (только при изменении пути)
    useEffect(() => {
        const path = location.pathname;
        if (path === '/plans') {
            setActiveTab('plans');
        } else if (path === '/more') {
            setActiveTab('more');
        }
        // Для /home и / оставляем текущий activeTab (home/stats)
    }, [location.pathname, setActiveTab]);

    // Обновление позиции индикатора
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
                className="relative backdrop-blur-xl bg-[#fbfbfd]/90 border border-white/30 shadow-2xl rounded-2xl py-2 px-2 flex items-center pointer-events-auto w-full max-w-md"
            >
                {/* Индикатор активного пункта */}
                <div
                    className="absolute bottom-1 top-1 bg-[#eaeaec] rounded-xl transition-all duration-300 ease-out"
                    style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
                />

                {/* Левая группа (Главная, Планы) */}
                {leftItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            ref={el => (leftRefs.current[index] = el)}
                            onClick={() => handleLeftClick(item)}
                            className="flex-1 flex flex-col items-center py-1 px-1 rounded-lg transition-colors z-10"
                        >
                            <Icon size={24} className={activeTab === item.id ? 'text-[#0486fc]' : 'text-[#323232]'} />
                            <span className={`text-xs mt-1 ${activeTab === item.id ? 'text-[#0486fc]' : 'text-[#323232]'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}

                {/* Центральная кнопка "+" */}
                <div className="flex items-center justify-center w-16">
                    <button
                        onClick={() => setShowTypeMenu(true)}
                        className="relative flex flex-col items-center -mt-8 z-20"
                    >
                        <div className={`bg-[#0486fc] text-white rounded-full p-4 shadow-lg shadow-[#0486fc]/30 transition-transform duration-300 ${showTypeMenu ? 'rotate-45' : 'rotate-0'}`}>
                            <Plus size={28} />
                        </div>
                    </button>
                </div>

                {/* Правая группа (Аналитика, Ещё) */}
                {rightItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            ref={el => (rightRefs.current[index] = el)}
                            onClick={() => handleRightClick(item)}
                            className="flex-1 flex flex-col items-center py-1 px-1 rounded-lg transition-colors z-10"
                        >
                            <Icon size={24} className={activeTab === item.id ? 'text-[#0486fc]' : 'text-[#323232]'} />
                            <span className={`text-xs mt-1 ${activeTab === item.id ? 'text-[#0486fc]' : 'text-[#323232]'}`}>
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