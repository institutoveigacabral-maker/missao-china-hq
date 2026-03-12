import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_MODULES } from '@/react-app/constants/navigation';
import { useAppContext } from '@/react-app/contexts/AppContext';
import { TertiaryButton } from '@/react-app/components/ui/Button';
import { useSafeSidebar } from '@/react-app/hooks/useSafeSidebar';
import { X } from 'lucide-react';

interface SafeSidebarProps {
  className?: string;
}

/**
 * Sidebar component com gerenciamento seguro de estado e prevenção de memory leaks
 */
export default function SafeSidebar({ className }: SafeSidebarProps) {
  const location = useLocation();
  const { selectedSKU, selectedSupplier, selectedRegulation } = useAppContext();
  const { isOpen, close, sidebarRef } = useSafeSidebar({
    closeOnEscape: true,
    closeOnClickOutside: true,
    preventBodyScroll: true
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={close}
          aria-label="Fechar menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              close();
            }
          }}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`fixed left-0 top-0 w-64 h-full bg-slate-900 text-white z-40 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className || ''}`}
        aria-label="Menu de navegação"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold">🏭</span>
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-lg truncate">China HQ</h2>
                <p className="text-slate-400 text-xs truncate">Grupo RÃO</p>
              </div>
            </div>
            
            <TertiaryButton 
              size="sm"
              icon={X}
              onClick={close}
              className="lg:hidden text-white hover:bg-slate-800 focus:ring-2 focus:ring-blue-500"
              aria-label="Fechar menu"
              title="Fechar menu (ESC)"
            >
              <span className="sr-only">Fechar menu</span>
            </TertiaryButton>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4" role="navigation">
            <div className="space-y-1 px-4">
              {NAVIGATION_MODULES.map((module) => {
                const Icon = module.icon;
                const isActive = location.pathname === module.path;
                
                return (
                  <Link
                    key={module.id}
                    to={module.path}
                    onClick={close}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={module.description}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium truncate">
                      {module.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
          
          {/* Selected Items Indicator */}
          {(selectedSKU || selectedSupplier || selectedRegulation) && (
            <div className="p-4 border-t border-slate-800">
              <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-800/50">
                <h4 className="text-xs font-medium text-blue-300 mb-2">
                  Selecionado:
                </h4>
                <div className="space-y-1 text-xs" role="status" aria-live="polite">
                  {selectedSKU && (
                    <div className="text-blue-200 flex items-center space-x-1">
                      <span aria-label="SKU">📦</span>
                      <span>SKU: {selectedSKU}</span>
                    </div>
                  )}
                  {selectedSupplier && (
                    <div className="text-green-200 flex items-center space-x-1">
                      <span aria-label="Fornecedor">🏭</span>
                      <span>Fornecedor: {selectedSupplier}</span>
                    </div>
                  )}
                  {selectedRegulation && (
                    <div className="text-orange-200 flex items-center space-x-1">
                      <span aria-label="Norma">📋</span>
                      <span>Norma: {selectedRegulation}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/**
 * Hook para usar o SafeSidebar component em qualquer lugar
 */
export const useSafeNavigationSidebar = () => {
  return useSafeSidebar({
    breakpoint: 1024,
    preventBodyScroll: true,
    closeOnEscape: true,
    closeOnClickOutside: true
  });
};
