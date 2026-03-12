import { useState } from 'react'

import { SkuForm } from '@/react-app/components/Forms/SkuForm'
import { SupplierForm } from '@/react-app/components/Forms/SupplierForm'
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button'
import { 
  Package, 
  Factory, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Database,
  Zap,
  Shield,
  Code,
  Layers
} from 'lucide-react'
import { useToast } from '@/react-app/hooks/useToast'

type FormType = 'sku' | 'supplier' | null

export default function FormSystemDemo() {
  const [activeForm, setActiveForm] = useState<FormType>(null)
  const [savedData, setSavedData] = useState<any[]>([])
  const toast = useToast()

  // Example data for editing demos - removed to fix TypeScript warnings

  const handleSkuSubmit = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSavedData(prev => {
      const existing = prev.findIndex(item => item.type === 'sku' && item.data.sku_code === data.sku_code)
      const newItem = { type: 'sku', data, timestamp: new Date().toISOString() }
      
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = newItem
        return updated
      }
      return [...prev, newItem]
    })
    
    setActiveForm(null)
    toast.success(`SKU ${data.sku_code} processado com sucesso!`)
  }

  const handleSupplierSubmit = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSavedData(prev => {
      const existing = prev.findIndex(item => item.type === 'supplier' && item.data.supplier_code === data.supplier_code)
      const newItem = { type: 'supplier', data, timestamp: new Date().toISOString() }
      
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = newItem
        return updated
      }
      return [...prev, newItem]
    })
    
    setActiveForm(null)
    toast.success(`Fornecedor ${data.company_name} processado com sucesso!`)
  }

  const handleCancel = () => {
    setActiveForm(null)
  }

  const clearData = () => {
    setSavedData([])
    toast.info('Dados removidos')
  }

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'React Hook Form',
      description: 'Performance otimizada com re-renders mínimos'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Zod Validation',
      description: 'Validação type-safe e robusta'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: 'Loading States',
      description: 'Estados de carregamento integrados'
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: 'Error Handling',
      description: 'Tratamento avançado de erros'
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: 'TypeScript',
      description: 'Type safety completa'
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: 'Composable',
      description: 'Componentes reutilizáveis'
    }
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Sistema de Formulários Avançado</h1>
              </div>
              <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                Sistema completo de formulários com React Hook Form, validação Zod, estados de loading automáticos e tratamento robusto de erros.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    {feature.icon}
                    <div>
                      <div className="font-medium">{feature.title}</div>
                      <div className="text-blue-200 text-xs">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold">{savedData.length}</div>
              <div className="text-blue-100">Registros Salvos</div>
              <div className="text-sm text-blue-200 mt-1">
                No Sistema Demo
              </div>
            </div>
          </div>
        </div>

        {/* Form Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Demonstração de Formulários</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Package className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-slate-900">Formulário SKU</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Formulário completo para cadastro e edição de SKUs com validação avançada
              </p>
              <div className="space-y-2">
                <PrimaryButton
                  onClick={() => setActiveForm('sku')}
                  disabled={activeForm !== null}
                  className="w-full"
                >
                  Novo SKU
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => {
                    setActiveForm('sku')
                    // Simular edição com dados de exemplo
                  }}
                  disabled={activeForm !== null}
                  className="w-full"
                >
                  Editar SKU Demo
                </SecondaryButton>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Factory className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-slate-900">Formulário Fornecedor</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Formulário para gestão de fornecedores com scores de qualidade e compliance
              </p>
              <div className="space-y-2">
                <PrimaryButton
                  onClick={() => setActiveForm('supplier')}
                  disabled={activeForm !== null}
                  className="w-full"
                >
                  Novo Fornecedor
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => {
                    setActiveForm('supplier')
                    // Simular edição com dados de exemplo
                  }}
                  disabled={activeForm !== null}
                  className="w-full"
                >
                  Editar Fornecedor Demo
                </SecondaryButton>
              </div>
            </div>
          </div>

          {savedData.length > 0 && (
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  {savedData.length} registro{savedData.length !== 1 ? 's' : ''} salvo{savedData.length !== 1 ? 's' : ''}
                </span>
                <SecondaryButton onClick={clearData} size="sm">
                  Limpar Dados
                </SecondaryButton>
              </div>
            </div>
          )}
        </div>

        {/* Active Form */}
        {activeForm === 'sku' && (
          <SkuForm
            sku={undefined} // Use exampleSku for edit demo
            onSubmit={handleSkuSubmit}
            onCancel={handleCancel}
            isEdit={false}
          />
        )}

        {activeForm === 'supplier' && (
          <SupplierForm
            supplier={undefined} // Use exampleSupplier for edit demo
            onSubmit={handleSupplierSubmit}
            onCancel={handleCancel}
            isEdit={false}
          />
        )}

        {/* Saved Data Display */}
        {savedData.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Dados Salvos ({savedData.length})
            </h3>
            <div className="space-y-4">
              {savedData.map((item, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {item.type === 'sku' ? (
                        <Package className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Factory className="w-5 h-5 text-green-600" />
                      )}
                      <span className="font-medium text-slate-900">
                        {item.type === 'sku' ? 'SKU' : 'Fornecedor'}
                      </span>
                      <span className="text-sm text-slate-500">
                        • {new Date(item.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.data.regulatory_status === 'certified' || item.data.is_approved ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-slate-700">Código:</span>
                      <div className="font-mono text-blue-600">
                        {item.data.sku_code || item.data.supplier_code}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Nome:</span>
                      <div className="text-slate-900">
                        {item.data.product_name || item.data.company_name}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Categoria/País:</span>
                      <div className="text-slate-900">
                        {item.data.product_category || item.data.country}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Status:</span>
                      <div className={`text-sm px-2 py-1 rounded ${
                        item.data.regulatory_status === 'certified' || item.data.is_approved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.data.regulatory_status || (item.data.is_approved ? 'Aprovado' : 'Pendente')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Implementation Details */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Implementação Técnica</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">🚀 Tecnologias Utilizadas</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• <strong>React Hook Form:</strong> Performance otimizada</li>
                <li>• <strong>Zod:</strong> Validação type-safe</li>
                <li>• <strong>TypeScript:</strong> Type safety completa</li>
                <li>• <strong>Tailwind CSS:</strong> Estilização responsiva</li>
                <li>• <strong>Loading States:</strong> UX aprimorada</li>
                <li>• <strong>Error Handling:</strong> Tratamento robusto</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">✨ Recursos Implementados</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Validação em tempo real</li>
                <li>• Estados de loading automáticos</li>
                <li>• Tratamento de erros avançado</li>
                <li>• Componentes reutilizáveis</li>
                <li>• Formulários responsivos</li>
                <li>• Debug mode para desenvolvimento</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
