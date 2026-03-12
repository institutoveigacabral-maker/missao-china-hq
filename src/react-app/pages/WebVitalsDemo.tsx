import { useState } from 'react';
import { Card } from '@/react-app/components/ui/Card';
import Button from '@/react-app/components/ui/Button';
import { Badge } from '@/react-app/components/ui/Badge';
import { WebVitalsMonitor } from '@/react-app/components/WebVitalsMonitor';
import { useWebVitals } from '@/react-app/utils/webVitalsMonitor';
import { useWebVitalsAnalytics } from '@/react-app/hooks/useWebVitalsAnalytics';
import { 
  Activity, 
  Zap, 
  Eye, 
  Clock, 
  Gauge, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  BarChart3,
  Settings
} from 'lucide-react';

export default function WebVitalsDemo() {
  const { metrics, report } = useWebVitals();
  const { analytics, exportData, resetData, sendAnalytics, isTracking } = useWebVitalsAnalytics({
    trackingEnabled: true,
    sampleInterval: 3000,
    maxSamples: 50
  });

  const [simulateLoad, setSimulateLoad] = useState(false);
  const [viewMode, setViewMode] = useState<'current' | 'analytics'>('current');

  // Simulate performance impact for demo
  const simulatePerformanceImpact = () => {
    setSimulateLoad(true);
    
    // Create heavy DOM manipulation to affect CLS and LCP
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100px';
    container.style.background = 'red';
    container.style.zIndex = '9999';
    
    document.body.appendChild(container);
    
    // Heavy computation to affect FID/INP
    const start = performance.now();
    while (performance.now() - start < 200) {
      // Block main thread
    }
    
    setTimeout(() => {
      document.body.removeChild(container);
      setSimulateLoad(false);
    }, 1000);
  };

  const getMetricIcon = (name: keyof typeof metrics) => {
    switch (name) {
      case 'CLS': return Target;
      case 'FID': return Zap;
      case 'FCP': return Eye;
      case 'LCP': return Activity;
      case 'TTFB': return Clock;
      case 'INP': return Gauge;
      default: return Activity;
    }
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good': return 'text-green-500';
      case 'needs-improvement': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getScoreIcon = (score: string) => {
    switch (score) {
      case 'good': return CheckCircle;
      case 'needs-improvement': return AlertCircle;
      case 'poor': return AlertCircle;
      default: return HelpCircle;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'degrading': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-500';
      case 'degrading': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatValue = (name: keyof typeof metrics, value: number | null) => {
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

  const getMetricDescription = (name: keyof typeof metrics) => {
    switch (name) {
      case 'CLS':
        return 'Measures visual stability - how much content shifts during page load';
      case 'FID':
        return 'Measures interactivity - delay between first user interaction and browser response';
      case 'FCP':
        return 'Measures loading - time until first content appears';
      case 'LCP':
        return 'Measures loading - time until largest content element appears';
      case 'TTFB':
        return 'Measures server responsiveness - time until first byte received';
      case 'INP':
        return 'Measures responsiveness - interaction delay throughout page lifecycle';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Core Web Vitals Monitor</h1>
          <p className="text-gray-600 mt-1">
            Real-time performance monitoring with analytics and recommendations
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('current')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'current' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Current
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'analytics' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Performance Score</h2>
          <div className="flex items-center gap-2">
            <Badge variant={report.overallScore >= 80 ? 'primary' : report.overallScore >= 60 ? 'secondary' : 'error'}>
              {report.overallScore >= 80 ? 'Good' : report.overallScore >= 60 ? 'Needs Improvement' : 'Poor'}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-gray-900">{report.overallScore}/100</span>
              {isTracking && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Activity className="w-4 h-4" />
                  <span>Session: {analytics.sessionData.length} samples</span>
                </div>
              )}
            </div>
            
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  report.overallScore >= 80 ? 'bg-green-500' : 
                  report.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${report.overallScore}%` }}
              />
            </div>
            
            {viewMode === 'analytics' && analytics.performanceScore > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Session Average: {analytics.performanceScore}/100
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Controls</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={simulatePerformanceImpact}
            disabled={simulateLoad}
            variant="secondary"
            className="flex items-center gap-2"
          >
            {simulateLoad ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Simulate Load
          </Button>
          
          <Button
            onClick={exportData}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          
          <Button
            onClick={resetData}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Analytics
          </Button>
          
          <Button
            onClick={sendAnalytics}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Send Analytics
          </Button>
        </div>
      </Card>

      {/* Core Metrics */}
      {viewMode === 'current' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(metrics).map(([key, value]) => {
            const name = key as keyof typeof metrics;
            const Icon = getMetricIcon(name);
            const ScoreIcon = getScoreIcon(report.scores[name]);
            
            return (
              <Card key={name} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{name}</h3>
                      <p className="text-sm text-gray-600">{getMetricDescription(name)}</p>
                    </div>
                  </div>
                  
                  <ScoreIcon className={`w-5 h-5 ${getScoreColor(report.scores[name])}`} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatValue(name, value)}
                    </span>
                    <Badge variant={
                      report.scores[name] === 'good' ? 'primary' : 
                      report.scores[name] === 'needs-improvement' ? 'secondary' : 'error'
                    }>
                      {report.scores[name] === 'good' ? 'Good' : 
                       report.scores[name] === 'needs-improvement' ? 'Needs Improvement' : 
                       report.scores[name] === 'poor' ? 'Poor' : 'Unknown'}
                    </Badge>
                  </div>
                  
                  {/* Benchmark indicators */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Good: &lt;{analytics.benchmarks[name].p50}</span>
                      <span>Poor: &gt;{analytics.benchmarks[name].p95}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                      <div className="bg-green-500 flex-1" />
                      <div className="bg-yellow-500 flex-1" />
                      <div className="bg-red-500 flex-1" />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(analytics.averages).map(([key, value]) => {
            const name = key as keyof typeof metrics;
            const Icon = getMetricIcon(name);
            const TrendIcon = getTrendIcon(analytics.trends[name]);
            
            return (
              <Card key={name} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{name}</h3>
                      <p className="text-sm text-gray-600">Session Average</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendIcon className={`w-4 h-4 ${getTrendColor(analytics.trends[name])}`} />
                    <span className={`text-xs font-medium ${getTrendColor(analytics.trends[name])}`}>
                      {analytics.trends[name]}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatValue(name, value)}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Current: {formatValue(name, metrics[name])}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
          
          <div className="space-y-3">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Status */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Core Web Vitals</p>
              <p className="text-sm text-gray-600">Active monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Analytics</p>
              <p className="text-sm text-gray-600">{analytics.sessionData.length} data points</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Settings className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Real-time</p>
              <p className="text-sm text-gray-600">Auto-refresh enabled</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Floating Monitor */}
      <WebVitalsMonitor 
        enabled={true}
        position="bottom-right"
        compact={true}
      />
    </div>
  );
}
