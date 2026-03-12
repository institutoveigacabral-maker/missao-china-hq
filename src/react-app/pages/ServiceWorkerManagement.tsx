import { Settings, Database, RefreshCw, Trash2, Download, Bell, Wifi } from 'lucide-react';

import Button from '@/react-app/components/ui/Button';
import ServiceWorkerStatus from '@/react-app/components/ui/ServiceWorkerStatus';
import UpdateBanner from '@/react-app/components/ui/UpdateBanner';
import OfflineIndicator from '@/react-app/components/ui/OfflineIndicator';
import { useServiceWorker, usePWAInstall } from '@/react-app/utils/swRegistration';
import { useToast } from '@/react-app/hooks/useToast';

export default function ServiceWorkerManagement() {
  const {
    registration,
    updateAvailable,
    isOnline,
    isRegistering,
    lastSyncAction,
    cacheStatus,
    hasServiceWorker,
    updateSW,
    checkForUpdates,
    triggerSync,
    refreshCacheStatus,
    clearCaches,
    requestNotificationPermission,
    unregisterSW
  } = useServiceWorker();

  const {
    isInstallable,
    isInstalled,
    install
  } = usePWAInstall();

  const { success, error: showError, info, warning } = useToast();

  const handleAdvancedUpdate = async () => {
    try {
      await updateSW();
      success('Service Worker atualizado com sucesso');
    } catch (err) {
      showError('Falha ao aplicar atualização');
    }
  };

  const handleAdvancedSync = async () => {
    try {
      await triggerSync('sync-all-data');
      info('Background sync em progresso');
    } catch (err) {
      showError('Falha ao iniciar sincronização');
    }
  };

  const handleClearAll = async () => {
    if (confirm('Tem certeza que deseja limpar todos os caches? Isso pode impactar a performance.')) {
      try {
        await clearCaches();
        await refreshCacheStatus();
        success('Todos os caches foram removidos');
      } catch (err) {
        showError('Falha ao remover caches');
      }
    }
  };

  const handleUnregister = async () => {
    if (confirm('Tem certeza que deseja desregistrar o Service Worker? Isso desabilitará recursos offline.')) {
      try {
        await unregisterSW();
        info('Service Worker foi removido');
      } catch (err) {
        showError('Falha ao remover Service Worker');
      }
    }
  };

  const handleInstall = async () => {
    try {
      await install();
      success('PWA instalado com sucesso');
    } catch (err) {
      showError('Falha ao instalar PWA');
    }
  };

  const handleNotifications = async () => {
    try {
      const permission = await requestNotificationPermission();
      const messages = {
        granted: 'Notificações habilitadas com sucesso',
        denied: 'Notificações foram negadas pelo usuário',
        default: 'Permissão de notificação pendente'
      };
      
      if (permission === 'granted') {
        success(messages[permission]);
      } else {
        warning(messages[permission]);
      }
    } catch (err) {
      showError('Falha ao solicitar permissão');
    }
  };

  if (!hasServiceWorker) {
    return (
      <div className="space-y-6 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Service Worker Não Suportado
            </h1>
            <p className="text-gray-600">
              Seu navegador não suporta Service Workers. 
              Atualize para um navegador mais recente para acessar recursos PWA.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-8">
        {/* PWA Components */}
        <UpdateBanner position="top" />
        <OfflineIndicator showWhenOnline position="top-right" />

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciamento de Service Worker
          </h1>
          <p className="text-lg text-gray-600">
            Controle avançado de PWA e Service Worker v2.0.0
          </p>
        </div>

        {/* Service Worker Status */}
        <ServiceWorkerStatus showDetails />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Connection Status */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${isOnline ? 'bg-green-100' : 'bg-red-100'}`}>
                <Wifi className={`w-6 h-6 ${isOnline ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div>
                <h3 className="font-semibold">Conectividade</h3>
                <p className="text-sm text-gray-600">
                  {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            {lastSyncAction && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                Último sync: {lastSyncAction}
              </div>
            )}
          </div>

          {/* Registration Status */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${registration ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Database className={`w-6 h-6 ${registration ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <h3 className="font-semibold">Service Worker</h3>
                <p className="text-sm text-gray-600">
                  {isRegistering ? 'Registrando...' : 
                   registration ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>
            {registration && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                Escopo: {registration.scope}
              </div>
            )}
          </div>

          {/* Cache Status */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Cache</h3>
                <p className="text-sm text-gray-600">
                  {Object.keys(cacheStatus).length} caches ativos
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={refreshCacheStatus}
              variant="secondary"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar Status
            </Button>
          </div>

          {/* Update Status */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${updateAvailable ? 'bg-orange-100' : 'bg-green-100'}`}>
                <Download className={`w-6 h-6 ${updateAvailable ? 'text-orange-600' : 'text-green-600'}`} />
              </div>
              <div>
                <h3 className="font-semibold">Atualizações</h3>
                <p className="text-sm text-gray-600">
                  {updateAvailable ? 'Disponível' : 'Atualizado'}
                </p>
              </div>
            </div>
            {updateAvailable && (
              <Button
                size="sm"
                onClick={handleAdvancedUpdate}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Aplicar Agora
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PWA Management */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Gerenciamento PWA
            </h3>
            <div className="space-y-3">
              {isInstallable && !isInstalled && (
                <Button
                  onClick={handleInstall}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Instalar PWA
                </Button>
              )}
              
              <Button
                onClick={handleNotifications}
                variant="secondary"
                className="w-full"
              >
                <Bell className="w-4 h-4 mr-2" />
                Solicitar Notificações
              </Button>
              
              <Button
                onClick={checkForUpdates}
                variant="secondary"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Verificar Atualizações
              </Button>
              
              <div className="text-xs text-gray-500 pt-2 border-t">
                Status: {isInstalled ? 'Instalado' : 'Não instalado'}
              </div>
            </div>
          </div>

          {/* Service Worker Actions */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Ações do Service Worker
            </h3>
            <div className="space-y-3">
              <Button
                onClick={handleAdvancedSync}
                disabled={!isOnline}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sincronização Completa
              </Button>
              
              <Button
                onClick={handleClearAll}
                variant="secondary"
                className="w-full text-orange-600 hover:text-orange-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Todos os Caches
              </Button>
              
              <Button
                onClick={handleUnregister}
                variant="danger"
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Desregistrar Service Worker
              </Button>
              
              <div className="text-xs text-gray-500 pt-2 border-t">
                Use com cuidado: ações irreversíveis
              </div>
            </div>
          </div>
        </div>

        {/* Cache Details */}
        {Object.keys(cacheStatus).length > 0 && (
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Detalhes do Cache
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(cacheStatus).map(([cacheName, count]) => (
                <div key={cacheName} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {cacheName}
                    </span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {count} itens
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Cache ativo
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Information */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Informações de Debug</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Service Worker Support:</strong> {hasServiceWorker ? 'Sim' : 'Não'}
            </div>
            <div>
              <strong>Registration Status:</strong> {registration ? 'Registrado' : 'Não registrado'}
            </div>
            <div>
              <strong>Update Available:</strong> {updateAvailable ? 'Sim' : 'Não'}
            </div>
            <div>
              <strong>Online Status:</strong> {isOnline ? 'Online' : 'Offline'}
            </div>
            <div>
              <strong>PWA Installable:</strong> {isInstallable ? 'Sim' : 'Não'}
            </div>
            <div>
              <strong>PWA Installed:</strong> {isInstalled ? 'Sim' : 'Não'}
            </div>
            <div>
              <strong>Cache Count:</strong> {Object.keys(cacheStatus).length}
            </div>
            <div>
              <strong>Last Sync:</strong> {lastSyncAction || 'Nenhum'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
