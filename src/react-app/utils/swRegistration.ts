// Service Worker Registration and Management
// Advanced PWA Service Worker Manager with Events and Hooks

import React from 'react';

// Service Worker Event Types
declare global {
  interface WindowEventMap {
    'sw-registered': CustomEvent<ServiceWorkerRegistration>
    'sw-updated': CustomEvent<ServiceWorkerRegistration>
    'sw-offline': CustomEvent<void>
    'sw-online': CustomEvent<void>
    'sw-sync-complete': CustomEvent<string>
    'sw-notification': CustomEvent<any>
  }
}



class ServiceWorkerManager extends EventTarget {
  private registration: ServiceWorkerRegistration | null = null
  private isOnline: boolean = navigator.onLine
  private updateCheckInterval: number | null = null

  constructor() {
    super()
    this.setupOnlineOfflineHandlers()
    this.setupPeriodicUpdateCheck()
  }

  // Register service worker with advanced options
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[SWManager] Service Worker not supported')
      return null
    }
    
    // Skip SW registration in development to avoid HMR conflicts
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.port === '5173'
    
    if (isDevelopment) {
      console.log('[SWManager] Skipping SW registration in development mode')
      return null
    }

    try {
      console.log('[SWManager] Registering service worker...')
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      })

      console.log('[SWManager] Service Worker registered:', this.registration.scope)

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound()
      })

      // Setup message handling
      this.setupMessageHandling()

      // Check for existing service worker
      if (this.registration.active) {
        this.dispatchEvent(new CustomEvent('sw-registered', {
          detail: this.registration
        }))
      }

      // Check for updates immediately
      await this.checkForUpdates()

      return this.registration

    } catch (error) {
      console.error('[SWManager] Service Worker registration failed:', error)
      return null
    }
  }

  // Handle service worker updates with user notification
  private handleUpdateFound() {
    if (!this.registration) return

    const newWorker = this.registration.installing
    if (!newWorker) return

    console.log('[SWManager] New service worker found, installing...')

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New update available
          console.log('[SWManager] New service worker installed, update available')
          this.dispatchEvent(new CustomEvent('sw-updated', {
            detail: this.registration!
          }))
          
          // Show update notification
          this.showUpdateNotification()
        } else {
          // First install
          console.log('[SWManager] Service worker installed for first time')
          this.dispatchEvent(new CustomEvent('sw-registered', {
            detail: this.registration!
          }))
        }
      }
    })
  }

  // Update service worker with smooth transition
  async update(): Promise<void> {
    if (!this.registration) {
      console.warn('[SWManager] No service worker registration found')
      return
    }

    try {
      console.log('[SWManager] Updating service worker...')
      
      // Check for updates
      await this.registration.update()
      
      // Skip waiting and reload if update is waiting
      if (this.registration.waiting) {
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        
        // Wait for service worker to take control
        await new Promise<void>((resolve) => {
          const handleControllerChange = () => {
            navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
            resolve()
          }
          navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
        })
        
        // Reload the page
        window.location.reload()
      }
    } catch (error) {
      console.error('[SWManager] Service worker update failed:', error)
      throw error
    }
  }

  // Check for updates manually
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      console.log('[SWManager] Checking for updates...')
      await this.registration.update()
      return true
    } catch (error) {
      console.error('[SWManager] Update check failed:', error)
      return false
    }
  }

  // Unregister service worker
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      const result = await this.registration.unregister()
      console.log('[SWManager] Service worker unregistered:', result)
      
      // Clear update interval
      if (this.updateCheckInterval) {
        clearInterval(this.updateCheckInterval)
        this.updateCheckInterval = null
      }
      
      return result
    } catch (error) {
      console.error('[SWManager] Service worker unregistration failed:', error)
      return false
    }
  }

  // Setup periodic update checks
  private setupPeriodicUpdateCheck() {
    // Check for updates every 30 minutes
    this.updateCheckInterval = window.setInterval(() => {
      if (this.isOnline && document.visibilityState === 'visible') {
        this.checkForUpdates()
      }
    }, 30 * 60 * 1000)
  }

  // Setup online/offline handlers
  private setupOnlineOfflineHandlers() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.dispatchEvent(new CustomEvent('sw-online'))
      console.log('[SWManager] App is online')
      
      // Trigger background sync
      this.triggerBackgroundSync()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.dispatchEvent(new CustomEvent('sw-offline'))
      console.log('[SWManager] App is offline')
    })

    // Check for updates when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.isOnline) {
        this.checkForUpdates()
      }
    })
  }

  // Setup message handling with service worker
  private setupMessageHandling() {
    if (!('serviceWorker' in navigator)) return

    const handleMessage = (event: MessageEvent) => {
      console.log('[SWManager] Message from SW:', event.data)
      
      // Type checking with proper casting
      if (!event.data || typeof event.data !== 'object' || event.data === null) {
        console.warn('[SWManager] Invalid message format received')
        return
      }
      
      const messageData: Record<string, any> = event.data
      if (!messageData.type || typeof messageData.type !== 'string') {
        console.warn('[SWManager] Missing or invalid message type')
        return
      }

      switch (messageData.type) {
        case 'SYNC_COMPLETE':
          this.dispatchEvent(new CustomEvent('sw-sync-complete', {
            detail: messageData.action || 'unknown'
          }))
          break
          
        case 'CACHE_UPDATED':
          console.log('[SWManager] Cache updated:', messageData.cache)
          break
          
        case 'NOTIFICATION_RECEIVED':
          this.dispatchEvent(new CustomEvent('sw-notification', {
            detail: messageData.notification
          }))
          break
      }
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)
  }

  // Trigger background sync
  async triggerBackgroundSync(action: string = 'sync-offline-actions'): Promise<void> {
    if (!this.registration || !('sync' in this.registration)) {
      console.warn('[SWManager] Background Sync not supported')
      return
    }

    try {
      await (this.registration as any).sync.register(action)
      console.log('[SWManager] Background sync registered:', action)
    } catch (error) {
      console.error('[SWManager] Background sync registration failed:', error)
    }
  }

  // Show update notification to user
  private showUpdateNotification() {
    // Create custom event that UI can listen to
    window.dispatchEvent(new CustomEvent('sw-update-available', {
      detail: {
        registration: this.registration,
        timestamp: Date.now()
      }
    }))
  }

  // Send message to service worker
  async sendMessage(message: any): Promise<any> {
    if (!navigator.serviceWorker.controller) {
      throw new Error('No service worker controller')
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel()
      
      messageChannel.port1.onmessage = (event: MessageEvent) => {
        const data = event.data as any
        if (data.error) {
          reject(new Error(data.error))
        } else {
          resolve(data)
        }
      }

      navigator.serviceWorker.controller!.postMessage(message, [messageChannel.port2])
    })
  }

  // Get cache status for debugging
  async getCacheStatus(): Promise<Record<string, number>> {
    try {
      return await this.sendMessage({ type: 'GET_CACHE_STATUS' })
    } catch (error) {
      console.error('[SWManager] Failed to get cache status:', error)
      return {}
    }
  }

  // Clear all caches
  async clearCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
      console.log('[SWManager] All caches cleared')
    } catch (error) {
      console.error('[SWManager] Failed to clear caches:', error)
    }
  }

  // Request permission for notifications
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported')
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    console.log('[SWManager] Notification permission:', permission)
    return permission
  }

  // Getters
  get online(): boolean {
    return this.isOnline
  }

  get swRegistration(): ServiceWorkerRegistration | null {
    return this.registration
  }

  get hasServiceWorker(): boolean {
    return 'serviceWorker' in navigator
  }
}

// Singleton instance
export const swManager = new ServiceWorkerManager()

// Helper functions for easy access
export const registerSW = () => swManager.register()
export const updateSW = () => swManager.update()
export const unregisterSW = () => swManager.unregister()
export const checkForUpdates = () => swManager.checkForUpdates()
export const triggerSync = (action?: string) => swManager.triggerBackgroundSync(action)
export const getCacheStatus = () => swManager.getCacheStatus()
export const clearAllCaches = () => swManager.clearCaches()

// React hook for service worker with full functionality
export const useServiceWorker = () => {
  const [registration, setRegistration] = React.useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = React.useState(false)
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)
  const [isRegistering, setIsRegistering] = React.useState(false)
  const [lastSyncAction, setLastSyncAction] = React.useState<string | null>(null)
  const [cacheStatus, setCacheStatus] = React.useState<Record<string, number>>({})

  React.useEffect(() => {
    let mounted = true

    // Register service worker
    const initializeServiceWorker = async () => {
      setIsRegistering(true)
      try {
        const reg = await registerSW()
        if (mounted) {
          setRegistration(reg)
        }
      } catch (error) {
        console.error('[useServiceWorker] Registration failed:', error)
      } finally {
        if (mounted) {
          setIsRegistering(false)
        }
      }
    }

    initializeServiceWorker()

    // Listen for service worker events
    const handleRegistered = (e: CustomEvent<ServiceWorkerRegistration>) => {
      if (mounted) {
        setRegistration(e.detail)
      }
    }

    const handleUpdated = (e: CustomEvent<ServiceWorkerRegistration>) => {
      if (mounted) {
        setUpdateAvailable(true)
        setRegistration(e.detail)
      }
    }

    const handleOnline = () => {
      if (mounted) {
        setIsOnline(true)
      }
    }

    const handleOffline = () => {
      if (mounted) {
        setIsOnline(false)
      }
    }

    const handleSyncComplete = (e: CustomEvent<string>) => {
      if (mounted) {
        setLastSyncAction(e.detail)
        // Clear after 5 seconds
        setTimeout(() => {
          if (mounted) {
            setLastSyncAction(null)
          }
        }, 5000)
      }
    }

    // Custom update notification handler
    const handleUpdateNotification = (_event: CustomEvent) => {
      if (mounted) {
        setUpdateAvailable(true)
      }
    }

    // Attach event listeners
    swManager.addEventListener('sw-registered', handleRegistered as EventListener)
    swManager.addEventListener('sw-updated', handleUpdated as EventListener)
    swManager.addEventListener('sw-online', handleOnline as EventListener)
    swManager.addEventListener('sw-offline', handleOffline as EventListener)
    swManager.addEventListener('sw-sync-complete', handleSyncComplete as EventListener)
    window.addEventListener('sw-update-available', handleUpdateNotification as EventListener)

    // Get initial cache status
    getCacheStatus().then(status => {
      if (mounted) {
        setCacheStatus(status)
      }
    })

    return () => {
      mounted = false
      swManager.removeEventListener('sw-registered', handleRegistered as EventListener)
      swManager.removeEventListener('sw-updated', handleUpdated as EventListener)
      swManager.removeEventListener('sw-online', handleOnline as EventListener)
      swManager.removeEventListener('sw-offline', handleOffline as EventListener)
      swManager.removeEventListener('sw-sync-complete', handleSyncComplete as EventListener)
      window.removeEventListener('sw-update-available', handleUpdateNotification as EventListener)
    }
  }, [])

  // Refresh cache status
  const refreshCacheStatus = React.useCallback(async () => {
    try {
      const status = await getCacheStatus()
      setCacheStatus(status)
    } catch (error) {
      console.error('[useServiceWorker] Failed to refresh cache status:', error)
    }
  }, [])

  return {
    // State
    registration,
    updateAvailable,
    isOnline,
    isRegistering,
    lastSyncAction,
    cacheStatus,
    hasServiceWorker: swManager.hasServiceWorker,
    
    // Actions
    updateSW: async () => {
      setUpdateAvailable(false)
      await updateSW()
    },
    checkForUpdates,
    triggerSync,
    refreshCacheStatus,
    clearCaches: async () => {
      await clearAllCaches()
      await refreshCacheStatus()
    },
    requestNotificationPermission: () => swManager.requestNotificationPermission(),
    unregisterSW
  }
}

// Hook for PWA installation
export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = React.useState<any>(null)
  const [isInstallable, setIsInstallable] = React.useState(false)
  const [isInstalled, setIsInstalled] = React.useState(false)

  React.useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://')
    setIsInstalled(isStandalone)

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = (_event: Event) => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = React.useCallback(async () => {
    if (!installPrompt) {
      throw new Error('Install prompt not available')
    }

    await installPrompt.prompt()
    const choiceResult = await installPrompt.userChoice
    
    if (choiceResult.outcome === 'accepted') {
      setIsInstallable(false)
      setInstallPrompt(null)
    }
    
    return choiceResult.outcome
  }, [installPrompt])

  return {
    isInstallable,
    isInstalled,
    install
  }
}
