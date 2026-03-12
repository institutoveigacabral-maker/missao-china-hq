import React from 'react'
import { SkuForm } from './SkuForm'
import { SupplierForm } from './SupplierForm'
import { useToast } from '@/react-app/hooks/useToast'
import { 
  Package, 
  CheckCircle, 
  Settings,
  Code2,
  Database,
  Zap
} from 'lucide-react'

/**
 * Integration guide and examples for the form system
 * Demonstrates proper usage patterns with react-hook-form and Zod
 */

// Example of extending the SKU form with custom validation
export const ExtendedSkuForm: React.FC<{
  onSubmit: (data: any) => Promise<void>
  customValidation?: boolean
}> = ({ onSubmit, customValidation = false }) => {
  const toast = useToast()

  const handleSubmit = async (data: any) => {
    if (customValidation) {
      // Add custom business logic validation
      if (data.risk_category === 'high' && !data.target_markets?.includes('Brasil')) {
        toast.error('Produtos de alto risco devem incluir Brasil como mercado alvo')
        return
      }
    }

    await onSubmit(data)
  }

  return (
    <SkuForm
      onSubmit={handleSubmit}
      className="border-2 border-blue-200"
    />
  )
}

// Example of using the supplier form with validation hooks
export const ValidatedSupplierForm: React.FC<{
  onSubmit: (data: any) => Promise<void>
  requireApproval?: boolean
}> = ({ onSubmit, requireApproval = false }) => {
  const toast = useToast()

  const handleSubmit = async (data: any) => {
    if (requireApproval && !data.is_approved) {
      toast.warning('Fornecedor deve ser aprovado antes de ser salvo no sistema')
      return
    }

    if (data.country === 'China' && data.quality_rating < 7) {
      toast.warning('Fornecedores chineses devem ter rating de qualidade >= 7')
      return
    }

    await onSubmit(data)
  }

  return (
    <SupplierForm
      onSubmit={handleSubmit}
      className="border-2 border-green-200"
    />
  )
}

// Form integration status component
export const FormSystemStatus: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      title: 'React Hook Form',
      status: 'active',
      description: 'Performance otimizada com re-renders mínimos'
    },
    {
      icon: <Settings className="w-5 h-5 text-green-600" />,
      title: 'Zod Validation',
      status: 'active',
      description: 'Validação type-safe em tempo real'
    },
    {
      icon: <Code2 className="w-5 h-5 text-purple-600" />,
      title: 'TypeScript Integration',
      status: 'active',
      description: 'Type safety completa em toda a aplicação'
    },
    {
      icon: <Database className="w-5 h-5 text-indigo-600" />,
      title: 'Database Schema Sync',
      status: 'active',
      description: 'Schemas Zod sincronizados com banco de dados'
    }
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center space-x-3 mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-bold text-slate-900">Sistema de Formulários Integrado</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center space-x-3 mb-2">
              {feature.icon}
              <div className="flex-1">
                <div className="font-medium text-slate-900">{feature.title}</div>
                <div className={`text-xs px-2 py-1 rounded ${
                  feature.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {feature.status}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 text-sm text-blue-800">
          <Package className="w-4 h-4" />
          <span className="font-medium">Status:</span>
          <span>Sistema totalmente implementado e operacional</span>
        </div>
      </div>
    </div>
  )
}

// Example usage patterns
export const FormUsageExamples: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Code2 className="w-5 h-5 mr-2" />
          Padrões de Uso Recomendados
        </h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
            <h4 className="font-medium text-blue-900">1. Formulário SKU Básico</h4>
            <p className="text-sm text-blue-800 mt-1">
              Use o SkuForm diretamente para casos simples de cadastro/edição
            </p>
            <code className="text-xs bg-blue-100 px-2 py-1 rounded mt-2 block">
              {`<SkuForm onSubmit={handleSubmit} />`}
            </code>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
            <h4 className="font-medium text-green-900">2. Validação Customizada</h4>
            <p className="text-sm text-green-800 mt-1">
              Adicione validações de negócio específicas no onSubmit
            </p>
            <code className="text-xs bg-green-100 px-2 py-1 rounded mt-2 block">
              {`<ExtendedSkuForm customValidation={true} />`}
            </code>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
            <h4 className="font-medium text-purple-900">3. Integração com API</h4>
            <p className="text-sm text-purple-800 mt-1">
              Use hooks de loading para melhor UX durante submissão
            </p>
            <code className="text-xs bg-purple-100 px-2 py-1 rounded mt-2 block">
              {`const { execute } = useAsyncOperation('save-sku')`}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

// Technical implementation details
export const FormTechnicalSpecs: React.FC = () => {
  const specs = [
    {
      category: 'Performance',
      items: [
        'Re-renders mínimos com React Hook Form',
        'Validação assíncrona com debounce',
        'Lazy loading de componentes de formulário',
        'Memoização de validadores Zod'
      ]
    },
    {
      category: 'Validação',
      items: [
        'Schemas Zod type-safe',
        'Validação em tempo real',
        'Mensagens de erro localizadas',
        'Validação condicional baseada em contexto'
      ]
    },
    {
      category: 'UX/UI',
      items: [
        'Touch-friendly em dispositivos móveis',
        'Estados de loading automáticos',
        'Feedback visual imediato',
        'Componentes acessíveis (ARIA)'
      ]
    },
    {
      category: 'Integração',
      items: [
        'API client com retry automático',
        'Sincronização offline',
        'Cache inteligente de dados',
        'Background sync para formulários'
      ]
    }
  ]

  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
        <Settings className="w-5 h-5 mr-2" />
        Especificações Técnicas
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {specs.map((spec, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
              {spec.category}
            </h4>
            <ul className="space-y-1">
              {spec.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm text-slate-700 flex items-start">
                  <CheckCircle className="w-3 h-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default {
  ExtendedSkuForm,
  ValidatedSupplierForm,
  FormSystemStatus,
  FormUsageExamples,
  FormTechnicalSpecs
}
