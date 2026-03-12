import { lazy, Suspense, ComponentType, LazyExoticComponent } from 'react';
import { Skeleton } from '../components/Loading/Skeleton';

// Performance monitoring for lazy components
const componentLoadTimes = new Map<string, number>();
const componentErrorCounts = new Map<string, number>();

interface LazyComponentOptions {
  fallback?: React.ReactNode;
  retryCount?: number;
  timeout?: number;
  preload?: boolean;
  chunkName?: string;
}

// Enhanced lazy component wrapper with performance tracking
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<T> {
  const {
    fallback = <Skeleton className="h-64" />,
    retryCount = 3,
    timeout = 30000,
    preload = false,
    chunkName = 'unknown'
  } = options;

  let retries = 0;
  const startTime = performance.now();

  const enhancedImportFn = async (): Promise<{ default: T }> => {
    try {
      // Set timeout for chunk loading
      const loadPromise = importFn();
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Chunk load timeout')), timeout);
      });

      const result = await Promise.race([loadPromise, timeoutPromise]);
      
      // Track successful load time
      const loadTime = performance.now() - startTime;
      componentLoadTimes.set(chunkName, loadTime);
      
      // Track chunk usage for bundle optimizer
      if (typeof window !== 'undefined' && (window as any).bundleOptimizer) {
        (window as any).bundleOptimizer.trackChunkUsage(chunkName);
      }

      return result;
    } catch (error) {
      retries++;
      const errorCount = componentErrorCounts.get(chunkName) || 0;
      componentErrorCounts.set(chunkName, errorCount + 1);

      console.warn(`Failed to load chunk "${chunkName}" (attempt ${retries}/${retryCount + 1}):`, error);

      if (retries <= retryCount) {
        // Exponential backoff retry
        const delay = Math.min(1000 * Math.pow(2, retries - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return enhancedImportFn();
      }

      throw error;
    }
  };

  const LazyComponent = lazy(enhancedImportFn);

  // Preload if requested
  if (preload && typeof window !== 'undefined') {
    // Preload during idle time
    requestIdleCallback(() => {
      enhancedImportFn().catch(() => {
        // Silently handle preload failures
      });
    });
  }

  // Return wrapped component with Suspense
  const WrappedComponent = (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  // Preserve component name for debugging
  WrappedComponent.displayName = `Lazy(${chunkName})`;

  return WrappedComponent as any;
}

// Preload strategy for critical routes
export const preloadComponents = {
  dashboard: () => import('../pages/Home'),
  suppliers: () => import('../pages/Suppliers'),
  regulations: () => import('../pages/Regulations'),
  finance: () => import('../pages/Finance'),
};

// Intelligent preloading based on user behavior
export class ComponentPreloader {
  private preloadedComponents = new Set<string>();
  private userInteractions: string[] = [];
  private preloadThreshold = 0.6; // 60% confidence

  constructor() {
    this.initializePreloading();
  }

  private initializePreloading(): void {
    if (typeof window === 'undefined') return;

    // Preload on hover (link prefetch pattern)
    document.addEventListener('mouseover', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href.includes('/')) {
        const route = this.extractRoute(link.href);
        this.considerPreload(route);
      }
    });

    // Track user navigation patterns
    window.addEventListener('popstate', () => {
      const route = this.extractRoute(window.location.pathname);
      this.trackInteraction(route);
    });
  }

  private extractRoute(path: string): string {
    const segments = path.split('/');
    return segments[1] || 'home'; // First segment after domain
  }

  private trackInteraction(route: string): void {
    this.userInteractions.push(route);
    
    // Keep only recent interactions (last 10)
    if (this.userInteractions.length > 10) {
      this.userInteractions.shift();
    }

    // Predict next route and preload
    this.predictAndPreload();
  }

  private predictAndPreload(): void {
    const routeCounts = this.userInteractions.reduce((acc, route) => {
      acc[route] = (acc[route] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Find most likely next routes
    const totalInteractions = this.userInteractions.length;
    Object.entries(routeCounts).forEach(([route, count]) => {
      const confidence = count / totalInteractions;
      
      if (confidence >= this.preloadThreshold && !this.preloadedComponents.has(route)) {
        this.preloadComponent(route);
      }
    });
  }

  private preloadComponent(route: string): void {
    const preloadFn = preloadComponents[route as keyof typeof preloadComponents];
    
    if (preloadFn && !this.preloadedComponents.has(route)) {
      this.preloadedComponents.add(route);
      
      // Preload during idle time
      requestIdleCallback(() => {
        preloadFn().catch(() => {
          // Remove from preloaded set on failure
          this.preloadedComponents.delete(route);
        });
      });
    }
  }

  public considerPreload(route: string): void {
    // Immediate preload for critical routes on hover
    const criticalRoutes = ['dashboard', 'suppliers'];
    
    if (criticalRoutes.includes(route) && !this.preloadedComponents.has(route)) {
      this.preloadComponent(route);
    }
  }

  public getStats(): {
    preloadedCount: number;
    interactionCount: number;
    preloadedComponents: string[];
  } {
    return {
      preloadedCount: this.preloadedComponents.size,
      interactionCount: this.userInteractions.length,
      preloadedComponents: Array.from(this.preloadedComponents),
    };
  }
}

// Global preloader instance
export const componentPreloader = new ComponentPreloader();

// Lazy component definitions with intelligent preloading
export const LazyHome = createLazyComponent(
  () => import('../pages/Home'),
  { chunkName: 'page-home', preload: true }
);

export const LazySuppliers = createLazyComponent(
  () => import('../pages/Suppliers'),
  { chunkName: 'page-suppliers' }
);

export const LazyRegulations = createLazyComponent(
  () => import('../pages/Regulations'),
  { chunkName: 'page-regulations' }
);

export const LazyFinance = createLazyComponent(
  () => import('../pages/Finance'),
  { chunkName: 'page-finance' }
);

export const LazyLogistics = createLazyComponent(
  () => import('../pages/Logistics'),
  { chunkName: 'page-logistics' }
);

export const LazyCantonFair = createLazyComponent(
  () => import('../pages/CantonFair'),
  { chunkName: 'page-canton-fair' }
);

export const LazyIncoterms = createLazyComponent(
  () => import('../pages/Incoterms'),
  { chunkName: 'page-incoterms' }
);

export const LazyRiskRegister = createLazyComponent(
  () => import('../pages/RiskRegister'),
  { chunkName: 'page-risk-register' }
);

export const LazyWfoeStructure = createLazyComponent(
  () => import('../pages/WfoeStructure'),
  { chunkName: 'page-wfoe-structure' }
);

export const LazyPlaybookTechnical = createLazyComponent(
  () => import('../pages/PlaybookTechnical'),
  { chunkName: 'page-playbook-technical' }
);

// Demo pages with lazy loading
export const LazyBundleMonitorDemo = createLazyComponent(
  () => import('../pages/BundleMonitorDemo'),
  { chunkName: 'demo-bundle-monitor' }
);

export const LazyWebVitalsDemo = createLazyComponent(
  () => import('../pages/WebVitalsDemo'),
  { chunkName: 'demo-web-vitals' }
);

export const LazyNetworkOptimizationDemo = createLazyComponent(
  () => import('../pages/NetworkOptimizationDemo'),
  { chunkName: 'demo-network-optimization' }
);

export const LazyAdvancedPerformanceDemo = createLazyComponent(
  () => import('../pages/AdvancedPerformanceDemo'),
  { chunkName: 'demo-advanced-performance' }
);

// Utility functions for performance monitoring
export const getComponentLoadStats = () => {
  return Array.from(componentLoadTimes.entries()).map(([name, time]) => ({
    name,
    loadTime: time,
    errorCount: componentErrorCounts.get(name) || 0,
  }));
};

export const getSlowComponents = (threshold = 1000) => {
  return getComponentLoadStats().filter(component => component.loadTime > threshold);
};

export const getFailedComponents = () => {
  return getComponentLoadStats().filter(component => component.errorCount > 0);
};
