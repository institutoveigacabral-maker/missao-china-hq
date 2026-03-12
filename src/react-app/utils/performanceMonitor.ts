// Performance monitoring utilities for production optimization

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((entryList) => {
        let cls = 0;
        entryList.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        });
        this.metrics.cls = cls;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported');
    }

    // First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    } catch (e) {
      console.warn('FCP observer not supported');
    }

    // Navigation timing for TTFB
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      }
    });
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      console.log('First Contentful Paint (FCP):', this.metrics.fcp ? `${this.metrics.fcp.toFixed(2)}ms` : 'Not measured');
      console.log('Largest Contentful Paint (LCP):', this.metrics.lcp ? `${this.metrics.lcp.toFixed(2)}ms` : 'Not measured');
      console.log('First Input Delay (FID):', this.metrics.fid ? `${this.metrics.fid.toFixed(2)}ms` : 'Not measured');
      console.log('Cumulative Layout Shift (CLS):', this.metrics.cls ? this.metrics.cls.toFixed(4) : 'Not measured');
      console.log('Time to First Byte (TTFB):', this.metrics.ttfb ? `${this.metrics.ttfb.toFixed(2)}ms` : 'Not measured');
      console.groupEnd();
    }
  }

  public reportToAnalytics(endpoint?: string): void {
    if (!endpoint || process.env.NODE_ENV !== 'production') return;

    const metrics = this.getMetrics();
    
    // Only send if we have meaningful data
    if (Object.keys(metrics).length > 0) {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          url: window.location.pathname,
        }),
      }).catch(() => {
        // Silently fail analytics reporting
      });
    }
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-log metrics after page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.logMetrics();
    }, 2000);
  });
}
