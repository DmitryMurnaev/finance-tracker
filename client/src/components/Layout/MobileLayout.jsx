import React from 'react';
import { History as HistoryIcon } from 'lucide-react';
import Header from './Header';
import BalanceCard from './BalanceCard';
import StatsBlocks from './StatsBlocks';
import TransactionList from '../Transactions/TransactionList';
import Statistics from '../Statistics/Statistics';
import MobileNavigation from './MobileNavigation';
import PeriodSelector from '../UI/PeriodSelector';

const MobileLayout = ({
                          // Отфильтрованные транзакции для списка
                          transactions,
                          // Все транзакции (для статистики)
                          allTransactions,
                          loading,
                          error,
                          fetchTransactions,
                          deleteTransaction,
                          totalIncome,
                          totalExpenses,
                          balance,
                          activeTab,
                          setActiveTab,
                          setIsFormOpen,
                          // Пропсы для PeriodSelector
                          periods,
                          selectedPeriod,
                          setSelectedPeriod
                      }) => (
    <div className="block md:hidden bg-gray-50 min-h-screen pb-32">
        <Header />

        <div className="p-4">
            {/* Баланс и блоки доходов/расходов всегда отображаются */}
            <BalanceCard balance={balance} totalIncome={totalIncome} />
            <StatsBlocks totalIncome={totalIncome} totalExpenses={totalExpenses} />

            {/* Контент в зависимости от вкладки */}
            {activeTab === 'home' ? (
                <>
                    {/* Заголовок списка + PeriodSelector */}
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-4 mb-4">
                        <div className="flex flex-row items-center justify-between gap-1 sm:gap-2">
                            <div className="flex items-center gap-2">
                                <HistoryIcon size={20} className="text-gray-600"/>
                                <h2 className="font-semibold">Последние операции</h2>
                            </div>
                            <PeriodSelector
                                periods={periods}
                                selectedPeriod={selectedPeriod}
                                onChange={setSelectedPeriod}
                            />
                        </div>
                    </div>

                    {/* Список транзакций (отфильтрованные) */}
                    <TransactionList
                        transactions={transactions}
                        loading={loading}
                        error={error}
                        onDelete={deleteTransaction}
                        onRetry={fetchTransactions}
                    />
                </>
            ) : (
                // Вкладка статистики
                <Statistics transactions={allTransactions}/>
            )}
        </div>

        {/* Нижняя навигация */}
        <MobileNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsFormOpen={setIsFormOpen}
        />
    </div>
);

export default MobileLayout;