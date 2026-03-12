interface ProgressIndicatorProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressIndicator({
  value,
  max = 100,
  size = 'md',
  color = 'blue',
  showPercentage = false,
  className = ''
}: ProgressIndicatorProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };
  
  const bgColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`relative w-full ${bgColorClasses[color]} rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className={`text-xs text-slate-600 mt-1 ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
}
