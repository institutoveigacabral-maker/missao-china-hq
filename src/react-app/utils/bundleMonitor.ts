// Bundle size monitoring utility for development and production optimization

export interface BundleMetrics {
  totalSize: number;
  jsSize: number;
  cssSize: number;
  imageSize: number;
  fontSize: number;
  domContentLoadedTime: number;
  loadCompleteTime: number;
  totalLoadTime: number;
  resourceCount: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    total: number;
  };
  largestResources: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

export class BundleMonitor {
  private metrics: Partial<BundleMetrics> = {};
  private isMonitoring = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initMonitoring();
    }
  }

  private initMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Monitor when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.collectMetrics());
    } else {
      this.collectMetrics();
    }

    // Monitor when all resources are loaded
    window.addEventListener('load', () => this.reportBundleSize());
  }

  private collectMetrics() {
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      // Basic timing metrics
      if (navigation) {
        this.metrics.domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        this.metrics.loadCompleteTime = navigation.loadEventEnd - navigation.loadEventStart;
        this.metrics.totalLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      }

      // Resource analysis
      const jsResources = resources.filter(r => this.isJavaScript(r.name));
      const cssResources = resources.filter(r => this.isCSS(r.name));
      const imageResources = resources.filter(r => this.isImage(r.name));
      const fontResources = resources.filter(r => this.isFont(r.name));

      // Calculate sizes
      this.metrics.jsSize = this.calculateTotalSize(jsResources);
      this.metrics.cssSize = this.calculateTotalSize(cssResources);
      this.metrics.imageSize = this.calculateTotalSize(imageResources);
      this.metrics.fontSize = this.calculateTotalSize(fontResources);
      this.metrics.totalSize = this.metrics.jsSize + this.metrics.cssSize + this.metrics.imageSize + this.metrics.fontSize;

      // Resource counts
      this.metrics.resourceCount = {
        js: jsResources.length,
        css: cssResources.length,
        images: imageResources.length,
        fonts: fontResources.length,
        total: resources.length
      };

      // Find largest resources
      this.metrics.largestResources = resources
        .map(r => ({
          name: this.getResourceName(r.name),
          size: this.getResourceSize(r),
          type: this.getResourceType(r.name)
        }))
        .filter(r => r.size > 0)
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);

    } catch (error) {
      console.warn('Bundle monitoring failed:', error);
    }
  }

  private isJavaScript(name: string): boolean {
    return /\.(js|mjs|jsx|ts|tsx)(\?.*)?$/.test(name) || name.includes('.js');
  }

  private isCSS(name: string): boolean {
    return /\.(css)(\?.*)?$/.test(name) || name.includes('.css');
  }

  private isImage(name: string): boolean {
    return /\.(jpg|jpeg|png|gif|svg|webp|avif|ico)(\?.*)?$/.test(name);
  }

  private isFont(name: string): boolean {
    return /\.(woff|woff2|ttf|otf|eot)(\?.*)?$/.test(name);
  }

  private calculateTotalSize(resources: PerformanceResourceTiming[]): number {
    return resources.reduce((total, resource) => {
      return total + this.getResourceSize(resource);
    }, 0);
  }

  private getResourceSize(resource: PerformanceResourceTiming): number {
    // Try to get actual transfer size, fallback to encoded size
    return resource.transferSize || resource.encodedBodySize || resource.decodedBodySize || 0;
  }

  private getResourceName(fullName: string): string {
    try {
      const url = new URL(fullName);
      return url.pathname.split('/').pop() || url.pathname;
    } catch {
      return fullName.split('/').pop() || fullName;
    }
  }

  private getResourceType(name: string): string {
    if (this.isJavaScript(name)) return 'JavaScript';
    if (this.isCSS(name)) return 'CSS';
    if (this.isImage(name)) return 'Image';
    if (this.isFont(name)) return 'Font';
    return 'Other';
  }

  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private formatTime(ms: number): string {
    return `${ms.toFixed(2)}ms`;
  }

  public reportBundleSize(): void {
    if (process.env.NODE_ENV === 'development') {
      this.collectMetrics(); // Ensure we have latest data
      
      console.group('🚀 Bundle Performance Report');
      
      // Timing metrics
      if (this.metrics.domContentLoadedTime !== undefined) {
        console.log('📦 DOM Content Loaded:', this.formatTime(this.metrics.domContentLoadedTime));
      }
      if (this.metrics.loadCompleteTime !== undefined) {
        console.log('⚡ Load Complete:', this.formatTime(this.metrics.loadCompleteTime));
      }
      if (this.metrics.totalLoadTime !== undefined) {
        console.log('🔄 Total Load Time:', this.formatTime(this.metrics.totalLoadTime));
      }

      console.log(''); // Empty line for separation

      // Resource counts
      if (this.metrics.resourceCount) {
        console.log('📜 JavaScript bundles:', this.metrics.resourceCount.js);
        console.log('🎨 CSS bundles:', this.metrics.resourceCount.css);
        console.log('🖼️ Images:', this.metrics.resourceCount.images);
        console.log('🔤 Fonts:', this.metrics.resourceCount.fonts);
        console.log('📊 Total resources:', this.metrics.resourceCount.total);
      }

      console.log(''); // Empty line for separation

      // Size metrics
      if (this.metrics.jsSize !== undefined) {
        console.log('📦 JavaScript size:', this.formatSize(this.metrics.jsSize));
      }
      if (this.metrics.cssSize !== undefined) {
        console.log('🎨 CSS size:', this.formatSize(this.metrics.cssSize));
      }
      if (this.metrics.imageSize !== undefined && this.metrics.imageSize > 0) {
        console.log('🖼️ Images size:', this.formatSize(this.metrics.imageSize));
      }
      if (this.metrics.fontSize !== undefined && this.metrics.fontSize > 0) {
        console.log('🔤 Fonts size:', this.formatSize(this.metrics.fontSize));
      }
      if (this.metrics.totalSize !== undefined) {
        console.log('💾 Total bundle size:', this.formatSize(this.metrics.totalSize));
      }

      // Largest resources
      if (this.metrics.largestResources && this.metrics.largestResources.length > 0) {
        console.log(''); // Empty line for separation
        console.log('🏆 Largest Resources:');
        this.metrics.largestResources.slice(0, 5).forEach((resource, index) => {
          console.log(`  ${index + 1}. ${resource.name} (${resource.type}): ${this.formatSize(resource.size)}`);
        });
      }

      // Performance recommendations
      this.logRecommendations();

      console.groupEnd();
    }
  }

  private logRecommendations(): void {
    const recommendations: string[] = [];

    if (this.metrics.totalSize && this.metrics.totalSize > 1024 * 1024) { // > 1MB
      recommendations.push('📈 Consider code splitting - bundle size exceeds 1MB');
    }

    if (this.metrics.resourceCount?.js && this.metrics.resourceCount.js > 10) {
      recommendations.push('🔧 Too many JS files - consider bundling optimization');
    }

    if (this.metrics.totalLoadTime && this.metrics.totalLoadTime > 3000) {
      recommendations.push('⚠️ Slow load time - consider lazy loading or CDN');
    }

    if (this.metrics.imageSize && this.metrics.imageSize > 512 * 1024) { // > 512KB
      recommendations.push('🖼️ Large image assets - consider WebP/AVIF formats');
    }

    if (recommendations.length > 0) {
      console.log(''); // Empty line for separation
      console.log('💡 Optimization Recommendations:');
      recommendations.forEach(rec => console.log(`  ${rec}`));
    }
  }

  public getMetrics(): Partial<BundleMetrics> {
    return { ...this.metrics };
  }

  public exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Bundle size monitoring utility functions
export const reportBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    // Report loaded chunks
    const performance = window.performance;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    console.group('🚀 Bundle Performance Report');
    console.log('📦 DOM Content Loaded:', `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
    console.log('⚡ Load Complete:', `${navigation.loadEventEnd - navigation.loadEventStart}ms`);
    console.log('🔄 Total Load Time:', `${navigation.loadEventEnd - navigation.fetchStart}ms`);
    
    // Report resource sizes
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(r => r.name.includes('.js'));
    const cssResources = resources.filter(r => r.name.includes('.css'));
    
    console.log('📜 JavaScript bundles:', jsResources.length);
    console.log('🎨 CSS bundles:', cssResources.length);
    console.groupEnd();
  }
};

// Call after app mount
export const initBundleMonitoring = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', reportBundleSize);
  }
};

// Singleton instance for advanced monitoring
export const bundleMonitor = new BundleMonitor();

// Advanced initialization with full monitoring
export const initAdvancedBundleMonitoring = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Add global access for debugging
    (window as any).bundleMonitor = bundleMonitor;
    
    // Report immediately if page is already loaded
    if (document.readyState === 'complete') {
      setTimeout(() => bundleMonitor.reportBundleSize(), 100);
    }
    
    console.log('🔧 Advanced Bundle Monitoring initialized. Use window.bundleMonitor for debugging.');
  }
};

// Hook for React components
export const useBundleMetrics = () => {
  return bundleMonitor.getMetrics();
};
