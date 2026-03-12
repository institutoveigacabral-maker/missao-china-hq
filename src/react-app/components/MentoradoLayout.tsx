import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, User, Target, Factory, FileText, BarChart3, TrendingUp,
  LogOut, Menu, X, Search, Bell
} from 'lucide-react';
import { Badge } from './ui/Badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MentoradoLayoutProps {
  children: React.ReactNode;
}

function MentoradoLayout({ children }: MentoradoLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('mentorado_user');
    
    if (!token || !userData) {
      navigate('/mentorado/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/mentorado/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('mentorado_user');
    navigate('/mentorado/login');
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/mentorado/dashboard', icon: Home },
    { name: 'Perfil', href: '/mentorado/profile', icon: User },
    { name: 'Deals', href: '/mentorado/deals', icon: Target },
    { name: 'Fornecedores', href: '/mentorado/suppliers', icon: Factory },
    { name: 'Documentos', href: '/mentorado/documents', icon: FileText },
    { name: 'Relatórios', href: '/mentorado/reports', icon: BarChart3 },
    { name: 'Analytics', href: '/mentorado/analytics', icon: TrendingUp, badge: 'novo' },
  ];

  const isActiveRoute = (href: string) => location.pathname === href;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </button>

            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                {navigationItems.find(item => isActiveRoute(item.href))?.name || 'Mentorado'}
              </h1>
              <p className="text-xs text-slate-500">Sistema exclusivo</p>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Search className="h-5 w-5 text-slate-600" />
            </button>

            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {user.name.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-slate-200 flex-shrink-0
        lg:block lg:pt-16
        ${sidebarOpen ? 'block' : 'hidden'}
        fixed inset-y-0 left-0 z-40 shadow-xl
        lg:static lg:shadow-none
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 bg-red-600 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-white">Mentorado</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium 
                      transition-all
                      ${isActive 
                        ? 'bg-red-50 text-red-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge variant="warning" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-600 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex">
        <div className="hidden lg:block w-64 flex-shrink-0"></div>
        <main className="flex-1 pt-16 min-h-screen">
          <div className="p-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MentoradoLayout;
