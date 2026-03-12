import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMentoradoAuth } from '../providers/MentoradoAuthProvider';
import { Spinner } from './ui/Spinner';

interface MentoradoPrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * MentoradoPrivateRoute component for the mentorado-specific authentication system
 * Protects mentorado routes by redirecting unauthenticated users to mentorado login
 */
export function MentoradoPrivateRoute({ 
  children, 
  redirectTo = '/mentorado/login' 
}: MentoradoPrivateRouteProps) {
  const { user, loading } = useMentoradoAuth();

  // Show loading spinner while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Verificando autenticação do mentorado...</p>
        </div>
      </div>
    );
  }

  // Redirect to mentorado login if user is not authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render protected content
  return <>{children}</>;
}
