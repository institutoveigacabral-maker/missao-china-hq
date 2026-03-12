// Asset preloading utilities for bundle optimization

interface PreloadOptions {
  as?: 'script' | 'style' | 'font' | 'image';
  crossorigin?: 'anonymous' | 'use-credentials';
  media?: string;
  type?: string;
  fetchpriority?: 'high' | 'low' | 'auto';
}

class AssetPreloader {
  private preloadedAssets = new Set<string>();
  private prefetchedAssets = new Set<string>();
  
  /**
   * Preload a resource with high priority
   */
  preload(href: string, options: PreloadOptions = {}): void {
    if (this.preloadedAssets.has(href) || typeof document === 'undefined') {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    
    if (options.as) link.as = options.as;
    if (options.crossorigin) link.crossOrigin = options.crossorigin;
    if (options.media) link.media = options.media;
    if (options.type) link.type = options.type;
    if (options.fetchpriority) (link as any).fetchPriority = options.fetchpriority;

    document.head.appendChild(link);
    this.preloadedAssets.add(href);
  }

  /**
   * Prefetch a resource with low priority
   */
  prefetch(href: string): void {
    if (this.prefetchedAssets.has(href) || typeof document === 'undefined') {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;

    document.head.appendChild(link);
    this.prefetchedAssets.add(href);
  }

  /**
   * Preload critical assets based on bundle analysis
   */
  preloadCriticalAssets(): void {
    // Preload critical vendor chunks
    this.preload('/assets/vendor/react-vendor.js', { 
      as: 'script', 
      fetchpriority: 'high' 
    });
    
    // Preload main CSS
    this.preload('/assets/styles/main.css', { 
      as: 'style', 
      fetchpriority: 'high' 
    });
  }

  /**
   * Prefetch likely-needed assets
   */
  prefetchLikelyAssets(userBehavior: string[] = []): void {
    // Based on user behavior, prefetch likely routes
    const commonRoutes = ['suppliers', 'regulations', 'finance'];
    
    commonRoutes.forEach(route => {
      if (userBehavior.includes(route)) {
        this.prefetch(`/assets/pages/${route}.js`);
      }
    });
  }

  /**
   * Clean up preload hints after assets are loaded
   */
  cleanup(): void {
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    preloadLinks.forEach(link => {
      const href = (link as HTMLLinkElement).href;
      
      // Check if asset is loaded
      if (this.isAssetLoaded(href)) {
        link.remove();
      }
    });
  }

  private isAssetLoaded(href: string): boolean {
    // Check if script is loaded
    const scripts = document.querySelectorAll('script[src]');
    for (const script of scripts) {
      if ((script as HTMLScriptElement).src === href) {
        return true;
      }
    }

    // Check if stylesheet is loaded
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    for (const stylesheet of stylesheets) {
      if ((stylesheet as HTMLLinkElement).href === href) {
        return true;
      }
    }

    return false;
  }

  getStats(): {
    preloadedCount: number;
    prefetchedCount: number;
    preloadedAssets: string[];
    prefetchedAssets: string[];
  } {
    return {
      preloadedCount: this.preloadedAssets.size,
      prefetchedCount: this.prefetchedAssets.size,
      preloadedAssets: Array.from(this.preloadedAssets),
      prefetchedAssets: Array.from(this.prefetchedAssets),
    };
  }
}

export const assetPreloader = new AssetPreloader();

// Auto-initialize critical asset preloading
if (typeof window !== 'undefined') {
  // Preload critical assets on page load
  window.addEventListener('load', () => {
    assetPreloader.preloadCriticalAssets();
  });

  // Cleanup unused preload hints periodically
  setInterval(() => {
    assetPreloader.cleanup();
  }, 30000); // Every 30 seconds
}
