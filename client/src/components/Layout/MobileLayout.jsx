import React from 'react';
import { History as HistoryIcon } from 'lucide-react';
import Header from './Header';
import AccountsSlider from "../Accounts/AccountsSlider";
import BalanceCard from './BalanceCard';
import StatsBlocks from './StatsBlocks';
import TransactionList from '../Transactions/TransactionList';
import Statistics from '../Statistics/Statistics';
import MobileNavigation from './MobileNavigation';
import PeriodSelector from '../UI/PeriodSelector';
import UserMenu from '../UI/UserMenu';

const MobileLayout = ({
                          transactions,
                          allTransactions,
                          loading,
                          error,
                          fetchTransactions,
                          deleteTransaction,
                          totalIncome,
                          totalExpenses,
                          totalBalance,                       // ✅ принимаем общий баланс
                          activeTab,
                          setActiveTab,
                          setIsFormOpen,
                          periods,
                          selectedPeriod,
                          setSelectedPeriod,
                          onEditTransaction,
                          accounts,
                          onAddAccount,                       // ✅ единое имя
                      }) => (
    <div className="block md:hidden bg-gray-50 min-h-screen pb-32">
        <div className="flex justify-between items-center p-4">
            <Header />
            <UserMenu />
        </div>

        <div className="p-4">
            <AccountsSlider accounts={accounts} onAddClick={onAddAccount} />
            <BalanceCard balance={totalBalance} totalIncome={totalIncome} />
            <StatsBlocks totalIncome={totalIncome} totalExpenses={totalExpenses} />

            {activeTab === 'home' ? (
                <>
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-3 sm:p-4 mb-4">
                        <div className="flex flex-col min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between gap-3">
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <HistoryIcon size={20} className="text-gray-600 flex-shrink-0" />
                                <h2 className="font-semibold text-sm sm:text-base whitespace-nowrap">
                                    Последние операции
                                </h2>
                            </div>
                            <PeriodSelector
                                periods={periods}
                                selectedPeriod={selectedPeriod}
                                onChange={setSelectedPeriod}
                                className="flex flex-wrap gap-1 sm:gap-2 min-[380px]:justify-end"
                            />
                        </div>
                    </div>

                    <TransactionList
                        transactions={transactions}
                        loading={loading}
                        error={error}
                        onDelete={deleteTransaction}
                        onRetry={fetchTransactions}
                        onEdit={onEditTransaction}
                    />
                </>
            ) : (
                <Statistics transactions={allTransactions} />
            )}
        </div>

        <MobileNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsFormOpen={setIsFormOpen}
        />
    </div>
);

export default MobileLayout;