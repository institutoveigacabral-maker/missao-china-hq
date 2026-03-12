// Core Web Vitals Monitoring
// Comprehensive performance monitoring system

import { useState, useEffect, useMemo } from 'react';

// Removed unused interface

export interface WebVitalsData {
  CLS: number | null;  // Cumulative Layout Shift
  FID: number | null;  // First Input Delay
  FCP: number | null;  // First Contentful Paint
  LCP: number | null;  // Largest Contentful Paint
  TTFB: number | null; // Time to First Byte
  INP: number | null;  // Interaction to Next Paint
}

export interface WebVitalsReport {
  metrics: WebVitalsData;
  scores: Record<keyof WebVitalsData, 'good' | 'needs-improvement' | 'poor' | 'unknown'>;
  recommendations: string[];
  overallScore: number;
  lastUpdated: number;
}

class WebVitalsMonitor {
  private metrics: WebVitalsData = {
    CLS: null,
    FID: null,
    FCP: null,
    LCP: null,
    TTFB: null,
    INP: null
  };
  
  private callbacks: Array<(metrics: WebVitalsData) => void> = [];
  private observer: PerformanceObserver | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined' || this.isInitialized) return;

    this.isInitialized = true;

    // Monitor various performance entries
    this.observePerformanceEntries();
    
    // Monitor Core Web Vitals using web-vitals library fallback
    this.monitorCoreWebVitals();
    
    // Monitor custom metrics
    this.monitorCustomMetrics();
    
    // Monitor resource loading
    this.monitorResourceTiming();

    // Initial TTFB calculation
    this.calculateInitialTTFB();
  }

  private observePerformanceEntries() {
    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      // Observe different types of performance entries
      const entryTypes = ['measure', 'mark', 'navigation', 'resource', 'paint'];
      
      for (const type of entryTypes) {
        try {
          this.observer.observe({ entryTypes: [type] });
        } catch (e) {
          // Some entry types might not be supported
          console.warn(`Performance entry type "${type}" not supported`);
        }
      }
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error);
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.updateMetric('FCP', entry.startTime);
        }
        break;
        
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        this.updateMetric('TTFB', navEntry.responseStart - navEntry.fetchStart);
        break;
        
      case 'largest-contentful-paint':
        this.updateMetric('LCP', entry.startTime);
        break;
        
      case 'first-input':
        const fidEntry = entry as any;
        this.updateMetric('FID', fidEntry.processingStart - fidEntry.startTime);
        break;
        
      case 'layout-shift':
        const clsEntry = entry as any;
        if (!clsEntry.hadRecentInput) {
          this.updateMetric('CLS', (this.metrics.CLS || 0) + clsEntry.value);
        }
        break;
    }
  }

  private calculateInitialTTFB() {
    // Calculate TTFB from navigation timing
    if ('performance' in window && 'timing' in window.performance) {
      const timing = window.performance.timing as any;
      if (timing.responseStart && timing.navigationStart) {
        const ttfb = timing.responseStart - timing.navigationStart;
        this.updateMetric('TTFB', ttfb);
      }
    }
  }

  private monitorCoreWebVitals() {
    // Fallback implementation for Core Web Vitals
    // In production, consider using the 'web-vitals' library
    
    // Monitor LCP
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.updateMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Fallback: use load event as LCP approximation
        window.addEventListener('load', () => {
          this.updateMetric('LCP', performance.now());
        });
      }

      // Monitor FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as any;
            this.updateMetric('FID', fidEntry.processingStart - fidEntry.startTime);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Fallback: measure first click/touch event
        let firstInteraction = true;
        const measureFirstInput = () => {
          if (firstInteraction) {
            this.updateMetric('FID', 0); // Approximation
            firstInteraction = false;
            window.removeEventListener('click', measureFirstInput);
            window.removeEventListener('touchstart', measureFirstInput);
          }
        };
        window.addEventListener('click', measureFirstInput);
        window.addEventListener('touchstart', measureFirstInput);
      }

      // Monitor CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const clsEntry = entry as any;
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value;
              this.updateMetric('CLS', clsValue);
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // No fallback for CLS - requires layout-shift API
      }

      // Monitor INP (Interaction to Next Paint)
      try {
        const inpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const inpEntry = entry as any;
            if (inpEntry.duration) {
              this.updateMetric('INP', inpEntry.duration);
            }
          }
        });
        inpObserver.observe({ entryTypes: ['event'] });
      } catch (e) {
        // Fallback: measure event handler timing
        this.measureEventTiming();
      }
    }
  }

  private measureEventTiming() {
    const eventTypes = ['click', 'touchstart', 'keydown'];
    
    eventTypes.forEach(eventType => {
      window.addEventListener(eventType, () => {
        const startTime = performance.now();
        
        requestAnimationFrame(() => {
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          // Update INP with the latest interaction duration
          if (duration > (this.metrics.INP || 0)) {
            this.updateMetric('INP', duration);
          }
        });
      });
    });
  }

  private monitorCustomMetrics() {
    // Monitor React hydration time
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        performance.mark('dom-content-loaded');
      });
    } else {
      performance.mark('dom-content-loaded');
    }

    // Monitor when React is ready
    window.addEventListener('load', () => {
      performance.mark('window-load');
      
      // Measure total load time
      try {
        performance.measure('total-load-time', 'navigationStart', 'window-load');
      } catch (e) {
        // Fallback if navigationStart mark doesn't exist
        performance.measure('total-load-time');
      }
    });

    // Monitor route changes (for SPA)
    this.monitorRouteChanges();
  }

  private monitorRouteChanges() {
    let currentPath = window.location.pathname;
    
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        const newPath = window.location.pathname;
        performance.mark(`route-change-${Date.now()}`);
        currentPath = newPath;
        
        // Reset some metrics for new route
        this.updateMetric('LCP', null);
        this.updateMetric('FCP', null);
        
        // Measure route change time
        setTimeout(() => {
          performance.mark(`route-complete-${Date.now()}`);
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private monitorResourceTiming() {
    // Monitor slow resources
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Flag slow resources (>2s)
            if (resourceEntry.duration > 2000) {
              console.warn('Slow resource detected:', {
                name: resourceEntry.name,
                duration: resourceEntry.duration,
                size: resourceEntry.transferSize
              });
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (e) {
        console.warn('Resource timing monitoring not supported');
      }
    }
  }

  private updateMetric(name: keyof WebVitalsData, value: number | null) {
    this.metrics[name] = value;
    this.notifyCallbacks();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development' && value !== null) {
      console.log(`📊 ${name}: ${value.toFixed(2)}${this.getMetricUnit(name)}`);
    }
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && value !== null) {
      this.sendToAnalytics(name, value);
    }
  }

  private getMetricUnit(name: keyof WebVitalsData): string {
    switch (name) {
      case 'CLS':
        return '';
      case 'FID':
      case 'FCP':
      case 'LCP':
      case 'TTFB':
      case 'INP':
        return 'ms';
      default:
        return '';
    }
  }

  private sendToAnalytics(metricName: string, value: number) {
    // Example: Send to Google Analytics 4
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', metricName, {
        custom_parameter_1: value,
        custom_parameter_2: 'core-web-vitals'
      });
    }

    // Example: Send to custom analytics endpoint
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric: metricName,
        value,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      })
    }).catch(() => {
      // Ignore analytics errors
    });
  }

  private notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback(this.metrics);
      } catch (error) {
        console.error('Web vitals callback error:', error);
      }
    });
  }

  // Public API
  getMetrics(): WebVitalsData {
    return { ...this.metrics };
  }

  onMetricUpdate(callback: (metrics: WebVitalsData) => void) {
    this.callbacks.push(callback);
    
    // Call immediately with current metrics
    callback(this.metrics);
    
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  generateReport(): WebVitalsReport {
    const scores: Record<keyof WebVitalsData, 'good' | 'needs-improvement' | 'poor' | 'unknown'> = {
      CLS: this.scoreMetric('CLS', this.metrics.CLS, [0.1, 0.25]),
      FID: this.scoreMetric('FID', this.metrics.FID, [100, 300]),
      FCP: this.scoreMetric('FCP', this.metrics.FCP, [1800, 3000]),
      LCP: this.scoreMetric('LCP', this.metrics.LCP, [2500, 4000]),
      TTFB: this.scoreMetric('TTFB', this.metrics.TTFB, [800, 1800]),
      INP: this.scoreMetric('INP', this.metrics.INP, [200, 500])
    };

    const recommendations = this.generateRecommendations(scores);
    const overallScore = this.calculateOverallScore(scores);

    return {
      metrics: this.metrics,
      scores,
      recommendations,
      overallScore,
      lastUpdated: Date.now()
    };
  }

  private scoreMetric(
    _name: keyof WebVitalsData,
    value: number | null,
    thresholds: [number, number]
  ): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
    if (value === null) return 'unknown';
    
    const [good, poor] = thresholds;
    
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  }

  private calculateOverallScore(scores: Record<keyof WebVitalsData, string>): number {
    const scoreValues = {
      'good': 100,
      'needs-improvement': 60,
      'poor': 20,
      'unknown': 0
    };

    const validScores = Object.values(scores).filter(score => score !== 'unknown');
    if (validScores.length === 0) return 0;

    const totalScore = validScores.reduce((sum, score) => sum + scoreValues[score as keyof typeof scoreValues], 0);
    return Math.round(totalScore / validScores.length);
  }

  private generateRecommendations(scores: Record<keyof WebVitalsData, string>): string[] {
    const recommendations: string[] = [];

    if (scores.LCP !== 'good') {
      recommendations.push('Optimize Largest Contentful Paint: Consider image optimization, server response times, and critical resource preloading');
    }

    if (scores.FID !== 'good') {
      recommendations.push('Improve First Input Delay: Reduce JavaScript execution time and consider code splitting');
    }

    if (scores.CLS !== 'good') {
      recommendations.push('Fix Cumulative Layout Shift: Set size attributes on images and reserve space for dynamic content');
    }

    if (scores.TTFB !== 'good') {
      recommendations.push('Improve Time to First Byte: Optimize server response time and consider CDN usage');
    }

    if (scores.FCP !== 'good') {
      recommendations.push('Optimize First Contentful Paint: Minimize render-blocking resources and improve critical path');
    }

    if (scores.INP !== 'good') {
      recommendations.push('Improve Interaction to Next Paint: Optimize event handlers and reduce main thread blocking');
    }

    return recommendations;
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.callbacks = [];
    this.isInitialized = false;
  }
}

// Global web vitals monitor instance
export const webVitalsMonitor = new WebVitalsMonitor();

// React hook for web vitals
export const useWebVitals = () => {
  const [metrics, setMetrics] = useState<WebVitalsData>({
    CLS: null,
    FID: null,
    FCP: null,
    LCP: null,
    TTFB: null,
    INP: null
  });

  useEffect(() => {
    const unsubscribe = webVitalsMonitor.onMetricUpdate(setMetrics);
    return unsubscribe;
  }, []);

  const report = useMemo(() => {
    return webVitalsMonitor.generateReport();
  }, [metrics]);

  return {
    metrics,
    report,
    getMetrics: webVitalsMonitor.getMetrics.bind(webVitalsMonitor)
  };
};

// Initialize web vitals monitoring
export const initWebVitals = () => {
  // Web vitals are automatically initialized when the module loads
  console.log('🚀 Web Vitals monitoring initialized');
};
