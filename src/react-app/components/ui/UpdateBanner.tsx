import { useState, useEffect } from 'react';
import { Download, X, RefreshCw } from 'lucide-react';
import Button from './Button';
import { useServiceWorker } from '@/react-app/utils/swRegistration';

interface UpdateBannerProps {
  autoShow?: boolean;
  dismissible?: boolean;
  position?: 'top' | 'bottom';
  className?: string;
}

export default function UpdateBanner({
  autoShow = true,
  dismissible = true,
  position = 'top',
  className = ''
}: UpdateBannerProps) {
  const { updateAvailable, updateSW } = useServiceWorker();
  const [isVisible, setIsVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (autoShow && updateAvailable) {
      setIsVisible(true);
    }
  }, [autoShow, updateAvailable]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await updateSW();
      // The page will reload automatically
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!updateAvailable || !isVisible) {
    return null;
  }

  const positionClasses = {
    top: 'top-0 animate-slide-down',
    bottom: 'bottom-0 animate-slide-up'
  };

  return (
    <div
      className={`
        fixed left-0 right-0 z-50 ${positionClasses[position]}
        ${className}
      `}
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Icon and Message */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="font-medium">
                  Nova versão disponível
                </div>
                <div className="text-sm text-blue-100">
                  Uma atualização da aplicação está pronta para ser instalada
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
                size="sm"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Atualizar Agora
                  </>
                )}
              </Button>

              {dismissible && (
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          {isUpdating && (
            <div className="mt-3">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full animate-progress" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
