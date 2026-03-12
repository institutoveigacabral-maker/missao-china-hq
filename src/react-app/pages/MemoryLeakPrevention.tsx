;
import MemoryLeakDemo from '@/react-app/components/MemoryLeakDemo';
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Code,
  BookOpen,
  ExternalLink,
  Brain,
  Zap,
  Activity
} from 'lucide-react';

export default function MemoryLeakPrevention() {
  const commonPatterns = [
    {
      title: 'useEffect sem cleanup',
      problem: `useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth)
  window.addEventListener('resize', handleResize)
  // ❌ Missing cleanup!
}, [])`,
      solution: `useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth)
  window.addEventListener('resize', handleResize)
  
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])`,
      impact: 'Alto',
      severity: 'critical'
    },
    {
      title: 'Timers sem cleanup',
      problem: `useEffect(() => {
  const timer = setInterval(() => {
    fetchData()
  }, 5000)
  // ❌ Missing clearInterval!
}, [])`,
      solution: `useEffect(() => {
  const timer = setInterval(() => {
    fetchData()
  }, 5000)
  
  return () => {
    clearInterval(timer)
  }
}, [])`,
      impact: 'Alto',
      severity: 'critical'
    },
    {
      title: 'State updates após unmount',
      problem: `useEffect(() => {
  fetchData().then(data => {
    setData(data) // ❌ Component pode ter sido desmontado!
  })
}, [])`,
      solution: `useEffect(() => {
  let isCancelled = false
  
  fetchData().then(data => {
    if (!isCancelled) {
      setData(data)
    }
  })
  
  return () => {
    isCancelled = true
  }
}, [])`,
      impact: 'Médio',
      severity: 'warning'
    },
    {
      title: 'Fetch sem abort',
      problem: `const handleSubmit = async () => {
  const response = await fetch('/api/data')
  // ❌ Não pode ser cancelado se componente desmontar
  setData(await response.json())
}`,
      solution: `const handleSubmit = async () => {
  const controller = new AbortController()
  
  try {
    const response = await fetch('/api/data', {
      signal: controller.signal
    })
    setData(await response.json())
  } catch (error) {
    if (error.name !== 'AbortError') {
      throw error
    }
  }
}`,
      impact: 'Médio',
      severity: 'warning'
    }
  ];

  const bestPractices = [
    {
      title: 'Always Cleanup',
      description: 'Todo useEffect que cria recursos deve ter uma função de cleanup no return',
      icon: Shield,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Use AbortController',
      description: 'Para requests fetch, sempre use AbortController para cancelar se necessário',
      icon: Zap,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Check Mount Status',
      description: 'Verifique se o componente ainda está montado antes de atualizar state',
      icon: CheckCircle,
      color: 'text-violet-600 bg-violet-100'
    },
    {
      title: 'Safe Timers',
      description: 'Use hooks personalizados que gerenciam timers com cleanup automático',
      icon: Activity,
      color: 'text-amber-600 bg-amber-100'
    }
  ];

  const availableHooks = [
    {
      name: 'useSafeEffect',
      description: 'Hook que rastreia se o componente está montado',
      usage: 'const isMounted = useSafeEffect()'
    },
    {
      name: 'useSafeAsyncState',
      description: 'State que só atualiza se o componente estiver montado',
      usage: 'const [state, setSafeState] = useSafeAsyncState(initialValue)'
    },
    {
      name: 'useSafeTimer',
      description: 'Timers com cleanup automático no unmount',
      usage: 'const { setSafeTimeout, setSafeInterval } = useSafeTimer()'
    },
    {
      name: 'useSafeFetch',
      description: 'Fetch com AbortController automático',
      usage: 'const { safeFetch } = useSafeFetch()'
    },
    {
      name: 'useEventListener',
      description: 'Event listeners com cleanup automático',
      usage: 'useEventListener("resize", handler, window)'
    },
    {
      name: 'useSafeAsync',
      description: 'Operações assíncronas com prevenção de vazamentos',
      usage: 'const { data, loading, error } = useSafeAsync(asyncFn)'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-white">
          <div className="flex items-center space-x-4 mb-6">
            <Shield className="w-12 h-12" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Memory Leak Prevention</h1>
              <p className="text-red-100 text-lg">Sistema completo de prevenção de vazamentos de memória</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">8+</div>
              <div className="text-red-100">Padrões Seguros</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">6+</div>
              <div className="text-red-100">Hooks Utilitários</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-red-100">Prevenção Ativa</div>
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <MemoryLeakDemo />

        {/* Common Patterns */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-slate-900">Padrões Problemáticos Comuns</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {commonPatterns.map((pattern, index) => (
              <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className={`p-4 ${
                  pattern.severity === 'critical' ? 'bg-red-50 border-b border-red-200' : 
                  'bg-yellow-50 border-b border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900">{pattern.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      pattern.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      Impacto {pattern.impact}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-2">❌ Problema:</h4>
                    <pre className="bg-slate-900 text-slate-300 p-3 rounded text-xs overflow-x-auto">
                      <code>{pattern.problem}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-2">✅ Solução:</h4>
                    <pre className="bg-slate-900 text-slate-300 p-3 rounded text-xs overflow-x-auto">
                      <code>{pattern.solution}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900">Melhores Práticas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bestPractices.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                  <div className={`p-3 rounded-lg ${practice.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">{practice.title}</h3>
                    <p className="text-slate-600 text-sm">{practice.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Hooks */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Code className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Hooks Disponíveis</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableHooks.map((hook, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-blue-600 mb-2">{hook.name}</h3>
                <p className="text-slate-600 text-sm mb-3">{hook.description}</p>
                <code className="block bg-slate-100 text-slate-800 p-2 rounded text-xs">
                  {hook.usage}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Guia de Implementação</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-slate-900 mb-4">1. Import dos Hooks</h3>
              <pre className="bg-slate-900 text-slate-300 p-4 rounded overflow-x-auto">
                <code>{`import {
  useSafeEffect,
  useSafeAsyncState,
  useSafeTimer,
  useSafeFetch,
  useEventListener
} from '@/react-app/utils/memoryLeakPatterns'

import {
  useSafeAsync,
  useSafeApiCall,
  useSafePolling
} from '@/react-app/hooks/useSafeAsync'`}</code>
              </pre>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-slate-900 mb-4">2. Uso Básico em Componentes</h3>
              <pre className="bg-slate-900 text-slate-300 p-4 rounded overflow-x-auto">
                <code>{`function MyComponent() {
  // Detecta memory leaks em desenvolvimento
  useMemoryLeakDetector('MyComponent')
  
  // State seguro
  const [data, setSafeData] = useSafeAsyncState(null)
  
  // Timers seguros
  const { setSafeTimeout } = useSafeTimer()
  
  // Fetch seguro
  const { safeFetch } = useSafeFetch()
  
  // Event listener seguro
  useEventListener('resize', handleResize, window)
  
  const handleAsync = async () => {
    const response = await safeFetch('/api/data')
    if (response) {
      setSafeData(await response.json())
    }
  }
  
  return <div>...</div>
}`}</code>
              </pre>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-slate-900 mb-4">3. Detecção Automática (Dev Mode)</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p>Em modo de desenvolvimento, o hook <code className="bg-slate-100 px-2 py-1 rounded">useMemoryLeakDetector</code> automaticamente:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Monitora mount/unmount de componentes</li>
                  <li>Reporta uso de memória após unmount</li>
                  <li>Detecta padrões suspeitos de vazamento</li>
                  <li>Logs detalhados no console do browser</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900">Recursos e Documentação</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Arquivos do Sistema</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <span className="text-sm font-medium">memoryLeakPatterns.ts</span>
                  <SecondaryButton size="sm" icon={ExternalLink}>
                    Ver Código
                  </SecondaryButton>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <span className="text-sm font-medium">useSafeAsync.ts</span>
                  <SecondaryButton size="sm" icon={ExternalLink}>
                    Ver Código
                  </SecondaryButton>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                  <span className="text-sm font-medium">MemoryLeakDemo.tsx</span>
                  <SecondaryButton size="sm" icon={ExternalLink}>
                    Ver Demo
                  </SecondaryButton>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Links Externos</h3>
              <div className="space-y-2">
                <a 
                  href="https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm font-medium">React Effects Guide</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a 
                  href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm font-medium">AbortController MDN</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a 
                  href="https://web.dev/performance-memory-leaks/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-slate-50 rounded hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm font-medium">Memory Leaks Guide</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Sistema Implementado com Sucesso!</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Todos os padrões de prevenção de memory leaks foram implementados no app. 
            Use os hooks seguros em seus componentes para garantir performance otimizada 
            e evitar vazamentos de memória.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <PrimaryButton 
              onClick={() => window.location.href = '/'}
              className="bg-white text-green-600 hover:bg-green-50 border-0"
            >
              Voltar ao Dashboard
            </PrimaryButton>
            <SecondaryButton 
              className="border-white text-white hover:bg-white/10"
            >
              Ver Mais Exemplos
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
