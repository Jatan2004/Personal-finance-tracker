import { MonthlyStats } from '../types';
import { formatCurrency } from '../utils/calculations';

interface CategoryBreakdownProps {
  stats: MonthlyStats;
}

export default function CategoryBreakdown({ stats }: CategoryBreakdownProps) {
  if (stats.categoryBreakdown.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No expense data for this month
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stats.categoryBreakdown.map((category) => (
        <div key={category.categoryId} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium text-gray-900">{category.categoryName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-600">{category.percentage.toFixed(1)}%</span>
              <span className="font-semibold text-gray-900 min-w-[80px] text-right">
                {formatCurrency(category.amount)}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${category.percentage}%`,
                backgroundColor: category.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
