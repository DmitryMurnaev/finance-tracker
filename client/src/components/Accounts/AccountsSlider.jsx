import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getIconById, getColorById } from '../../config/accountsConfig';

const AccountsSlider = ({ accounts, onAddClick }) => {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    console.log('🎨 AccountsSlider рендер с accounts:', accounts);

    if (!accounts.length) {
        return (
            <div className="mb-6 text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-2">У вас ещё нет счетов</p>
                <button
                    onClick={onAddClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    <Plus size={18} /> Добавить счёт
                </button>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Ваши счета</h2>
                <button
                    onClick={onAddClick}
                    className="text-blue-500 text-sm hover:text-blue-600"
                >
                    + Новый счёт
                </button>
            </div>

            <div className="relative">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 hover:bg-gray-50"
                >
                    <ChevronLeft size={24} />
                </button>

                <div
                    ref={sliderRef}
                    className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {accounts.map((account) => {
                        const icon = getIconById(account.icon_id);
                        const color = getColorById(account.color_id);
                        return (
                            <div
                                key={account.id}
                                className={`flex-shrink-0 w-48 p-4 rounded-xl shadow-sm ${color.bg}`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{icon.emoji}</span>
                                    <span className={`font-medium truncate ${color.text}`}>
                                        {account.name}
                                    </span>
                                </div>
                                <div className={`text-lg font-bold ${color.text}`}>
                                    {account.balance.toLocaleString('ru-RU')} ₽
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1 hover:bg-gray-50"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default AccountsSlider;