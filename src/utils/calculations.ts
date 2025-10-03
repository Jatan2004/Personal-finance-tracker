import { Transaction, Category, MonthlyStats } from '../types';

export const calculateMonthlyStats = (
  transactions: Transaction[],
  categories: Category[],
  month: string
): MonthlyStats => {
  const [year, monthNum] = month.split('-');

  const monthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getFullYear() === parseInt(year) &&
           tDate.getMonth() === parseInt(monthNum) - 1;
  });

  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = new Map<string, number>();

  monthTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const current = categoryTotals.get(t.categoryId) || 0;
      categoryTotals.set(t.categoryId, current + t.amount);
    });

  const categoryBreakdown = Array.from(categoryTotals.entries())
    .map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || 'Unknown',
        amount,
        color: category?.color || '#64748b',
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    categoryBreakdown,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getMonthName = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};
