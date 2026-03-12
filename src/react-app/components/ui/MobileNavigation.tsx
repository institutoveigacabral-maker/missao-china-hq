import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  FileText, 
  Users, 
  Shield, 
  Truck,
  Search
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  path: string
  badge?: number
}

const navigationItems: NavItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
    path: '/',
  },
  {
    id: 'playbook',
    label: 'SKUs',
    icon: FileText,
    path: '/playbook',
  },
  {
    id: 'suppliers',
    label: 'Fornecedores',
    icon: Users,
    path: '/suppliers',
  },
  {
    id: 'regulations',
    label: 'Compliance',
    icon: Shield,
    path: '/regulations',
  },
  {
    id: 'logistics',
    label: 'Logística',
    icon: Truck,
    path: '/logistics',
  },
]

export const MobileNavigation: React.FC = () => {
  const location = useLocation()

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Bottom Navigation Bar - z-30 */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 safe-bottom shadow-lg">
        <div className="grid grid-cols-5 min-h-touch">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = isActivePath(item.path)
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center relative
                  touch-feedback transition-all duration-200 min-h-touch min-w-touch
                  ${isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-slate-500 hover:text-slate-700 active:bg-slate-50'
                  }
                `}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-1" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium truncate w-full text-center px-1">
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom padding to prevent content overlap */}
      <div className="lg:hidden h-16 safe-bottom" />
    </>
  )
}

// Quick action floating button for mobile
interface QuickActionButtonProps {
  onClick: () => void
  icon: React.ComponentType<any>
  label: string
  className?: string
  variant?: 'primary' | 'secondary'
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  onClick,
  icon: Icon,
  label,
  className = '',
  variant = 'primary'
}) => {
  const baseClasses = `
    lg:hidden fixed bottom-20 right-4 z-25
    min-w-touch min-h-touch w-14 h-14 rounded-full shadow-lg
    flex items-center justify-center
    touch-feedback transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transform hover:scale-105 active:scale-95
  `
  
  const variantClasses = variant === 'primary'
    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 focus:ring-slate-500'

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      aria-label={label}
      title={label}
    >
      <Icon className="w-6 h-6" />
    </button>
  )
}

// Mobile menu overlay for additional options
interface MobileMenuOverlayProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({
  isOpen,
  onClose,
  children,
  title = 'Menu'
}) => {
  if (!isOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 z-45">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-hidden safe-bottom">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-slate-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="px-4 pb-3 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile search bar component
interface MobileSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onFocus?: () => void
  onSearch?: (value: string) => void
  showCancel?: boolean
  onCancel?: () => void
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Buscar...",
  onFocus,
  onSearch,
  showCancel = false,
  onCancel
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-slate-200 safe-top">
      <div className="px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={onFocus}
              placeholder={placeholder}
              className="
                w-full min-h-touch pl-10 pr-4 
                bg-slate-100 rounded-full text-base
                placeholder-slate-500 text-slate-900
                border-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                transition-all duration-200
              "
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 text-slate-500" />
            </div>
            
            {/* Clear button */}
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 touch-feedback"
                aria-label="Limpar busca"
              >
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Cancel button */}
          {showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-blue-600 font-medium text-base min-h-touch px-3 touch-feedback"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

// Mobile tab bar for switching between views
interface MobileTabItem {
  id: string
  label: string
  count?: number
}

interface MobileTabBarProps {
  tabs: MobileTabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  tabs,
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`lg:hidden bg-white border-b border-slate-200 ${className}`}>
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex-shrink-0 px-4 py-3 min-h-touch
              text-sm font-medium whitespace-nowrap
              border-b-2 transition-colors duration-200
              ${activeTab === tab.id
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-500 border-transparent hover:text-slate-700'
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Mobile action sheet for contextual actions
interface ActionSheetItem {
  id: string
  label: string
  icon?: React.ComponentType<any>
  destructive?: boolean
  disabled?: boolean
  onClick: () => void
}

interface MobileActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  items: ActionSheetItem[]
}

export const MobileActionSheet: React.FC<MobileActionSheetProps> = ({
  isOpen,
  onClose,
  title,
  items
}) => {
  if (!isOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 z-45">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Action sheet */}
      <div className="absolute bottom-0 left-4 right-4 safe-bottom">
        <div className="bg-white rounded-2xl mb-2 overflow-hidden">
          {title && (
            <div className="px-4 py-3 border-b border-slate-200 text-center">
              <h3 className="text-sm font-medium text-slate-500">{title}</h3>
            </div>
          )}
          
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick()
                  onClose()
                }}
                disabled={item.disabled}
                className={`
                  w-full flex items-center space-x-3 px-4 py-4 min-h-touch
                  text-left transition-colors duration-200
                  ${index !== items.length - 1 ? 'border-b border-slate-100' : ''}
                  ${item.destructive
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-slate-900 hover:bg-slate-50'
                  }
                  ${item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'touch-feedback'
                  }
                `}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
        
        {/* Cancel button */}
        <button
          onClick={onClose}
          className="w-full bg-white rounded-2xl px-4 py-4 min-h-touch font-semibold text-blue-600 touch-feedback"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default MobileNavigation
