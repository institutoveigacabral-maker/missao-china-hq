import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Tab {
  id: string
  label: string
  count?: number
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

interface MobileTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  scrollable?: boolean
  className?: string
}

export const MobileTabs: React.FC<MobileTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  scrollable = true,
  className = '',
}) => {
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current
    if (!container || !scrollable) return

    setShowLeftScroll(container.scrollLeft > 0)
    setShowRightScroll(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    )
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        container.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
  }, [scrollable])

  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: -150, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: 150, behavior: 'smooth' })
    }
  }

  const scrollToActiveTab = () => {
    const container = scrollContainerRef.current
    const activeTabElement = container?.querySelector(`[data-tab-id="${activeTab}"]`)
    
    if (container && activeTabElement) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTabElement.getBoundingClientRect()
      
      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        activeTabElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }
    }
  }

  useEffect(() => {
    scrollToActiveTab()
  }, [activeTab])

  const getTabClasses = (tab: Tab) => {
    const baseClasses = "relative flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap"
    const isActive = tab.id === activeTab
    const isDisabled = tab.disabled

    if (isDisabled) {
      return `${baseClasses} text-gray-400 cursor-not-allowed`
    }

    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-full ${
          isActive 
            ? 'bg-blue-600 text-white shadow-sm' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`
      
      case 'underline':
        return `${baseClasses} border-b-2 ${
          isActive 
            ? 'text-blue-600 border-blue-600' 
            : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
        }`
      
      default:
        return `${baseClasses} ${
          isActive 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`
    }
  }

  return (
    <div className={`relative bg-white border-b border-gray-200 ${className}`}>
      {/* Left scroll button */}
      {scrollable && showLeftScroll && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-0 z-10 h-full px-2 bg-gradient-to-r from-white to-transparent flex items-center"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
      )}

      {/* Tabs container */}
      <div
        ref={scrollContainerRef}
        className={`
          flex ${scrollable ? 'overflow-x-auto scrollbar-hide' : ''}
          ${scrollable && showLeftScroll ? 'pl-8' : ''}
          ${scrollable && showRightScroll ? 'pr-8' : ''}
        `}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            className={getTabClasses(tab)}
            disabled={tab.disabled}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`
                ml-1 px-2 py-0.5 text-xs rounded-full
                ${tab.id === activeTab 
                  ? variant === 'pills' 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {tab.count > 99 ? '99+' : tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Right scroll button */}
      {scrollable && showRightScroll && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-0 z-10 h-full px-2 bg-gradient-to-l from-white to-transparent flex items-center"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      )}
    </div>
  )
}

// Tab content wrapper
export const MobileTabContent: React.FC<{
  activeTab: string
  tabId: string
  children: React.ReactNode
  className?: string
  lazy?: boolean
}> = ({ activeTab, tabId, children, className = '', lazy = false }) => {
  const isActive = activeTab === tabId
  const [hasBeenActive, setHasBeenActive] = useState(!lazy || isActive)

  useEffect(() => {
    if (isActive) {
      setHasBeenActive(true)
    }
  }, [isActive])

  if (lazy && !hasBeenActive) {
    return null
  }

  return (
    <div
      className={`${isActive ? 'block' : 'hidden'} ${className}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
    >
      {children}
    </div>
  )
}

// Compound component for easier usage
export const MobileTabsContainer: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  )
}

// Vertical tabs for larger screens
export const MobileVerticalTabs: React.FC<{
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}> = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
          className={`
            flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left
            ${tab.id === activeTab
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : tab.disabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            {tab.icon && <tab.icon className="w-4 h-4" />}
            <span>{tab.label}</span>
          </div>
          {tab.count !== undefined && (
            <span className={`
              px-2 py-0.5 text-xs rounded-full
              ${tab.id === activeTab 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default MobileTabs