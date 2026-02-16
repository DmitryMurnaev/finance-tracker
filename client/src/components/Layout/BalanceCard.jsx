import { Wallet } from 'lucide-react';

const BalanceCard = ({ balance, totalIncome }) => (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <Wallet className="mr-3" size={24} />
                <h2 className="text-lg font-semibold">Текущий баланс</h2>
            </div>
            <div className="text-blue-100 text-sm bg-white/20 px-3 py-1 rounded-full">
                {balance >= 0 ? '+' : ''}{balance.toLocaleString('ru-RU')} ₽
            </div>
        </div>
        <div className="text-center">
            <div className="text-5xl font-bold mb-2">
                {balance.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-blue-100">
                Доходы: +{totalIncome.toLocaleString('ru-RU')} ₽
            </div>
        </div>
    </div>
);

export default BalanceCard;