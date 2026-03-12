import { useState } from 'react'
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button'
import { 
  useAdvancedLoading,
  useAsyncOperation,
  useBatchLoading,
  usePollingOperation,
  useConditionalLoading
} from '@/react-app/hooks/useAdvancedLoading'
import { useLoadingContext } from '@/react-app/providers/LoadingProvider'
import { 
  Zap, 
  Database, 
  RefreshCw, 
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  PlayCircle,
  StopCircle,
  Activity,
  Target,
  Layers,
  Timer
} from 'lucide-react'

export default function AdvancedLoadingDemo() {
  const [results, setResults] = useState<any[]>([])
  const [pollingActive, setPollingActive] = useState(false)
  const [batchProgress, setBatchProgress] = useState({ completed: 0, total: 0 })
  
  // Context for monitoring
  const { getLoadingKeys, isAnyLoading } = useLoadingContext()
  
  // Advanced loading hook
  const advancedLoading = useAdvancedLoading({
    key: 'advanced-demo',
    timeout: 10000,
    retryCount: 2,
    retryDelay: 1000
  })
  
  // Async operation hook
  const asyncOp = useAsyncOperation('async-demo')
  
  // Batch loading hook
  const batchLoading = useBatchLoading('batch-demo')
  
  // Polling hook
  const pollingOp = usePollingOperation(3000, 'polling-demo')
  
  // Conditional loading hook
  const conditionalLoading = useConditionalLoading(
    () => results.length > 0,
    'conditional-demo'
  )

  // Demo functions
  const simulateSuccessOperation = async () => {
    return advancedLoading.withLoading(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        return { success: true, data: 'Operation completed successfully!' }
      },
      'success-demo',
      {
        loadingMessage: 'Processing successful operation...',
        successMessage: 'Operation completed!',
        onSuccess: (data) => {
          setResults(prev => [...prev, data])
        }
      }
    )
  }

  const simulateFailureOperation = async () => {
    try {
      await advancedLoading.withLoading(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 1500))
          throw new Error('Simulated operation failure')
        },
        'failure-demo',
        {
          loadingMessage: 'Processing operation that will fail...',
          errorMessage: 'Operation failed as expected!',
          onError: (error) => {
            setResults(prev => [...prev, { error: error.message, timestamp: Date.now() }])
          }
        }
      )
    } catch (error) {
      // Error already handled by withLoading
    }
  }

  const simulateRetryOperation = async () => {
    let attempts = 0
    try {
      await advancedLoading.withLoading(
        async () => {
          attempts++
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Fail first 2 attempts, succeed on 3rd
          if (attempts < 3) {
            throw new Error(`Attempt ${attempts} failed`)
          }
          
          return { success: true, attempts, message: 'Succeeded after retries!' }
        },
        'retry-demo',
        {
          loadingMessage: 'Attempting operation with retries...',
          successMessage: `Success after ${attempts} attempts!`,
          onSuccess: (data) => {
            setResults(prev => [...prev, data])
          }
        }
      )
    } catch (error) {
      // Error handled by withLoading
    }
  }

  const simulateAsyncOperation = async () => {
    try {
      const result = await asyncOp.execute(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 1800))
          return { 
            id: Date.now(),
            message: 'Async operation completed',
            timestamp: new Date().toISOString()
          }
        },
        {
          loadingMessage: 'Executing async operation...',
          successMessage: 'Async operation successful!',
          onSuccess: (data) => {
            setResults(prev => [...prev, data])
          }
        }
      )
      
      console.log('Async operation result:', result)
    } catch (error) {
      console.error('Async operation failed:', error)
    }
  }

  const simulateFetchOperation = async () => {
    try {
      const result = await asyncOp.executeFetch(
        '/api/dashboard',
        {},
        {
          loadingMessage: 'Fetching dashboard data...',
          successMessage: 'Dashboard data loaded!',
          onSuccess: (data) => {
            setResults(prev => [...prev, { type: 'fetch', data: Object.keys(data).length + ' properties' }])
          },
          onError: (error) => {
            setResults(prev => [...prev, { type: 'fetch-error', error: error.message }])
          }
        }
      )
      
      console.log('Fetch result:', result)
    } catch (error) {
      // Error handled by executeFetch
    }
  }

  const simulateBatchOperations = async () => {
    setBatchProgress({ completed: 0, total: 4 })
    
    const operations = [
      {
        key: 'fetch-users',
        operation: async () => {
          await new Promise(resolve => setTimeout(resolve, 1000))
          return { users: 150 }
        },
        options: { 
          successMessage: 'Users loaded!',
          onSuccess: () => setResults(prev => [...prev, { type: 'users', count: 150 }])
        }
      },
      {
        key: 'fetch-orders',
        operation: async () => {
          await new Promise(resolve => setTimeout(resolve, 1500))
          return { orders: 85 }
        },
        options: { 
          successMessage: 'Orders loaded!',
          onSuccess: () => setResults(prev => [...prev, { type: 'orders', count: 85 }])
        }
      },
      {
        key: 'fetch-products',
        operation: async () => {
          await new Promise(resolve => setTimeout(resolve, 800))
          if (Math.random() < 0.3) throw new Error('Products fetch failed')
          return { products: 240 }
        },
        options: { 
          successMessage: 'Products loaded!',
          onSuccess: () => setResults(prev => [...prev, { type: 'products', count: 240 }])
        }
      },
      {
        key: 'fetch-analytics',
        operation: async () => {
          await new Promise(resolve => setTimeout(resolve, 1200))
          return { analytics: 'ready' }
        },
        options: { 
          successMessage: 'Analytics ready!',
          onSuccess: () => setResults(prev => [...prev, { type: 'analytics', status: 'ready' }])
        }
      }
    ] as Array<{
      key: string
      operation: () => Promise<any>
      options?: {
        loadingMessage?: string
        successMessage?: string
        errorMessage?: string
        showToast?: boolean
        onSuccess?: (data: any) => void
        onError?: (error: Error) => void
        onTimeout?: () => void
      }
    }>

    const results = await batchLoading.executeBatch(
      operations,
      (completed, total) => {
        setBatchProgress({ completed, total })
      }
    )

    console.log('Batch results:', results)
  }

  const togglePolling = () => {
    if (pollingActive) {
      pollingOp.stopLoading()
      setPollingActive(false)
    } else {
      const stopPolling = pollingOp.startPolling(
        async () => {
          const data = {
            timestamp: new Date().toLocaleTimeString(),
            random: Math.random().toFixed(4),
            status: 'polling active'
          }
          setResults(prev => [...prev.slice(-9), data]) // Keep last 10 results
          return data
        },
        {
          showToast: false,
          onError: (error) => {
            console.error('Polling failed:', error)
          }
        }
      )
      
      setPollingActive(true)
      
      // Auto stop after 30 seconds
      setTimeout(() => {
        stopPolling()
        setPollingActive(false)
      }, 30000)
    }
  }

  const simulateConditionalOperation = async () => {
    try {
      const result = await conditionalLoading.executeIfCondition(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 1500))
          return { 
            message: 'Conditional operation executed!',
            resultCount: results.length
          }
        },
        {
          loadingMessage: 'Checking condition and executing...',
          successMessage: 'Conditional operation succeeded!',
          onSuccess: (data) => {
            setResults(prev => [...prev, data])
          }
        }
      )
      
      if (result === null) {
        setResults(prev => [...prev, { 
          type: 'conditional-skipped', 
          message: 'Operation skipped - condition not met'
        }])
      }
    } catch (error) {
      console.error('Conditional operation failed:', error)
    }
  }

  const clearResults = () => {
    setResults([])
    setBatchProgress({ completed: 0, total: 0 })
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Advanced Loading System</h1>
              </div>
              <p className="text-violet-100 text-lg mb-4">
                Sistema completo de loading com retry, timeout, batch e polling
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Timer className="w-4 h-4" />
                  <span>Timeout & Retry</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4" />
                  <span>Batch Operations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Real-time Polling</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{getLoadingKeys().length}</div>
              <div className="text-violet-100">Loading States</div>
              <div className="text-sm text-violet-200 mt-1">
                {isAnyLoading() ? 'Active' : 'Idle'}
              </div>
            </div>
          </div>
        </div>

        {/* Global Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{getLoadingKeys().length}</div>
              <div className="text-sm text-slate-600">Active Loading States</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{results.length}</div>
              <div className="text-sm text-slate-600">Total Operations</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{batchProgress.completed}/{batchProgress.total}</div>
              <div className="text-sm text-slate-600">Batch Progress</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                {pollingActive ? (
                  <Activity className="w-5 h-5 text-green-600 animate-pulse" />
                ) : (
                  <div className="w-5 h-5 bg-slate-300 rounded-full" />
                )}
                <span className="text-sm text-slate-600">
                  {pollingActive ? 'Polling Active' : 'Polling Stopped'}
                </span>
              </div>
            </div>
          </div>
          
          {getLoadingKeys().length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Active Loading Keys:</h3>
              <div className="flex flex-wrap gap-2">
                {getLoadingKeys().map(key => (
                  <span key={key} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {key}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Operation Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Basic Operations</h3>
            <div className="space-y-3">
              <PrimaryButton
                onClick={simulateSuccessOperation}
                icon={CheckCircle2}
                disabled={advancedLoading.isLoading('success-demo')}
                className="w-full"
              >
                Success Operation
              </PrimaryButton>
              
              <SecondaryButton
                onClick={simulateFailureOperation}
                icon={XCircle}
                disabled={advancedLoading.isLoading('failure-demo')}
                className="w-full"
              >
                Failure Operation
              </SecondaryButton>
              
              <SecondaryButton
                onClick={simulateRetryOperation}
                icon={RefreshCw}
                disabled={advancedLoading.isLoading('retry-demo')}
                className="w-full"
              >
                Retry Operation (3 attempts)
              </SecondaryButton>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Async Operations</h3>
            <div className="space-y-3">
              <PrimaryButton
                onClick={simulateAsyncOperation}
                icon={Zap}
                disabled={asyncOp.isLoading}
                className="w-full"
              >
                Async Operation
              </PrimaryButton>
              
              <SecondaryButton
                onClick={simulateFetchOperation}
                icon={Database}
                disabled={asyncOp.isLoading}
                className="w-full"
              >
                Fetch Operation
              </SecondaryButton>
              
              <SecondaryButton
                onClick={simulateConditionalOperation}
                icon={Target}
                disabled={conditionalLoading.isLoading()}
                className="w-full"
              >
                Conditional Operation
                {!conditionalLoading.condition() && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Needs Results
                  </span>
                )}
              </SecondaryButton>
            </div>
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Batch Operations</h3>
            <div className="space-y-4">
              {batchProgress.total > 0 && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Batch Progress</span>
                    <span className="text-sm text-slate-600">{batchProgress.completed}/{batchProgress.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(batchProgress.completed / batchProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <PrimaryButton
                onClick={simulateBatchOperations}
                icon={Layers}
                disabled={batchLoading.isLoading()}
                className="w-full"
              >
                Execute Batch (4 operations)
              </PrimaryButton>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Polling Operations</h3>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Polling Status</span>
                  <div className="flex items-center space-x-2">
                    {pollingActive ? (
                      <>
                        <Activity className="w-4 h-4 text-green-600 animate-pulse" />
                        <span className="text-sm text-green-600">Active</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">Stopped</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <PrimaryButton
                onClick={togglePolling}
                icon={pollingActive ? StopCircle : PlayCircle}
                className="w-full"
              >
                {pollingActive ? 'Stop Polling' : 'Start Polling (3s interval)'}
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Operation Results</h3>
            <SecondaryButton
              onClick={clearResults}
              icon={RefreshCw}
              size="sm"
            >
              Clear Results
            </SecondaryButton>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No operations executed yet. Try the buttons above!</p>
              </div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="flex items-start justify-between">
                    <pre className="text-sm text-slate-700 flex-1 overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                    <span className="text-xs text-slate-500 ml-3">
                      #{results.length - index}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">🚀 Como Usar</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-slate-900 mb-3">Import dos Hooks</h4>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-sm overflow-x-auto">
                <code>{`import {
  useAdvancedLoading,
  useAsyncOperation,
  useBatchLoading,
  usePollingOperation,
  useConditionalLoading
} from '@/hooks/useAdvancedLoading'`}</code>
              </pre>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-slate-900 mb-3">Uso Básico</h4>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-sm overflow-x-auto">
                <code>{`const loading = useAdvancedLoading({
  timeout: 10000,
  retryCount: 3
})

// With loading wrapper
const result = await loading.withLoading(
  async () => fetchData(),
  'fetch-key',
  {
    successMessage: 'Data loaded!',
    errorMessage: 'Failed to load'
  }
)`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }
