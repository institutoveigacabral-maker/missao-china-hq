import { useState } from 'react'

import { 
  LoadingButton,
  EnhancedLoadingButton,
  PrimaryLoadingButton,
  SecondaryLoadingButton,
  OutlineLoadingButton,
  GhostLoadingButton,
  PulseLoadingButton
} from '@/react-app/components/ui/LoadingButton'
import { 
  Download, 
  Save, 
  Send, 
  Upload, 
  Search,
  Play,
  Pause,
  Heart,
  Star,
  Settings,
  Zap,
  Code,
  Monitor
} from 'lucide-react'

export default function LoadingButtonDemo() {
  const [primaryLoading, setPrimaryLoading] = useState(false)
  const [secondaryLoading, setSecondaryLoading] = useState(false)
  const [outlineLoading, setOutlineLoading] = useState(false)
  const [ghostLoading, setGhostLoading] = useState(false)
  const [enhancedLoading, setEnhancedLoading] = useState(false)
  const [pulseLoading, setPulseLoading] = useState(false)

  const variants = ['primary', 'secondary', 'outline', 'ghost'] as const
  const sizes = ['sm', 'md', 'lg'] as const

  const handleAsyncAction = (setter: (loading: boolean) => void, duration = 2000) => {
    setter(true)
    setTimeout(() => setter(false), duration)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Sistema LoadingButton</h1>
              </div>
              <p className="text-blue-100 text-lg mb-4">
                Botões inteligentes com estados de loading integrados
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>4 Variantes + Enhanced</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4" />
                  <span>3 Tamanhos Responsivos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Spinner Integrado</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">6+</div>
              <div className="text-blue-100">Componentes</div>
              <div className="text-sm text-blue-200 mt-1">
                Ready-to-use
              </div>
            </div>
          </div>
        </div>

        {/* Basic Variants */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Variantes Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-4">
              <h3 className="font-medium text-slate-700">Primary</h3>
              <PrimaryLoadingButton
                loading={primaryLoading}
                onClick={() => handleAsyncAction(setPrimaryLoading)}
                loadingText="Salvando..."
              >
                Salvar Dados
              </PrimaryLoadingButton>
              <div className="text-xs text-slate-500">
                {primaryLoading ? 'Estado: Loading' : 'Estado: Idle'}
              </div>
            </div>

            <div className="text-center space-y-4">
              <h3 className="font-medium text-slate-700">Secondary</h3>
              <SecondaryLoadingButton
                loading={secondaryLoading}
                onClick={() => handleAsyncAction(setSecondaryLoading)}
                loadingText="Processando..."
              >
                Processar
              </SecondaryLoadingButton>
              <div className="text-xs text-slate-500">
                {secondaryLoading ? 'Estado: Loading' : 'Estado: Idle'}
              </div>
            </div>

            <div className="text-center space-y-4">
              <h3 className="font-medium text-slate-700">Outline</h3>
              <OutlineLoadingButton
                loading={outlineLoading}
                onClick={() => handleAsyncAction(setOutlineLoading)}
                loadingText="Carregando..."
              >
                Carregar
              </OutlineLoadingButton>
              <div className="text-xs text-slate-500">
                {outlineLoading ? 'Estado: Loading' : 'Estado: Idle'}
              </div>
            </div>

            <div className="text-center space-y-4">
              <h3 className="font-medium text-slate-700">Ghost</h3>
              <GhostLoadingButton
                loading={ghostLoading}
                onClick={() => handleAsyncAction(setGhostLoading)}
                loadingText="Enviando..."
              >
                Enviar
              </GhostLoadingButton>
              <div className="text-xs text-slate-500">
                {ghostLoading ? 'Estado: Loading' : 'Estado: Idle'}
              </div>
            </div>
          </div>
        </div>

        {/* Size Variations */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Variações de Tamanho</h2>
          <div className="space-y-6">
            {sizes.map(size => (
              <div key={size} className="space-y-4">
                <h3 className="font-medium text-slate-700 capitalize">Tamanho {size}</h3>
                <div className="flex flex-wrap gap-4">
                  {variants.map(variant => (
                    <LoadingButton
                      key={`${size}-${variant}`}
                      variant={variant}
                      size={size}
                      loading={false}
                    >
                      {`${variant.charAt(0).toUpperCase() + variant.slice(1)} ${size.toUpperCase()}`}
                    </LoadingButton>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced LoadingButton */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Enhanced LoadingButton</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-slate-700">Com Ícones</h3>
              <div className="space-y-3">
                <EnhancedLoadingButton
                  variant="primary"
                  icon={<Download className="w-4 h-4" />}
                  iconPosition="left"
                  loading={enhancedLoading}
                  onClick={() => handleAsyncAction(setEnhancedLoading)}
                  loadingText="Baixando..."
                >
                  Download
                </EnhancedLoadingButton>
                
                <EnhancedLoadingButton
                  variant="outline"
                  icon={<Upload className="w-4 h-4" />}
                  iconPosition="right"
                  fullWidth
                >
                  Upload Arquivo
                </EnhancedLoadingButton>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-slate-700">Com Shadow</h3>
              <div className="space-y-3">
                <EnhancedLoadingButton
                  variant="primary"
                  shadow
                  icon={<Save className="w-4 h-4" />}
                >
                  Salvar com Shadow
                </EnhancedLoadingButton>
                
                <EnhancedLoadingButton
                  variant="secondary"
                  shadow
                  rounded="full"
                  icon={<Send className="w-4 h-4" />}
                >
                  Enviar
                </EnhancedLoadingButton>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-slate-700">Especiais</h3>
              <div className="space-y-3">
                <PulseLoadingButton
                  variant="primary"
                  loading={pulseLoading}
                  onClick={() => handleAsyncAction(setPulseLoading, 3000)}
                  loadingText="Pulsando..."
                >
                  Pulse Button
                </PulseLoadingButton>
                
                <EnhancedLoadingButton
                  variant="ghost"
                  size="lg"
                  fullWidth
                  icon={<Heart className="w-5 h-5" />}
                >
                  Full Width Ghost
                </EnhancedLoadingButton>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Ações Interativas Simuladas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnhancedLoadingButton
              variant="primary"
              icon={<Search className="w-4 h-4" />}
              onClick={() => {
                // Simula busca
                alert('Iniciando busca...')
              }}
            >
              Buscar
            </EnhancedLoadingButton>

            <EnhancedLoadingButton
              variant="secondary"
              icon={<Play className="w-4 h-4" />}
              onClick={() => {
                // Simula reprodução
                alert('Reproduzindo...')
              }}
            >
              Reproduzir
            </EnhancedLoadingButton>

            <EnhancedLoadingButton
              variant="outline"
              icon={<Pause className="w-4 h-4" />}
              onClick={() => {
                // Simula pausa
                alert('Pausado!')
              }}
            >
              Pausar
            </EnhancedLoadingButton>

            <EnhancedLoadingButton
              variant="ghost"
              icon={<Star className="w-4 h-4" />}
              onClick={() => {
                // Simula favoritar
                alert('Favoritado!')
              }}
            >
              Favoritar
            </EnhancedLoadingButton>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Exemplos de Código</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3">Import Básico</h3>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-sm overflow-x-auto">
                <code>{`import { 
  LoadingButton,
  PrimaryLoadingButton,
  EnhancedLoadingButton 
} from '@/components/ui/LoadingButton'`}</code>
              </pre>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3">Uso Básico</h3>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-sm overflow-x-auto">
                <code>{`<LoadingButton
  variant="primary"
  loading={isLoading}
  loadingText="Salvando..."
  onClick={handleSave}
>
  Salvar
</LoadingButton>`}</code>
              </pre>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3">Enhanced com Ícone</h3>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-sm overflow-x-auto">
                <code>{`<EnhancedLoadingButton
  variant="primary"
  icon={<Download />}
  shadow
  fullWidth
  loading={downloading}
>
  Download
</EnhancedLoadingButton>`}</code>
              </pre>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3">Componente Especializado</h3>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-sm overflow-x-auto">
                <code>{`<PrimaryLoadingButton
  loading={saving}
  loadingText="Processando..."
  size="lg"
>
  Processar Dados
</PrimaryLoadingButton>`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Features Summary */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Recursos do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h3 className="font-bold text-green-800 mb-3">🎨 Design</h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• 4 variantes de estilo</li>
                <li>• 3 tamanhos responsivos</li>
                <li>• Spinner integrado automático</li>
                <li>• Estados disabled/loading</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">⚡ Funcionalidades</h3>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Loading text customizável</li>
                <li>• Ícones posicionáveis</li>
                <li>• Shadow e rounded options</li>
                <li>• Full width support</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h3 className="font-bold text-purple-800 mb-3">🛠️ Desenvolvimento</h3>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• TypeScript completo</li>
                <li>• Props HTML nativas</li>
                <li>• Componentes especializados</li>
                <li>• Easy customization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
