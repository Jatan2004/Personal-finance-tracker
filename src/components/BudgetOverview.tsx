import { Transaction, Category } from '../types';
import { formatCurrency } from '../utils/calculations';
import * as Icons from 'lucide-react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface BudgetOverviewProps {
  transactions: Transaction[];
  categories: Category[];
  currentMonth: string;
}

export default function BudgetOverview({ transactions, categories, currentMonth }: BudgetOverviewProps) {
  const [year, month] = currentMonth.split('-');

  const monthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getFullYear() === parseInt(year) &&
           tDate.getMonth() === parseInt(month) - 1 &&
           t.type === 'expense';
  });

  const categoriesWithBudget = categories.filter(c => c.budgetAmount && c.budgetAmount > 0);

  if (categoriesWithBudget.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No budgets set yet
      </div>
    );
  }

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as any;
    return IconComponent || Icons.Circle;
  };

  const budgetData = categoriesWithBudget.map(category => {
    const spent = monthTransactions
      .filter(t => t.categoryId === category.id)
      .reduce((sum, t) => sum + t.amount, 0);

    const budget = category.budgetAmount || 0;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    const remaining = budget - spent;
    const isOverBudget = spent > budget;

    return {
      category,
      spent,
      budget,
      percentage: Math.min(percentage, 100),
      remaining,
      isOverBudget,
    };
  });

  return (
    <div className="space-y-4">
      {budgetData.map(({ category, spent, budget, percentage, remaining, isOverBudget }) => {
        const Icon = getIcon(category.icon);

        return (
          <div key={category.id} className="bg-gradient-to-br from-teal-50/50 to-cyan-50/30 rounded-lg p-4 border border-teal-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(spent)} of {formatCurrency(budget)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOverBudget ? (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    isOverBudget ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {isOverBudget ? 'Over' : 'Left'}: {formatCurrency(Math.abs(remaining))}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
