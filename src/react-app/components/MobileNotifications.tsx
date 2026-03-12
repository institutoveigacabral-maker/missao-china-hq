import React, { useState } from 'react'
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { TouchButton } from './Touch'
import { Badge } from './ui/Badge'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  avatar?: string
  category?: string
}

interface MobileNotificationsProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onDeleteAll: () => void
  isOpen: boolean
  onClose: () => void
  maxHeight?: string
}

export const MobileNotifications: React.FC<MobileNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  isOpen,
  onClose,
  maxHeight = '70vh',
}) => {
  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m atrás`
    if (hours < 24) return `${hours}h atrás`
    if (days < 7) return `${days}d atrás`
    return timestamp.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Panel */}
      <div 
        className="absolute inset-x-0 top-0 bg-white rounded-b-xl flex flex-col animate-in slide-in-from-top duration-300"
        style={{ maxHeight }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-xl">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notificações</h2>
            {unreadCount > 0 && (
              <Badge variant="primary" size="sm">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <TouchButton
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-blue-600 hover:text-blue-700"
              >
                Marcar como lidas
              </TouchButton>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium">Nenhuma notificação</p>
              <p className="text-sm">Você está em dia!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  formatTime={formatTime}
                  getIcon={getNotificationIcon}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <TouchButton
              variant="secondary"
              size="sm"
              onClick={onDeleteAll}
              className="w-full text-red-600 hover:text-red-700"
              leftIcon={Trash2}
            >
              Limpar todas as notificações
            </TouchButton>
          </div>
        )}
      </div>
    </div>
  )
}

// Individual notification item component
const NotificationItem: React.FC<{
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  formatTime: (timestamp: Date) => string
  getIcon: (type: Notification['type']) => React.ReactNode
}> = ({ notification, onMarkAsRead, onDelete, formatTime, getIcon }) => {
  const [showActions, setShowActions] = useState(false)

  return (
    <div 
      className={`
        relative p-4 transition-colors
        ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white hover:bg-gray-50'}
      `}
    >
      <div className="flex items-start space-x-3">
        {/* Icon or Avatar */}
        <div className="flex-shrink-0 mt-1">
          {notification.avatar ? (
            <img 
              src={notification.avatar} 
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            getIcon(notification.type)
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-800'}`}>
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {notification.message}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(notification.timestamp)}</span>
                </span>
                {notification.category && (
                  <Badge variant="secondary" size="sm">
                    {notification.category}
                  </Badge>
                )}
              </div>

              {/* Action button */}
              {notification.action && (
                <div className="mt-3">
                  <TouchButton
                    variant="primary"
                    size="sm"
                    onClick={notification.action.onClick}
                    className="text-xs"
                  >
                    {notification.action.label}
                  </TouchButton>
                </div>
              )}
            </div>

            {/* Actions menu */}
            <div className="flex items-center space-x-1 ml-2">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                  title="Marcar como lida"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded actions */}
          {showActions && (
            <div className="mt-3 flex space-x-2 animate-in fade-in slide-in-from-top-1 duration-200">
              {notification.read ? (
                <TouchButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // Mark as unread logic would go here
                    setShowActions(false)
                  }}
                  className="text-xs"
                >
                  Marcar como não lida
                </TouchButton>
              ) : (
                <TouchButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onMarkAsRead(notification.id)
                    setShowActions(false)
                  }}
                  className="text-xs"
                >
                  Marcar como lida
                </TouchButton>
              )}
              <TouchButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  onDelete(notification.id)
                  setShowActions(false)
                }}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Excluir
              </TouchButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Notification bell icon with badge
export const MobileNotificationBell: React.FC<{
  unreadCount: number
  onClick: () => void
  className?: string
}> = ({ unreadCount, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </button>
  )
}

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const deleteAllNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    unreadCount,
  }
}

export default MobileNotifications
