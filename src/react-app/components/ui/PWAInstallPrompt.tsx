import React, { useState, useEffect } from 'react'
import { X, Download, Smartphone, Monitor } from 'lucide-react'
import { TouchButton } from '../Touch'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAInstallPromptProps {
  onInstall?: () => void
  onDismiss?: () => void
  className?: string
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  onInstall,
  onDismiss,
  className = '',
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown')

  useEffect(() => {
    // Detect platform
    detectPlatform()
    
    // Check if already installed
    checkIfInstalled()
    
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setIsInstalled(true)
      setShowPrompt(false)
      onInstall?.()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [onInstall])

  const detectPlatform = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (/ipad|iphone|ipod/.test(userAgent)) {
      setPlatform('ios')
    } else if (/android/.test(userAgent)) {
      setPlatform('android')
    } else if (/windows|mac|linux/.test(userAgent)) {
      setPlatform('desktop')
    }
  }

  const checkIfInstalled = () => {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
    const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches
    
    // Check iOS standalone
    const isIOSStandalone = (window.navigator as any).standalone === true
    
    setIsInstalled(isStandalone || isFullscreen || isMinimalUI || isIOSStandalone)
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show manual installation instructions
      setShowPrompt(true)
      return
    }

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      console.log(`User ${outcome} the install prompt`)
      
      if (outcome === 'accepted') {
        onInstall?.()
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
      
    } catch (error) {
      console.error('Install prompt failed:', error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    onDismiss?.()
    
    // Don't show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already installed
  if (isInstalled) {
    return null
  }

  // Don't show if recently dismissed
  const lastDismissed = localStorage.getItem('pwa-install-dismissed')
  if (lastDismissed && Date.now() - parseInt(lastDismissed) < 7 * 24 * 60 * 60 * 1000) {
    return null
  }

  if (!showPrompt && !deferredPrompt) {
    return null
  }

  return (
    <>
      {/* Install Banner */}
      <InstallBanner
        onInstall={handleInstallClick}
        onDismiss={handleDismiss}
        platform={platform}
        className={className}
      />

      {/* Manual Installation Modal */}
      {showPrompt && !deferredPrompt && (
        <ManualInstallModal
          platform={platform}
          onClose={handleDismiss}
        />
      )}
    </>
  )
}

// Install Banner Component
interface InstallBannerProps {
  onInstall: () => void
  onDismiss: () => void
  platform: string
  className: string
}

const InstallBanner: React.FC<InstallBannerProps> = ({
  onInstall,
  onDismiss,
  platform,
  className,
}) => {
  const getPlatformIcon = () => {
    switch (platform) {
      case 'ios':
      case 'android':
        return Smartphone
      case 'desktop':
        return Monitor
      default:
        return Download
    }
  }

  const Icon = getPlatformIcon()

  return (
    <div className={`
      fixed bottom-20 left-4 right-4 z-65 lg:bottom-4 lg:left-auto lg:right-4 lg:w-96
      bg-white border border-gray-200 rounded-lg shadow-lg p-4
      ${className}
    `}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">
            Instalar Missão China HQ
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Acesse rapidamente e use offline. Instale como aplicativo.
          </p>
          
          <div className="flex space-x-2 mt-3">
            <TouchButton
              size="sm"
              onClick={onInstall}
              className="flex-1"
            >
              Instalar
            </TouchButton>
            
            <TouchButton
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="px-2"
            >
              <X className="w-4 h-4" />
            </TouchButton>
          </div>
        </div>
      </div>
    </div>
  )
}

// Manual Installation Modal
interface ManualInstallModalProps {
  platform: string
  onClose: () => void
}

const ManualInstallModal: React.FC<ManualInstallModalProps> = ({
  platform,
  onClose,
}) => {
  const getInstructions = () => {
    switch (platform) {
      case 'ios':
        return {
          title: 'Instalar no iOS',
          steps: [
            'Toque no botão "Compartilhar" (📤) na barra inferior do Safari',
            'Role para baixo e toque em "Adicionar à Tela de Início"',
            'Toque em "Adicionar" no canto superior direito',
            'O app aparecerá na sua tela de início'
          ],
          icon: '📱'
        }
        
      case 'android':
        return {
          title: 'Instalar no Android',
          steps: [
            'Toque no menu (⋮) no canto superior direito do Chrome',
            'Selecione "Adicionar à tela inicial" ou "Instalar app"',
            'Toque em "Adicionar" quando solicitado',
            'O app será instalado e aparecerá na sua tela inicial'
          ],
          icon: '🤖'
        }
        
      case 'desktop':
        return {
          title: 'Instalar no Desktop',
          steps: [
            'Clique no ícone de instalação (⬇️) na barra de endereços',
            'Ou clique no menu (⋮) e selecione "Instalar Missão China HQ"',
            'Clique em "Instalar" na janela que aparecer',
            'O app será adicionado ao seu sistema e área de trabalho'
          ],
          icon: '💻'
        }
        
      default:
        return {
          title: 'Instalar Aplicativo',
          steps: [
            'Procure pelo ícone de instalação na barra do navegador',
            'Ou acesse o menu do navegador',
            'Selecione a opção "Instalar" ou "Adicionar à tela inicial"',
            'Siga as instruções do seu navegador'
          ],
          icon: '📲'
        }
    }
  }

  const instructions = getInstructions()

  return (
    <div className="fixed inset-0 z-65 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{instructions.icon}</span>
              <h2 className="text-lg font-semibold text-gray-900">
                {instructions.title}
              </h2>
            </div>
            <TouchButton
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </TouchButton>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Siga estes passos para instalar o Missão China HQ como aplicativo:
            </p>
            
            <ol className="space-y-3">
              {instructions.steps.map((step, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <TouchButton
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Entendi
            </TouchButton>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for PWA install status
export const usePWAInstall = () => {
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isIOSStandalone)
    }

    const handleBeforeInstallPrompt = () => {
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
    }

    checkInstallStatus()
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return { canInstall, isInstalled }
}

// Default export for compatibility
export default PWAInstallPrompt
