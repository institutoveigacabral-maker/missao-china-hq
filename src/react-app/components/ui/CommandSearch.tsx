import React from 'react';
import { Command } from 'cmdk';
import { Search, FileText, Shield, Truck, Package, Factory, Home, BookOpen, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  subtitle?: string;
  type: 'sku' | 'supplier' | 'regulation' | 'logistics' | 'page' | 'feature';
  url: string;
  category?: string;
  status?: string;
}

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchData: SearchItem[];
}

const getIcon = (type: string, title?: string) => {
  switch (type) {
    case 'sku': return Package;
    case 'supplier': return Factory;
    case 'regulation': return Shield;
    case 'logistics': return Truck;
    case 'page':
      if (title?.includes('Command Center') || title?.includes('Home')) return Home;
      if (title?.includes('Playbook')) return BookOpen;
      if (title?.includes('Canton Fair')) return MapPin;
      return FileText;
    case 'feature': return ArrowRight;
    default: return FileText;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'sku': return 'SKU';
    case 'supplier': return 'Fornecedor';
    case 'regulation': return 'Regulamentação';
    case 'logistics': return 'Logística';
    case 'page': return 'Página';
    case 'feature': return 'Funcionalidade';
    default: return 'Item';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'sku': return 'bg-blue-100 text-blue-800';
    case 'supplier': return 'bg-green-100 text-green-800';
    case 'regulation': return 'bg-red-100 text-red-800';
    case 'logistics': return 'bg-orange-100 text-orange-800';
    case 'page': return 'bg-purple-100 text-purple-800';
    case 'feature': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'certified': return 'bg-green-50 text-green-700 border-green-200';
    case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'blocked': return 'bg-red-50 text-red-700 border-red-200';
    case 'active': return 'bg-green-50 text-green-700 border-green-200';
    case 'critical': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export const CommandSearch: React.FC<CommandSearchProps> = ({ isOpen, onClose, searchData }) => {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');
  const [filteredResults, setFilteredResults] = React.useState<SearchItem[]>([]);

  // Hotkeys para fechar
  useHotkeys('escape', () => {
    if (isOpen) {
      onClose();
    }
  }, { enabled: isOpen });

  // Filtrar resultados baseado na query
  React.useEffect(() => {
    if (query.length < 2) {
      setFilteredResults([]);
      return;
    }

    const filtered = searchData
      .filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 results

    setFilteredResults(filtered);
  }, [query, searchData]);

  const handleSelect = (item: SearchItem) => {
    navigate(item.url);
    onClose();
    setQuery('');
    setFilteredResults([]);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setQuery('');
      setFilteredResults([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <Command.Dialog 
        open={isOpen} 
        onOpenChange={handleOpenChange}
        className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200"
        label="Global search"
      >
        {/* Search Header */}
        <div className="flex items-center border-b border-slate-200 px-6 py-4">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Buscar SKUs, fornecedores, regulamentações, páginas..."
            className="flex-1 text-lg outline-none placeholder-slate-400 bg-transparent"
            autoFocus
          />
          <div className="flex items-center space-x-2 ml-4">
            <kbd className="hidden sm:inline-block text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results List */}
        <Command.List className="max-h-96 overflow-y-auto p-2">
          <Command.Empty className="py-12 text-center text-slate-500">
            {query.length < 2 ? (
              <div className="space-y-4">
                <Search className="w-12 h-12 mx-auto text-slate-300" />
                <div>
                  <p className="text-lg font-medium text-slate-700 mb-2">Busca Global Inteligente</p>
                  <p className="text-sm text-slate-500">Digite pelo menos 2 caracteres para buscar</p>
                  <div className="mt-4 text-xs text-slate-400 space-y-1">
                    <p>📦 SKUs: IOT-TEMP-001, RFS-001</p>
                    <p>🏭 Fornecedores: Shenzhen, Taiwan</p>
                    <p>📋 Regulamentações: ANATEL, CE</p>
                    <p>📄 Páginas: playbook, suppliers</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Search className="w-8 h-8 mx-auto text-slate-300" />
                <p>Nenhum resultado encontrado para "{query}"</p>
                <p className="text-xs text-slate-400">Tente termos como: IOT, Shenzhen, ANATEL</p>
              </div>
            )}
          </Command.Empty>

          {filteredResults.map((item) => {
            const Icon = getIcon(item.type, item.title);
            return (
              <Command.Item
                key={item.id}
                value={`${item.title} ${item.description} ${item.category || ''}`}
                onSelect={() => handleSelect(item)}
                className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-50 cursor-pointer group transition-colors duration-200 data-[selected=true]:bg-blue-50 outline-none"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg mr-4 group-hover:bg-blue-100 transition-colors duration-200 flex-shrink-0">
                  <Icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-900">
                      {item.title}
                    </p>
                    {item.status && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ml-2 ${getStatusColor(item.status)} flex-shrink-0`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 truncate group-hover:text-slate-600">
                    {item.subtitle || item.description}
                  </p>
                  {item.category && (
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {item.category}
                    </p>
                  )}
                </div>

                {/* Type Badge */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {getTypeLabel(item.type)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </Command.Item>
            );
          })}
        </Command.List>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="inline-flex items-center px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono">
                  ↑↓
                </kbd>
                <span>navegar</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="inline-flex items-center px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono">
                  ↵
                </kbd>
                <span>selecionar</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="inline-flex items-center px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono">
                esc
              </kbd>
              <span>fechar</span>
            </div>
          </div>
        </div>
      </Command.Dialog>
    </div>
  );
};

export default CommandSearch;
