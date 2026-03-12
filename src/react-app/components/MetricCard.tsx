import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MetricCardProps } from '@/shared/types';

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  trend = 'stable',
  className = ''
}: MetricCardProps & { className?: string }) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <Minus className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-slate-600 truncate pr-2">
          {title}
        </h3>
        {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" />}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
            {value}
          </span>
        </div>
        
        {change && (
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeColor()}`}>
            {getTrendIcon()}
            <span className="truncate">{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
