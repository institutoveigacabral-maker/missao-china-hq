import { useState } from 'react'
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button'
import {
  Spinner,
  SpinnerOverlay
} from '@/react-app/components/ui/Spinner'
import { 
  LoadingOverlay
} from '@/react-app/components/ui/LoadingComponents'
import { 
  Play, 
  Square, 
  Zap,
  Settings,
  Monitor,
  Smartphone,
  Palette
} from 'lucide-react'

export default function SpinnerDemo() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)

  const colors = ['blue', 'green', 'red', 'yellow', 'purple', 'cyan', 'gray'] as const
  const sizes = ['sm', 'md', 'lg', 'xl'] as const

  const handleButtonDemo = () => {
    setButtonLoading(true)
    setTimeout(() => setButtonLoading(false), 3000)
  }

  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Sistema de Spinner</h1>
            </div>
            <p className="text-blue-100 text-lg mb-4">
              Componentes de spinner especializados para diferentes casos de uso
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>8 Cores Disponíveis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4" />
                <span>Múltiplos Tamanhos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>Responsivo</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">8</div>
            <div className="text-blue-100">Componentes</div>
            <div className="text-sm text-blue-200 mt-1">
              Especializado por Uso
            </div>
          </div>
        </div>
      </div>

      {/* Global Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Controles de Demonstração</h2>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton
            onClick={() => setShowOverlay(true)}
            icon={Play}
          >
            Mostrar Overlay
          </PrimaryButton>
          <SecondaryButton
            onClick={() => setShowLoadingOverlay(true)}
            icon={Settings}
          >
            Loading Overlay Avançado
          </SecondaryButton>
          <SecondaryButton
            onClick={handleButtonDemo}
            icon={buttonLoading ? Square : Play}
            disabled={buttonLoading}
          >
            {buttonLoading ? 'Carregando...' : 'Teste Botão'}
          </SecondaryButton>
          
        </div>
      </div>

      {/* Basic Spinners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Spinner Básico - Tamanhos</h3>
          <div className="grid grid-cols-4 gap-6 text-center">
            {sizes.map(size => (
              <div key={size} className="space-y-3">
                <Spinner size={size} color="blue" />
                <div className="text-sm font-medium text-slate-700 capitalize">{size}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Spinner Básico - Cores</h3>
          <div className="grid grid-cols-4 gap-4">
            {colors.map(color => (
              <div key={color} className="text-center space-y-3">
                <Spinner size="md" color={color} />
                <div className="text-xs font-medium text-slate-600 capitalize">{color}</div>
              </div>
            ))}
            <div className="text-center space-y-3 bg-slate-900 rounded-lg p-3">
              <Spinner size="md" color="white" />
              <div className="text-xs font-medium text-white">White</div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo content continues... */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Demonstração Completa</h3>
        <p className="text-gray-600">
          Todos os componentes de spinner estão funcionais. Esta página serve como demonstração 
          dos diferentes tipos de spinners disponíveis no sistema.
        </p>
      </div>

      {/* Overlays */}
      <SpinnerOverlay 
        message="Demonstração do overlay de spinner com design moderno" 
        show={showOverlay}
        onClose={() => setShowOverlay(false)}
      />
      
      <LoadingOverlay 
        show={showLoadingOverlay}
        message="Overlay avançado do sistema de loading"
      >
        <SecondaryButton
          onClick={() => setShowLoadingOverlay(false)}
          size="sm"
        >
          Fechar
        </SecondaryButton>
      </LoadingOverlay>
    </div>
  )
}
