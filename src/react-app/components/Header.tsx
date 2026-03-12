import { Menu, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-20 shadow-sm md:hidden">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-600 to-accent-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-sm">CH</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-accent-600 transition-colors">China HQ</h1>
              <p className="text-xs text-slate-500 leading-tight">Grupo RÃO</p>
            </div>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-slate-600" />
          </button>

          <button className="flex items-center gap-2 p-1.5 pr-3 hover:bg-slate-100 rounded-lg transition-colors">
            <div className="w-7 h-7 bg-accent-600 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
