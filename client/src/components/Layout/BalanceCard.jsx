import { Wallet } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

const BalanceCard = ({ balance, totalIncome }) => {
    const { formatCurrency } = useCurrency();
    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Wallet className="mr-3" size={24} />
                    <h2 className="text-lg font-semibold">Текущий баланс</h2>
                </div>
                <div className="text-blue-100 text-sm bg-white/20 px-3 py-1 rounded-full">
                    {formatCurrency(balance)}
                </div>
            </div>
            <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                    {formatCurrency(balance)}
                </div>
                <div className="text-blue-100">
                    Доходы: {formatCurrency(totalIncome)}
                </div>
            </div>
        </div>
    );
};

export default BalanceCard;