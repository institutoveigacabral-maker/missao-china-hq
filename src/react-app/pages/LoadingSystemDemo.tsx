import { useState } from 'react'

import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button'
import { 
  useLoading, 
  useLoadingContext
} from '@/react-app/providers/LoadingProvider'
import { 
  useAdvancedLoading, 
  useBatchLoading, 
  useConditionalLoading
} from '@/react-app/hooks/useAdvancedLoading'
import {
  LoadingSpinner,
  LoadingDots,
  LoadingProgress,
  LoadingSkeleton,
  LoadingCardSkeleton,
  LoadingOverlay,
  LoadingState,
  LoadingButton,
  DelayedLoading
} from '@/react-app/components/ui/LoadingComponents'
import { 
  RefreshCw, 
  Settings, 
  Database,
  Cpu,
  Zap,
  Shield
} from 'lucide-react'

export default function LoadingSystemDemo() {
  const [demoState, setDemoState] = useState<'loading' | 'success' | 'error' | 'idle'>('idle')
  const [progress, setProgress] = useState(0)
  const [showOverlay, setShowOverlay] = useState(false)
  
  // Loading context
  const { 
    isAnyLoading, 
    getLoadingKeys, 
    clearAllLoading,
    setLoading
  } = useLoadingContext()
  
  // Basic loading hook
  const basicLoading = useLoading('demo-basic')
  
  // Advanced loading with retry
  const advancedLoading = useAdvancedLoading({
    key: 'demo-advanced',
    timeout: 5000,
    retryCount: 2,
    retryDelay: 1000
  })
  
  // Batch loading
  const batchLoading = useBatchLoading('demo-batch')
  
  // Conditional loading
  const conditionalLoading = useConditionalLoading(
    () => progress > 0 && progress < 100,
    'demo-conditional'
  )
  const { isLoading: isConditionalLoading } = useLoadingContext()
  
  // Demo functions
  const simulateBasicLoading = () => {
    basicLoading.start()
    setTimeout(() => basicLoading.stop(), 2000)
  }
  
  const simulatePromiseLoading = async () => {
    setLoading('demo-promise', true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setDemoState('success')
    } catch (error) {
      setDemoState('error')
    } finally {
      setLoading('demo-promise', false)
    }
  }
  
  const simulateAdvancedLoading = async () => {
    setDemoState('loading')
    try {
      await advancedLoading.withLoading(async () => {
        // Simulate 50% failure rate
        if (Math.random() < 0.5) {
          throw new Error('Simulated failure')
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { success: true }
      }, 'advanced-retry', {
        successMessage: 'Advanced operation succeeded!',
        onSuccess: () => setDemoState('success'),
        onError: () => setDemoState('error')
      })
    } catch (error) {
      console.error('Advanced operation failed:', error)
    }
  }
  
  const simulateBatchLoading = async () => {
    const operations = [
      { 
        key: 'fetch-users', 
        operation: async () => ({ users: 100 }),
        options: { successMessage: 'Users loaded!' }
      },
      { 
        key: 'fetch-posts', 
        operation: async () => ({ posts: 50 }),
        options: { successMessage: 'Posts loaded!' }
      },
      { 
        key: 'fetch-comments', 
        operation: async () => ({ comments: 200 }),
        options: { successMessage: 'Comments loaded!' }
      },
      { 
        key: 'fetch-analytics', 
        operation: async () => ({ analytics: 'done' }),
        options: { successMessage: 'Analytics ready!' }
      },
    ]
    
    await batchLoading.executeBatch(operations, (completed, total) => {
      setBatchProgress({ 
        completed, 
        total, 
        percentage: (completed / total) * 100 
      })
      console.log(`Batch progress: ${completed}/${total}`)
    })
  }
  
  const simulateProgressLoading = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }
  
  const toggleConditionalLoading = () => {
    // Toggle progress to test conditional loading
    setProgress(prev => prev > 0 ? 0 : 50)
  }
  
  const toggleBasicLoading = () => {
    if (basicLoading.isLoading) {
      basicLoading.stop()
    } else {
      basicLoading.start()
    }
  }
  
  const [batchProgress, setBatchProgress] = useState({ completed: 0, total: 0, percentage: 0 })
  
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Cpu className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Sistema de Loading Avançado</h1>
              </div>
              <p className="text-purple-100 text-lg mb-4">
                Demonstração completa do sistema de loading com prevenção de memory leaks
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Memory Safe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Hooks Avançados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Context Provider</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{getLoadingKeys().length}</div>
              <div className="text-purple-100">Estados Ativos</div>
              <div className="text-sm text-purple-200 mt-1">
                {isAnyLoading() ? 'Carregando...' : 'Inativo'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Global Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Controles Globais</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <SecondaryButton
              onClick={clearAllLoading}
              icon={RefreshCw}
            >
              Limpar Todos
            </SecondaryButton>
            <SecondaryButton
              onClick={() => setShowOverlay(!showOverlay)}
              icon={Settings}
            >
              Toggle Overlay Global
            </SecondaryButton>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium text-slate-800 mb-2">Estados Ativos:</h3>
            {getLoadingKeys().length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhum loading ativo</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {getLoadingKeys().map(key => (
                  <span 
                    key={key} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {key}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Loading Components Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spinners and Visual Elements */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Componentes Visuais</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-slate-700 mb-3">Spinners</h4>
                <div className="flex items-center space-x-4">
                  <LoadingSpinner size="sm" color="blue" />
                  <LoadingSpinner size="md" color="green" />
                  <LoadingSpinner size="lg" color="purple" />
                  <LoadingSpinner size="xl" color="red" />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-700 mb-3">Loading Dots</h4>
                <div className="space-y-2">
                  <LoadingDots color="bg-blue-600" />
                  <LoadingDots color="bg-green-600" />
                  <LoadingDots color="bg-purple-600" />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-700 mb-3">Progress Bar</h4>
                <LoadingProgress 
                  progress={progress} 
                  label="Simulação de Progresso"
                  color="bg-green-600"
                />
                <PrimaryButton
                  onClick={simulateProgressLoading}
                  className="mt-2"
                  size="sm"
                >
                  Simular Progresso
                </PrimaryButton>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-700 mb-3">Skeleton Loading</h4>
                <LoadingSkeleton lines={3} className="mb-4" />
                <LoadingCardSkeleton />
              </div>
            </div>
          </div>
          
          {/* Loading States */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Estados de Loading</h3>
            <div className="space-y-4">
              <LoadingState state="loading" />
              <LoadingState state="success" />
              <LoadingState state="error" />
              <LoadingState state="idle" />
              
              <div className="pt-4 border-t">
                <h4 className="font-medium text-slate-700 mb-3">Estado Dinâmico</h4>
                <LoadingState state={demoState} />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setDemoState('loading')}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                  >
                    Loading
                  </button>
                  <button
                    onClick={() => setDemoState('success')}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded"
                  >
                    Success
                  </button>
                  <button
                    onClick={() => setDemoState('error')}
                    className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded"
                  >
                    Error
                  </button>
                  <button
                    onClick={() => setDemoState('idle')}
                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded"
                  >
                    Idle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hook Demonstrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Loading Hook */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">useLoading Hook</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  basicLoading.isLoading 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {basicLoading.isLoading ? 'Carregando' : 'Inativo'}
                </span>
                {basicLoading.isLoading && <LoadingSpinner size="sm" />}
              </div>
              
              <div className="flex gap-2">
                <LoadingButton
                  isLoading={basicLoading.isLoading}
                  onClick={simulateBasicLoading}
                  variant="primary"
                  size="sm"
                >
                  Simular Loading
                </LoadingButton>
                <SecondaryButton
                  onClick={toggleBasicLoading}
                  size="sm"
                >
                  Toggle
                </SecondaryButton>
              </div>
            </div>
          </div>
          
          {/* Promise Loading */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Promise Loading</h3>
            <div className="space-y-4">
              <LoadingButton
                isLoading={false}
                onClick={simulatePromiseLoading}
                variant="primary"
                size="sm"
              >
                Executar Promise
              </LoadingButton>
              
              <DelayedLoading 
                show={true} 
                delay={300}
                fallback={<p className="text-sm text-gray-500">Aguardando delay...</p>}
              >
                <p className="text-sm text-green-600">Loading mostrado após delay!</p>
              </DelayedLoading>
            </div>
          </div>
          
          {/* Advanced Loading with Retry */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Loading com Retry</h3>
            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                Advanced loading com retry automático
              </div>
              
              <LoadingButton
                isLoading={false}
                onClick={simulateAdvancedLoading}
                variant="primary"
                size="sm"
              >
                Testar com Retry
              </LoadingButton>
            </div>
          </div>
          
          {/* Batch Loading */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Batch Loading</h3>
            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                Operações: {batchProgress.completed}/{batchProgress.total}
              </div>
              
              {batchProgress.total > 0 && (
                <LoadingProgress 
                  progress={batchProgress.percentage}
                  label="Progresso do Batch"
                  color="bg-purple-600"
                />
              )}
              
              <LoadingButton
                isLoading={batchLoading.isLoading()}
                onClick={simulateBatchLoading}
                variant="primary"
                size="sm"
              >
                Executar Batch
              </LoadingButton>
            </div>
          </div>
          
          {/* Conditional Loading */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Loading Condicional</h3>
            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                Ativo quando progresso entre 1-99%
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  isConditionalLoading('demo-conditional') 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {isConditionalLoading('demo-conditional') ? 'Ativo' : 'Inativo'}
                </span>
                {isConditionalLoading('demo-conditional') && <LoadingSpinner size="sm" color="yellow" />}
              </div>
            </div>
          </div>
          
          {/* Conditional Loading */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Conditional Loading</h3>
            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                Ativo quando progresso está entre 1-99%
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  conditionalLoading.condition() 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {conditionalLoading.condition() ? 'Condition Met' : 'Condition Not Met'}
                </span>
                {conditionalLoading.isLoading() && <LoadingSpinner size="sm" color="purple" />}
              </div>
              
              <SecondaryButton
                onClick={toggleConditionalLoading}
                size="sm"
              >
                Toggle Progress ({progress}%)
              </SecondaryButton>
            </div>
          </div>
        </div>
        
        {/* Global Loading Overlay */}
        <LoadingOverlay 
          show={showOverlay} 
          message="Overlay global ativo para demonstração"
        >
          <SecondaryButton
            onClick={() => setShowOverlay(false)}
            size="sm"
          >
            Fechar Overlay
          </SecondaryButton>
        </LoadingOverlay>
      </div>
    </div>
  )
}
