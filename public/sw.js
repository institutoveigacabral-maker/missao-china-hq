// Service Worker para Missão China HQ PWA
// Version 2.0.0

const CACHE_NAME = 'china-hq-v2.0.0'
const API_CACHE_NAME = 'china-hq-api-v2.0.0'
const STATIC_CACHE_NAME = 'china-hq-static-v2.0.0'

// Skip SW in development to avoid HMR conflicts
const isDevelopment = self.location.hostname === 'localhost' || 
                      self.location.hostname === '127.0.0.1' ||
                      self.location.port === '5173'

// Recursos críticos para cache
const STATIC_RESOURCES = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
]

// APIs críticas para cache
const CRITICAL_APIS = [
  '/api/stats',
  '/api/skus',
  '/api/suppliers', 
  '/api/regulations'
]

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first', 
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
}

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2.0.0')
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static resources')
        return cache.addAll(STATIC_RESOURCES)
      }),
      
      // Cache critical APIs  
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching critical APIs')
        return Promise.all(
          CRITICAL_APIS.map(url => 
            fetch(url)
              .then(response => cache.put(url, response.clone()))
              .catch(err => console.log(`[SW] Failed to cache ${url}:`, err))
          )
        )
      })
    ]).then(() => {
      console.log('[SW] Installation complete')
      // Force activation
      return self.skipWaiting()
    })
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v2.0.0')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== API_CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete')
    })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  // Skip service worker in development to avoid HMR conflicts
  if (isDevelopment) {
    return
  }
  
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return
  }
  
  // Skip HMR and WebSocket requests
  if (url.pathname.includes('__vite') || 
      url.pathname.includes('__debug') ||
      url.protocol === 'ws:' ||
      url.protocol === 'wss:') {
    return
  }

  // Route requests to appropriate strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
  } else if (isStaticResource(request)) {
    event.respondWith(handleStaticResource(request))
  } else {
    event.respondWith(handleNavigationRequest(request))
  }
})

// Handle API requests - Network First with fallback
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME)
  
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Update cache with fresh data
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    // Network failed, try cache
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      console.log('[SW] Serving API from cache:', request.url)
      return cachedResponse
    }
    
    // Return offline response
    return createOfflineApiResponse(request)
    
  } catch (error) {
    console.log('[SW] Network error for API:', request.url, error)
    
    // Try cache
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      console.log('[SW] Serving API from cache:', request.url)
      return cachedResponse
    }
    
    // Return offline response
    return createOfflineApiResponse(request)
  }
}

// Handle static resources - Cache First
async function handleStaticResource(request) {
  const cache = await caches.open(STATIC_CACHE_NAME)
  
  // Try cache first
  const cachedResponse = await cache.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  // Fetch from network and cache
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('[SW] Failed to fetch static resource:', request.url)
    return new Response('Resource unavailable offline', { status: 503 })
  }
}

// Handle navigation requests - Stale While Revalidate
async function handleNavigationRequest(request) {
  const cache = await caches.open(CACHE_NAME)
  
  // Get from cache
  const cachedResponse = await cache.match(request)
  
  // Start network request
  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => {
    // Network failed, return offline page
    return cache.match('/offline.html')
  })
  
  // Return cached version immediately, update in background
  return cachedResponse || networkPromise
}

// Utility functions
function isStaticResource(request) {
  const url = new URL(request.url)
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|woff|woff2|ttf|eot)$/)
}

function createOfflineApiResponse(request) {
  const url = new URL(request.url)
  
  // Return mock data for different endpoints
  if (url.pathname.includes('/stats')) {
    return new Response(JSON.stringify({
      offline: true,
      message: 'Dados em cache - última sincronização',
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  return new Response(JSON.stringify({
    error: 'Offline',
    message: 'Dados não disponíveis offline'
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  })
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag)
  
  if (event.tag === 'sync-offline-actions') {
    event.waitUntil(syncOfflineActions())
  }
})

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event.data?.text())
  
  const options = {
    body: event.data?.text() || 'Nova atualização disponível',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir App'
      },
      {
        action: 'dismiss', 
        title: 'Dispensar'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Missão China HQ', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  }
})

// Sync offline actions
async function syncOfflineActions() {
  try {
    const offlineActions = await getOfflineActions()
    
    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        })
        
        // Remove from offline storage
        await removeOfflineAction(action.id)
        
      } catch (error) {
        console.log('[SW] Failed to sync action:', action.id, error)
      }
    }
  } catch (error) {
    console.log('[SW] Sync failed:', error)
  }
}

// IndexedDB helpers for offline actions
async function getOfflineActions() {
  // Implement IndexedDB logic to get offline actions
  return []
}

async function removeOfflineAction(actionId) {
  // Implement IndexedDB logic to remove synced action
  console.log('[SW] Removing synced action:', actionId)
}

// Message handling para comunicação com app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'REQUEST_SYNC') {
    self.registration.sync.register('sync-offline-actions')
  }
  
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    getCacheStatus().then(status => {
      event.ports[0].postMessage(status)
    })
  }
})

// Get cache status for debugging
async function getCacheStatus() {
  const cacheNames = await caches.keys()
  const status = {}
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    status[cacheName] = keys.length
  }
  
  return status
}

// ============================================================================
// ADVANCED OFFLINE STRATEGIES - ENHANCED SERVICE WORKER
// ============================================================================

// Cache patterns for different content types
const CACHE_PATTERNS = {
  // Images - Cache first, long term
  images: {
    pattern: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: 'china-hq-images-v1',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 100
  },
  
  // API responses - Network first with timeout
  api: {
    pattern: /\/api\//,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: API_CACHE_NAME,
    timeout: 3000,
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 50
  },
  
  // Static assets - Cache first
  static: {
    pattern: /\.(css|js|woff|woff2|ttf|eot)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: STATIC_CACHE_NAME,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxEntries: 60
  },
  
  // HTML pages - Stale while revalidate
  pages: {
    pattern: /\/$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: 'china-hq-pages-v1',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxEntries: 20
  }
}

// Enhanced fetch handler with timeout and retry
self.addEventListener('fetch', (event) => {
  // Skip service worker in development
  if (isDevelopment) {
    return
  }
  
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests and non-HTTP URLs
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return
  }
  
  // Skip HMR and WebSocket requests
  if (url.pathname.includes('__vite') || 
      url.pathname.includes('__debug') ||
      url.protocol === 'ws:' ||
      url.protocol === 'wss:') {
    return
  }

  // Find matching pattern for advanced handling
  const pattern = findMatchingPattern(request)
  if (pattern && shouldUseAdvancedStrategy(request)) {
    event.respondWith(handleRequestWithStrategy(request, pattern))
  }
})

// Determine if request should use advanced strategy
function shouldUseAdvancedStrategy(request) {
  const url = new URL(request.url)
  
  // Use advanced strategies for specific content types
  return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf|eot)$/) ||
         url.pathname.startsWith('/api/') ||
         url.pathname === '/'
}

// Find matching cache pattern
function findMatchingPattern(request) {
  const url = new URL(request.url)
  
  for (const [key, pattern] of Object.entries(CACHE_PATTERNS)) {
    if (pattern.pattern.test(url.pathname) || pattern.pattern.test(request.url)) {
      return pattern
    }
  }
  
  return null
}

// Handle request with specific strategy
async function handleRequestWithStrategy(request, pattern) {
  const cache = await caches.open(pattern.cacheName)
  
  switch (pattern.strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return handleCacheFirst(request, cache, pattern)
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return handleNetworkFirst(request, cache, pattern)
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return handleStaleWhileRevalidate(request, cache, pattern)
    
    default:
      return fetch(request)
  }
}

// Cache First Strategy
async function handleCacheFirst(request, cache, pattern) {
  try {
    // Check cache first
    const cachedResponse = await cache.match(request)
    if (cachedResponse && !isExpired(cachedResponse, pattern.maxAge)) {
      return cachedResponse
    }
    
    // Fetch from network
    const networkResponse = await fetchWithTimeout(request, pattern.timeout)
    
    if (networkResponse && networkResponse.ok) {
      // Clone and cache with timestamp
      const responseToCache = addTimestamp(networkResponse.clone())
      cache.put(request, responseToCache)
      await cleanupCache(cache, pattern.maxEntries)
    }
    
    return networkResponse
    
  } catch (error) {
    // Return stale cache if available
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      console.log('[SW] Serving stale content:', request.url)
      return cachedResponse
    }
    
    throw error
  }
}

// Network First Strategy with timeout
async function handleNetworkFirst(request, cache, pattern) {
  try {
    // Try network with timeout
    const networkResponse = await fetchWithTimeout(request, pattern.timeout || 3000)
    
    if (networkResponse && networkResponse.ok) {
      // Update cache with timestamp
      const responseToCache = addTimestamp(networkResponse.clone())
      cache.put(request, responseToCache)
      await cleanupCache(cache, pattern.maxEntries)
      return networkResponse
    }
    
    // Network failed, try cache
    const cachedResponse = await cache.match(request)
    return cachedResponse || createAdvancedOfflineResponse(request)
    
  } catch (error) {
    console.log('[SW] Network timeout for:', request.url)
    
    // Fallback to cache
    const cachedResponse = await cache.match(request)
    return cachedResponse || createAdvancedOfflineResponse(request)
  }
}

// Stale While Revalidate Strategy
async function handleStaleWhileRevalidate(request, cache, pattern) {
  // Get cached version
  const cachedResponse = await cache.match(request)
  
  // Start network request (don't await)
  const networkPromise = fetchWithTimeout(request, pattern.timeout)
    .then(response => {
      if (response && response.ok) {
        const responseToCache = addTimestamp(response.clone())
        cache.put(request, responseToCache)
        cleanupCache(cache, pattern.maxEntries)
      }
      return response
    })
    .catch(error => {
      console.log('[SW] Background update failed:', request.url, error)
      return null
    })
  
  // Return cached immediately, or wait for network
  return cachedResponse || networkPromise
}

// Fetch with timeout
function fetchWithTimeout(request, timeout = 5000) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Fetch timeout')), timeout)
    })
  ])
}

// Check if cached response is expired
function isExpired(response, maxAge) {
  if (!maxAge) return false
  
  const cachedTime = response.headers.get('sw-cached-time')
  if (!cachedTime) return false
  
  return Date.now() - parseInt(cachedTime) > maxAge
}

// Add timestamp to cached responses
function addTimestamp(response) {
  const responseClone = response.clone()
  const headers = new Headers(responseClone.headers)
  headers.set('sw-cached-time', Date.now().toString())
  
  return new Response(responseClone.body, {
    status: responseClone.status,
    statusText: responseClone.statusText,
    headers: headers
  })
}

// Cleanup old cache entries
async function cleanupCache(cache, maxEntries) {
  if (!maxEntries) return
  
  try {
    const keys = await cache.keys()
    if (keys.length > maxEntries) {
      // Remove oldest entries
      const entriesToDelete = keys.slice(0, keys.length - maxEntries)
      await Promise.all(entriesToDelete.map(key => cache.delete(key)))
      console.log(`[SW] Cleaned up ${entriesToDelete.length} cache entries`)
    }
  } catch (error) {
    console.log('[SW] Cache cleanup failed:', error)
  }
}

// Create advanced offline response
function createAdvancedOfflineResponse(request) {
  const url = new URL(request.url)
  
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({
      offline: true,
      message: 'Dados não disponíveis offline',
      timestamp: new Date().toISOString(),
      url: request.url,
      cached: false
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })
  }
  
  // Return offline page for navigation requests
  return caches.match('/offline.html')
}

// Enhanced message handling for advanced features
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEANUP_CACHES') {
    event.waitUntil(cleanupAllCaches())
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_ADVANCED_CACHE_STATUS') {
    getAdvancedCacheStatus().then(status => {
      event.ports[0].postMessage(status)
    })
  }
  
  if (event.data && event.data.type === 'FORCE_REFRESH_CACHE') {
    event.waitUntil(forceRefreshCache(event.data.pattern))
  }
})

// Cleanup all caches with pattern-specific logic
async function cleanupAllCaches() {
  try {
    const cacheNames = await caches.keys()
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const pattern = Object.values(CACHE_PATTERNS).find(p => p.cacheName === cacheName)
      
      if (pattern) {
        await cleanupCache(cache, pattern.maxEntries)
      }
    }
    
    console.log('[SW] Advanced cache cleanup completed')
  } catch (error) {
    console.log('[SW] Cache cleanup failed:', error)
  }
}

// Get advanced cache status with detailed info
async function getAdvancedCacheStatus() {
  try {
    const cacheNames = await caches.keys()
    const status = {
      patterns: {},
      total: 0,
      lastCleanup: new Date().toISOString()
    }
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const keys = await cache.keys()
      const pattern = Object.values(CACHE_PATTERNS).find(p => p.cacheName === cacheName)
      
      status.patterns[cacheName] = {
        entries: keys.length,
        maxEntries: pattern?.maxEntries || 'unlimited',
        strategy: pattern?.strategy || 'default',
        maxAge: pattern?.maxAge ? `${Math.round(pattern.maxAge / (60 * 60 * 1000))}h` : 'unlimited'
      }
      
      status.total += keys.length
    }
    
    return status
  } catch (error) {
    console.log('[SW] Failed to get cache status:', error)
    return { error: 'Failed to get cache status' }
  }
}

// Force refresh cache for specific pattern
async function forceRefreshCache(patternName) {
  try {
    const pattern = CACHE_PATTERNS[patternName]
    if (!pattern) {
      console.log('[SW] Pattern not found:', patternName)
      return
    }
    
    const cache = await caches.open(pattern.cacheName)
    const keys = await cache.keys()
    
    // Delete all entries for this pattern
    await Promise.all(keys.map(key => cache.delete(key)))
    
    console.log(`[SW] Force refreshed cache for pattern: ${patternName}`)
  } catch (error) {
    console.log('[SW] Force refresh failed:', error)
  }
}

// Periodic cache maintenance
setInterval(() => {
  cleanupAllCaches()
}, 6 * 60 * 60 * 1000) // Every 6 hours
