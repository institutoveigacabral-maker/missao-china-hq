import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMentoradoAuth } from '../providers/MentoradoAuthProvider';
import { Spinner } from './ui/Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export function MentoradoProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useMentoradoAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/mentorado/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
