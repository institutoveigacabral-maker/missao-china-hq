import { useState } from 'react';
import { Container, Stack } from '../components/ResponsiveLayout';
import MobileFilters from '@/react-app/components/MobileFilters';
import MobileDataCard from '@/react-app/components/MobileDataCard';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Filter, Search, Download, Plus, Grid, List } from 'lucide-react';

// Mock components for demo
const MobileFilterButton = ({ onClick, filtersCount }: { onClick: () => void; filtersCount: number }) => (
  <Button variant="secondary" icon={Filter} onClick={onClick}>
    Filtros {filtersCount > 0 && <Badge variant="info" className="ml-2">{filtersCount}</Badge>}
  </Button>
);

const AppliedFilters = ({ filters, onRemove }: { filters: Array<{ key: string; value: string; label: string }>; onRemove: (key: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    {filters.map(filter => (
      <button
        key={filter.key}
        onClick={() => onRemove(filter.key)}
        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
      >
        {filter.label}: {filter.value} <span className="ml-1">×</span>
      </button>
    ))}
  </div>
);

const MobileDataCardList = ({ children, viewMode }: { children: React.ReactNode; viewMode: 'grid' | 'list' }) => (
  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
    {children}
  </div>
);

export default function MobileSystemDemo() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFilters, setCurrentFilters] = useState<Record<string, unknown>>({});
  
  // Mock data
  const mockData = [
    {
      id: 1,
      title: 'SKU-IOT-001',
      subtitle: 'Sensor de Temperatura',
      value: 'Aprovado',
      badge: { text: 'Ativo', variant: 'success' as const },
      icon: 'package' as const,
      status: 'active' as const,
      category: 'IoT',
      supplier: 'Shenzhen Tech',
      region: 'China'
    },
    {
      id: 2,
      title: 'SKU-IOT-002',
      subtitle: 'Módulo WiFi ESP32',
      value: 'Pendente',
      badge: { text: 'Análise', variant: 'warning' as const },
      icon: 'package' as const,
      status: 'pending' as const,
      category: 'IoT',
      supplier: 'Shanghai Electronics',
      region: 'China'
    },
    {
      id: 3,
      title: 'SUP-001',
      subtitle: 'TechCorp Solutions',
      value: '95%',
      badge: { text: 'Certificado', variant: 'success' as const },
      icon: 'factory' as const,
      status: 'active' as const,
      category: 'Fornecedor',
      supplier: 'TechCorp',
      region: 'Taiwan'
    }
  ];

  const filterOptions = {
    categories: [
      { id: 'iot', label: 'IoT', value: 'IoT' },
      { id: 'electronics', label: 'Eletrônicos', value: 'Electronics' },
      { id: 'supplier', label: 'Fornecedor', value: 'Fornecedor' }
    ],
    statuses: [
      { id: 'active', label: 'Ativo', value: 'active' },
      { id: 'pending', label: 'Pendente', value: 'pending' },
      { id: 'inactive', label: 'Inativo', value: 'inactive' }
    ],
    regions: [
      { id: 'china', label: 'China', value: 'China' },
      { id: 'taiwan', label: 'Taiwan', value: 'Taiwan' },
      { id: 'brazil', label: 'Brasil', value: 'Brazil' }
    ],
    suppliers: [
      { id: 'shenzhen', label: 'Shenzhen Tech', value: 'Shenzhen Tech' },
      { id: 'shanghai', label: 'Shanghai Electronics', value: 'Shanghai Electronics' },
      { id: 'techcorp', label: 'TechCorp Solutions', value: 'TechCorp' }
    ]
  };

  const getActiveFiltersCount = () => {
    return Object.values(currentFilters).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.length > 0;
      return value !== null && value !== undefined;
    }).length;
  };

  const getAppliedFilters = () => {
    const applied: Array<{ key: string; value: string; label: string }> = [];
    
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        applied.push({
          key,
          value: value.join(', '),
          label: key.charAt(0).toUpperCase() + key.slice(1)
        });
      } else if (typeof value === 'string' && value.length > 0) {
        applied.push({
          key,
          value,
          label: key.charAt(0).toUpperCase() + key.slice(1)
        });
      }
    });
    
    return applied;
  };

  const filteredData = mockData.filter(item => {
    // Search filter
    if (currentFilters.search && typeof currentFilters.search === 'string') {
      const searchTerm = currentFilters.search.toLowerCase();
      if (!item.title.toLowerCase().includes(searchTerm) && 
          !item.subtitle.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }

    // Category filter
    if (currentFilters.categories && Array.isArray(currentFilters.categories)) {
      if (currentFilters.categories.length > 0 && 
          !currentFilters.categories.includes(item.category)) {
        return false;
      }
    }

    // Status filter
    if (currentFilters.statuses && Array.isArray(currentFilters.statuses)) {
      if (currentFilters.statuses.length > 0 && 
          !currentFilters.statuses.includes(item.status)) {
        return false;
      }
    }

    return true;
  });

  const handleApplyFilters = (filters: Record<string, unknown>) => {
    setCurrentFilters(filters);
  };

  const handleResetFilters = () => {
    setCurrentFilters({});
  };

  const handleRemoveFilter = (filterKey: string) => {
    const newFilters = { ...currentFilters };
    delete newFilters[filterKey];
    setCurrentFilters(newFilters);
  };

  const handleExport = () => {
    console.log('Exporting data...', filteredData);
  };

  const handleAdd = () => {
    console.log('Adding new item...');
  };

  const handleGroupAction = (groupId: string) => {
    console.log('Group action for:', groupId);
  };

  return (
    <Container className="py-6">
      <Stack spacing={6}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Demo - Sistema Mobile Completo</h1>
          <p className="text-green-100">
            Demonstração de um sistema completo com filtros, busca e visualização de dados responsiva
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <MobileFilterButton
              onClick={() => setFiltersOpen(true)}
              filtersCount={getActiveFiltersCount()}
            />
            <Button variant="secondary" icon={Search}>
              Busca Avançada
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                icon={Grid}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                icon={List}
                onClick={() => setViewMode('list')}
              >
                Lista
              </Button>
            </div>
            <Button variant="secondary" icon={Download} onClick={handleExport}>
              Exportar
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleAdd}>
              Adicionar
            </Button>
          </div>
        </div>

        {/* Applied Filters */}
        {getAppliedFilters().length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Filtros Aplicados:</h3>
            <AppliedFilters 
              filters={getAppliedFilters()} 
              onRemove={handleRemoveFilter}
            />
          </div>
        )}

        {/* Results Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">
                {filteredData.length} resultados encontrados
              </h3>
              <p className="text-sm text-blue-700">
                {mockData.length - filteredData.length > 0 && 
                  `${mockData.length - filteredData.length} itens filtrados`}
              </p>
            </div>
            {filteredData.length > 0 && (
              <Button size="sm" variant="ghost" onClick={() => handleGroupAction('all')}>
                Ação em Lote
              </Button>
            )}
          </div>
        </div>

        {/* Data Cards */}
        {filteredData.length > 0 ? (
          <MobileDataCardList viewMode={viewMode}>
            {filteredData.map(item => (
              <MobileDataCard
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                value={item.value}
                badge={item.badge}
                icon={item.icon}
                status={item.status}
                metadata={[
                  { label: 'Categoria', value: item.category },
                  { label: 'Fornecedor', value: item.supplier },
                  { label: 'Região', value: item.region }
                ]}
                onClick={() => console.log('Clicked:', item.title)}
              />
            ))}
          </MobileDataCardList>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Tente ajustar os filtros ou termos de busca
            </p>
            <Button variant="secondary" onClick={handleResetFilters}>
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Filters Modal */}
        <MobileFilters
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          filters={currentFilters}
          options={filterOptions}
          searchPlaceholder="Buscar SKUs, fornecedores..."
          showDateRange={true}
          showLocation={true}
        />

        {/* Performance Metrics */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas do Sistema</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mockData.length}</div>
              <div className="text-sm text-gray-600">Total de Itens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{filteredData.length}</div>
              <div className="text-sm text-gray-600">Filtrados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{getActiveFiltersCount()}</div>
              <div className="text-sm text-gray-600">Filtros Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">150ms</div>
              <div className="text-sm text-gray-600">Tempo de Busca</div>
            </div>
          </div>
        </div>
      </Stack>
    </Container>
  );
}
