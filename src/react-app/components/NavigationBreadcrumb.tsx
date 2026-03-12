import { ChevronRight, Home, Package, Factory, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/react-app/contexts/AppContext';
import { NAVIGATION_MODULES } from '@/react-app/constants/navigation';

interface BreadcrumbItem {
  name: string;
  path: string;
  icon?: any;
}

export default function NavigationBreadcrumb() {
  const location = useLocation();
  const { selectedSKU, selectedSupplier, selectedRegulation } = useAppContext();

  // Find current module
  const currentModule = NAVIGATION_MODULES.find(module => module.path === location.pathname);
  
  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', path: '/', icon: Home }
  ];

  if (currentModule && currentModule.path !== '/') {
    breadcrumbItems.push({
      name: currentModule.name,
      path: currentModule.path,
      icon: currentModule.icon
    });
  }

  // Add selected context items
  if (selectedSKU) {
    breadcrumbItems.push({
      name: `SKU: ${selectedSKU}`,
      path: '#',
      icon: Package
    });
  }

  if (selectedSupplier) {
    breadcrumbItems.push({
      name: `Fornecedor: ${selectedSupplier}`,
      path: '#',
      icon: Factory
    });
  }

  if (selectedRegulation) {
    breadcrumbItems.push({
      name: `Norma: ${selectedRegulation}`,
      path: '#',
      icon: Shield
    });
  }

  return (
    <div className="bg-white border-b border-slate-200 px-3 sm:px-4 lg:px-6 xl:px-8 py-2">
      <nav className="flex items-center space-x-2 text-sm overflow-x-auto">
        {breadcrumbItems.map((item, index) => (
          <div key={item.path + index} className="flex items-center space-x-2 whitespace-nowrap">
            {index > 0 && <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
            
            {item.path === '#' ? (
              <span className="text-slate-900 font-medium flex items-center space-x-1">
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="truncate max-w-32 sm:max-w-48">{item.name}</span>
              </span>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center space-x-1 transition-colors hover:text-blue-600 ${
                  index === breadcrumbItems.length - 1 && !selectedSKU && !selectedSupplier && !selectedRegulation
                    ? 'text-slate-900 font-medium'
                    : 'text-slate-600'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                <span className="truncate max-w-32 sm:max-w-48">{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
