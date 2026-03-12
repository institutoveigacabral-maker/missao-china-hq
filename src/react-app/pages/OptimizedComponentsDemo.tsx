import React, { useState, useCallback, useMemo } from 'react'
import { 
  OptimizedList, 
  OptimizedSearch, 
  OptimizedCard,
  PerformanceDebugger 
} from '@/react-app/components/OptimizedComponents'
import { Badge } from '@/react-app/components/ui/Badge'
import { useRenderCount, useExpensiveComputation } from '@/react-app/hooks/useAdvancedPerformance'

// Sample data for demos
const generateSampleData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Books', 'Home'][i % 4],
    price: Math.floor(Math.random() * 1000) + 10,
    inStock: Math.random() > 0.3,
    rating: Math.floor(Math.random() * 5) + 1,
    description: `Description for item ${i + 1}`,
    supplier: `Supplier ${Math.floor(i / 10) + 1}`,
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
  }))
}

// Optimized List Demo
const OptimizedListDemo: React.FC = () => {
  useRenderCount('OptimizedListDemo')
  
  const [items] = useState(() => generateSampleData(50))
  const [filter, setFilter] = useState('')

  const filteredItems = useMemo(() => {
    if (!filter) return items
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase())
    )
  }, [items, filter])

  const renderItem = useCallback((item: any) => (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
        <Badge variant={item.inStock ? 'success' : 'error'}>
          {item.inStock ? 'Em Estoque' : 'Fora de Estoque'}
        </Badge>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-lg font-semibold text-blue-600">R$ {item.price}</span>
        <span className="text-sm text-gray-500">{item.category}</span>
      </div>
    </div>
  ), [])

  const keyExtractor = useCallback((item: any) => `item-${item.id}`, [])

  return (
    <OptimizedCard 
      title="Optimized List Demo" 
      subtitle={`Mostrando ${filteredItems.length} de ${items.length} itens`}
    >
      <div className="space-y-4">
        <OptimizedSearch
          onSearch={setFilter}
          placeholder="Buscar por nome ou categoria..."
          className="w-full"
        />
        
        <OptimizedList
          items={filteredItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          className="space-y-3 max-h-96 overflow-y-auto"
          emptyMessage="Nenhum item encontrado com os filtros aplicados"
        />
      </div>
    </OptimizedCard>
  )
}

// Performance Metrics Demo
const PerformanceMetricsDemo: React.FC = () => {
  useRenderCount('PerformanceMetricsDemo')
  
  const [complexity, setComplexity] = useState(100)
  
  const { result: computationResult, isComputing, cacheSize } = useExpensiveComputation(
    () => {
      // Expensive computation simulation
      let sum = 0
      for (let i = 0; i < complexity * 1000; i++) {
        sum += Math.sqrt(i) * Math.sin(i) * Math.cos(i)
      }
      return {
        result: sum.toFixed(2),
        iterations: complexity * 1000,
        timestamp: new Date().toLocaleTimeString()
      }
    },
    [complexity],
    { debounce: 500, cache: true, maxCacheSize: 10 }
  )

  return (
    <OptimizedCard 
      title="Performance Metrics Demo"
      subtitle="Demonstração de cache e computação otimizada"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complexidade da Computação: {complexity}
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ajuste para simular diferentes cargas de processamento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Cache Status</h4>
            <div className="text-sm text-blue-800">
              <p>Entradas: {cacheSize}/10</p>
              <p>Debounce: 500ms</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Computation</h4>
            <div className="text-sm text-green-800">
              <p>Status: {isComputing ? 'Calculando...' : 'Concluído'}</p>
              <p>Iterações: {computationResult?.iterations || 0}</p>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Resultado</h4>
            <div className="text-sm text-purple-800">
              <p className="font-mono">{computationResult?.result || 'Aguardando...'}</p>
              <p className="text-xs">{computationResult?.timestamp}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">💡 Otimizações Ativas</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Debouncing para evitar cálculos desnecessários</li>
            <li>• Cache inteligente para resultados recentes</li>
            <li>• Memoização profunda de componentes</li>
            <li>• Tracking de renders em desenvolvimento</li>
          </ul>
        </div>
      </div>
    </OptimizedCard>
  )
}

export default function OptimizedComponentsDemo() {
  useRenderCount('OptimizedComponentsDemo')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ⚡ Optimized Components Demo
          </h1>
          <p className="text-lg text-gray-600">
            Demonstração completa de componentes React otimizados para performance máxima
          </p>
        </div>

        <div className="space-y-8">
          {/* Optimized List Demo */}
          <OptimizedListDemo />

          {/* Performance Metrics Demo */}
          <PerformanceMetricsDemo />
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Performance Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Componente Otimizados</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• OptimizedList com memoização</li>
                <li>• OptimizedField com validação</li>
                <li>• OptimizedSearch com debouncing</li>
                <li>• OptimizedCard com rendering otimizado</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Performance Hooks</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• useRenderCount para debugging</li>
                <li>• useExpensiveComputation com cache</li>
                <li>• useDebouncedCallback</li>
                <li>• useWhyDidYouUpdate</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Otimizações Ativas</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Memoização com React.memo</li>
                <li>• Callbacks otimizados</li>
                <li>• Cache inteligente de resultados</li>
                <li>• Debouncing automático</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Development Performance Debugger */}
      <PerformanceDebugger 
        componentName="OptimizedComponentsDemo"
        props={{ timestamp: Date.now() }}
        position="bottom-right"
      />
    </div>
  )
}
