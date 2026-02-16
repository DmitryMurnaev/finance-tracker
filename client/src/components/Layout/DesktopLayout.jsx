import React from 'react';
import Header from './Header';
import AccountsSlider from "../Accounts/AccountsSlider";
import BalanceCard from './BalanceCard';
import StatsBlocks from './StatsBlocks';
import ListHeader from './ListHeader';
import TransactionList from '../Transactions/TransactionList';
import Statistics from '../Statistics/Statistics';
import DesktopNavigation from './DesktopNavigation';
import UserMenu from '../UI/UserMenu';

const DesktopLayout = ({
                           transactions,
                           allTransactions,
                           loading,
                           error,
                           fetchTransactions,
                           deleteTransaction,
                           totalIncome,
                           totalExpenses,
                           totalBalance,
                           activeTab,
                           setActiveTab,
                           setIsFormOpen,
                           periods,
                           selectedPeriod,
                           setSelectedPeriod,
                           onEditTransaction,
                           accounts,
                           onAddAccount,
                           onEditAccount,
                           onDeleteAccount,
                       }) => (
    <div className="hidden md:block bg-gray-50 min-h-screen pb-32">
        <div className="flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-100">
            <Header />
            <UserMenu />
        </div>

        <div className="p-4">
            {activeTab === 'home' && (
                <>
                    <AccountsSlider
                        accounts={accounts}
                        onAddClick={onAddAccount}
                        onEditAccount={onEditAccount}
                        onDeleteAccount={onDeleteAccount}
                    />
                    <BalanceCard balance={totalBalance} totalIncome={totalIncome} />
                    <StatsBlocks totalIncome={totalIncome} totalExpenses={totalExpenses} />
                </>
            )}

            {activeTab === 'home' && (
                <ListHeader title="Последние операции" count={transactions.length} />
            )}
        </div>

        <div className="px-4 pb-4">
            {activeTab === 'home' ? (
                <TransactionList
                    transactions={transactions}
                    loading={loading}
                    error={error}
                    onDelete={deleteTransaction}
                    onRetry={fetchTransactions}
                    onEdit={onEditTransaction}
                />
            ) : (
                <Statistics transactions={allTransactions} />
            )}
        </div>

        <div className="fixed bottom-0 left-0 right-0">
            <DesktopNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsFormOpen={setIsFormOpen}
            />
        </div>
    </div>
);

export default DesktopLayout;