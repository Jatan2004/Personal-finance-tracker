import { Category } from '../types';

export const defaultCategories: Omit<Category, 'id'>[] = [
  { name: 'Salary', type: 'income', color: '#10b981', icon: 'briefcase' },
  { name: 'Freelance', type: 'income', color: '#059669', icon: 'laptop' },
  { name: 'Investments', type: 'income', color: '#34d399', icon: 'trending-up' },
  { name: 'Other Income', type: 'income', color: '#6ee7b7', icon: 'plus-circle' },

  { name: 'Groceries', type: 'expense', color: '#f59e0b', icon: 'shopping-cart', budgetAmount: 500 },
  { name: 'Dining Out', type: 'expense', color: '#d97706', icon: 'utensils', budgetAmount: 200 },
  { name: 'Transportation', type: 'expense', color: '#3b82f6', icon: 'car', budgetAmount: 150 },
  { name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: 'film', budgetAmount: 100 },
  { name: 'Shopping', type: 'expense', color: '#ec4899', icon: 'shopping-bag', budgetAmount: 300 },
  { name: 'Bills & Utilities', type: 'expense', color: '#ef4444', icon: 'file-text', budgetAmount: 400 },
  { name: 'Healthcare', type: 'expense', color: '#06b6d4', icon: 'heart', budgetAmount: 150 },
  { name: 'Education', type: 'expense', color: '#14b8a6', icon: 'book', budgetAmount: 200 },
  { name: 'Other Expenses', type: 'expense', color: '#64748b', icon: 'more-horizontal' },
];
