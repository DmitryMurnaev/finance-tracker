import Header from './Header';
import BalanceCard from './BalanceCard';
import StatsBlocks from './StatsBlocks';
import ListHeader from './ListHeader';
import TransactionList from '../Transactions/TransactionList';
import Statistics from '../Statistics/Statistics';
import MobileNavigation from './MobileNavigation';

const MobileLayout = ({
                          transactions,
                          loading,
                          error,
                          fetchTransactions,
                          deleteTransaction,
                          totalIncome,
                          totalExpenses,
                          balance,
                          activeTab,
                          setActiveTab,
                          setIsFormOpen
                      }) => (
    <div className="block md:hidden bg-gray-50 min-h-screen pb-32">
        <Header />
        <div className="p-4">
            <BalanceCard balance={balance} totalIncome={totalIncome} />
            <StatsBlocks totalIncome={totalIncome} totalExpenses={totalExpenses} />
            {activeTab === 'home' && (
                <ListHeader
                    title="Последние операции"
                    count={transactions.length}
                />
            )}
            {activeTab === 'home' ? (
                <TransactionList
                    transactions={transactions}
                    loading={loading}
                    error={error}
                    onDelete={deleteTransaction}
                    onRetry={fetchTransactions}
                />
            ) : (
                <Statistics transactions={transactions} />
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