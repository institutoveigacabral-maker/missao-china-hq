import { useEffect, useState, useCallback } from 'react';
import { useWebVitals, WebVitalsData } from '@/react-app/utils/webVitalsMonitor';

interface WebVitalsAnalytics {
  sessionData: WebVitalsData[];
  averages: WebVitalsData;
  trends: Record<keyof WebVitalsData, 'improving' | 'stable' | 'degrading'>;
  insights: string[];
  performanceScore: number;
  benchmarks: Record<keyof WebVitalsData, { p50: number; p90: number; p95: number }>;
}

interface UseWebVitalsAnalyticsOptions {
  trackingEnabled?: boolean;
  sampleInterval?: number;
  maxSamples?: number;
  enableBenchmarking?: boolean;
}

export const useWebVitalsAnalytics = (options: UseWebVitalsAnalyticsOptions = {}) => {
  const {
    trackingEnabled = true,
    sampleInterval = 5000,
    maxSamples = 100
  } = options;

  const { metrics, report } = useWebVitals();
  const [analytics, setAnalytics] = useState<WebVitalsAnalytics>({
    sessionData: [],
    averages: {
      CLS: null,
      FID: null,
      FCP: null,
      LCP: null,
      TTFB: null,
      INP: null
    },
    trends: {
      CLS: 'stable',
      FID: 'stable',
      FCP: 'stable',
      LCP: 'stable',
      TTFB: 'stable',
      INP: 'stable'
    },
    insights: [],
    performanceScore: 0,
    benchmarks: {
      CLS: { p50: 0.1, p90: 0.15, p95: 0.25 },
      FID: { p50: 50, p90: 100, p95: 300 },
      FCP: { p50: 1200, p90: 1800, p95: 3000 },
      LCP: { p50: 1500, p90: 2500, p95: 4000 },
      TTFB: { p50: 200, p90: 800, p95: 1800 },
      INP: { p50: 100, p90: 200, p95: 500 }
    }
  });

  // Sample metrics periodically
  useEffect(() => {
    if (!trackingEnabled) return;

    const interval = setInterval(() => {
      setAnalytics(prev => {
        const newData = [...prev.sessionData];
        
        // Add new sample
        const hasValidMetrics = Object.values(metrics).some(value => value !== null);
        if (hasValidMetrics) {
          newData.push({ ...metrics, timestamp: Date.now() } as WebVitalsData & { timestamp: number });
        }
        
        // Keep only recent samples
        if (newData.length > maxSamples) {
          newData.splice(0, newData.length - maxSamples);
        }

        return {
          ...prev,
          sessionData: newData
        };
      });
    }, sampleInterval);

    return () => clearInterval(interval);
  }, [trackingEnabled, sampleInterval, maxSamples, metrics]);

  // Calculate analytics when data changes
  useEffect(() => {
    if (analytics.sessionData.length < 2) return;

    const calculateAverages = (): WebVitalsData => {
      const validData = analytics.sessionData.filter(sample => 
        Object.values(sample).some(value => value !== null)
      );

      if (validData.length === 0) {
        return {
          CLS: null,
          FID: null,
          FCP: null,
          LCP: null,
          TTFB: null,
          INP: null
        };
      }

      const averages: Partial<WebVitalsData> = {};
      
      (Object.keys(metrics) as Array<keyof WebVitalsData>).forEach(key => {
        const values = validData
          .map(sample => sample[key])
          .filter((value): value is number => value !== null);
        
        if (values.length > 0) {
          averages[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
        } else {
          averages[key] = null;
        }
      });

      return averages as WebVitalsData;
    };

    const calculateTrends = (): Record<keyof WebVitalsData, 'improving' | 'stable' | 'degrading'> => {
      const trends: Partial<Record<keyof WebVitalsData, 'improving' | 'stable' | 'degrading'>> = {};
      
      if (analytics.sessionData.length < 10) {
        // Not enough data for trend analysis
        (Object.keys(metrics) as Array<keyof WebVitalsData>).forEach(key => {
          trends[key] = 'stable';
        });
        return trends as Record<keyof WebVitalsData, 'improving' | 'stable' | 'degrading'>;
      }

      const recent = analytics.sessionData.slice(-5);
      const older = analytics.sessionData.slice(-10, -5);

      (Object.keys(metrics) as Array<keyof WebVitalsData>).forEach(key => {
        const recentValues = recent
          .map(sample => sample[key])
          .filter((value): value is number => value !== null);
        
        const olderValues = older
          .map(sample => sample[key])
          .filter((value): value is number => value !== null);

        if (recentValues.length === 0 || olderValues.length === 0) {
          trends[key] = 'stable';
          return;
        }

        const recentAvg = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
        const olderAvg = olderValues.reduce((sum, val) => sum + val, 0) / olderValues.length;

        const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;

        // For CLS, lower is better; for others, lower is also generally better
        if (Math.abs(percentChange) < 5) {
          trends[key] = 'stable';
        } else if (percentChange < 0) {
          trends[key] = 'improving';
        } else {
          trends[key] = 'degrading';
        }
      });

      return trends as Record<keyof WebVitalsData, 'improving' | 'stable' | 'degrading'>;
    };

    const generateInsights = (): string[] => {
      const insights: string[] = [];
      const avgData = calculateAverages();
      const trendData = calculateTrends();

      // Performance insights based on current metrics
      if (avgData.LCP !== null && avgData.LCP > 4000) {
        insights.push('LCP is consistently slow - consider image optimization and lazy loading');
      }

      if (avgData.CLS !== null && avgData.CLS > 0.25) {
        insights.push('High CLS detected - review layout shifts and reserve space for dynamic content');
      }

      if (avgData.FID !== null && avgData.FID > 300) {
        insights.push('FID is high - consider reducing JavaScript execution time');
      }

      if (avgData.TTFB !== null && avgData.TTFB > 1800) {
        insights.push('TTFB is slow - optimize server response time or consider CDN');
      }

      // Trend insights
      Object.entries(trendData).forEach(([key, trend]) => {
        if (trend === 'degrading') {
          insights.push(`${key} performance is degrading over this session`);
        } else if (trend === 'improving') {
          insights.push(`${key} performance is improving - good job!`);
        }
      });

      // Session insights
      if (analytics.sessionData.length > 50) {
        insights.push('Long session detected - monitoring for performance degradation');
      }

      return insights.slice(0, 5); // Limit to top 5 insights
    };

    const calculatePerformanceScore = (): number => {
      const weights = {
        CLS: 0.15,
        FID: 0.20,
        FCP: 0.15,
        LCP: 0.25,
        TTFB: 0.15,
        INP: 0.10
      };

      let totalScore = 0;
      let totalWeight = 0;

      Object.entries(report.scores).forEach(([key, score]) => {
        const weight = weights[key as keyof typeof weights];
        const scoreValue = score === 'good' ? 100 : score === 'needs-improvement' ? 60 : score === 'poor' ? 20 : 0;
        
        if (score !== 'unknown') {
          totalScore += scoreValue * weight;
          totalWeight += weight;
        }
      });

      return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    };

    setAnalytics(prev => ({
      ...prev,
      averages: calculateAverages(),
      trends: calculateTrends(),
      insights: generateInsights(),
      performanceScore: calculatePerformanceScore()
    }));
  }, [analytics.sessionData, report.scores]);

  // Export data for analysis
  const exportData = useCallback(() => {
    const data = {
      sessionData: analytics.sessionData,
      averages: analytics.averages,
      trends: analytics.trends,
      insights: analytics.insights,
      performanceScore: analytics.performanceScore,
      sessionInfo: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionDuration: analytics.sessionData.length * sampleInterval
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `web-vitals-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [analytics, sampleInterval]);

  // Reset analytics data
  const resetData = useCallback(() => {
    setAnalytics(prev => ({
      ...prev,
      sessionData: [],
      averages: {
        CLS: null,
        FID: null,
        FCP: null,
        LCP: null,
        TTFB: null,
        INP: null
      },
      trends: {
        CLS: 'stable',
        FID: 'stable',
        FCP: 'stable',
        LCP: 'stable',
        TTFB: 'stable',
        INP: 'stable'
      },
      insights: []
    }));
  }, []);

  // Send analytics to backend
  const sendAnalytics = useCallback(async () => {
    if (!trackingEnabled || analytics.sessionData.length === 0) return;

    try {
      await fetch('/api/analytics/web-vitals-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionData: analytics.sessionData,
          averages: analytics.averages,
          performanceScore: analytics.performanceScore,
          url: window.location.href,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.warn('Failed to send web vitals analytics:', error);
    }
  }, [trackingEnabled, analytics]);

  return {
    analytics,
    exportData,
    resetData,
    sendAnalytics,
    isTracking: trackingEnabled && analytics.sessionData.length > 0
  };
};
