import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
}

interface PWAActions {
  install: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  requestSync: () => void;
}

export function usePWA(): PWAState & PWAActions {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Detectar se está executando como PWA instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
    setIsInstalled(isStandalone);

    // Listener para install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log('[PWA] Install prompt available');
    };

    // Listener para app instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      console.log('[PWA] App installed successfully');
    };

    // Listeners para status de conexão
    const handleOnline = () => {
      setIsOnline(true);
      console.log('[PWA] Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('[PWA] Connection lost');
    };

    // Listener para service worker updates
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        setUpdateAvailable(true);
        console.log('[PWA] Update available');
      }
      
      if (event.data && event.data.type === 'DASHBOARD_SYNCED') {
        console.log('[PWA] Dashboard data synced');
      }
    };

    // Registrar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    navigator.serviceWorker?.addEventListener('message', handleSWMessage);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
  }, []);

  const install = async (): Promise<void> => {
    if (!installPrompt) {
      throw new Error('Install prompt not available');
    }

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted install');
        setIsInstallable(false);
        setInstallPrompt(null);
      } else {
        console.log('[PWA] User dismissed install');
      }
    } catch (error) {
      console.error('[PWA] Install failed:', error);
      throw error;
    }
  };

  const checkForUpdates = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('[PWA] Checked for updates');
        }
      } catch (error) {
        console.error('[PWA] Update check failed:', error);
      }
    }
  };

  const requestSync = (): void => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.controller?.postMessage({
        type: 'REQUEST_SYNC'
      });
      console.log('[PWA] Sync requested');
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    install,
    checkForUpdates,
    requestSync
  };
}
