import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load individual components for better code splitting
export const LazySkuAnalysisPanel = lazy(() => import('./SkuAnalysisPanel'));
export const LazyCantonFairMap = lazy(() => import('./CantonFairMap'));
export const LazySkuForm = lazy(() => import('./SkuForm'));
export const LazySearchAnalytics = lazy(() => import('./SearchAnalytics'));
export const LazyComplianceScoreEngine = lazy(() => import('./ComplianceScoreEngine'));

// Loading fallback component
export function ComponentLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        <span className="text-sm text-gray-600">{text}</span>
      </div>
    </div>
  );
}

// Wrapper for lazy components with error boundary
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyWrapper({ 
  children, 
  fallback = <ComponentLoader />
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// HOC for route-based code splitting
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  loaderText?: string
) {
  return React.memo((props: P) => (
    <LazyWrapper fallback={<ComponentLoader text={loaderText} />}>
      <Component {...props} />
    </LazyWrapper>
  ));
}

// Preload utilities for better UX
export function preloadComponent(componentImport: () => Promise<any>) {
  // Preload on hover or focus
  const preload = () => {
    componentImport().catch(() => {
      // Silently fail preloading
    });
  };

  return {
    onMouseEnter: preload,
    onFocus: preload,
  };
}

// Resource hints for critical resources
export function addResourceHints() {
  if (typeof document === 'undefined') return;

  // Preload critical fonts
  const linkFont = document.createElement('link');
  linkFont.rel = 'preload';
  linkFont.as = 'font';
  linkFont.type = 'font/woff2';
  linkFont.crossOrigin = 'anonymous';
  linkFont.href = 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
  document.head.appendChild(linkFont);

  // DNS prefetch for external services
  const dnsHints = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.openai.com',
  ];

  dnsHints.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}

// Initialize resource hints
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', addResourceHints);
}
