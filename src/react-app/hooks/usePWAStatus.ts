import { useState, useEffect } from 'react'
import { useServiceWorker } from '../utils/swRegistration'
import { useBackgroundSync } from '../utils/backgroundSync'

export interface PWAStatus {
  isInstalled: boolean
  isOnline: boolean
  updateAvailable: boolean
  hasOfflineData: boolean
  syncInProgress: boolean
  pendingActions: number
  failedActions: number
  lastSync: Date | null
}

export const usePWAStatus = () => {
  const { updateAvailable, isOnline } = useServiceWorker()
  const { queueStatus } = useBackgroundSync()
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Check if app is installed as PWA
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://')

    setIsInstalled(isStandalone)
  }, [])

  // Update last sync time when sync completes
  useEffect(() => {
    if (queueStatus.pending === 0 && queueStatus.total > 0 && !isProcessing) {
      setLastSync(new Date())
    }
  }, [queueStatus.pending, queueStatus.total, isProcessing])

  // Update processing state based on queue activity
  useEffect(() => {
    setIsProcessing(queueStatus.syncing > 0)
  }, [queueStatus.syncing])

  // Check for offline data in localStorage/IndexedDB
  const [hasOfflineData, setHasOfflineData] = useState(false)

  useEffect(() => {
    const checkOfflineData = () => {
      // Check for cached data indicators
      const hasLocalData = localStorage.getItem('offline_data_available') === 'true'
      const hasPendingActions = queueStatus.pending > 0
      setHasOfflineData(hasLocalData || hasPendingActions)
    }

    checkOfflineData()
  }, [queueStatus.pending])

  const status: PWAStatus = {
    isInstalled,
    isOnline,
    updateAvailable,
    hasOfflineData,
    syncInProgress: isProcessing,
    pendingActions: queueStatus.pending,
    failedActions: queueStatus.failed,
    lastSync,
  }

  const getStatusMessage = (): string => {
    if (!isOnline) {
      return `Offline - ${queueStatus.pending} ação${queueStatus.pending !== 1 ? 'ões' : ''} pendente${queueStatus.pending !== 1 ? 's' : ''}`
    }
    
    if (isProcessing) {
      return 'Sincronizando dados...'
    }
    
    if (updateAvailable) {
      return 'Atualização disponível'
    }
    
    if (lastSync) {
      const diffMinutes = Math.floor((Date.now() - lastSync.getTime()) / 60000)
      if (diffMinutes < 1) {
        return 'Sincronizado agora'
      } else if (diffMinutes < 60) {
        return `Sincronizado há ${diffMinutes}min`
      } else {
        const diffHours = Math.floor(diffMinutes / 60)
        return `Sincronizado há ${diffHours}h`
      }
    }
    
    return 'Online'
  }

  const getStatusColor = (): string => {
    if (!isOnline) return 'amber'
    if (updateAvailable) return 'blue'
    if (isProcessing) return 'blue'
    if (queueStatus.failed > 0) return 'red'
    return 'green'
  }

  return {
    status,
    getStatusMessage,
    getStatusColor,
  }
}
