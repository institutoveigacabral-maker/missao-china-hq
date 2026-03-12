// Toast utilities and components

export { CustomToast } from './CustomToast';

// Re-export the main toast function for convenience
export { default as toast } from 'react-hot-toast';

// Export types
export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  style?: React.CSSProperties;
}

export { useToast } from '@/react-app/hooks/useToast';
