// Background Sync Implementation
// src/utils/backgroundSync.ts

import React from 'react'

interface OfflineAction {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  endpoint: string
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data: any
  timestamp: number
  retries: number
  maxRetries: number
}

interface SyncQueueItem {
  id: string
  action: OfflineAction
  status: 'pending' | 'syncing' | 'completed' | 'failed'
}

class BackgroundSyncManager {
  private dbName = 'china-hq-sync'
  private dbVersion = 1
  private storeName = 'offline-actions'
  private db: IDBDatabase | null = null

  constructor() {
    this.initDB()
  }

  // Initialize IndexedDB
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('status', 'status', { unique: false })
        }
      }
    })
  }

  // Add action to sync queue
  async addToQueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retries'>): Promise<string> {
    if (!this.db) await this.initDB()

    const fullAction: OfflineAction = {
      ...action,
      id: this.generateId(),
      timestamp: Date.now(),
      retries: 0,
      maxRetries: action.maxRetries || 3
    }

    const queueItem: SyncQueueItem = {
      id: fullAction.id,
      action: fullAction,
      status: 'pending'
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.add(queueItem)

      request.onsuccess = () => {
        console.log('[BackgroundSync] Action queued:', fullAction.id)
        this.requestSync()
        resolve(fullAction.id)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Get all pending actions
  async getPendingActions(): Promise<SyncQueueItem[]> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('status')
      const request = index.getAll('pending')

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Update action status
  async updateActionStatus(id: string, status: SyncQueueItem['status']): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const item = getRequest.result
        if (item) {
          item.status = status
          const updateRequest = store.put(item)
          updateRequest.onsuccess = () => resolve()
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          reject(new Error('Action not found'))
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  // Remove completed action
  async removeAction(id: string): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)

      request.onsuccess = () => {
        console.log('[BackgroundSync] Action removed:', id)
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Request background sync
  private async requestSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in (window as any).ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        await (registration as any).sync.register('sync-offline-actions')
        console.log('[BackgroundSync] Sync requested')
      } catch (error) {
        console.error('[BackgroundSync] Sync request failed:', error)
        // Fallback to immediate sync
        this.performSync()
      }
    } else {
      // Background sync not supported, sync immediately
      this.performSync()
    }
  }

  // Perform sync (can be called from SW or directly)
  async performSync(): Promise<void> {
    if (!navigator.onLine) {
      console.log('[BackgroundSync] Offline, skipping sync')
      return
    }

    try {
      const pendingActions = await this.getPendingActions()
      console.log(`[BackgroundSync] Syncing ${pendingActions.length} actions`)

      for (const item of pendingActions) {
        try {
          await this.updateActionStatus(item.id, 'syncing')
          await this.syncAction(item.action)
          await this.removeAction(item.id)
          
        } catch (error) {
          console.error('[BackgroundSync] Sync failed for action:', item.id, error)
          
          // Increment retry count
          const newRetries = item.action.retries + 1
          if (newRetries >= item.action.maxRetries) {
            await this.updateActionStatus(item.id, 'failed')
            console.error('[BackgroundSync] Max retries reached for action:', item.id)
          } else {
            // Update retry count and reset to pending
            item.action.retries = newRetries
            await this.updateActionStatus(item.id, 'pending')
          }
        }
      }

    } catch (error) {
      console.error('[BackgroundSync] Sync operation failed:', error)
    }
  }

  // Sync individual action
  private async syncAction(action: OfflineAction): Promise<void> {
    const response = await fetch(action.endpoint, {
      method: action.method,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: action.data ? JSON.stringify(action.data) : undefined
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    console.log('[BackgroundSync] Action synced successfully:', action.id)
  }

  // Get authentication headers
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth-token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Get sync queue status
  async getQueueStatus(): Promise<{
    pending: number
    syncing: number
    failed: number
    total: number
  }> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        const items = request.result
        const status = {
          pending: items.filter(item => item.status === 'pending').length,
          syncing: items.filter(item => item.status === 'syncing').length,  
          failed: items.filter(item => item.status === 'failed').length,
          total: items.length
        }
        resolve(status)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Clear failed actions
  async clearFailedActions(): Promise<void> {
    if (!this.db) await this.initDB()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('status')
      const request = index.getAll('failed')

      request.onsuccess = () => {
        const failedItems = request.result
        const deletePromises = failedItems.map(item => 
          new Promise<void>((res, rej) => {
            const deleteRequest = store.delete(item.id)
            deleteRequest.onsuccess = () => res()
            deleteRequest.onerror = () => rej(deleteRequest.error)
          })
        )

        Promise.all(deletePromises)
          .then(() => {
            console.log(`[BackgroundSync] Cleared ${failedItems.length} failed actions`)
            resolve()
          })
          .catch(reject)
      }
      request.onerror = () => reject(request.error)
    })
  }
}

// Singleton instance
export const syncManager = new BackgroundSyncManager()

// Helper functions for common operations
export const queueOfflineAction = (
  type: OfflineAction['type'],
  endpoint: string,
  method: OfflineAction['method'],
  data?: any
) => {
  return syncManager.addToQueue({
    type,
    endpoint,
    method,
    data,
    maxRetries: 3
  })
}

// React hook for background sync
export const useBackgroundSync = () => {
  const [queueStatus, setQueueStatus] = React.useState({
    pending: 0,
    syncing: 0,
    failed: 0,
    total: 0
  })
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  // Update queue status
  const updateQueueStatus = React.useCallback(async () => {
    try {
      const status = await syncManager.getQueueStatus()
      setQueueStatus(status)
    } catch (error) {
      console.error('Failed to get queue status:', error)
    }
  }, [])

  // Listen for online/offline events
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncManager.performSync()
      updateQueueStatus()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial status update
    updateQueueStatus()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [updateQueueStatus])

  return {
    queueStatus,
    isOnline,
    performSync: () => syncManager.performSync(),
    clearFailed: () => syncManager.clearFailedActions().then(updateQueueStatus),
    updateStatus: updateQueueStatus
  }
}
