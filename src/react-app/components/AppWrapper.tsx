import React, { useEffect } from 'react'
import { useServiceWorker } from '../utils/swRegistration'
import { useBackgroundSync } from '../utils/backgroundSync'
import { useToast } from '../hooks/useToast'
import PWAUpdateBanner from './ui/PWAUpdateBanner'
import OfflineIndicator from './ui/OfflineIndicator'
import BackgroundSyncStatus from './ui/BackgroundSyncStatus'
import BundleMonitor from './ui/BundleMonitor'

interface AppWrapperProps {
  children: React.ReactNode
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const { updateAvailable, isOnline } = useServiceWorker()
  const { queueStatus, performSync } = useBackgroundSync()
  const toast = useToast()

  // Handle service worker updates
  useEffect(() => {
    if (updateAvailable) {
      toast.custom(
        'Nova versão disponível! Toque para atualizar.',
        '🚀',
        {
          duration: 15000,
          style: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
          },
        }
      )
    }
  }, [updateAvailable, toast])

  // Handle connectivity changes
  useEffect(() => {
    const handleOnline = () => {
      toast.success('Conexão restaurada! Sincronizando dados...')
      performSync()
    }

    const handleOffline = () => {
      toast.warning('Conexão perdida. Modo offline ativado.')
    }

    if (isOnline && queueStatus.pending > 0) {
      setTimeout(() => {
        performSync()
      }, 1000)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isOnline, queueStatus.pending, performSync, toast])

  // Handle background sync completion
  useEffect(() => {
    if (isOnline && queueStatus.pending === 0 && queueStatus.total > 0) {
      const syncedCount = queueStatus.total - queueStatus.failed
      if (syncedCount > 0) {
        toast.success(`${syncedCount} ação${syncedCount > 1 ? 'ões' : ''} sincronizada${syncedCount > 1 ? 's' : ''} com sucesso!`)
      }
    }
  }, [queueStatus.total, queueStatus.pending, queueStatus.failed, isOnline, toast])

  return (
    <>
      {children}
      
      {/* PWA Update Banner */}
      <PWAUpdateBanner />
      
      {/* Offline Indicator */}
      <OfflineIndicator 
        showWhenOnline={false}
        position="bottom-right"
      />
      
      {/* Background Sync Status */}
      <BackgroundSyncStatus 
        compact={true}
        showDetails={false}
      />
      
      {/* Bundle Monitor (Development only) */}
      <BundleMonitor />
    </>
  )
}
