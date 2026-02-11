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
    <div className="hidden md:block bg-gray-50 min-h-screen pb-32">
        {/* Шапка — прилипает при скролле */}
        <Header />

        <div className="p-4">
            <BalanceCard balance={balance} totalIncome={totalIncome} />
            <StatsBlocks totalIncome={totalIncome} totalExpenses={totalExpenses} />

            {/* Заголовок списка — только для главной, для статистики убираем */}
            {activeTab === 'home' && (
                <ListHeader
                    title="Последние операции"
                    count={transactions.length}
                />
            )}
        </div>

        {/* Контент — в потоке, без внутреннего скролла */}
        <div className="px-4 pb-4">
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

        {/* Навигация — фиксированная снизу, как на мобилке */}
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