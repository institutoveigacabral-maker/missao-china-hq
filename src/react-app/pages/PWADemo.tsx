import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Bell, 
  Share2,
  Settings,
  Database,
  Monitor,
  Zap
} from 'lucide-react';
;
import { usePWA } from '@/react-app/hooks/usePWA';
import { useServiceWorker, usePWAInstall } from '@/react-app/utils/swRegistration';
import PWAInstallPrompt from '@/react-app/components/ui/PWAInstallPrompt';
import PWAUpdateBanner from '@/react-app/components/ui/PWAUpdateBanner';
import ServiceWorkerStatus from '@/react-app/components/ui/ServiceWorkerStatus';
import UpdateBanner from '@/react-app/components/ui/UpdateBanner';
import OfflineIndicator from '@/react-app/components/ui/OfflineIndicator';

export default function PWADemo() {
  const { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    updateAvailable, 
    checkForUpdates,
    requestSync 
  } = usePWA();

  // Advanced Service Worker Hook
  const {
    registration,
    isRegistering,
    lastSyncAction,
    cacheStatus,
    hasServiceWorker,
    triggerSync,
    requestNotificationPermission
  } = useServiceWorker();

  // PWA Install Hook
  const {
    isInstallable: installable,
    isInstalled: installed,
    install: installPWA
  } = usePWAInstall();
  
  const [syncStatus, setSyncStatus] = useState('idle');
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    // Listen for SW messages
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === 'DASHBOARD_SYNCED') {
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 2000);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleSWMessage);
    
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
  }, []);

  

  const handleRequestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        new Notification('Missão China HQ', {
          body: 'Notificações ativadas com sucesso!',
          icon: 'https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-icon-512x512.png',
          badge: 'https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/public-icons-icon-512x512.png'
        });
      }
    }
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    requestSync();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Missão China HQ',
          text: 'Dashboard Executivo para operações China-Brasil/Portugal',
          url: window.location.origin
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.origin);
        alert('URL copiada para área de transferência!');
      }
    }
  };

  const getStatusIcon = (status: boolean) => (
    status ? '✅' : '❌'
  );

  const getStatusText = (status: boolean) => (
    status ? 'Ativo' : 'Inativo'
  );

  const getStatusColor = (status: boolean) => (
    status ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'
  );

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-8">
        {/* Advanced PWA Components */}
        <UpdateBanner position="top" />
        <OfflineIndicator showWhenOnline position="top-right" />
        <PWAUpdateBanner />
        
        {/* Service Worker Status Dashboard */}
        <ServiceWorkerStatus showDetails className="mb-8" />
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Smartphone size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PWA Demo</h1>
              <p className="text-lg text-gray-600">Progressive Web App Features</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className={`px-3 py-1 rounded-full border ${getStatusColor(isOnline)}`}>
              {isOnline ? <Wifi size={14} className="inline mr-1" /> : <WifiOff size={14} className="inline mr-1" />}
              Conexão: {getStatusText(isOnline)}
            </div>
            <div className={`px-3 py-1 rounded-full border ${getStatusColor(isInstalled)}`}>
              <Monitor size={14} className="inline mr-1" />
              App: {getStatusText(isInstalled)}
            </div>
          </div>
        </div>

        {/* Advanced Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${installed ? 'bg-green-500' : 'bg-gray-300'}`} />
              <h3 className="font-semibold">Instalação Avançada</h3>
            </div>
            <p className="text-sm text-gray-600">
              {installed ? 'App instalado' : 'App não instalado'}
            </p>
            <div className="text-xs text-gray-500 mt-1">
              Legacy: {isInstalled ? 'Sim' : 'Não'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${registration ? 'bg-green-500' : 'bg-red-500'}`} />
              <h3 className="font-semibold">Service Worker</h3>
            </div>
            <p className="text-sm text-gray-600">
              {isRegistering ? 'Registrando...' : 
               registration ? 'Ativo' : 'Inativo'}
            </p>
            <div className="text-xs text-gray-500 mt-1">
              Suporte: {hasServiceWorker ? 'Sim' : 'Não'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${Object.keys(cacheStatus).length > 0 ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <h3 className="font-semibold">Cache Status</h3>
            </div>
            <p className="text-sm text-gray-600">
              {Object.keys(cacheStatus).length} caches ativos
            </p>
            {lastSyncAction && (
              <div className="text-xs text-green-600 mt-1">
                Último sync: {lastSyncAction}
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${updateAvailable ? 'bg-orange-500' : 'bg-green-500'}`} />
              <h3 className="font-semibold">Atualizações</h3>
            </div>
            <p className="text-sm text-gray-600">
              {updateAvailable ? 'Disponível' : 'Atualizado'}
            </p>
            <div className="text-xs text-gray-500 mt-1">
              v2.0.0 Service Worker
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Installation */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Instalação</h3>
                <p className="text-sm text-gray-600">Como app nativo</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Instalável</span>
                <span className="text-sm font-medium">
                  {getStatusIcon(isInstallable)} {getStatusText(isInstallable)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Instalado</span>
                <span className="text-sm font-medium">
                  {getStatusIcon(isInstalled)} {getStatusText(isInstalled)}
                </span>
              </div>
              
              {installable && !installed && (
                <button
                  onClick={installPWA}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium mb-2"
                >
                  Instalar App (Avançado)
                </button>
              )}
              
              
              
              {isInstalled && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    ✨ App instalado com sucesso! Acesse pela tela inicial.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Offline Support */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Database size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Suporte Offline</h3>
                <p className="text-sm text-gray-600">Cache inteligente</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Service Worker</span>
                <span className="text-sm font-medium">
                  {'serviceWorker' in navigator ? '✅ Ativo' : '❌ Inativo'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cache API</span>
                <span className="text-sm font-medium">
                  {'caches' in window ? '✅ Disponível' : '❌ Indisponível'}
                </span>
              </div>
              
              <button
                onClick={() => triggerSync()}
                disabled={!isOnline}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center space-x-2 mb-2"
              >
                <RefreshCw size={16} />
                <span>Background Sync</span>
              </button>
              
              <button
                onClick={handleSync}
                disabled={syncStatus === 'syncing'}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <RefreshCw size={16} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                <span>
                  {syncStatus === 'syncing' ? 'Sincronizando...' : 
                   syncStatus === 'synced' ? 'Sincronizado!' : 'Legacy Sync'}
                </span>
              </button>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bell size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Notificações</h3>
                <p className="text-sm text-gray-600">Push notifications</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Permissão</span>
                <span className="text-sm font-medium">
                  {notificationPermission === 'granted' ? '✅ Permitido' :
                   notificationPermission === 'denied' ? '❌ Negado' : '⏳ Pendente'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Push API</span>
                <span className="text-sm font-medium">
                  {'PushManager' in window ? '✅ Suportado' : '❌ Não suportado'}
                </span>
              </div>
              
              {notificationPermission !== 'granted' && (
                <>
                  <button
                    onClick={requestNotificationPermission}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium mb-2"
                  >
                    Ativar Notificações (Avançado)
                  </button>
                  
                  <button
                    onClick={handleRequestNotificationPermission}
                    className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                  >
                    Ativar Notificações (Legacy)
                  </button>
                </>
              )}
              
              {notificationPermission === 'granted' && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700">
                    🔔 Notificações ativadas! Você receberá atualizações importantes.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Web Share API */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Share2 size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Compartilhamento</h3>
                <p className="text-sm text-gray-600">Web Share API</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Share API</span>
                <span className="text-sm font-medium">
                  {'share' in navigator ? '✅ Suportado' : '❌ Não suportado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Clipboard API</span>
                <span className="text-sm font-medium">
                  {!!navigator.clipboard ? '✅ Disponível' : '❌ Indisponível'}
                </span>
              </div>
              
              <button
                onClick={handleShare}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                Compartilhar App
              </button>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Zap size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Atualizações</h3>
                <p className="text-sm text-gray-600">Auto-update</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Update Available</span>
                <span className="text-sm font-medium">
                  {getStatusIcon(updateAvailable)} {updateAvailable ? 'Sim' : 'Não'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Versão</span>
                <span className="text-sm font-medium">v2.0.0</span>
              </div>
              
              <button
                onClick={checkForUpdates}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Verificar Atualizações
              </button>
              
              {updateAvailable && (
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm text-indigo-700">
                    🚀 Nova versão disponível! Recarregue a página.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* App Configuration */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings size={20} className="text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Configurações</h3>
                <p className="text-sm text-gray-600">App settings</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Display Mode</span>
                <span className="text-sm font-medium">Standalone</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Theme Color</span>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium">#3b82f6</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Orientation</span>
                <span className="text-sm font-medium">Portrait-Primary</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Start URL</span>
                <span className="text-sm font-medium">/</span>
              </div>
            </div>
          </div>
        </div>

        {/* Manifest Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-4">Informações do Manifest</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Nome:</strong> Missão China HQ - Dashboard Executivo
            </div>
            <div>
              <strong>Nome Curto:</strong> China HQ
            </div>
            <div>
              <strong>Versão:</strong> 2.0.0
            </div>
            <div>
              <strong>Categoria:</strong> Business, Productivity
            </div>
            <div>
              <strong>Idioma:</strong> pt-BR
            </div>
            <div>
              <strong>Escopo:</strong> /
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Descrição:</strong> Plataforma completa para gestão de operações China ↔ Brasil/Portugal
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">📊 Dashboard</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">📦 SKUs IoT</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">🏭 Fornecedores</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">📋 Compliance</span>
            </div>
          </div>
        </div>

        {/* Install Prompt */}
        <PWAInstallPrompt />
      </div>
    </div>
  );
}
