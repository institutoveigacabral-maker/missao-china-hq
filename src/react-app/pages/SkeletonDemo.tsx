import React, { useState } from 'react'
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button'
import {
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  
  SkeletonForm,
  SkeletonDashboard,
  SkeletonNavigation,
  SkeletonShimmer,
  withSkeleton
} from '@/react-app/components/Loading/Skeleton'
import {
  ProgressiveSkeleton,
  AnimatedSkeleton,
  SmartSkeleton,
  SkeletonText,
  SkeletonButton,
  SkeletonImage,
  SkeletonAvatar,
  SkeletonDashboardStats,
  SkeletonChart
} from '@/react-app/components/Loading/AdvancedSkeleton'
import {
  useSkeleton,
  useSkeletonPromise,
  useAutoSkeleton,
  useSkeletonPagination,
  useSkeletonRefresh,
  useSkeletonGroup
} from '@/react-app/hooks/useSkeleton'
import { 
  Package, 
  Table, 
  List, 
  Grid3X3, 
  FileText, 
  BarChart3, 
  Navigation,
  Sparkles,
  RefreshCw,
  Play,
  Zap,
  Timer,
  Users,
  Database
} from 'lucide-react'

// Componente de exemplo para o withSkeleton HOC
const ExampleCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="bg-white p-6 rounded-lg border border-slate-200">
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{content}</p>
    <div className="flex space-x-2 mt-4">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">
        Ação Principal
      </button>
      <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm">
        Ação Secundária
      </button>
    </div>
  </div>
)

const SkeletonWrappedCard = withSkeleton(ExampleCard, () => <SkeletonCard variant="default" />)

// Simulação de dados
const generateMockData = (count: number) => 
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `Descrição do item ${i + 1}`,
    status: Math.random() > 0.5 ? 'ativo' : 'inativo'
  }))

export default function SkeletonDemo() {
  const [demoData, setDemoData] = useState<any[]>([])
  const [showShimmer, setShowShimmer] = useState(true)
  const [progressiveLoading, setProgressiveLoading] = useState(false)
  const [smartSkeletonLoading, setSmartSkeletonLoading] = useState(false)
  
  // Hooks de skeleton
  const basicSkeleton = useSkeleton('basic-demo', { 
    delay: 200, 
    minDuration: 1000,
    showShimmer 
  })
  
  const promiseSkeleton = useSkeletonPromise('promise-demo', {
    delay: 100,
    onStart: () => console.log('Promise skeleton started'),
    onEnd: () => console.log('Promise skeleton ended')
  })
  
  const autoSkeleton = useAutoSkeleton(demoData.length > 0 ? demoData : null, 'auto-demo')
  
  const paginationSkeleton = useSkeletonPagination('pagination-demo', {
    itemsPerPage: 5,
    totalPages: 3
  })
  
  const refreshSkeleton = useSkeletonRefresh('refresh-demo', 10000)
  
  
  
  const groupSkeleton = useSkeletonGroup(['group-1', 'group-2', 'group-3'])

  // Simulações de loading
  const simulateBasicLoading = () => {
    basicSkeleton.start()
    setTimeout(() => basicSkeleton.stop(), 3000)
  }

  const simulatePromiseLoading = async () => {
    await promiseSkeleton.executeWithSkeleton(async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      return 'Promise completed'
    })
  }

  const loadMockData = async () => {
    setDemoData([])
    await promiseSkeleton.executeWithSkeleton(async () => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setDemoData(generateMockData(10))
    })
  }

  const loadPage = async (page: number) => {
    await paginationSkeleton.loadPage(page, async (_pageNum) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return generateMockData(5)
    })
  }

  const refreshData = async () => {
    await refreshSkeleton.refresh(async () => {
      await new Promise(resolve => setTimeout(resolve, 1200))
      setDemoData(generateMockData(Math.floor(Math.random() * 15) + 5))
    })
  }

  const simulateGroupLoading = () => {
    groupSkeleton.startAll()
    setTimeout(() => groupSkeleton.stopAll(), 2500)
  }

  const startProgressiveLoading = () => {
    setProgressiveLoading(true)
    setTimeout(() => setProgressiveLoading(false), 8000) // Duração total dos estágios
  }

  const toggleSmartSkeleton = () => {
    setSmartSkeletonLoading(true)
    setTimeout(() => setSmartSkeletonLoading(false), 3000)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Sistema de Skeleton Loading</h1>
              </div>
              <p className="text-indigo-100 text-lg mb-4">
                Componentes de skeleton avançados com hooks especializados
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Timer className="w-4 h-4" />
                  <span>Delays Configuráveis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Shimmer Effects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>HOCs & Hooks</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">12</div>
              <div className="text-indigo-100">Componentes</div>
              <div className="text-sm text-indigo-200 mt-1">
                6 Hooks Especializados
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Controles Gerais</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <PrimaryButton
              onClick={simulateBasicLoading}
              icon={Play}
              disabled={basicSkeleton.isLoading}
            >
              Skeleton Básico
            </PrimaryButton>
            <SecondaryButton
              onClick={simulatePromiseLoading}
              icon={Database}
              disabled={promiseSkeleton.isLoading}
            >
              Promise Loading
            </SecondaryButton>
            <SecondaryButton
              onClick={loadMockData}
              icon={RefreshCw}
              disabled={autoSkeleton.isLoading}
            >
              Carregar Dados
            </SecondaryButton>
            <SecondaryButton
              onClick={simulateGroupLoading}
              icon={Users}
              disabled={groupSkeleton.isAnyLoading}
            >
              Group Loading
            </SecondaryButton>
            <SecondaryButton
              onClick={startProgressiveLoading}
              icon={Timer}
              disabled={progressiveLoading}
            >
              Progressive Loading
            </SecondaryButton>
            <SecondaryButton
              onClick={toggleSmartSkeleton}
              icon={Zap}
              disabled={smartSkeletonLoading}
            >
              Smart Skeleton
            </SecondaryButton>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showShimmer}
                onChange={(e) => setShowShimmer(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">Shimmer Effect</span>
            </label>
          </div>
        </div>

        {/* Basic Skeleton Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Skeleton Básico</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Linhas simples</h4>
                <Skeleton lines={3} />
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Tamanhos customizados</h4>
                <div className="space-y-2">
                  <Skeleton width="100%" height="2rem" />
                  <Skeleton width="70%" height="1.5rem" />
                  <Skeleton width="50%" height="1rem" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Formatos circulares</h4>
                <div className="flex space-x-3">
                  <Skeleton width="3rem" height="3rem" rounded />
                  <Skeleton width="4rem" height="4rem" rounded />
                  <Skeleton width="5rem" height="5rem" rounded />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">Shimmer Effect</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Com shimmer</h4>
                <SkeletonShimmer lines={2} />
              </div>
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Card com shimmer</h4>
                <div className="skeleton-shimmer">
                  <SkeletonCard variant="product" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Timer className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-slate-900">Progressive Loading</h3>
            </div>
            <div className="space-y-4">
              {progressiveLoading ? (
                <ProgressiveSkeleton
                  stages={[
                    {
                      component: <SkeletonText lines={1} />,
                      duration: 1000,
                      description: "Carregando título..."
                    },
                    {
                      component: <div className="space-y-3">
                        <SkeletonText lines={1} />
                        <SkeletonImage aspectRatio="16:9" />
                      </div>,
                      duration: 2000,
                      description: "Carregando imagem..."
                    },
                    {
                      component: <div className="space-y-3">
                        <SkeletonText lines={1} />
                        <SkeletonImage aspectRatio="16:9" />
                        <SkeletonText lines={3} />
                      </div>,
                      duration: 2000,
                      description: "Carregando conteúdo..."
                    }
                  ]}
                />
              ) : (
                <div className="text-center text-slate-500 py-8">
                  Clique em "Progressive Loading" para ver a demonstração
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-violet-600" />
              <h3 className="text-lg font-bold text-slate-900">Smart Skeleton</h3>
            </div>
            <SmartSkeleton 
              loading={smartSkeletonLoading}
              delay={200}
              minDuration={1000}
              skeleton={
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <SkeletonAvatar size="lg" shimmer />
                    <div className="space-y-2">
                      <SkeletonText lines={1} shimmer />
                      <SkeletonText lines={1} lastLineWidth="60%" shimmer />
                    </div>
                  </div>
                  <SkeletonImage height="150px" shimmer />
                  <div className="flex space-x-2">
                    <SkeletonButton variant="primary" size="md" shimmer />
                    <SkeletonButton variant="secondary" size="md" shimmer />
                  </div>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    JS
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">John Smith</h4>
                    <p className="text-slate-600 text-sm">Product Manager</p>
                  </div>
                </div>
                <div className="bg-slate-100 rounded-lg p-4 h-[150px] flex items-center justify-center">
                  <span className="text-slate-500">Conteúdo carregado!</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Ação Principal</button>
                  <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg">Cancelar</button>
                </div>
              </div>
            </SmartSkeleton>
          </div>
        </div>

        {/* Animation Types */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-slate-900">Animation Types</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700 text-sm">Pulse (Default)</h4>
              <AnimatedSkeleton animationType="pulse" speed="normal" height="2rem" />
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700 text-sm">Wave</h4>
              <AnimatedSkeleton animationType="wave" speed="normal" height="2rem" />
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700 text-sm">Shimmer</h4>
              <AnimatedSkeleton animationType="shimmer" speed="normal" height="2rem" />
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700 text-sm">Breathe</h4>
              <AnimatedSkeleton animationType="breathe" speed="normal" height="2rem" />
            </div>
          </div>
        </div>

        {/* Pre-built Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Cards</h3>
            </div>
            <div className="space-y-4">
              <SkeletonCard variant="default" shimmer={showShimmer} />
              <SkeletonCard variant="compact" shimmer={showShimmer} />
              <SkeletonCard variant="detailed" shimmer={showShimmer} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Table className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-slate-900">Tabela</h3>
            </div>
            <SkeletonTable rows={4} cols={3} shimmer={showShimmer} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <List className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-bold text-slate-900">Listas</h3>
            </div>
            <SkeletonList items={4} variant="simple" shimmer={showShimmer} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-bold text-slate-900">Formulário</h3>
            </div>
            <SkeletonForm fields={3} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Navigation className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-slate-900">Navegação</h3>
            </div>
            <SkeletonNavigation items={5} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Grid3X3 className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900">Lista Detalhada</h3>
            </div>
            <SkeletonList items={3} variant="detailed" />
          </div>
        </div>

        {/* Hook Demonstrations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Auto Skeleton Hook</h3>
            <div className="space-y-4">
              <div className="text-sm text-slate-600">
                Status: {autoSkeleton.hasData ? 'Dados carregados' : 'Sem dados'}
              </div>
              
              {autoSkeleton.shouldShow ? (
                <SkeletonList items={5} variant="simple" />
              ) : (
                <div className="space-y-2">
                  {demoData.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-slate-200 rounded">
                      <span className="font-medium">{item.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Pagination Skeleton</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  Página {paginationSkeleton.currentPage} de {paginationSkeleton.totalPages}
                </span>
                <div className="flex space-x-2">
                  {Array.from({ length: paginationSkeleton.totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => loadPage(i + 1)}
                      disabled={paginationSkeleton.isLoading}
                      className={`px-3 py-1 text-sm rounded ${
                        i + 1 === paginationSkeleton.currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
              
              {paginationSkeleton.shouldShow ? (
                <SkeletonList items={paginationSkeleton.itemsPerPage} variant="simple" />
              ) : (
                <div className="text-sm text-slate-600 p-4 text-center border border-slate-200 rounded">
                  Página {paginationSkeleton.currentPage} carregada
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Group Skeleton Demo */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Group Skeleton</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groupSkeleton.skeletons.map((skeleton, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-medium text-slate-700">Grupo {index + 1}</h4>
                {skeleton.shouldShow ? (
                  <SkeletonCard variant="default" />
                ) : (
                  <div className="p-4 border border-slate-200 rounded text-center text-sm text-slate-600">
                    Conteúdo do grupo {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-slate-600">
            Estado: {groupSkeleton.isAnyLoading ? 'Carregando' : 'Completo'} | 
            Todos carregando: {groupSkeleton.areAllLoading ? 'Sim' : 'Não'}
          </div>
        </div>

        {/* HOC Demo */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">withSkeleton HOC</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-700 mb-3">Com Loading</h4>
              <SkeletonWrappedCard
                isLoading={basicSkeleton.shouldShow}
                title="Card com HOC"
                content="Este card é envolvido pelo withSkeleton HOC e mostra skeleton quando isLoading=true"
              />
            </div>
            <div>
              <h4 className="font-medium text-slate-700 mb-3">Sem Loading</h4>
              <SkeletonWrappedCard
                isLoading={false}
                title="Card Normal"
                content="Este card mostra o conteúdo normal quando isLoading=false"
              />
            </div>
          </div>
        </div>

        {/* Dashboard Components */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Dashboard Stats</h3>
            </div>
            <SkeletonDashboardStats shimmer={showShimmer} />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-slate-900">Chart Skeleton</h3>
            </div>
            <SkeletonChart height="250px" shimmer={showShimmer} />
          </div>
        </div>

        {/* Dashboard Demo */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Full Dashboard Skeleton</h3>
            </div>
            <SecondaryButton
              onClick={refreshData}
              icon={RefreshCw}
              disabled={refreshSkeleton.isLoading}
            >
              Refresh
            </SecondaryButton>
          </div>
          
          {refreshSkeleton.shouldShow ? (
            <SkeletonDashboard />
          ) : (
            <div className="text-center py-12 text-slate-600">
              Dashboard carregado com {demoData.length} itens
              <div className="text-sm text-slate-500 mt-2">
                Último refresh: {new Date(refreshSkeleton.lastRefresh).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
