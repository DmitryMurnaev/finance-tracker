import { Wallet } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const BalanceCard = ({ balance, totalIncome }) => {
    const { formatCurrency } = useCurrency();

    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 sm:p-6 text-white mb-6 shadow-lg">
            <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center justify-between gap-2 mb-4">
                <div className="flex items-center min-w-0">
                    <Wallet className="mr-3 flex-shrink-0" size={24} />
                    <h2 className="text-base sm:text-lg font-semibold whitespace-nowrap">Текущий баланс</h2>
                </div>
                <div className="text-blue-100 text-sm bg-white/20 px-3 py-1 rounded-full truncate max-w-full">
                    {formatCurrency(balance)}
                </div>
            </div>
            <div className="text-center">
                <div className="text-3xl min-[400px]:text-4xl sm:text-5xl font-bold mb-2 break-words">
                    {formatCurrency(balance)}
                </div>
                <div className="text-blue-100 text-xs min-[400px]:text-sm sm:text-base break-words">
                    Доходы: {formatCurrency(totalIncome)}
                </div>
            </div>
        </div>
    );
};

export default BalanceCard;