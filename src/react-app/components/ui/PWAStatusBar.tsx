import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, RefreshCw, Smartphone } from 'lucide-react';
import { usePWA } from '@/react-app/hooks/usePWA';
import PWAInstallPrompt from './PWAInstallPrompt';

export default function PWAStatusBar() {
  const { isOnline, isInstallable, isInstalled, updateAvailable, requestSync } = usePWA();
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Listen for sync events
  useEffect(() => {
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'DASHBOARD_SYNCED') {
        setLastSyncTime(new Date(event.data.timestamp));
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleSWMessage);
    
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
  }, []);

  const handleSyncRequest = () => {
    requestSync();
    setLastSyncTime(new Date());
  };

  return (
    <>
      <div className="flex items-center space-x-2 text-xs">
        {/* Connection Status */}
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
          isOnline 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {isOnline ? (
            <Wifi size={12} />
          ) : (
            <WifiOff size={12} />
          )}
          <span className="font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* PWA Status */}
        {isInstalled && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            <Smartphone size={12} />
            <span className="font-medium">App</span>
          </div>
        )}

        {/* Install Button */}
        {isInstallable && !isInstalled && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
            <Download size={12} />
            <span className="font-medium">Instalar</span>
          </div>
        )}

        {/* Update Available */}
        {updateAvailable && (
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors animate-pulse"
          >
            <RefreshCw size={12} />
            <span className="font-medium">Atualizar</span>
          </button>
        )}

        {/* Sync Button (offline only) */}
        {!isOnline && (
          <button
            onClick={handleSyncRequest}
            className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            title="Sincronizar quando voltar online"
          >
            <RefreshCw size={12} className={lastSyncTime ? 'animate-spin' : ''} />
            <span className="font-medium">Sync</span>
          </button>
        )}

        {/* Last Sync Time */}
        {lastSyncTime && (
          <div className="text-gray-500 px-2">
            <span>Sync: {lastSyncTime.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
        )}
      </div>

      {/* Install Prompt Modal */}
      <PWAInstallPrompt />
    </>
  );
}
