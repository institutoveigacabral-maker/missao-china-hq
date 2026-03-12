import { Loader2, Package, Search, Database } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]} ${className}`} />
  );
};

interface LoadingCardProps {
  title?: string;
  subtitle?: string;
  icon?: 'package' | 'search' | 'database' | 'default';
}

export const LoadingCard = ({ 
  title = 'Carregando...', 
  subtitle,
  icon = 'default' 
}: LoadingCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'package':
        return <Package className="w-8 h-8 text-blue-600 animate-pulse" />;
      case 'search':
        return <Search className="w-8 h-8 text-blue-600 animate-pulse" />;
      case 'database':
        return <Database className="w-8 h-8 text-blue-600 animate-pulse" />;
      default:
        return <LoadingSpinner size="lg" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        {getIcon()}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="text-slate-600 text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton = ({ className = '', lines = 1 }: SkeletonProps) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-slate-200 rounded ${className} ${
            index > 0 ? 'mt-2' : ''
          }`}
        />
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-slate-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const LoadingButton = ({ 
  loading = false, 
  children, 
  className = '',
  onClick,
  disabled = false
}: LoadingButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center justify-center space-x-2 transition-all duration-200 ${
        loading || disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:opacity-90'
      } ${className}`}
    >
      {loading && <LoadingSpinner size="sm" />}
      <span>{children}</span>
    </button>
  );
};
