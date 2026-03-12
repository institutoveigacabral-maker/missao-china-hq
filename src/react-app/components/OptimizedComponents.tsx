import React, { memo, useMemo, useCallback } from 'react'
import { useRenderCount, useDebouncedCallback, useWhyDidYouUpdate } from '@/react-app/hooks/useAdvancedPerformance'

// Optimized list component
interface OptimizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T, index: number) => string
  className?: string
  emptyMessage?: string
}

export const OptimizedList = memo(<T,>({
  items,
  renderItem,
  keyExtractor,
  className = '',
  emptyMessage = 'Nenhum item encontrado'
}: OptimizedListProps<T>) => {
  useRenderCount('OptimizedList')
  
  const memoizedItems = useMemo(() => {
    return items.map((item, index) => ({
      key: keyExtractor(item, index),
      element: renderItem(item, index),
      item,
      index
    }))
  }, [items, renderItem, keyExtractor])
  
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    )
  }
  
  return (
    <div className={className}>
      {memoizedItems.map(({ key, element }) => (
        <div key={key}>
          {element}
        </div>
      ))}
    </div>
  )
}) as <T>(props: OptimizedListProps<T>) => React.JSX.Element

// Optimized table row
interface OptimizedRowProps<T = Record<string, any>> {
  data: T
  columns: Array<{
    key: string
    header?: string
    render?: (value: any, row: T) => React.ReactNode
  }>
  onClick?: (data: T) => void
  className?: string
  isSelected?: boolean
}

export const OptimizedRow = memo(<T extends Record<string, any>>({
  data,
  columns,
  onClick,
  className = '',
  isSelected = false
}: OptimizedRowProps<T>) => {
  useRenderCount(`OptimizedRow-${data.id || 'unknown'}`)
  
  const handleClick = useCallback(() => {
    onClick?.(data)
  }, [onClick, data])
  
  const cells = useMemo(() => {
    return columns.map(column => ({
      key: column.key,
      value: data[column.key],
      rendered: column.render ? column.render(data[column.key], data) : data[column.key]
    }))
  }, [data, columns])
  
  return (
    <tr 
      className={`
        ${onClick ? 'cursor-pointer hover:bg-blue-50 transition-colors duration-150' : ''} 
        ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'}
        ${className}
      `}
      onClick={handleClick}
    >
      {cells.map(cell => (
        <td key={cell.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
          {cell.rendered}
        </td>
      ))}
    </tr>
  )
}) as <T extends Record<string, any>>(props: OptimizedRowProps<T>) => React.JSX.Element

// Optimized form field
interface OptimizedFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  error?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  helperText?: string
}

export const OptimizedField = memo<OptimizedFieldProps>(({
  label,
  value,
  onChange,
  type = 'text',
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  helperText
}) => {
  useRenderCount(`OptimizedField-${label}`)
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])
  
  const inputId = useMemo(() => 
    `field-${label.toLowerCase().replace(/\s+/g, '-')}`, 
    [label]
  )
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-lg transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
        `}
      />
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
})

// Optimized search component
interface OptimizedSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
  showClearButton?: boolean
  loading?: boolean
}

export const OptimizedSearch = memo<OptimizedSearchProps>(({
  onSearch,
  placeholder = 'Buscar...',
  debounceMs = 300,
  className = '',
  showClearButton = true,
  loading = false
}) => {
  useRenderCount('OptimizedSearch')
  
  const [query, setQuery] = React.useState('')
  
  const debouncedSearch = useDebouncedCallback(
    (searchQuery: string) => {
      onSearch(searchQuery)
    },
    debounceMs,
    [onSearch]
  )
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }, [debouncedSearch])
  
  const handleClear = useCallback(() => {
    setQuery('')
    onSearch('')
  }, [onSearch])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }, [handleClear])
  
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {loading ? (
          <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      
      {query && showClearButton && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
          title="Limpar busca (Esc)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
})

// Optimized table component
interface OptimizedTableProps<T extends Record<string, any>> {
  data: T[]
  columns: Array<{
    key: string
    header: string
    render?: (value: any, row: T) => React.ReactNode
    sortable?: boolean
  }>
  onRowClick?: (row: T) => void
  selectedRows?: Set<string | number>
  keyExtractor: (row: T) => string | number
  className?: string
  emptyMessage?: string
  loading?: boolean
}

export const OptimizedTable = memo(<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  selectedRows,
  keyExtractor,
  className = '',
  emptyMessage = 'Nenhum dado encontrado',
  loading = false
}: OptimizedTableProps<T>) => {
  useRenderCount('OptimizedTable')

  const memoizedRows = useMemo(() => {
    return data.map(row => ({
      key: keyExtractor(row),
      row,
      isSelected: selectedRows?.has(keyExtractor(row)) || false
    }))
  }, [data, keyExtractor, selectedRows])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Carregando...
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {memoizedRows.map(({ key, row, isSelected }) => (
            <OptimizedRow<T>
              key={key}
              data={row}
              columns={columns}
              onClick={onRowClick}
              isSelected={isSelected}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}) as <T extends Record<string, any>>(props: OptimizedTableProps<T>) => React.JSX.Element

// Performance debugging component
export const PerformanceDebugger: React.FC<{ 
  componentName: string 
  props: Record<string, any>
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}> = ({ componentName, props, position = 'bottom-left' }) => {
  useRenderCount(componentName)
  useWhyDidYouUpdate(componentName, props)
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4', 
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }
  
  return (
    <div className={`fixed ${positionClasses[position]} bg-black text-white p-2 rounded text-xs font-mono z-50 opacity-75 hover:opacity-100 transition-opacity`}>
      🔧 {componentName} Debug
      <div className="text-yellow-300 text-xs mt-1">
        Props: {Object.keys(props).length}
      </div>
    </div>
  )
}

// Optimized card component
interface OptimizedCardProps {
  children: React.ReactNode
  className?: string
  loading?: boolean
  error?: string
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export const OptimizedCard = memo<OptimizedCardProps>(({
  children,
  className = '',
  loading = false,
  error,
  title,
  subtitle,
  actions
}) => {
  useRenderCount('OptimizedCard')

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Carregando...
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-600 py-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
})

export default {
  OptimizedList,
  OptimizedRow,
  OptimizedField,
  OptimizedSearch,
  OptimizedTable,
  OptimizedCard,
  PerformanceDebugger
}
