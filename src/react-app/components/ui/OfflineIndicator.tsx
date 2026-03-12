import { WifiOff, Wifi, CloudOff, Cloud } from 'lucide-react';
import { useServiceWorker } from '@/react-app/utils/swRegistration';

interface OfflineIndicatorProps {
  showWhenOnline?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export default function OfflineIndicator({
  showWhenOnline = false,
  position = 'top-right',
  className = ''
}: OfflineIndicatorProps) {
  const { isOnline, lastSyncAction } = useServiceWorker();

  // Don't show when online unless explicitly requested
  if (isOnline && !showWhenOnline) {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div
      className={`
        fixed z-40 ${positionClasses[position]}
        ${className}
      `}
    >
      <div
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full shadow-lg
          transition-all duration-300 ease-in-out
          ${isOnline 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white animate-pulse'
          }
        `}
      >
        {/* Icon */}
        {isOnline ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}

        {/* Status Text */}
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>

        {/* Sync Status */}
        {lastSyncAction && (
          <div className="flex items-center gap-1 border-l border-white/30 pl-2 ml-1">
            <Cloud className="w-3 h-3" />
            <span className="text-xs">Sincronizado</span>
          </div>
        )}
      </div>

      {/* Offline Message */}
      {!isOnline && (
        <div className="mt-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg max-w-xs">
          <div className="flex items-center gap-1 mb-1">
            <CloudOff className="w-3 h-3" />
            <span className="font-medium">Modo Offline</span>
          </div>
          <div className="text-gray-300">
            Dados em cache serão sincronizados quando a conexão for restaurada
          </div>
        </div>
      )}
    </div>
  );
}
