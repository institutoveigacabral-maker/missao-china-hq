import { CheckCircle, Download, Wifi, WifiOff, RefreshCw, Trash2, Bell } from 'lucide-react';
import { useServiceWorker } from '@/react-app/utils/swRegistration';
import Button from './Button';
import { useToast } from '@/react-app/hooks/useToast';

interface ServiceWorkerStatusProps {
  showDetails?: boolean;
  className?: string;
}

export default function ServiceWorkerStatus({ 
  showDetails = false, 
  className = '' 
}: ServiceWorkerStatusProps) {
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
    requestNotificationPermission
  } = useServiceWorker();

  const { success, error: showError, info, warning } = useToast();

  const handleUpdate = async () => {
    try {
      await updateSW();
      success('Atualização aplicada com sucesso');
    } catch (err) {
      showError('Falha ao aplicar atualização');
    }
  };

  const handleCheckUpdates = async () => {
    try {
      const hasUpdate = await checkForUpdates();
      info(hasUpdate ? 'Verificando por atualizações...' : 'Aplicação está atualizada');
    } catch (err) {
      showError('Falha ao verificar atualizações');
    }
  };

  const handleSync = async () => {
    try {
      await triggerSync();
      info('Sincronizando dados em background');
    } catch (err) {
      showError('Falha ao iniciar sincronização');
    }
  };

  const handleClearCaches = async () => {
    try {
      await clearCaches();
      success('Todos os caches foram removidos');
    } catch (err) {
      showError('Falha ao remover caches');
    }
  };

  const handleNotificationPermission = async () => {
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
      <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
        <WifiOff className="w-4 h-4" />
        <span>Service Worker não suportado</span>
      </div>
    );
  }

  const connectionIcon = isOnline ? (
    <Wifi className="w-4 h-4 text-green-500" />
  ) : (
    <WifiOff className="w-4 h-4 text-red-500" />
  );

  const connectionText = isOnline ? 'Online' : 'Offline';
  const connectionColor = isOnline ? 'text-green-600' : 'text-red-600';

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-3 text-sm ${className}`}>
        {/* Connection Status */}
        <div className="flex items-center gap-1">
          {connectionIcon}
          <span className={connectionColor}>{connectionText}</span>
        </div>

        {/* Service Worker Status */}
        {isRegistering ? (
          <div className="flex items-center gap-1 text-blue-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Registrando...</span>
          </div>
        ) : registration ? (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Ativo</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-500">
            <span>Inativo</span>
          </div>
        )}

        {/* Update Available */}
        {updateAvailable && (
          <Button
            size="sm"
            onClick={handleUpdate}
            className="flex items-center gap-1 text-xs"
          >
            <Download className="w-3 h-3" />
            Atualizar
          </Button>
        )}

        {/* Last Sync Action */}
        {lastSyncAction && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <RefreshCw className="w-3 h-3" />
            <span>Sincronizado: {lastSyncAction}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 p-4 bg-white rounded-lg border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Service Worker Status</h3>
        <Button
          size="sm"
          variant="secondary"
          onClick={refreshCacheStatus}
          className="flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Atualizar
        </Button>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Connection */}
        <div className="flex items-center gap-2">
          {connectionIcon}
          <div>
            <div className="text-sm font-medium">Conexão</div>
            <div className={`text-xs ${connectionColor}`}>{connectionText}</div>
          </div>
        </div>

        {/* Service Worker */}
        <div className="flex items-center gap-2">
          {isRegistering ? (
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
          ) : registration ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <div className="w-4 h-4 bg-gray-300 rounded-full" />
          )}
          <div>
            <div className="text-sm font-medium">Service Worker</div>
            <div className="text-xs text-gray-600">
              {isRegistering ? 'Registrando...' : registration ? 'Ativo' : 'Inativo'}
            </div>
          </div>
        </div>
      </div>

      {/* Cache Status */}
      {Object.keys(cacheStatus).length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Status do Cache</h4>
          <div className="space-y-1">
            {Object.entries(cacheStatus).map(([cacheName, count]) => (
              <div key={cacheName} className="flex justify-between text-xs">
                <span className="text-gray-600 truncate">{cacheName}</span>
                <span className="text-gray-800 font-medium">{count} itens</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Sync */}
      {lastSyncAction && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm">
          <RefreshCw className="w-4 h-4 text-blue-600" />
          <span>Última sincronização: <strong>{lastSyncAction}</strong></span>
        </div>
      )}

      {/* Update Available */}
      {updateAvailable && (
        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
          <Download className="w-4 h-4 text-orange-600" />
          <div className="flex-1">
            <div className="text-sm font-medium text-orange-800">
              Atualização Disponível
            </div>
            <div className="text-xs text-orange-600">
              Uma nova versão da aplicação está pronta
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleUpdate}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Aplicar
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCheckUpdates}
          className="flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Verificar Atualizações
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleSync}
          disabled={!isOnline}
          className="flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          Sincronizar
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleNotificationPermission}
          className="flex items-center gap-1"
        >
          <Bell className="w-3 h-3" />
          Notificações
        </Button>

        <Button
          size="sm"
          variant="danger"
          onClick={handleClearCaches}
          className="flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Limpar Cache
        </Button>
      </div>
    </div>
  );
}
