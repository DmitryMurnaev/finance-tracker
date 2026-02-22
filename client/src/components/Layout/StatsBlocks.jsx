import { useCurrency } from '../../context/CurrencyContext';

const StatsBlocks = ({ totalIncome, totalExpenses }) => {
    const { formatCurrency } = useCurrency();

    // Функция для форматирования без копеек на очень маленьких экранах
    const formatCompact = (value) => {
        return value.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' ₽';
    };

    return (
        <div className="grid grid-cols-1 min-[370px]:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="bg-white p-3 sm:p-5 rounded-xl shadow border border-gray-100 overflow-hidden">
                <div className="text-green-500 font-bold text-lg sm:text-xl md:text-2xl truncate">
                    <span className="hidden min-[370px]:inline">{formatCurrency(totalIncome)}</span>
                    <span className="inline min-[370px]:hidden">{formatCompact(totalIncome)}</span>
                </div>
                <div className="text-gray-700 text-xs sm:text-sm mt-1">Доходы</div>
            </div>
            <div className="bg-white p-3 sm:p-5 rounded-xl shadow border border-gray-100 overflow-hidden">
                <div className="text-red-500 font-bold text-lg sm:text-xl md:text-2xl truncate">
                    <span className="hidden min-[370px]:inline">{formatCurrency(totalExpenses)}</span>
                    <span className="inline min-[370px]:hidden">{formatCompact(totalExpenses)}</span>
                </div>
                <div className="text-gray-700 text-xs sm:text-sm mt-1">Расходы</div>
            </div>
        </div>
    );
};

export default StatsBlocks;