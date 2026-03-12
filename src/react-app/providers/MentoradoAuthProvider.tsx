import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from '../utils/authInterceptor';

interface MentoradoUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: MentoradoUser | null;
  login: (email: string, code: string) => Promise<boolean>;
  sendCode: (email: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const MentoradoAuthContext = createContext<AuthContextType | null>(null);

interface MentoradoAuthProviderProps {
  children: ReactNode;
}

export function MentoradoAuthProvider({ children }: MentoradoAuthProviderProps) {
  const [user, setUser] = useState<MentoradoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('mentorado_user');

      if (accessToken && storedUser) {
        try {
          // Verify token is still valid
          const response = await fetch('/api/mentorado-auth/verify', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (response.ok) {
            setUser(JSON.parse(storedUser));
          } else {
            // Try to refresh token
            if (refreshToken) {
              const newToken = await refreshAccessToken();
              
              if (newToken) {
                const userData = localStorage.getItem('mentorado_user');
                if (userData) {
                  setUser(JSON.parse(userData));
                }
              } else {
                // Clear invalid tokens
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('mentorado_user');
              }
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Clear potentially corrupted data
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('mentorado_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, code: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/mentorado-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('mentorado_user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/mentorado/dashboard');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('mentorado_user');
    setUser(null);
    navigate('/mentorado/login');
  };

  const sendCode = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/mentorado-auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return response.ok;
    } catch (error) {
      console.error('Send code error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    sendCode,
    logout,
    loading
  };

  return (
    <MentoradoAuthContext.Provider value={value}>
      {children}
    </MentoradoAuthContext.Provider>
  );
}

export const useMentoradoAuth = (): AuthContextType => {
  const context = useContext(MentoradoAuthContext);
  if (context === null) {
    throw new Error('useMentoradoAuth must be used within a MentoradoAuthProvider');
  }
  return context;
};
