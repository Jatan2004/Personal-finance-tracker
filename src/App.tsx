import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight, PieChart, Target } from 'lucide-react';
import { Transaction, Category } from './types';
import { storage } from './utils/storage';
import { calculateMonthlyStats, getCurrentMonth, getMonthName } from './utils/calculations';
import { defaultCategories } from './data/defaultCategories';
import StatCard from './components/StatCard';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';
import CategoryBreakdown from './components/CategoryBreakdown';
import BudgetOverview from './components/BudgetOverview';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'budgets'>('overview');

  useEffect(() => {
    const savedTransactions = storage.getTransactions();
    const savedCategories = storage.getCategories();

    if (savedCategories.length === 0) {
      const initialCategories = defaultCategories.map((cat, index) => ({
        ...cat,
        id: `cat-${Date.now()}-${index}`,
      }));
      setCategories(initialCategories);
      storage.saveCategories(initialCategories);
    } else {
      setCategories(savedCategories);
    }

    setTransactions(savedTransactions);
  }, []);

  const stats = calculateMonthlyStats(transactions, categories, currentMonth);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: `txn-${Date.now()}`,
    };

    const updated = [...transactions, transaction];
    setTransactions(updated);
    storage.saveTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    storage.saveTransactions(updated);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1);

    if (direction === 'prev') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }

    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">Financial Tracker</h1>
              <p className="text-gray-700">Manage your income and expenses with ease</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>

          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-teal-100 px-6 py-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-teal-50 rounded-lg transition-colors text-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{getMonthName(currentMonth)}</h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-teal-50 rounded-lg transition-colors text-gray-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Income"
            amount={stats.totalIncome}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Total Expenses"
            amount={stats.totalExpenses}
            icon={TrendingDown}
            color="red"
          />
          <StatCard
            title="Balance"
            amount={stats.balance}
            icon={Wallet}
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-teal-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h3>
            <TransactionList
              transactions={transactions.filter(t => {
                const [year, month] = currentMonth.split('-');
                const tDate = new Date(t.date);
                return tDate.getFullYear() === parseInt(year) &&
                       tDate.getMonth() === parseInt(month) - 1;
              })}
              categories={categories}
              onDelete={handleDeleteTransaction}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-teal-100 overflow-hidden">
              <div className="border-b border-teal-100">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-b-2 border-teal-500'
                        : 'text-gray-600 hover:bg-teal-50/50'
                    }`}
                  >
                    <PieChart className="w-4 h-4 mx-auto mb-1" />
                    Breakdown
                  </button>
                  <button
                    onClick={() => setActiveTab('budgets')}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'budgets'
                        ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-b-2 border-teal-500'
                        : 'text-gray-600 hover:bg-teal-50/50'
                    }`}
                  >
                    <Target className="w-4 h-4 mx-auto mb-1" />
                    Budgets
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Category Breakdown</h3>
                    <CategoryBreakdown stats={stats} />
                  </>
                )}

                {activeTab === 'budgets' && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Budget Progress</h3>
                    <BudgetOverview
                      transactions={transactions}
                      categories={categories}
                      currentMonth={currentMonth}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddTransactionModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTransaction}
        />
      )}
    </div>
  );
}

export default App;
