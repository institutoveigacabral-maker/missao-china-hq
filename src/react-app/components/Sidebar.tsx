import { Link, useLocation } from 'react-router-dom';
import { 
  X, Home, Globe2, Users, Calculator, Truck, 
  Building2, AlertTriangle, MapPin, BookOpen, Crown, Gavel, Shield,
  ChevronRight, Sparkles
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  id: string;
  name: string;
  path: string;
  icon: any;
  badge?: string;
  color?: string;
}

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: 'Principal',
    items: [
      { id: 'home', name: 'Dashboard', path: '/', icon: Home, color: 'blue' },
      { id: 'missao-china-pro', name: 'Missão China Pro', path: '/missao-china-pro', icon: Globe2, color: 'purple', badge: 'PRO' },
    ]
  },
  {
    title: 'Gestão',
    items: [
      { id: 'suppliers', name: 'Fornecedores', path: '/suppliers', icon: Users, color: 'green' },
      { id: 'playbook', name: 'Playbook', path: '/playbook', icon: BookOpen, color: 'orange' },
      { id: 'canton-fair', name: 'Canton Fair', path: '/canton-fair', icon: MapPin, color: 'pink' },
    ]
  },
  {
    title: 'Compliance',
    items: [
      { id: 'regulations', name: 'Regulamentos', path: '/regulations', icon: Shield, color: 'indigo' },
      { id: 'risk-register', name: 'Riscos', path: '/risk-register', icon: AlertTriangle, color: 'red' },
    ]
  },
  {
    title: 'Operações',
    items: [
      { id: 'finance', name: 'Impostos', path: '/finance', icon: Calculator, color: 'emerald' },
      { id: 'logistics', name: 'Logística', path: '/logistics', icon: Truck, color: 'cyan' },
      { id: 'incoterms', name: 'Incoterms', path: '/incoterms', icon: Gavel, color: 'violet' },
      { id: 'wfoe-structure', name: 'WFOE', path: '/wfoe-structure', icon: Building2, color: 'slate' },
    ]
  },
  {
    title: 'Vendas',
    items: [
      { id: 'cash-out', name: 'Cash Out', path: '/cash-out', icon: Crown, color: 'amber', badge: 'NEW' },
    ]
  }
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={`
          w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 flex-shrink-0
          lg:block lg:pt-16
          fixed inset-y-0 left-0 z-50 
          lg:static lg:bg-white
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 lg:hidden bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-slate-900">China HQ</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 hover:shadow-md"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {NAVIGATION_SECTIONS.map((section, sectionIndex) => (
              <div key={section.title} className="space-y-2">
                {/* Section Title */}
                <div className="flex items-center gap-2 px-3 mb-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                </div>

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || 
                                    (item.path === '/' && location.pathname === '/dashboard');
                    const isHovered = hoveredItem === item.id;
                    
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={onClose}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`
                          group ${isActive ? 'active' : ''}
                          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium 
                          transition-all duration-200 ease-out
                          hover:shadow-md hover:scale-[1.02]
                          ${isActive 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200' 
                            : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100'
                          }
                        `}
                        style={{
                          animationDelay: `${sectionIndex * 50 + itemIndex * 30}ms`
                        }}
                      >
                        {/* Icon Container */}
                        <div className={`
                          w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                          transition-all duration-200
                          ${isActive 
                            ? 'bg-white/20 shadow-inner' 
                            : 'bg-slate-100 group-hover:bg-white group-hover:shadow-sm'
                          }
                        `}>
                          <Icon className={`
                            w-4 h-4 transition-all duration-200
                            ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-blue-600'}
                            ${isHovered && !isActive ? 'scale-110' : ''}
                          `} />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.name}</span>
                          
                          {/* Badge */}
                          {item.badge && (
                            <span className={`
                              text-[10px] font-bold px-2 py-0.5 rounded-full
                              ${isActive 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                              }
                            `}>
                              {item.badge}
                            </span>
                          )}
                          
                          {/* Chevron on hover */}
                          <ChevronRight className={`
                            w-4 h-4 transition-all duration-200
                            ${isHovered && !isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                          `} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Mentorado Access */}
            <div className="pt-4">
              <div className="p-4 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 border border-red-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 text-sm">Mentorado Hub</h3>
                    <p className="text-red-700 text-xs">Acesso exclusivo</p>
                  </div>
                </div>
                <Link
                  to="/mentorado/dashboard"
                  onClick={onClose}
                  className="
                    block w-full bg-gradient-to-r from-red-600 to-pink-600 
                    hover:from-red-700 hover:to-pink-700 
                    text-white text-sm font-semibold px-4 py-2.5 rounded-xl 
                    transition-all duration-200 text-center
                    shadow-md hover:shadow-lg hover:scale-[1.02]
                  "
                >
                  Acessar Sistema
                </Link>
              </div>
            </div>
          </nav>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200/80 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                <p className="text-xs font-medium text-slate-600">Sistema Ativo</p>
              </div>
              <p className="text-xs text-slate-400 font-mono">v2.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
