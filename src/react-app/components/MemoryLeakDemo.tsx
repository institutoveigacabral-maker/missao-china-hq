import { useState } from 'react';
import { 
  useSafeAsync, 
  useSafeApiCall, 
  useSafePolling 
} from '@/react-app/hooks/useSafeAsync';
import {
  useSafeEffect,
  useEventListener,
  useSafeAsyncState,
  useSafeTimer,
  useSafeFetch,
  useMemoryLeakDetector,
  
  useSafeLocalStorage
} from '@/react-app/utils/memoryLeakPatterns';
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Timer, 
  Wifi, 
  Search,
  MemoryStick,
  Activity,
  Shield,
  Zap
} from 'lucide-react';

interface MemoryLeakDemoProps {
  className?: string;
}

export default function MemoryLeakDemo({ className = '' }: MemoryLeakDemoProps) {
  // Memory leak detector para este componente
  useMemoryLeakDetector('MemoryLeakDemo');
  
  // Demonstrações dos hooks seguros
  const [, setDemoType] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Safe async state
  const [safeCounter, setSafeCounter] = useSafeAsyncState(0);
  
  // Safe timers
  const { setSafeTimeout, setSafeInterval, clearSafeInterval } = useSafeTimer();
  
  // Safe fetch
  const { safeFetch } = useSafeFetch();
  
  // Safe debounced state (unused in demo but available)
  // const [searchTerm, setSearchTerm] = useSafeDebouncedState('', 500);
  
  // Safe localStorage
  const [persistedData, setPersistedData] = useSafeLocalStorage('demo-data', { count: 0, name: 'Demo' });
  
  // Safe async hook
  const {
    data: asyncData,
    loading: asyncLoading,
    error: asyncError,
    execute: executeAsync
  } = useSafeAsync(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { message: 'Async operation completed safely!', timestamp: Date.now() };
  }, [], { immediate: false });
  
  // Safe API call
  const {
    data: apiData,
    loading: apiLoading,
    error: apiError
  } = useSafeApiCall('/api/dashboard', {}, []);
  
  // Safe polling
  const {
    data: pollingData,
    start: startPolling,
    stop: stopPolling,
    isPolling
  } = useSafePolling(async () => {
    return { time: new Date().toLocaleTimeString(), random: Math.random() };
  }, 3000, { enabled: false });
  
  // Event listener demo
  useEventListener('keydown', (event) => {
    if (event instanceof KeyboardEvent && event.key === 'Escape') {
      addLog('ESC key pressed - event listener working safely');
    }
  });
  
  // Safe effect demo
  useSafeEffect();
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  const handleTimerDemo = () => {
    setDemoType('timer');
    addLog('Timer demo iniciado');
    
    setSafeTimeout(() => {
      addLog('Timer executado com segurança');
      setSafeCounter(prev => prev + 1);
    }, 2000);
    
    addLog('Timer agendado (2s)');
  };
  
  const handleIntervalDemo = () => {
    setDemoType('interval');
    addLog('Interval demo iniciado');
    
    let counter = 0;
    const interval = setSafeInterval(() => {
      counter++;
      addLog(`Interval tick ${counter}`);
      setSafeCounter(prev => prev + 1);
      
      if (counter >= 5) {
        clearSafeInterval(interval!);
        addLog('Interval finalizado automaticamente');
      }
    }, 1000);
    
    addLog('Interval iniciado (1s)');
  };
  
  const handleFetchDemo = async () => {
    setDemoType('fetch');
    addLog('Fetch demo iniciado');
    
    try {
      const response = await safeFetch('/api/dashboard');
      if (response) {
        addLog('Fetch executado com sucesso');
        const data = await response.json();
        addLog(`Dados recebidos: ${Object.keys(data).length} propriedades`);
      } else {
        addLog('Fetch cancelado ou componente desmontado');
      }
    } catch (error) {
      addLog(`Fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const handleAsyncDemo = () => {
    setDemoType('async');
    addLog('Async demo iniciado');
    executeAsync();
  };
  
  const handlePollingDemo = () => {
    if (isPolling) {
      stopPolling();
      addLog('Polling parado');
    } else {
      startPolling();
      addLog('Polling iniciado (3s interval)');
    }
    setDemoType('polling');
  };
  
  const handleLocalStorageDemo = () => {
    setDemoType('localStorage');
    const newData = {
      count: persistedData.count + 1,
      name: `Demo ${Date.now()}`
    };
    setPersistedData(newData);
    addLog(`LocalStorage atualizado: count=${newData.count}`);
  };
  
  const handleMemoryStress = () => {
    setDemoType('stress');
    addLog('Memory stress test iniciado');
    
    // Simula vazamento de memória controlado
    const largeArray = new Array(100000).fill(0).map((_, i) => ({
      id: i,
      data: `Large object ${i}`,
      timestamp: Date.now()
    }));
    
    addLog(`Criado array com ${largeArray.length} objetos`);
    
    // Cleanup automático após 5 segundos
    setSafeTimeout(() => {
      largeArray.length = 0;
      addLog('Array limpo automaticamente');
    }, 5000);
  };
  
  const clearLogs = () => {
    setLogs([]);
    setSafeCounter(0);
  };
  
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-lg ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white rounded-t-xl">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Memory Leak Prevention Demo</h2>
            <p className="text-blue-100">Demonstração dos padrões seguros implementados</p>
          </div>
        </div>
        
        {/* Real-time stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-xl font-bold">{safeCounter}</div>
            <div className="text-sm text-blue-100">Safe Operations</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-xl font-bold">{logs.length}</div>
            <div className="text-sm text-blue-100">Log Entries</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="text-xl font-bold">{persistedData.count}</div>
            <div className="text-sm text-blue-100">Persisted Count</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center justify-center">
              {isPolling ? (
                <Activity className="w-5 h-5 animate-pulse text-green-300" />
              ) : (
                <div className="w-5 h-5 bg-slate-400 rounded-full opacity-50" />
              )}
            </div>
            <div className="text-sm text-blue-100">Polling Status</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Demo Controls */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Testes de Padrões Seguros</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SecondaryButton
              onClick={handleTimerDemo}
              icon={Timer}
              size="sm"
              className="w-full"
            >
              Safe Timer
            </SecondaryButton>
            
            <SecondaryButton
              onClick={handleIntervalDemo}
              icon={Activity}
              size="sm"
              className="w-full"
            >
              Safe Interval
            </SecondaryButton>
            
            <SecondaryButton
              onClick={handleFetchDemo}
              icon={Wifi}
              size="sm"
              className="w-full"
              disabled={apiLoading}
            >
              Safe Fetch
            </SecondaryButton>
            
            <SecondaryButton
              onClick={handleAsyncDemo}
              icon={Zap}
              size="sm"
              className="w-full"
              disabled={asyncLoading}
            >
              Safe Async
            </SecondaryButton>
            
            <SecondaryButton
              onClick={handlePollingDemo}
              icon={Search}
              size="sm"
              className="w-full"
            >
              {isPolling ? 'Stop Poll' : 'Start Poll'}
            </SecondaryButton>
            
            <SecondaryButton
              onClick={handleLocalStorageDemo}
              icon={MemoryStick}
              size="sm"
              className="w-full"
            >
              LocalStorage
            </SecondaryButton>
            
            <SecondaryButton
              onClick={handleMemoryStress}
              icon={AlertTriangle}
              size="sm"
              className="w-full"
            >
              Memory Stress
            </SecondaryButton>
            
            <PrimaryButton
              onClick={clearLogs}
              size="sm"
              className="w-full"
            >
              Clear Logs
            </PrimaryButton>
          </div>
        </div>
        
        {/* Status Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Async Operations Status */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-3">Async Operations</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Safe Async:</span>
                {asyncLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-600 text-sm">Loading...</span>
                  </div>
                ) : asyncData ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : asyncError ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <div className="w-5 h-5 bg-slate-300 rounded-full" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">API Call:</span>
                {apiLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-600 text-sm">Loading...</span>
                  </div>
                ) : apiData ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : apiError ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <div className="w-5 h-5 bg-slate-300 rounded-full" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Polling:</span>
                {isPolling ? (
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-green-600 animate-pulse" />
                    <span className="text-green-600 text-sm">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-slate-300 rounded-full" />
                    <span className="text-slate-500 text-sm">Stopped</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Real-time Data */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-3">Real-time Data</h4>
            <div className="space-y-2 text-sm">
              {pollingData && (
                <div className="bg-white rounded p-2 border border-slate-200">
                  <div className="font-medium text-green-600">Polling Data:</div>
                  <div className="text-slate-600">Time: {pollingData.time}</div>
                  <div className="text-slate-600">Random: {pollingData.random.toFixed(4)}</div>
                </div>
              )}
              
              {asyncData && (
                <div className="bg-white rounded p-2 border border-slate-200">
                  <div className="font-medium text-blue-600">Async Result:</div>
                  <div className="text-slate-600">{asyncData.message}</div>
                </div>
              )}
              
              <div className="bg-white rounded p-2 border border-slate-200">
                <div className="font-medium text-violet-600">Persisted Data:</div>
                <div className="text-slate-600">Name: {persistedData.name}</div>
                <div className="text-slate-600">Count: {persistedData.count}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activity Log */}
        <div className="bg-slate-900 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3">Activity Log (últimas 10 entradas)</h4>
          <div className="bg-black rounded p-3 font-mono text-sm max-h-48 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-slate-500">Aguardando atividade...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-green-400 mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Como Usar</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>Safe Timer:</strong> Demonstra setTimeout que não executa após unmount</p>
            <p>• <strong>Safe Interval:</strong> Demonstra setInterval com cleanup automático</p>
            <p>• <strong>Safe Fetch:</strong> Demonstra fetch com AbortController</p>
            <p>• <strong>Safe Async:</strong> Demonstra operação assíncrona segura</p>
            <p>• <strong>Polling:</strong> Demonstra polling que pode ser parado/iniciado</p>
            <p>• <strong>LocalStorage:</strong> Demonstra persistence segura</p>
            <p>• <strong>Memory Stress:</strong> Testa cleanup de objetos grandes</p>
            <p>• <strong>ESC Key:</strong> Pressione ESC para testar event listener</p>
          </div>
        </div>
      </div>
    </div>
  );
}
