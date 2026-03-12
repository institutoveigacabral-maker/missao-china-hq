import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ChevronRight, Package, Factory, Shield, TrendingUp, TrendingDown, Minus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface MobileDataCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info';
  };
  icon?: 'package' | 'factory' | 'shield';
  onClick?: () => void;
  status?: 'active' | 'pending' | 'inactive';
  metadata?: Array<{
    label: string;
    value: string;
  }>;
}

export default function MobileDataCard({
  title,
  subtitle,
  value,
  change,
  changeType = 'neutral',
  badge,
  icon,
  onClick,
  status,
  metadata
}: MobileDataCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'package': return <Package className="w-5 h-5 text-blue-600" />;
      case 'factory': return <Factory className="w-5 h-5 text-green-600" />;
      case 'shield': return <Shield className="w-5 h-5 text-orange-600" />;
      default: return null;
    }
  };

  const getTrendIcon = () => {
    switch (changeType) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active': 
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': 
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'inactive': 
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-slate-500';
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md active:scale-98' : ''}`} onClick={onClick}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <div className="flex-1">
            <h3 className="font-medium text-slate-900 text-sm leading-tight">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {badge && (
            <Badge variant={badge.variant} size="sm">
              {badge.text}
            </Badge>
          )}
          {onClick && (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Value and Change */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          {change && (
            <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
              {getTrendIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
        {status && (
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            <span className="text-xs text-slate-500 capitalize">{status}</span>
          </div>
        )}
      </div>

      {/* Metadata */}
      {metadata && metadata.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-slate-100">
          {metadata.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-xs text-slate-500">{item.label}</span>
              <span className="text-xs font-medium text-slate-700">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
