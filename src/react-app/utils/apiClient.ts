// API Client - Robust HTTP client with advanced optimization features

// Environment-safe configuration
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin + '/api'
  }
  return '/api'
}

// API Configuration interface
interface ApiConfig {
  baseURL: string
  timeout: number
  retries: number
  cacheMaxAge: number
  maxCacheSize: number
  headers?: Record<string, string>
  interceptors?: {
    request?: RequestInterceptor[]
    response?: ResponseInterceptor[]
  }
}

// Request/Response interceptor types
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
type ResponseInterceptor = (response: ApiResponse<any>) => ApiResponse<any> | Promise<ApiResponse<any>>

// Request configuration
interface RequestConfig extends RequestInit {
  endpoint: string
  params?: Record<string, any>
  timeout?: number
  retries?: number
  cacheMaxAge?: number
  batch?: boolean
  skipInterceptors?: boolean
  validateStatus?: (status: number) => boolean
}

// Standardized API response
interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Headers
  config: RequestConfig
}

// Enhanced API Error class
class ApiError extends Error {
  public status: number
  public statusText: string
  public data: any
  public config: RequestConfig
  public code: string

  constructor(
    message: string,
    status: number,
    statusText: string,
    data: any = null,
    config: RequestConfig,
    code?: string
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.data = data
    this.config = config
    this.code = code || this.getErrorCode(status)
  }

  private getErrorCode(status: number): string {
    if (status === 0) return 'NETWORK_ERROR'
    if (status === 400) return 'BAD_REQUEST'
    if (status === 401) return 'UNAUTHORIZED'
    if (status === 403) return 'FORBIDDEN'
    if (status === 404) return 'NOT_FOUND'
    if (status === 429) return 'RATE_LIMITED'
    if (status >= 500) return 'SERVER_ERROR'
    return 'UNKNOWN_ERROR'
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }

  get isServerError(): boolean {
    return this.status >= 500
  }

  get isNetworkError(): boolean {
    return this.status === 0
  }

  get isRetryable(): boolean {
    return this.isNetworkError || this.status >= 500 || this.status === 429
  }
}

// Cache management with automatic cleanup
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; expiry: number }>()
  private maxSize: number
  private cleanupInterval: number | null = null

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize
    this.startCleanup()
  }

  private startCleanup() {
    if (typeof window === 'undefined') return
    
    this.cleanupInterval = window.setInterval(() => {
      this.cleanExpired()
      this.enforceSizeLimit()
    }, 60000) // Cleanup every minute
  }

  private cleanExpired() {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.expiry) {
        this.cache.delete(key)
      }
    }
  }

  private enforceSizeLimit() {
    if (this.cache.size <= this.maxSize) return

    // Sort by timestamp and remove oldest entries
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
    
    const toRemove = entries.slice(0, this.cache.size - this.maxSize)
    toRemove.forEach(([key]) => this.cache.delete(key))
  }

  set(key: string, data: any, expiry: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    })
  }

  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now > entry.timestamp + entry.expiry) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear(pattern?: string) {
    if (pattern) {
      for (const [key] of this.cache) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  getStats() {
    const now = Date.now()
    const entries = Array.from(this.cache.values())
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      validEntries: entries.filter(entry => now <= entry.timestamp + entry.expiry).length,
      expiredEntries: entries.filter(entry => now > entry.timestamp + entry.expiry).length,
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
  }
}

// Main API Client class
class ApiClient {
  private config: ApiConfig
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private cache: ApiCache

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseURL: config.baseURL || getApiBaseUrl(),
      timeout: 10000,
      retries: 3,
      cacheMaxAge: 5 * 60 * 1000, // 5 minutes
      maxCacheSize: 1000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      ...config
    }

    this.cache = new ApiCache(this.config.maxCacheSize)

    // Add interceptors from config
    if (config.interceptors?.request) {
      this.requestInterceptors = [...config.interceptors.request]
    }
    if (config.interceptors?.response) {
      this.responseInterceptors = [...config.interceptors.response]
    }
  }

  // Add request interceptor with error handling
  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor)
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor)
      if (index > -1) {
        this.requestInterceptors.splice(index, 1)
      }
    }
  }

  // Add response interceptor with error handling
  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor)
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor)
      if (index > -1) {
        this.responseInterceptors.splice(index, 1)
      }
    }
  }

  // Build complete URL with query parameters
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const baseUrl = endpoint.startsWith('http') ? endpoint : `${this.config.baseURL}${endpoint}`
    
    if (!params || Object.keys(params).length === 0) {
      return baseUrl
    }

    const url = new URL(baseUrl)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, String(v)))
        } else {
          url.searchParams.append(key, String(value))
        }
      }
    })

    return url.toString()
  }

  // Apply request interceptors with proper error handling
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    if (config.skipInterceptors) return config

    let processedConfig = { ...config }
    
    for (const interceptor of this.requestInterceptors) {
      try {
        processedConfig = await interceptor(processedConfig)
      } catch (error) {
        console.error('Request interceptor error:', error)
        // Continue with original config if interceptor fails
      }
    }

    return processedConfig
  }

  // Apply response interceptors with proper error handling
  private async applyResponseInterceptors(response: ApiResponse<any>): Promise<ApiResponse<any>> {
    if (response.config.skipInterceptors) return response

    let processedResponse = { ...response }
    
    for (const interceptor of this.responseInterceptors) {
      try {
        processedResponse = await interceptor(processedResponse)
      } catch (error) {
        console.error('Response interceptor error:', error)
        // Continue with original response if interceptor fails
      }
    }

    return processedResponse
  }

  // Enhanced request method with better error handling
  private async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    // Apply request interceptors
    const processedConfig = await this.applyRequestInterceptors(config)
    
    // Generate cache key for GET requests
    const cacheKey = processedConfig.method === 'GET' || !processedConfig.method
      ? this.buildUrl(processedConfig.endpoint, processedConfig.params)
      : null

    // Check cache for GET requests
    if (cacheKey && !processedConfig.body) {
      const cachedData = this.cache.get(cacheKey)
      if (cachedData) {
        return {
          data: cachedData,
          status: 200,
          statusText: 'OK',
          headers: new Headers(),
          config: processedConfig
        }
      }
    }
    
    // Build URL with parameters
    const url = this.buildUrl(processedConfig.endpoint, processedConfig.params)
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: processedConfig.method || 'GET',
      headers: {
        ...this.config.headers,
        ...processedConfig.headers
      },
      body: processedConfig.body,
    }

    try {
      // Make the request using fetch
      const response = await fetch(url, fetchOptions)
      
      // Parse response data with content-type detection
      let data: T
      const contentType = response.headers.get('content-type') || ''
      
      try {
        if (contentType.includes('application/json')) {
          const text = await response.text()
          data = text ? JSON.parse(text) : null
        } else if (contentType.includes('text/')) {
          data = await response.text() as unknown as T
        } else if (contentType.includes('application/octet-stream') || contentType.includes('application/pdf')) {
          data = await response.blob() as unknown as T
        } else {
          // Try JSON first, fallback to text
          const text = await response.text()
          try {
            data = text ? JSON.parse(text) : null
          } catch {
            data = text as unknown as T
          }
        }
      } catch (parseError) {
        throw new ApiError(
          `Failed to parse response: ${(parseError as Error).message}`,
          response.status,
          response.statusText,
          null,
          processedConfig,
          'PARSE_ERROR'
        )
      }

      // Validate status
      const validateStatus = processedConfig.validateStatus || ((status: number) => status >= 200 && status < 300)
      if (!validateStatus(response.status)) {
        throw new ApiError(
          `Request failed: ${response.statusText}`,
          response.status,
          response.statusText,
          data,
          processedConfig
        )
      }

      // Cache successful GET responses
      if (cacheKey && response.ok && !processedConfig.body) {
        this.cache.set(cacheKey, data, processedConfig.cacheMaxAge || this.config.cacheMaxAge)
      }

      // Create standardized response
      const apiResponse: ApiResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: processedConfig
      }

      // Apply response interceptors
      return await this.applyResponseInterceptors(apiResponse)

    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Network or other errors
      throw new ApiError(
        `Network error: ${(error as Error).message}`,
        0,
        'Network Error',
        null,
        processedConfig,
        'NETWORK_ERROR'
      )
    }
  }

  // HTTP method implementations
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    config: Partial<RequestConfig> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      endpoint,
      params,
      method: 'GET'
    })
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    config: Partial<RequestConfig> = {}
  ): Promise<ApiResponse<T>> {
    let body: string | FormData | undefined
    let headers: Record<string, string> = {}
    
    // Safely copy headers from config
    if (config.headers) {
      const configHeaders = config.headers as Record<string, string>
      Object.assign(headers, configHeaders)
    }

    if (data instanceof FormData) {
      body = data
      // Remove Content-Type to let browser set it with boundary
      delete headers['Content-Type']
    } else if (data !== undefined) {
      body = JSON.stringify(data)
      headers['Content-Type'] = 'application/json'
    }

    return this.request<T>({
      ...config,
      endpoint,
      method: 'POST',
      body,
      headers
    })
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    config: Partial<RequestConfig> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      endpoint,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T = any>(
    endpoint: string,
    config: Partial<RequestConfig> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      endpoint,
      method: 'DELETE'
    })
  }

  // Create a new instance with different configuration
  create(config: Partial<ApiConfig>): ApiClient {
    return new ApiClient({
      ...this.config,
      ...config
    })
  }

  // Cache management methods
  clearCache(pattern?: string): void {
    this.cache.clear(pattern)
  }

  getCacheStats() {
    return this.cache.getStats()
  }

  // Configuration management
  updateConfig(updates: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  getConfig(): ApiConfig {
    return { ...this.config }
  }

  // Cleanup method
  destroy(): void {
    this.cache.destroy()
    this.requestInterceptors = []
    this.responseInterceptors = []
  }
}

// Default API client instance
export const apiClient = new ApiClient()

// Enhanced auth interceptor with token refresh
apiClient.addRequestInterceptor(async (config) => {
  // Add authentication token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    }
  }

  // Add request ID for tracking
  config.headers = {
    ...config.headers,
    'X-Request-ID': typeof crypto !== 'undefined' ? crypto.randomUUID() : `req_${Date.now()}_${Math.random()}`
  }

  return config
})

// Enhanced response interceptor with better error handling
apiClient.addResponseInterceptor(async (response) => {
  // Log API calls in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log(`API ${response.config.method} ${response.config.endpoint}:`, {
      status: response.status,
      data: response.data
    })
  }

  // Handle token refresh on 401
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    window.dispatchEvent(new CustomEvent('auth:token-expired'))
  }

  return response
})

// Export types for external use
export type {
  ApiConfig,
  RequestConfig,
  ApiResponse,
  RequestInterceptor,
  ResponseInterceptor
}

export { ApiError, ApiClient }

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    apiClient.destroy()
  })
}
