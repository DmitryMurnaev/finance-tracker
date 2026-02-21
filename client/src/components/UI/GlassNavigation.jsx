import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Target, BarChart3, MoreHorizontal, Plus } from 'lucide-react';

const GlassNavigation = ({ activeTab, setActiveTab, showTypeMenu, setShowTypeMenu }) => {
    const navigate = useNavigate();
    const navRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    // Список основных пунктов (без центральной кнопки)
    const items = [
        { id: 'home', icon: Home, label: 'Главная', action: () => { setActiveTab('home'); navigate('/home'); } },
        { id: 'plans', icon: Target, label: 'Планы', action: () => { navigate('/plans'); } },
        { id: 'stats', icon: BarChart3, label: 'Аналитика', action: () => { setActiveTab('stats'); navigate('/home'); } },
        { id: 'more', icon: MoreHorizontal, label: 'Ещё', action: () => { navigate('/more'); } },
    ];

    // Ссылки на DOM-элементы пунктов
    const itemRefs = useRef([]);

    // Обновление позиции индикатора
    useEffect(() => {
        const activeIndex = items.findIndex(item => item.id === activeTab);
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

    return (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
            <div
                ref={navRef}
                className="relative backdrop-blur-xl bg-white/70 border border-white/20 shadow-lg rounded-2xl px-2 py-2 flex items-center gap-1 pointer-events-auto"
                style={{ maxWidth: '90%' }}
            >
                {/* Индикатор активного пункта */}
                <div
                    className="absolute bottom-2 top-2 bg-blue-500/20 rounded-xl transition-all duration-300 ease-out"
                    style={{
                        left: indicatorStyle.left,
                        width: indicatorStyle.width,
                    }}
                />

                {/* Основные пункты меню */}
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            ref={el => itemRefs.current[index] = el}
                            onClick={item.action}
                            className={`relative flex flex-col items-center px-3 py-1 rounded-lg transition-colors z-10 ${
                                activeTab === item.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <Icon size={24} />
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    );
                })}

                {/* Центральная кнопка «+» */}
                <button
                    onClick={() => setShowTypeMenu(true)}
                    className="relative flex flex-col items-center -mt-8 z-20"
                >
                    <div className={`bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-500/30 transition-transform duration-300 ${showTypeMenu ? 'rotate-45' : 'rotate-0'}`}>
                        <Plus size={28} />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default GlassNavigation;