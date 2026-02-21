import { useCurrency } from '../../context/CurrencyContext';

const StatsBlocks = ({ totalIncome, totalExpenses }) => {
    const { formatCurrency } = useCurrency();
    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="bg-white p-3 sm:p-5 rounded-xl shadow border border-gray-100 overflow-hidden">
                <div className="text-green-500 font-bold text-lg sm:text-xl md:text-2xl truncate">
                    {formatCurrency(totalIncome)}
                </div>
                <div className="text-gray-700 text-xs sm:text-sm mt-1">Доходы</div>
            </div>
            <div className="bg-white p-3 sm:p-5 rounded-xl shadow border border-gray-100 overflow-hidden">
                <div className="text-red-500 font-bold text-lg sm:text-xl md:text-2xl truncate">
                    {formatCurrency(totalExpenses)}
                </div>
                <div className="text-gray-700 text-xs sm:text-sm mt-1">Расходы</div>
            </div>
        </div>
    );
};
export default StatsBlocks;