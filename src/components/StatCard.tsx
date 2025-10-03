import { Video as LucideIcon } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'green' | 'red' | 'blue';
}

export default function StatCard({ title, amount, icon: Icon, trend, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    red: 'bg-rose-50 text-rose-600 border-rose-200',
    blue: 'bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-600 border-teal-200',
  };

  const textColorClasses = {
    green: 'text-emerald-900',
    red: 'text-rose-900',
    blue: 'bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent',
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-teal-100 p-6 hover:shadow-lg transition-all hover:scale-105">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColorClasses[color]} mb-2`}>
            {formatCurrency(amount)}
          </p>
          {trend && (
            <p className={`text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
