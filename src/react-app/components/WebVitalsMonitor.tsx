import React, { useState, useEffect } from 'react';
import { Activity, Zap, Eye, Clock, Gauge, Target, RefreshCw, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { useWebVitals, WebVitalsData } from '@/react-app/utils/webVitalsMonitor';

interface WebVitalsMonitorProps {
  enabled?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  compact?: boolean;
}

export const WebVitalsMonitor: React.FC<WebVitalsMonitorProps> = ({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  compact = false
}) => {
  const { metrics, report } = useWebVitals();
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Force re-render to update timestamps
      setIsExpanded(prev => prev);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);
  
  if (!enabled) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  const getMetricIcon = (name: keyof WebVitalsData) => {
    switch (name) {
      case 'CLS':
        return Target;
      case 'FID':
        return Zap;
      case 'FCP':
        return Eye;
      case 'LCP':
        return Activity;
      case 'TTFB':
        return Clock;
      case 'INP':
        return Gauge;
      default:
        return Activity;
    }
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good':
        return 'text-green-400';
      case 'needs-improvement':
        return 'text-yellow-400';
      case 'poor':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getScoreIcon = (score: string) => {
    switch (score) {
      case 'good':
        return CheckCircle;
      case 'needs-improvement':
        return AlertCircle;
      case 'poor':
        return AlertCircle;
      default:
        return HelpCircle;
    }
  };

  const formatValue = (name: keyof WebVitalsData, value: number | null) => {
    if (value === null) return 'N/A';
    
    switch (name) {
      case 'CLS':
        return value.toFixed(3);
      case 'FID':
      case 'FCP':
      case 'LCP':
      case 'TTFB':
      case 'INP':
        return `${value.toFixed(0)}ms`;
      default:
        return value.toFixed(1);
    }
  };

  const getMetricDescription = (name: keyof WebVitalsData) => {
    switch (name) {
      case 'CLS':
        return 'Cumulative Layout Shift - measures visual stability';
      case 'FID':
        return 'First Input Delay - measures interactivity';
      case 'FCP':
        return 'First Contentful Paint - measures loading';
      case 'LCP':
        return 'Largest Contentful Paint - measures loading';
      case 'TTFB':
        return 'Time to First Byte - measures server response';
      case 'INP':
        return 'Interaction to Next Paint - measures responsiveness';
      default:
        return '';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 max-w-sm`}>
      <div className="bg-black/90 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold">Web Vitals</span>
            <div className={`w-2 h-2 rounded-full ${
              report.overallScore >= 80 ? 'bg-green-400' : 
              report.overallScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-1 rounded ${autoRefresh ? 'text-blue-400' : 'text-gray-500'} hover:bg-gray-800`}
              title={autoRefresh ? 'Disable auto refresh' : 'Enable auto refresh'}
            >
              <RefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            
            {compact && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800"
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}
          </div>
        </div>

        {/* Overall Score */}
        {isExpanded && (
          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Overall Score</span>
              <span className={`text-lg font-bold ${
                report.overallScore >= 80 ? 'text-green-400' : 
                report.overallScore >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {report.overallScore}/100
              </span>
            </div>
            
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  report.overallScore >= 80 ? 'bg-green-400' : 
                  report.overallScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ width: `${report.overallScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="p-3">
          <div className="space-y-2">
            {Object.entries(metrics).map(([key, value]) => {
              const name = key as keyof WebVitalsData;
              const Icon = getMetricIcon(name);
              const ScoreIcon = getScoreIcon(report.scores[name]);
              
              return (
                <div key={name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3 h-3 text-blue-400" />
                    <span className="text-xs font-mono">{name}</span>
                    <ScoreIcon className={`w-3 h-3 ${getScoreColor(report.scores[name])}`} />
                  </div>
                  
                  <span className={`text-xs font-mono ${getScoreColor(report.scores[name])}`}>
                    {formatValue(name, value)}
                  </span>
                  
                  {/* Tooltip */}
                  {isExpanded && (
                    <div className="hidden group-hover:block absolute left-0 top-full mt-1 p-2 bg-gray-900 text-xs rounded shadow-lg z-10 max-w-xs">
                      {getMetricDescription(name)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        {isExpanded && report.recommendations.length > 0 && (
          <div className="p-3 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-2">Recommendations:</div>
            <div className="space-y-1">
              {report.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="text-xs text-gray-300 leading-relaxed">
                  • {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {isExpanded && (
          <div className="p-2 border-t border-gray-700 text-xs text-gray-500 text-center">
            Last updated: {new Date(report.lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

// Compact version for production
export const CompactWebVitalsMonitor: React.FC = () => {
  const { report } = useWebVitals();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Show after 3 seconds and hide after 10 seconds
    const showTimer = setTimeout(() => setIsVisible(true), 3000);
    const hideTimer = setTimeout(() => setIsVisible(false), 13000);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);
  
  if (!isVisible || process.env.NODE_ENV !== 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2">
        <Activity className="w-3 h-3" />
        <span>Score: {report.overallScore}/100</span>
        <div className={`w-2 h-2 rounded-full ${
          report.overallScore >= 80 ? 'bg-green-400' : 
          report.overallScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'
        }`} />
      </div>
    </div>
  );
};

// Performance debugging component for development
export const PerformanceMonitor: React.FC<{ enabled?: boolean }> = ({ 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  if (!enabled) return null;

  return (
    <WebVitalsMonitor 
      enabled={enabled}
      position="bottom-left"
      compact={false}
    />
  );
};
