import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
}

interface DemoAuthContextType {
  user: DemoUser | null;
  isPending: boolean;
  login: (user: DemoUser) => void;
  logout: () => void;
}

const DemoAuthContext = createContext<DemoAuthContextType | null>(null);

interface DemoAuthProviderProps {
  children: ReactNode;
}

export function DemoAuthProvider({ children }: DemoAuthProviderProps) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    // Check for stored demo user
    const storedToken = localStorage.getItem('demo_token');
    const storedUser = localStorage.getItem('demo_user');
    
    console.log('DemoAuthProvider checking auth:', { storedToken, storedUser });
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Setting user from localStorage:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('demo_token');
        localStorage.removeItem('demo_user');
      }
    }
    
    setIsPending(false);
  }, []);

  const login = (userData: DemoUser) => {
    setUser(userData);
    localStorage.setItem('demo_token', 'demo-jwt-token');
    localStorage.setItem('demo_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_token');
    localStorage.removeItem('demo_user');
  };

  const value: DemoAuthContextType = {
    user,
    isPending,
    login,
    logout
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export const useDemoAuth = (): DemoAuthContextType => {
  const context = useContext(DemoAuthContext);
  if (context === null) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};
