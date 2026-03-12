import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDemoAuth } from './DemoAuthProvider';
import { Spinner } from './ui/Spinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * PrivateRoute component for the main Mocha authentication system
 * Protects routes by redirecting unauthenticated users to login
 */
export function PrivateRoute({ children, redirectTo = '/login' }: PrivateRouteProps) {
  const { user, isPending } = useDemoAuth();

  // Show loading spinner while auth state is being determined
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render protected content
  return <>{children}</>;
}
