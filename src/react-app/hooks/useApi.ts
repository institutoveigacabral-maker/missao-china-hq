// React hooks for seamless API integration with real data
import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '@/react-app/utils/apiClient'

// Generic hook interface for all API operations
interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  mutate: (newData: T) => void
}

// Cache interface for intelligent data management
interface CacheEntry<T> {
  data: T
  timestamp: number
  expiry: number
}

// Global cache store
const cache = new Map<string, CacheEntry<any>>()

// Utility function to generate cache keys
const getCacheKey = (endpoint: string, params?: any): string => {
  if (!params) return endpoint
  const paramString = new URLSearchParams(params).toString()
  return `${endpoint}?${paramString}`
}

// Utility function to check cache validity
const isCacheValid = <T>(entry: CacheEntry<T>): boolean => {
  return Date.now() < entry.timestamp + entry.expiry
}

// Generic useApi hook with caching and optimization
export function useApi<T>(
  endpoint: string,
  options: {
    params?: Record<string, any>
    immediate?: boolean
    cacheTime?: number
    client?: typeof apiClient
    onSuccess?: (data: T) => void
    onError?: (error: string) => void
  } = {}
): UseApiState<T> {
  const {
    params,
    immediate = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    client = apiClient,
    onSuccess,
    onError
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const cacheKey = getCacheKey(endpoint, params)

  const fetchData = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Check cache first
    const cachedEntry = cache.get(cacheKey)
    if (cachedEntry && isCacheValid(cachedEntry)) {
      setData(cachedEntry.data)
      setError(null)
      onSuccess?.(cachedEntry.data)
      return
    }

    setLoading(true)
    setError(null)
    abortControllerRef.current = new AbortController()

    try {
      const response = await client.get<T>(endpoint, params, {
        signal: abortControllerRef.current.signal
      })
      
      const responseData = response.data

      // Cache the response
      cache.set(cacheKey, {
        data: responseData,
        timestamp: Date.now(),
        expiry: cacheTime
      })

      setData(responseData)
      onSuccess?.(responseData)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        onError?.(err.message)
      } else if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
        onError?.(err.message)
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [endpoint, params, cacheKey, cacheTime, client, onSuccess, onError])

  const mutate = useCallback((newData: T) => {
    setData(newData)
    // Update cache
    cache.set(cacheKey, {
      data: newData,
      timestamp: Date.now(),
      expiry: cacheTime
    })
  }, [cacheKey, cacheTime])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [immediate, fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    mutate
  }
}

// SKU-related hooks
export interface SKU {
  id: number
  sku_code: string
  product_name: string
  product_category: string
  description?: string
  technical_specs?: string
  regulatory_status: string
  supplier_id?: number
  lab_test_status?: string
  certification_level?: string
  risk_category: string
  target_markets?: string
  compliance_notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
  supplier_name?: string
}

export const useSkus = (filters?: Record<string, any>) => {
  return useApi<SKU[]>('/api/skus', {
    params: filters,
    client: apiClient,
    cacheTime: 2 * 60 * 1000 // 2 minutes for SKU data
  })
}

export const useSku = (skuId: string | number) => {
  return useApi<SKU>(`/api/skus/${skuId}`, {
    client: apiClient,
    immediate: !!skuId,
    cacheTime: 5 * 60 * 1000
  })
}

export const useSkusByCategory = (category: string) => {
  return useSkus({ product_category: category })
}

export const useSkusByVertical = (vertical: string) => {
  return useSkus({ vertical })
}

// Supplier-related hooks
export interface Supplier {
  id: number
  supplier_code: string
  company_name: string
  supplier_type: string
  country: string
  city?: string
  contact_person?: string
  email?: string
  phone?: string
  quality_rating: number
  certification_status: string
  compliance_score: number
  last_audit_date?: string
  next_audit_date?: string
  risk_level: string
  is_approved: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export const useSuppliers = (filters?: Record<string, any>) => {
  return useApi<Supplier[]>('/api/suppliers', {
    params: filters,
    client: apiClient,
    cacheTime: 5 * 60 * 1000 // 5 minutes for supplier data
  })
}

export const useSupplier = (supplierId: string | number) => {
  return useApi<Supplier>(`/api/suppliers/${supplierId}`, {
    client: apiClient,
    immediate: !!supplierId,
    cacheTime: 10 * 60 * 1000
  })
}

export const useSuppliersByRating = (minRating: number = 4) => {
  return useSuppliers({ min_rating: minRating })
}

// Regulation-related hooks
export interface Regulation {
  id: number
  regulation_code: string
  regulation_name: string
  region: string
  category: string
  description?: string
  official_link?: string
  validity_start_date?: string
  validity_end_date?: string
  last_update_date?: string
  severity_level: string
  is_mandatory: boolean
  created_at: string
  updated_at: string
}

export const useRegulations = (filters?: Record<string, any>) => {
  return useApi<Regulation[]>('/api/regulations', {
    params: filters,
    client: apiClient,
    cacheTime: 30 * 60 * 1000 // 30 minutes for regulation data
  })
}

export const useRegulation = (regulationId: string | number) => {
  return useApi<Regulation>(`/api/regulations/${regulationId}`, {
    client: apiClient,
    immediate: !!regulationId,
    cacheTime: 60 * 60 * 1000 // 1 hour
  })
}

// Dashboard statistics hook
export interface DashboardStats {
  totalSKUs: number
  certifiedSKUs: number
  pendingSKUs: number
  blockedSKUs: number
  lowRiskSKUs: number
  mediumRiskSKUs: number
  highRiskSKUs: number
  totalSuppliers: number
  approvedSuppliers: number
  totalRegulations: number
  activeRegulations: number
  complianceScore: number
  recentActivity: {
    newSKUs: number
    updatedSuppliers: number
    expiredCertifications: number
  }
  verticalDistribution: Record<string, number>
  riskDistribution: Record<string, number>
  statusDistribution: Record<string, number>
}

export const useDashboardStats = () => {
  return useApi<DashboardStats>('/api/dashboard/stats', {
    cacheTime: 1 * 60 * 1000 // 1 minute for real-time stats
  })
}

// Search functionality
export interface SearchResult {
  type: 'sku' | 'supplier' | 'regulation'
  id: number
  title: string
  subtitle?: string
  description?: string
  category?: string
  relevance: number
}

export const useSearch = (query: string, options?: {
  types?: Array<'sku' | 'supplier' | 'regulation'>
  limit?: number
}) => {
  return useApi<SearchResult[]>('/api/search', {
    params: {
      q: query,
      types: options?.types?.join(','),
      limit: options?.limit || 20
    },
    immediate: query.length >= 2,
    cacheTime: 2 * 60 * 1000
  })
}

// Batch operations hook
interface BatchOperation {
  operation: 'create' | 'update' | 'delete'
  resource: string
  data?: any
  id?: string | number
}

interface BatchResult {
  success: boolean
  operations: Array<{
    success: boolean
    error?: string
    data?: any
  }>
}

export const useBatchOperations = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeBatch = useCallback(async (operations: BatchOperation[]): Promise<BatchResult> => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post<BatchResult>('/api/batch', { operations })
      return response.data
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Batch operation failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    executeBatch,
    loading,
    error
  }
}

// Mutation hooks for CRUD operations
export const useCreateSKU = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSKU = useCallback(async (skuData: Partial<SKU>): Promise<SKU> => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post<SKU>('/api/skus', skuData)
      
      // Invalidate cache for SKU lists
      const cacheKeys = Array.from(cache.keys()).filter(key => key.startsWith('/api/skus'))
      cacheKeys.forEach(key => cache.delete(key))
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to create SKU'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return { createSKU, loading, error }
}

export const useUpdateSKU = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateSKU = useCallback(async (skuId: string | number, skuData: Partial<SKU>): Promise<SKU> => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.put<SKU>(`/api/skus/${skuId}`, skuData)
      
      // Invalidate related cache entries
      const cacheKeys = Array.from(cache.keys()).filter(key => 
        key.startsWith('/api/skus') || key.includes(`/${skuId}`)
      )
      cacheKeys.forEach(key => cache.delete(key))
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update SKU'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateSKU, loading, error }
}

export const useDeleteSKU = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteSKU = useCallback(async (skuId: string | number): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      await apiClient.delete(`/api/skus/${skuId}`)
      
      // Invalidate related cache entries
      const cacheKeys = Array.from(cache.keys()).filter(key => 
        key.startsWith('/api/skus') || key.includes(`/${skuId}`)
      )
      cacheKeys.forEach(key => cache.delete(key))
      
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete SKU'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteSKU, loading, error }
}

// Real-time data hooks with WebSocket support
export const useRealTimeStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // For now, use polling. In production, this would use WebSocket
    const interval = setInterval(async () => {
      try {
        const response = await apiClient.get<DashboardStats>('/api/dashboard/stats')
        setStats(response.data)
        setConnected(true)
      } catch (error) {
        setConnected(false)
      }
    }, 30000) // Update every 30 seconds

    // Initial load
    apiClient.get<DashboardStats>('/api/dashboard/stats')
      .then(response => {
        setStats(response.data)
        setConnected(true)
      })
      .catch(() => setConnected(false))

    return () => clearInterval(interval)
  }, [])

  return { stats, connected }
}

// Analytics and reporting hooks
export interface AnalyticsData {
  period: string
  metrics: {
    skuGrowth: number
    complianceImprovement: number
    supplierPerformance: number
    riskReduction: number
  }
  trends: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      color: string
    }>
  }
}

export const useAnalytics = (period: '7d' | '30d' | '90d' | '1y' = '30d') => {
  return useApi<AnalyticsData>('/api/analytics', {
    params: { period },
    cacheTime: 10 * 60 * 1000 // 10 minutes for analytics
  })
}

// File upload hook
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (
    file: File,
    endpoint: string = '/api/upload',
    fieldName: string = 'file'
  ): Promise<{ url: string; filename: string }> => {
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append(fieldName, file)
      
      const response = await apiClient.post<{ url: string; filename: string }>(endpoint, formData)
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Upload failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [])

  return {
    uploadFile,
    uploading,
    progress,
    error
  }
}

// Export utility functions for cache management
export const clearCache = (pattern?: string) => {
  if (pattern) {
    const keysToDelete = Array.from(cache.keys()).filter(key => key.includes(pattern))
    keysToDelete.forEach(key => cache.delete(key))
  } else {
    cache.clear()
  }
}

export const getCacheSize = () => cache.size

export const getCacheStats = () => {
  const entries = Array.from(cache.entries())
  
  return {
    total: entries.length,
    valid: entries.filter(([_, entry]) => isCacheValid(entry)).length,
    expired: entries.filter(([_, entry]) => !isCacheValid(entry)).length,
    oldestEntry: entries.length > 0 ? Math.min(...entries.map(([_, entry]) => entry.timestamp)) : null,
    newestEntry: entries.length > 0 ? Math.max(...entries.map(([_, entry]) => entry.timestamp)) : null
  }
}

// Export all types and interfaces
export type {
  UseApiState,
  CacheEntry,
  BatchOperation,
  BatchResult
}
