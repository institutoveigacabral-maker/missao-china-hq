import { useState, useEffect } from 'react';
import { RefreshCw, X, Download } from 'lucide-react';

export default function PWAUpdateBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        setIsVisible(true);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleSWMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className={`p-1.5 bg-white/20 rounded-lg ${isUpdating ? 'animate-spin' : ''}`}>
            {isUpdating ? (
              <RefreshCw size={16} />
            ) : (
              <Download size={16} />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">
              {isUpdating ? 'Atualizando...' : 'Nova versão disponível!'}
            </p>
            <p className="text-blue-100 text-xs">
              {isUpdating ? 'Aplicando melhorias' : 'Toque para atualizar o app'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isUpdating && (
            <>
              <button
                onClick={handleUpdate}
                className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                disabled={isUpdating}
              >
                Atualizar
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </>
          )}
          
          {isUpdating && (
            <div className="flex items-center space-x-2 text-blue-100">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-sm">Aguarde...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
