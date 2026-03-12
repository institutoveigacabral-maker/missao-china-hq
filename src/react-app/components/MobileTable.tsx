import React, { useState } from 'react'
import { ChevronDown, ChevronRight, MoreVertical, Search } from 'lucide-react'
import { TouchInput, TouchCard } from './Touch'

interface Column {
  key: string
  label: string
  width?: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
  mobileRender?: (value: any, row: any) => React.ReactNode
  hideOnMobile?: boolean
}

interface MobileTableProps {
  data: any[]
  columns: Column[]
  loading?: boolean
  searchable?: boolean
  onRowClick?: (row: any) => void
  emptyMessage?: string
  className?: string
}

export const MobileTable: React.FC<MobileTableProps> = ({
  data,
  columns,
  loading = false,
  searchable = false,
  onRowClick,
  emptyMessage = "Nenhum dado encontrado",
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  // Filter data based on search
  const filteredData = searchQuery
    ? data.filter(row =>
        columns.some(col => {
          const value = row[col.key]
          return value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        })
      )
    : data

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        }
      }
      return { key, direction: 'asc' }
    })
  }

  if (loading) {
    return <MobileTableSkeleton />
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Search bar - mobile only */}
      {searchable && (
        <div className="lg:hidden mb-4">
          <TouchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            leftIcon={Search}
            clearable
            onClear={() => setSearchQuery('')}
          />
        </div>
      )}

      {/* Desktop search bar */}
      {searchable && (
        <div className="hidden lg:block mb-6">
          <div className="max-w-md">
            <TouchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar na tabela..."
              leftIcon={Search}
              clearable
              onClear={() => setSearchQuery('')}
              className="h-10"
            />
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <ChevronDown className={`
                        w-4 h-4 transition-transform
                        ${sortConfig?.key === column.key 
                          ? sortConfig.direction === 'desc' 
                            ? 'rotate-180' 
                            : ''
                          : 'opacity-50'
                        }
                      `} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((row, index) => (
              <tr
                key={row.id || index}
                onClick={() => onRowClick?.(row)}
                className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                  transition-colors duration-150
                `}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {sortedData.map((row, index) => (
          <MobileTableCard
            key={row.id || index}
            row={row}
            columns={columns}
            onClick={() => onRowClick?.(row)}
          />
        ))}
      </div>

      {/* Empty state */}
      {sortedData.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          <div className="flex flex-col items-center space-y-2">
            <Search className="w-12 h-12 text-gray-300" />
            <p className="text-lg font-medium">{emptyMessage}</p>
            {searchQuery && (
              <p className="text-sm">
                Nenhum resultado para "<span className="font-medium">{searchQuery}</span>"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Mobile card representation of table row
interface MobileTableCardProps {
  row: any
  columns: Column[]
  onClick?: () => void
}

const MobileTableCard: React.FC<MobileTableCardProps> = ({
  row,
  columns,  
  onClick,
}) => {
  const [expanded, setExpanded] = useState(false)

  // Get primary columns (not hidden on mobile)
  const primaryColumns = columns.filter(col => !col.hideOnMobile)
  const hiddenColumns = columns.filter(col => col.hideOnMobile)

  return (
    <TouchCard 
      onClick={onClick}
      hover={!!onClick}
      className="relative"
    >
      <div className="space-y-3">
        {/* Primary info always visible */}
        {primaryColumns.slice(0, 3).map((column) => (
          <div key={column.key} className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-500 w-1/3">
              {column.label}
            </span>
            <div className="text-sm text-gray-900 w-2/3 text-right">
              {column.mobileRender
                ? column.mobileRender(row[column.key], row)
                : column.render
                  ? column.render(row[column.key], row)
                  : row[column.key]
              }
            </div>
          </div>
        ))}

        {/* Expandable section for additional info */}
        {(primaryColumns.length > 3 || hiddenColumns.length > 0) && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="flex items-center justify-center w-full py-2 text-sm text-blue-600 hover:text-blue-800 border-t border-gray-100 transition-colors"
            >
              <span className="mr-1">
                {expanded ? 'Mostrar menos' : 'Mostrar mais'}
              </span>
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {expanded && (
              <div className="space-y-2 pt-2 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Remaining primary columns */}
                {primaryColumns.slice(3).map((column) => (
                  <div key={column.key} className="flex justify-between items-start text-sm">
                    <span className="text-gray-500 w-1/3">{column.label}</span>
                    <div className="text-gray-900 w-2/3 text-right">
                      {column.mobileRender
                        ? column.mobileRender(row[column.key], row)
                        : column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]
                      }
                    </div>
                  </div>
                ))}

                {/* Hidden columns */}
                {hiddenColumns.map((column) => (
                  <div key={column.key} className="flex justify-between items-start text-sm">
                    <span className="text-gray-500 w-1/3">{column.label}</span>
                    <div className="text-gray-900 w-2/3 text-right">
                      {column.mobileRender
                        ? column.mobileRender(row[column.key], row)
                        : column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Row actions menu */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          // Handle row actions menu
        }}
        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </TouchCard>
  )
}

// Loading skeleton for mobile table
const MobileTableSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Desktop skeleton */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header skeleton */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex space-x-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              ))}
            </div>
          </div>
          {/* Rows skeleton */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
              <div className="flex space-x-6">
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <div key={colIndex} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: colIndex === 0 ? '120px' : '80px' }}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="lg:hidden space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MobileTable
