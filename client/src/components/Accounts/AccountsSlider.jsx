import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Hand } from 'lucide-react';
import { getIconById, getColorById } from '../../config/accountsConfig';

const AccountsSlider = ({ accounts, onAddClick, onEditAccount, onDeleteAccount }) => {
    const sliderRef = useRef(null);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        if (!accounts.length || !sliderRef.current) return;
        const container = sliderRef.current;
        const hasScroll = container.scrollWidth > container.clientWidth;
        setShowHint(hasScroll);
    }, [accounts]);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const card = sliderRef.current.querySelector('.account-card');
            const cardWidth = card?.offsetWidth || 200;
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!accounts.length) {
        return (
            <div className="mb-6 text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <p className="text-gray-600 text-lg mb-4">У вас ещё нет счетов</p>
                <button
                    onClick={onAddClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
                >
                    <Plus size={20} />
                    Добавить счёт
                </button>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Ваши счета</h2>
                <button
                    onClick={onAddClick}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                    <Plus size={18} />
                    Новый счёт
                </button>
            </div>

            <div className="relative group">
                <button
                    onClick={() => scroll('left')}
                    className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollPadding: '0 16px' }}
                >
                    {accounts.map((account) => {
                        const icon = getIconById(account.icon_id);
                        const color = getColorById(account.color_id);
                        return (
                            <div
                                key={account.id}
                                onClick={() => onEditAccount(account)}
                                className={`account-card flex-shrink-0 w-[calc(100vw-2rem)] sm:w-64 md:w-72 p-4 rounded-xl shadow-sm cursor-pointer snap-start ${color.bg}`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-3xl">{icon.emoji}</span>
                                    <span className={`font-medium text-lg truncate ${color.text}`}>
                                        {account.name}
                                    </span>
                                </div>
                                <div className={`text-2xl font-bold ${color.text}`}>
                                    {account.balance.toLocaleString('ru-RU')} ₽
                                </div>
                            </div>
                        );
                    })}
                </div>

                {showHint && (
                    <div className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg animate-pulse">
                        <Hand className="text-blue-500" size={24} />
                    </div>
                )}

                <button
                    onClick={() => scroll('right')}
                    className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center text-gray-600 hover:text-blue-600 hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default AccountsSlider;