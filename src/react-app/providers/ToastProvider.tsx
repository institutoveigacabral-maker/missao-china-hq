import React from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        gutter={8}
        containerClassName="z-[100]"
        containerStyle={{ zIndex: 100 }}
        toastOptions={{
          // Default options
          className: '',
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            maxWidth: '400px',
          },
          
          // Success toast styling
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
            style: {
              border: '1px solid #10b981',
              background: '#f0fdf4',
              color: '#166534',
            },
          },
          
          // Error toast styling  
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              border: '1px solid #ef4444',
              background: '#fef2f2',
              color: '#dc2626',
            },
          },
          
          // Loading toast styling
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#ffffff',
            },
            style: {
              border: '1px solid #3b82f6',
              background: '#eff6ff',
              color: '#1e40af',
            },
          },
        }}
      />
    </>
  );
};
