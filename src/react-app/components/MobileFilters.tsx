import { useState } from 'react';
import { Filter, X, ChevronDown, Search, Calendar, MapPin } from 'lucide-react';
import { Badge } from './ui/Badge';
import Button from './ui/Button';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface DateRange {
  start: string;
  end: string;
}

interface MobileFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, unknown>) => void;
  onReset: () => void;
  filters: Record<string, unknown>;
  options: {
    categories?: FilterOption[];
    statuses?: FilterOption[];
    regions?: FilterOption[];
    suppliers?: FilterOption[];
    [key: string]: FilterOption[] | undefined;
  };
  searchPlaceholder?: string;
  showDateRange?: boolean;
  showLocation?: boolean;
}

export default function MobileFilters({
  isOpen,
  onClose,
  onApply,
  onReset,
  filters,
  options,
  searchPlaceholder = "Buscar...",
  showDateRange = false,
  showLocation = false
}: MobileFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    search: true,
    categories: false,
    statuses: false,
    regions: false,
    suppliers: false,
    dateRange: false,
    location: false
  });

  const updateFilter = (key: string, value: unknown) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
    onClose();
  };

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.length > 0;
      return value !== null && value !== undefined;
    }).length;
  };

  const renderMultiSelect = (sectionKey: string, optionsList: FilterOption[], label: string) => {
    const selectedValues = (localFilters[sectionKey] as string[]) || [];
    
    return (
      <div className="border-b border-slate-200">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium text-slate-900">{label}</span>
            {selectedValues.length > 0 && (
              <Badge variant="info" size="sm">
                {selectedValues.length}
              </Badge>
            )}
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-slate-500 transition-transform ${
              expandedSections[sectionKey] ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections[sectionKey] && (
          <div className="px-4 pb-4 space-y-2">
            {optionsList.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              
              return (
                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter(v => v !== option.value);
                      updateFilter(sectionKey, newValues);
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">{option.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderDateRange = () => {
    const dateRange = (localFilters.dateRange as DateRange) || { start: '', end: '' };
    
    return (
      <div className="border-b border-slate-200">
        <button
          onClick={() => toggleSection('dateRange')}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="font-medium text-slate-900">Período</span>
            {(dateRange.start || dateRange.end) && (
              <Badge variant="info" size="sm">
                Ativo
              </Badge>
            )}
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-slate-500 transition-transform ${
              expandedSections.dateRange ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.dateRange && (
          <div className="px-4 pb-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Data inicial
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => updateFilter('dateRange', { ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Data final
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => updateFilter('dateRange', { ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLocationFilter = () => {
    const location = (localFilters.location as string) || '';
    
    return (
      <div className="border-b border-slate-200">
        <button
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="font-medium text-slate-900">Localização</span>
            {location && (
              <Badge variant="info" size="sm">
                Ativo
              </Badge>
            )}
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-slate-500 transition-transform ${
              expandedSections.location ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {expandedSections.location && (
          <div className="px-4 pb-4">
            <input
              type="text"
              placeholder="Digite uma cidade ou região"
              value={location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center md:items-center">
      <div className="bg-white w-full max-w-md max-h-[90vh] flex flex-col rounded-t-xl md:rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="info">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Fechar filtros"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="border-b border-slate-200">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={(localFilters.search as string) || ''}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Filters */}
          {options.categories && renderMultiSelect('categories', options.categories, 'Categorias')}
          {options.statuses && renderMultiSelect('statuses', options.statuses, 'Status')}
          {options.regions && renderMultiSelect('regions', options.regions, 'Regiões')}
          {options.suppliers && renderMultiSelect('suppliers', options.suppliers, 'Fornecedores')}
          
          {/* Date Range */}
          {showDateRange && renderDateRange()}
          
          {/* Location */}
          {showLocation && renderLocationFilter()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <Button
            onClick={handleApply}
            className="w-full"
            variant="primary"
          >
            Aplicar Filtros
          </Button>
          <Button
            onClick={handleReset}
            className="w-full"
            variant="secondary"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
