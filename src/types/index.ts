export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  budgetAmount?: number;
}

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    amount: number;
    color: string;
    percentage: number;
  }[];
}
