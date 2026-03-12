import React, { useState } from 'react'
import { Container, Stack } from '../components/ResponsiveLayout'
import { TouchButton } from '../components/Touch'
import { SkuFormAdvanced } from '../components/Forms/SkuFormAdvanced'
import { useSkus, useDeleteSku } from '../hooks/useSkuCrud'
import { SkeletonTable } from '../components/Loading'
import { Trash, Plus, Edit, Eye, Package, AlertTriangle, CheckCircle } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { SkuFormData } from '../schemas/skuSchema'

interface Sku {
  id: number
  sku_code: string
  product_name: string
  product_category: string
  description: string
  technical_specs: string
  regulatory_status: 'pending' | 'approved' | 'rejected'
  lab_test_status: 'pending' | 'in_progress' | 'completed' | 'failed'
  certification_level: string
  risk_category: 'low' | 'medium' | 'high'
  target_markets: string
  compliance_notes: string
  is_active: boolean
}

export const SkuCrudDemo = () => {
  const [formVisible, setFormVisible] = useState(false)
  const [editingSku, setEditingSku] = useState<Sku | null>(null)
  const { data, isLoading } = useSkus()
  const deleteSku = useDeleteSku()

  const handleEdit = (sku: Sku) => {
    setEditingSku(sku as Sku)
    setFormVisible(true)
  }

  const handleCloseForm = () => {
    setFormVisible(false)
    setEditingSku(null)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'yellow', icon: AlertTriangle, label: 'Pendente' },
      approved: { color: 'green', icon: CheckCircle, label: 'Aprovado' },
      rejected: { color: 'red', icon: AlertTriangle, label: 'Rejeitado' },
      in_progress: { color: 'blue', icon: Package, label: 'Em Progresso' },
      completed: { color: 'green', icon: CheckCircle, label: 'Concluído' },
      failed: { color: 'red', icon: AlertTriangle, label: 'Falhou' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.color as 'yellow' | 'green' | 'red' | 'blue'} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    )
  }

  const getRiskBadge = (risk: string) => {
    const riskConfig = {
      low: { color: 'green', label: 'Baixo' },
      medium: { color: 'yellow', label: 'Médio' },
      high: { color: 'red', label: 'Alto' },
    }

    const config = riskConfig[risk as keyof typeof riskConfig] || riskConfig.medium

    return (
      <Badge variant={config.color as 'yellow' | 'green' | 'red'}>
        {config.label}
      </Badge>
    )
  }

  if (isLoading) return <SkeletonTable rows={6} cols={4} />

  return (
    <Container className="py-6">
      <Stack spacing={6}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Gerenciar SKUs</h1>
              <p className="text-blue-100">
                Sistema completo de CRUD para produtos IoT com validação avançada
              </p>
            </div>
            <TouchButton 
              leftIcon={Plus} 
              onClick={() => {
                setEditingSku(null)
                setFormVisible(!formVisible)
              }}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              {formVisible ? 'Fechar' : 'Novo SKU'}
            </TouchButton>
          </div>
        </div>

        {formVisible && (
          <SkuFormAdvanced 
            defaultValues={editingSku || undefined}
            editMode={!!editingSku}
            onSuccess={handleCloseForm} 
          />
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Lista de SKUs ({(data?.data || []).length})</span>
            </h2>
          </div>

          {(data?.data || []).length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum SKU cadastrado</h3>
              <p className="text-gray-500 mb-6">Comece criando seu primeiro produto</p>
              <TouchButton 
                leftIcon={Plus}
                onClick={() => setFormVisible(true)}
              >
                Criar Primeiro SKU
              </TouchButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {(data?.data || []).map((sku: Sku) => (
                <div key={sku.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {sku.product_name}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                        {sku.sku_code}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getRiskBadge(sku.risk_category)}
                      {!sku.is_active && (
                        <Badge variant="gray">Inativo</Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Categoria:</strong> {sku.product_category}
                      </p>
                    </div>

                    {sku.description && (
                      <div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          <strong>Descrição:</strong> {sku.description}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(sku.regulatory_status)}
                      {getStatusBadge(sku.lab_test_status)}
                    </div>

                    {sku.target_markets && (
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>Mercados:</strong> {sku.target_markets}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <TouchButton
                        size="sm"
                        variant="outline"
                        leftIcon={Edit}
                        onClick={() => handleEdit(sku)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        Editar
                      </TouchButton>
                      
                      <TouchButton
                        size="sm"
                        variant="outline"
                        leftIcon={Eye}
                        onClick={() => alert(`Visualizar detalhes do SKU: ${sku.product_name}`)}
                        className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      >
                        Ver
                      </TouchButton>
                    </div>

                    <TouchButton
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja deletar o SKU "${sku.product_name}"?`)) {
                          deleteSku.mutate(sku.id)
                        }
                      }}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash className="w-4 h-4" />
                    </TouchButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Stack>
    </Container>
  )
}
