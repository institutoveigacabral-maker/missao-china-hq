export interface ChunkAnalysis {
  name: string;
  size: number;
  gzipSize?: number;
  isVendor: boolean;
  isLazy: boolean;
  loadTime?: number;
  dependencies?: string[];
}

export interface BundleMetrics {
  totalSize: number;
  totalGzipSize: number;
  chunkCount: number;
  vendorSize: number;
  applicationSize: number;
  lazyChunks: number;
  duplicateModules: string[];
  largeDependencies: string[];
}

export interface LoadingStrategy {
  preload: string[];
  prefetch: string[];
  defer: string[];
}

class BundleOptimizer {
  private loadingStats: Record<string, number> = {};
  private chunkSizes: Record<string, ChunkAnalysis> = {};
  private performanceEntries: PerformanceEntry[] = [];
  private duplicateDetection: Map<string, string[]> = new Map();

  constructor() {
    this.initializePerformanceMonitoring();
    this.analyzeDynamicImports();
  }

  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      this.performanceEntries.push(...entries);
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation' || entry.entryType === 'resource') {
          this.analyzeResourceEntry(entry as PerformanceResourceTiming);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation', 'resource'] });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }

    // Monitor chunk loading
    this.monitorChunkLoading();
  }

  private analyzeResourceEntry(entry: PerformanceResourceTiming): void {
    const url = entry.name;
    const duration = entry.responseEnd - entry.startTime;

    // Identify chunks by their naming pattern
    if (url.includes('/assets/') && url.endsWith('.js')) {
      const chunkName = this.extractChunkName(url);
      this.loadingStats[chunkName] = duration;

      // Estimate size from transfer time and connection
      const transferSize = entry.transferSize || 0;
      if (transferSize > 0 && !this.chunkSizes[chunkName]) {
        this.chunkSizes[chunkName] = {
          name: chunkName,
          size: transferSize,
          isVendor: this.isVendorChunk(chunkName),
          isLazy: this.isLazyChunk(chunkName),
          loadTime: duration,
        };
      }
    }
  }

  private extractChunkName(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const name = filename.split('-')[0] || filename.split('.')[0];
    return name;
  }

  private isVendorChunk(chunkName: string): boolean {
    return chunkName.includes('vendor') || 
           chunkName.includes('react') || 
           chunkName.includes('router') ||
           chunkName.includes('ui-vendor') ||
           chunkName.includes('charts');
  }

  private isLazyChunk(chunkName: string): boolean {
    return chunkName.includes('page-') || 
           chunkName.includes('components-') ||
           chunkName.includes('lazy');
  }

  private monitorChunkLoading(): void {
    if (typeof window === 'undefined') return;

    // Hook into dynamic imports
    // const originalImport = (window as any).__vitePreload || (() => {});
    
    // Monitor webpack/vite chunk loading
    const originalJsonp = (window as any).__webpack_require__;
    if (originalJsonp) {
      this.hookWebpackChunks(originalJsonp);
    }
  }

  private hookWebpackChunks(webpackRequire: any): void {
    const originalEnsure = webpackRequire.e;
    if (originalEnsure) {
      webpackRequire.e = (chunkId: string) => {
        const startTime = performance.now();
        return originalEnsure.call(webpackRequire, chunkId).then((result: any) => {
          const loadTime = performance.now() - startTime;
          this.loadingStats[`chunk-${chunkId}`] = loadTime;
          return result;
        });
      };
    }
  }

  private analyzeDynamicImports(): void {
    if (typeof window === 'undefined') return;

    // Track React.lazy components
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'SCRIPT' && element.getAttribute('src')?.includes('/assets/')) {
              const src = element.getAttribute('src')!;
              const chunkName = this.extractChunkName(src);
              this.markAsLazyLoaded(chunkName);
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private markAsLazyLoaded(chunkName: string): void {
    if (this.chunkSizes[chunkName]) {
      this.chunkSizes[chunkName].isLazy = true;
    }
  }

  public analyzeBundles(): ChunkAnalysis[] {
    const chunks: ChunkAnalysis[] = [];

    // Analyze from performance entries
    this.performanceEntries.forEach((entry) => {
      if (entry.entryType === 'resource' && entry.name.includes('/assets/') && entry.name.endsWith('.js')) {
        const chunkName = this.extractChunkName(entry.name);
        const resourceEntry = entry as PerformanceResourceTiming;
        
        if (!chunks.find(c => c.name === chunkName)) {
          chunks.push({
            name: chunkName,
            size: resourceEntry.transferSize || 0,
            gzipSize: resourceEntry.encodedBodySize || undefined,
            isVendor: this.isVendorChunk(chunkName),
            isLazy: this.isLazyChunk(chunkName),
            loadTime: resourceEntry.responseEnd - resourceEntry.startTime,
          });
        }
      }
    });

    // Add cached chunk sizes
    Object.values(this.chunkSizes).forEach((chunk) => {
      if (!chunks.find(c => c.name === chunk.name)) {
        chunks.push(chunk);
      }
    });

    return chunks.sort((a, b) => b.size - a.size);
  }

  public getLoadingStats(): Record<string, number> {
    return { ...this.loadingStats };
  }

  public getBundleMetrics(): BundleMetrics {
    const chunks = this.analyzeBundles();
    
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    const totalGzipSize = chunks.reduce((sum, chunk) => sum + (chunk.gzipSize || chunk.size * 0.3), 0);
    const vendorSize = chunks.filter(c => c.isVendor).reduce((sum, chunk) => sum + chunk.size, 0);
    const applicationSize = totalSize - vendorSize;
    const lazyChunks = chunks.filter(c => c.isLazy).length;

    return {
      totalSize,
      totalGzipSize,
      chunkCount: chunks.length,
      vendorSize,
      applicationSize,
      lazyChunks,
      duplicateModules: this.detectDuplicateModules(),
      largeDependencies: this.findLargeDependencies(chunks),
    };
  }

  private detectDuplicateModules(): string[] {
    // Simplified duplicate detection
    const modules = Array.from(this.duplicateDetection.keys());
    return modules.filter(module => {
      const chunks = this.duplicateDetection.get(module) || [];
      return chunks.length > 1;
    });
  }

  private findLargeDependencies(chunks: ChunkAnalysis[]): string[] {
    return chunks
      .filter(chunk => chunk.size > 100000) // > 100KB
      .map(chunk => chunk.name)
      .slice(0, 5); // Top 5
  }

  public getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const metrics = this.getBundleMetrics();
    const chunks = this.analyzeBundles();

    // Large bundle warning
    if (metrics.totalSize > 2000000) { // > 2MB
      suggestions.push('Total bundle size is large. Consider code splitting.');
    }

    // Vendor chunk optimization
    if (metrics.vendorSize > metrics.applicationSize * 2) {
      suggestions.push('Vendor chunks are significantly larger than app code. Consider vendor splitting.');
    }

    // Lazy loading suggestions
    const nonLazyPages = chunks.filter(c => c.name.includes('page-') && !c.isLazy);
    if (nonLazyPages.length > 0) {
      suggestions.push(`Consider lazy loading: ${nonLazyPages.map(c => c.name).join(', ')}`);
    }

    // Large individual chunks
    const largeChunks = chunks.filter(c => c.size > 500000); // > 500KB
    if (largeChunks.length > 0) {
      suggestions.push(`Large chunks detected: ${largeChunks.map(c => c.name).join(', ')}`);
    }

    // Duplicate modules
    if (metrics.duplicateModules.length > 0) {
      suggestions.push(`Potential duplicate modules: ${metrics.duplicateModules.slice(0, 3).join(', ')}`);
    }

    // Slow loading chunks
    const slowChunks = chunks.filter(c => c.loadTime && c.loadTime > 1000);
    if (slowChunks.length > 0) {
      suggestions.push(`Slow loading chunks (>1s): ${slowChunks.map(c => c.name).join(', ')}`);
    }

    return suggestions;
  }

  public generateLoadingStrategy(): LoadingStrategy {
    const chunks = this.analyzeBundles();
    
    const strategy: LoadingStrategy = {
      preload: [],
      prefetch: [],
      defer: [],
    };

    chunks.forEach((chunk) => {
      // Critical vendor chunks should be preloaded
      if (chunk.isVendor && chunk.name.includes('react')) {
        strategy.preload.push(chunk.name);
      }
      // Large lazy chunks should be prefetched
      else if (chunk.isLazy && chunk.size > 100000) {
        strategy.prefetch.push(chunk.name);
      }
      // Non-critical chunks can be deferred
      else if (!chunk.isVendor && chunk.size < 50000) {
        strategy.defer.push(chunk.name);
      }
    });

    return strategy;
  }

  public optimizeResourceHints(): void {
    if (typeof document === 'undefined') return;

    const strategy = this.generateLoadingStrategy();
    const head = document.head;

    // Add preload hints
    strategy.preload.forEach((chunk) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = `/assets/chunks/${chunk}.js`;
      head.appendChild(link);
    });

    // Add prefetch hints
    strategy.prefetch.forEach((chunk) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/assets/chunks/${chunk}.js`;
      head.appendChild(link);
    });
  }

  public trackChunkUsage(chunkName: string): void {
    const startTime = performance.now();
    
    // Track when chunk is actually used
    requestIdleCallback(() => {
      const endTime = performance.now();
      const usageTime = endTime - startTime;
      
      if (this.chunkSizes[chunkName]) {
        this.chunkSizes[chunkName].loadTime = usageTime;
      }
    });
  }

  public reset(): void {
    this.loadingStats = {};
    this.chunkSizes = {};
    this.performanceEntries = [];
    this.duplicateDetection.clear();
  }
}

export const bundleOptimizer = new BundleOptimizer();
