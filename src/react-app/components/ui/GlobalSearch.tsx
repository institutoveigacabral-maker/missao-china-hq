import { useState, useEffect, useRef, Fragment } from 'react';
import { Search, X, Package, Factory, Shield, ArrowRight, Home, BookOpen, Award, Truck, MapPin, FileText, DollarSign, Building, AlertTriangle, BarChart3 } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';
import useGlobalSearch from '@/react-app/hooks/useGlobalSearch';
import type { SearchItem } from '@/react-app/hooks/useGlobalSearch';
import CommandSearch from './CommandSearch';
import SearchAnalytics from '@/react-app/components/SearchAnalytics';

interface GlobalSearchProps {
  isOpen?: boolean;
  onClose?: () => void;
  searchData?: SearchItem[];
}

export default function GlobalSearch({ isOpen: isOpenProp, onClose: onCloseProp, searchData: searchDataProp }: GlobalSearchProps) {
  // Always call hooks at the top level
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen: isOpenHook,
    query,
    results,
    isSearching,
    setQuery,
    closeSearch,
    selectResult,
    totalItems
  } = useGlobalSearch({ searchData: searchDataProp });
  
  // Use props if provided, otherwise use hook values
  const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenHook;
  const onClose = onCloseProp || closeSearch;
  
  // Alternative Command-based search - can switch between implementations
  const useCommandInterface = false;
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard navigation
  useHotkeys('ArrowDown', (e) => {
    e.preventDefault();
    setSelectedIndex(prev => (prev + 1) % results.length);
  }, { enabled: isOpen && results.length > 0 });

  useHotkeys('ArrowUp', (e) => {
    e.preventDefault();
    setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
  }, { enabled: isOpen && results.length > 0 });

  useHotkeys('Enter', (e) => {
    e.preventDefault();
    if (results[selectedIndex]) {
      selectResult(results[selectedIndex]);
      onClose();
    }
  }, { enabled: isOpen && results.length > 0 });

  useHotkeys('Escape', () => {
    onClose();
  }, { enabled: isOpen });

  if (useCommandInterface) {
    return (
      <CommandSearch 
        isOpen={isOpen} 
        onClose={onClose} 
        searchData={results} 
      />
    );
  }

  const getResultIcon = (type: string, title?: string) => {
    switch (type) {
      case 'sku': return <Package className="w-4 h-4 text-blue-600" />;
      case 'supplier': return <Factory className="w-4 h-4 text-green-600" />;
      case 'regulation': return <Shield className="w-4 h-4 text-orange-600" />;
      case 'page':
        // Specific icons for different pages
        if (title?.includes('Command Center')) return <Home className="w-4 h-4 text-purple-600" />;
        if (title?.includes('Playbook')) return <BookOpen className="w-4 h-4 text-indigo-600" />;
        if (title?.includes('Normas') || title?.includes('Regulations')) return <Shield className="w-4 h-4 text-red-600" />;
        if (title?.includes('Fornecedores') || title?.includes('Suppliers')) return <Factory className="w-4 h-4 text-green-600" />;
        if (title?.includes('Canton Fair')) return <MapPin className="w-4 h-4 text-pink-600" />;
        if (title?.includes('Incoterms')) return <FileText className="w-4 h-4 text-yellow-600" />;
        if (title?.includes('Logística')) return <Truck className="w-4 h-4 text-cyan-600" />;
        if (title?.includes('Tributação') || title?.includes('Finance')) return <DollarSign className="w-4 h-4 text-emerald-600" />;
        if (title?.includes('WFOE')) return <Building className="w-4 h-4 text-slate-600" />;
        if (title?.includes('Risk')) return <AlertTriangle className="w-4 h-4 text-orange-600" />;
        return <ArrowRight className="w-4 h-4 text-purple-600" />;
      case 'feature': return <Award className="w-4 h-4 text-amber-600" />;
      default: return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'certified': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'blocked': return 'text-red-600';
      case 'active': return 'text-green-600';
      case 'critical': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl mx-auto">
        {/* Search Input */}
        <div className="relative border-b border-slate-200">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar SKUs, fornecedores, normas, páginas... (Cmd+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-transparent border-none outline-none text-lg placeholder-slate-500"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
            aria-label="Fechar busca"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
              <p className="text-slate-600">Buscando...</p>
            </div>
          ) : query.length < 2 ? (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-2">Digite pelo menos 2 caracteres para buscar</p>
              <div className="text-sm text-slate-400 space-y-1">
                <p>📦 SKUs: IOT-TEMP-001, RFS-001, RIDER-GPS-001</p>
                <p>🏭 Fornecedores: Shenzhen, Taiwan, Guangzhou</p>
                <p>📋 Normas: ANATEL, CE, RED, INMETRO</p>
                <p>📄 Páginas: playbook, suppliers, canton fair</p>
                <p className="text-xs text-slate-300 mt-2">Total de {totalItems} itens indexados</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}-${index}`}
                  onClick={() => {
                    selectResult(result);
                    onClose();
                  }}
                  className={`w-full px-4 py-3 text-left transition-colors border-b border-slate-100 last:border-b-0 ${
                    index === selectedIndex 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getResultIcon(result.type, result.title)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-slate-900 truncate">{result.title}</div>
                        {result.status && (
                          <span className={`text-xs font-medium ml-2 ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 truncate">{result.subtitle}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-slate-400 capitalize">{result.type}</span>
                        {result.description && (
                          <Fragment>
                            <span className="text-xs text-slate-300">•</span>
                            <span className="text-xs text-slate-500 truncate">{result.description}</span>
                          </Fragment>
                        )}
                      </div>
                    </div>
                    {index === selectedIndex && (
                      <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="text-slate-500 mb-3">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                Nenhum resultado encontrado para "{query}"
              </div>
              <div className="text-sm text-slate-400">
                Tente termos como: IOT, Shenzhen, ANATEL, playbook
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-4 py-3 bg-slate-50 rounded-b-xl">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <span>↑↓ navegar</span>
              <span>↵ selecionar</span>
              <span>esc fechar</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAnalytics(true)}
                className="flex items-center space-x-1 text-slate-400 hover:text-blue-600 transition-colors"
                title="Ver analytics de busca"
              >
                <BarChart3 className="w-3 h-3" />
                <span>Analytics</span>
              </button>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">
                🚀 Busca Inteligente • Cmd+K • {totalItems} itens
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Analytics Modal */}
      <SearchAnalytics 
        searchData={results}
        isVisible={showAnalytics}
        onClose={() => setShowAnalytics(false)}
      />
    </div>
  );
}

// Simple hook for triggering global search modal
export function useGlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);

  useHotkeys('meta+k, ctrl+k', (e) => {
    e.preventDefault();
    setIsOpen(true);
  });

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
}

// Enhanced GlobalSearch component that can work standalone or with props
export function GlobalSearchStandalone({ searchData }: { searchData?: SearchItem[] }) {
  const {
    isOpen,
    closeSearch
  } = useGlobalSearch({ searchData });

  return (
    <GlobalSearch 
      isOpen={isOpen} 
      onClose={closeSearch} 
      searchData={searchData}
    />
  );
}
