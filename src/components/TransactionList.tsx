import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/calculations';
import * as Icons from 'lucide-react';
import { Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, categories, onDelete }: TransactionListProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as any;
    return IconComponent || Icons.Circle;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <Icons.FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-lg">No transactions yet</p>
        <p className="text-gray-400 text-sm">Add your first transaction to get started</p>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-2">
      {sortedTransactions.map((transaction) => {
        const category = categories.find(c => c.id === transaction.categoryId);
        const Icon = category ? getIcon(category.icon) : Icons.Circle;

        return (
          <div
            key={transaction.id}
            className="bg-gradient-to-r from-white to-teal-50/30 rounded-lg border border-teal-100 p-4 hover:shadow-md transition-all group hover:border-teal-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="p-2.5 rounded-lg"
                  style={{ backgroundColor: `${category?.color}20`, color: category?.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-gray-500">{category?.name || 'Unknown'}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-lg font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete transaction"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
