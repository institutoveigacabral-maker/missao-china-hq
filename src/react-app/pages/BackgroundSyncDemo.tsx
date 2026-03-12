import React, { useState } from 'react'
import { Plus, Trash2, Edit3, Database, Wifi, WifiOff } from 'lucide-react'
import BackgroundSyncStatus from '../components/ui/BackgroundSyncStatus'
import { queueOfflineAction, useBackgroundSync } from '../utils/backgroundSync'

interface MockDataItem {
  id: string
  name: string
  description: string
  type: 'sku' | 'supplier' | 'regulation'
  status: 'active' | 'pending' | 'inactive'
  createdAt: string
}

const BackgroundSyncDemo: React.FC = () => {
  const [items, setItems] = useState<MockDataItem[]>([
    {
      id: '1',
      name: 'Smart IoT Sensor v2.1',
      description: 'Sensor de temperatura e umidade para aplicações industriais',
      type: 'sku',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'Shenzhen Tech Solutions',
      description: 'Fornecedor especializado em componentes eletrônicos',
      type: 'supplier',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ])

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    type: 'sku' as const,
    status: 'active' as const
  })

  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const { queueStatus } = useBackgroundSync()

  // Simulate offline mode
  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode)
    if (!isOfflineMode) {
      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      })
      window.dispatchEvent(new Event('offline'))
    } else {
      // Simulate going online
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
      })
      window.dispatchEvent(new Event('online'))
    }
  }

  const handleCreate = async () => {
    if (!newItem.name) return

    const item: MockDataItem = {
      id: Date.now().toString(),
      ...newItem,
      createdAt: new Date().toISOString()
    }

    // Add to local state immediately for optimistic updates
    setItems(prev => [...prev, item])

    // Queue for background sync
    try {
      await queueOfflineAction(
        'CREATE',
        `/api/${item.type}s`,
        'POST',
        item
      )
      
      console.log('Item queued for sync:', item.id)
      
      // Reset form
      setNewItem({
        name: '',
        description: '',
        type: 'sku',
        status: 'active'
      })
    } catch (error) {
      console.error('Failed to queue item:', error)
      // Remove from local state if queueing failed
      setItems(prev => prev.filter(i => i.id !== item.id))
    }
  }

  const handleUpdate = async (item: MockDataItem) => {
    const updatedItem = {
      ...item,
      name: `${item.name} (Updated)`,
      updatedAt: new Date().toISOString()
    }

    // Update local state immediately
    setItems(prev => prev.map(i => i.id === item.id ? updatedItem : i))

    // Queue for background sync
    try {
      await queueOfflineAction(
        'UPDATE',
        `/api/${item.type}s/${item.id}`,
        'PUT',
        updatedItem
      )
      
      console.log('Update queued for sync:', item.id)
    } catch (error) {
      console.error('Failed to queue update:', error)
      // Revert local state if queueing failed
      setItems(prev => prev.map(i => i.id === item.id ? item : i))
    }
  }

  const handleDelete = async (item: MockDataItem) => {
    // Remove from local state immediately
    setItems(prev => prev.filter(i => i.id !== item.id))

    // Queue for background sync
    try {
      await queueOfflineAction(
        'DELETE',
        `/api/${item.type}s/${item.id}`,
        'DELETE'
      )
      
      console.log('Delete queued for sync:', item.id)
    } catch (error) {
      console.error('Failed to queue delete:', error)
      // Restore to local state if queueing failed
      setItems(prev => [...prev, item])
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sku': return '📱'
      case 'supplier': return '🏭' 
      case 'regulation': return '📋'
      default: return '📄'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-amber-100 text-amber-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Background Sync Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Demonstração do sistema de sincronização em background. Crie, edite e exclua itens mesmo offline - 
            eles serão sincronizados automaticamente quando a conexão retornar.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Controles de Teste</h2>
            
            <button
              onClick={toggleOfflineMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isOfflineMode 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isOfflineMode ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              {isOfflineMode ? 'Simular Online' : 'Simular Offline'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Form */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Criar Novo Item</h3>
              
              <input
                type="text"
                placeholder="Nome do item"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <input
                type="text"
                placeholder="Descrição"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div className="flex gap-2">
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as any }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sku">SKU</option>
                  <option value="supplier">Fornecedor</option>
                  <option value="regulation">Regulamentação</option>
                </select>
                
                <select
                  value={newItem.status}
                  onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value as any }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Ativo</option>
                  <option value="pending">Pendente</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              
              <button
                onClick={handleCreate}
                disabled={!newItem.name}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                Criar Item
              </button>
            </div>

            {/* Sync Status */}
            <BackgroundSyncStatus showDetails={true} />
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Items Locais ({items.length})
              </h2>
              {queueStatus.total > 0 && (
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                  {queueStatus.total} na fila
                </span>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="capitalize">{item.type}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span>{new Date(item.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleUpdate(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum item cadastrado</p>
                <p className="text-sm">Crie o primeiro item acima</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Como Testar o Background Sync:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
            <li>Clique em "Simular Offline" para simular perda de conexão</li>
            <li>Crie, edite ou exclua itens - eles aparecerão imediatamente na lista</li>
            <li>Observe que as ações ficam pendentes na fila de sincronização</li>
            <li>Clique em "Simular Online" para restaurar a conexão</li>
            <li>As ações serão sincronizadas automaticamente em background</li>
            <li>Acompanhe o progresso no painel de status de sincronização</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default BackgroundSyncDemo
