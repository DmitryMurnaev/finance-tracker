import Header from './Header';
import BalanceCard from './BalanceCard';
import StatsBlocks from './StatsBlocks';
import ListHeader from './ListHeader';
import TransactionList from '../Transactions/TransactionList';
import Statistics from '../Statistics/Statistics';
import DesktopNavigation from './DesktopNavigation';

const DesktopLayout = ({
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
    <div className="hidden md:block bg-gray-50 h-screen overflow-hidden">
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0">
                <Header />
                <div className="p-4">
                    <BalanceCard balance={balance} totalIncome={totalIncome} />
                    <StatsBlocks totalIncome={totalIncome} totalExpenses={totalExpenses} />
                    <ListHeader
                        title={activeTab === 'home' ? 'Последние операции' : 'Аналитика'}
                        count={activeTab === 'home' ? transactions.length : 0}
                    />
                </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
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
            <DesktopNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setIsFormOpen={setIsFormOpen}
            />
        </div>
    </div>
);
export default DesktopLayout;