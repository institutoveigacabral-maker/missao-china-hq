import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAsyncOperation } from '@/react-app/hooks/useAdvancedLoading'
import { useToast } from '@/react-app/hooks/useToast'
import { LoadingButton } from '@/react-app/components/ui/LoadingButton'
import { TouchInput, TouchTextArea } from '@/react-app/components/Touch/TouchInput'
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  X,
  FileText,
  Shield,
  Target,
  Settings,
  AlertCircle
} from 'lucide-react'

// Enhanced Zod schema with comprehensive validation
const skuSchema = z.object({
  sku_code: z.string()
    .min(3, 'Código SKU deve ter pelo menos 3 caracteres')
    .max(50, 'Código SKU deve ter no máximo 50 caracteres')
    .regex(/^[A-Z0-9-_]+$/, 'Código SKU deve conter apenas letras maiúsculas, números, hífens e underscores'),
  
  product_name: z.string()
    .min(2, 'Nome do produto deve ter pelo menos 2 caracteres')
    .max(200, 'Nome do produto deve ter no máximo 200 caracteres'),
  
  product_category: z.string()
    .min(1, 'Categoria é obrigatória'),
  
  description: z.string()
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .optional(),
  
  technical_specs: z.string()
    .max(2000, 'Especificações técnicas devem ter no máximo 2000 caracteres')
    .optional(),
  
  regulatory_status: z.enum(['pending', 'certified', 'blocked', 'testing']),
  
  risk_category: z.enum(['low', 'medium', 'high']),
  
  target_markets: z.string()
    .max(500, 'Mercados alvo devem ter no máximo 500 caracteres')
    .optional(),
  
  supplier_id: z.number()
    .positive('ID do fornecedor deve ser positivo')
    .optional(),
  
  is_active: z.boolean()
})

type SkuFormData = z.infer<typeof skuSchema>

interface SkuFormProps {
  sku?: Partial<SkuFormData> & { id?: number }
  onSubmit: (data: SkuFormData) => Promise<void> | void
  onCancel?: () => void
  isEdit?: boolean
  className?: string
}

// API client for SKU operations
const saveSkuToApi = async (formData: SkuFormData & { id?: number }): Promise<SkuFormData & { id: number }> => {
  const method = formData.id ? 'PUT' : 'POST'
  const url = formData.id ? `/api/skus/${formData.id}` : '/api/skus'
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || `HTTP ${response.status}: ${response.statusText}`)
  }
  
  return response.json()
}

export const SkuForm: React.FC<SkuFormProps> = ({ 
  sku, 
  onSubmit, 
  onCancel, 
  isEdit = false,
  className = ''
}) => {
  const { execute, isLoading } = useAsyncOperation('save-sku')
  const toast = useToast()

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    reset,
    clearErrors
  } = useForm<SkuFormData>({
    resolver: zodResolver(skuSchema),
    defaultValues: {
      sku_code: sku?.sku_code || '',
      product_name: sku?.product_name || '',
      product_category: sku?.product_category || 'IoT',
      description: sku?.description || '',
      technical_specs: sku?.technical_specs || '',
      regulatory_status: sku?.regulatory_status || 'pending',
      risk_category: sku?.risk_category || 'medium',
      target_markets: sku?.target_markets || 'Brasil, Portugal',
      supplier_id: sku?.supplier_id,
      is_active: sku?.is_active ?? true,
    },
    mode: 'onChange' // Validate on change for better UX
  })

  // Watch form values for dynamic UI updates
  const watchedValues = watch()
  const currentRiskCategory = watch('risk_category')
  const currentRegulatoryStatus = watch('regulatory_status')

  // Enhanced form submission with proper error handling
  const onFormSubmit = async (data: SkuFormData) => {
    try {
      if (onSubmit) {
        // If onSubmit is provided, use it directly
        await onSubmit(data)
        toast.success(`SKU ${data.sku_code} ${isEdit ? 'atualizado' : 'criado'} com sucesso!`)
      } else {
        // Otherwise, use the default API call
        await execute(
          () => saveSkuToApi({ ...data, id: sku?.id }),
          {
            loadingMessage: isEdit ? 'Atualizando SKU...' : 'Criando novo SKU...',
            successMessage: `SKU ${data.sku_code} ${isEdit ? 'atualizado' : 'criado'} com sucesso!`,
            errorMessage: `Erro ao ${isEdit ? 'atualizar' : 'criar'} SKU`,
            onSuccess: (savedSku) => {
              toast.success(`SKU ${savedSku.sku_code} processado com sucesso!`)
              reset(savedSku) // Reset form with new data
            },
            onError: (error) => {
              console.error('Erro ao salvar SKU:', error)
              toast.error(`Erro: ${error.message}`)
            }
          }
        )
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(`Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  // Helper functions for UI
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'certified':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'blocked':
        return <X className="w-4 h-4 text-red-600" />
      case 'testing':
        return <Settings className="w-4 h-4 text-blue-600" />
      default:
        return <Settings className="w-4 h-4 text-slate-600" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200'
    }
  }

  const handleReset = () => {
    reset()
    clearErrors()
    toast.info('Formulário resetado')
  }

  const isFormLoading = isLoading || isSubmitting

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Package className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">
            {isEdit ? `Editar SKU ${sku?.sku_code}` : 'Novo SKU'}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          {sku && (
            <span className={`px-3 py-1 text-sm rounded-full border ${getRiskColor(currentRiskCategory)}`}>
              {currentRiskCategory} risk
            </span>
          )}
          {isDirty && (
            <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
              • Não salvo
            </span>
          )}
        </div>
      </div>

      {/* Form Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-red-800">Corrija os seguintes erros:</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <span className="font-medium">{field}:</span> {error?.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Informações Básicas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TouchInput
              label="Código SKU *"
              {...register('sku_code')}
              error={errors.sku_code?.message}
              placeholder="Ex: IOT-2024-001"
              disabled={isEdit || isFormLoading}
              helperText={isEdit ? "Código SKU não pode ser alterado" : "Use apenas letras maiúsculas, números, hífens e underscores"}
            />

            <TouchInput
              label="Nome do Produto *"
              {...register('product_name')}
              error={errors.product_name?.message}
              placeholder="Ex: Smart Sensor IoT"
              disabled={isFormLoading}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                {...register('product_category')}
                disabled={isFormLoading}
                className={`w-full min-h-touch px-4 py-3 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.product_category 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              >
                <option value="IoT">IoT</option>
                <option value="Sensor">Sensor</option>
                <option value="Controller">Controller</option>
                <option value="Camera">Camera</option>
                <option value="Electronics">Electronics</option>
                <option value="Smart Home">Smart Home</option>
                <option value="Pet Tech">Pet Tech</option>
                <option value="Fitness">Fitness</option>
                <option value="Food tech">Food tech</option>
              </select>
              {errors.product_category && (
                <p className="mt-2 text-sm text-red-600">{errors.product_category.message}</p>
              )}
            </div>

            <TouchInput
              label="Mercados Alvo"
              {...register('target_markets')}
              error={errors.target_markets?.message}
              placeholder="Ex: Brasil, Portugal, União Europeia"
              disabled={isFormLoading}
            />
          </div>
        </div>

        {/* Description and Specs */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Descrição e Especificações
          </h3>
          
          <div className="space-y-4">
            <TouchTextArea
              label="Descrição"
              {...register('description')}
              error={errors.description?.message}
              placeholder="Descrição detalhada do produto..."
              rows={3}
              disabled={isFormLoading}
            />

            <TouchTextArea
              label="Especificações Técnicas"
              {...register('technical_specs')}
              error={errors.technical_specs?.message}
              placeholder="Ex: Wi-Fi 2.4GHz, Bluetooth 5.0, Sensores: Temperatura, Umidade..."
              rows={4}
              disabled={isFormLoading}
            />
          </div>
        </div>

        {/* Status and Risk */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Status e Risco
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Regulatório *
              </label>
              <div className="relative">
                <select
                  {...register('regulatory_status')}
                  disabled={isFormLoading}
                  className={`w-full min-h-touch px-4 py-3 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                    errors.regulatory_status 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                >
                  <option value="pending">Pending</option>
                  <option value="certified">Certified</option>
                  <option value="blocked">Blocked</option>
                  <option value="testing">Testing</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getStatusIcon(currentRegulatoryStatus)}
                </div>
              </div>
              {errors.regulatory_status && (
                <p className="mt-2 text-sm text-red-600">{errors.regulatory_status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria de Risco *
              </label>
              <select
                {...register('risk_category')}
                disabled={isFormLoading}
                className={`w-full min-h-touch px-4 py-3 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.risk_category 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.risk_category && (
                <p className="mt-2 text-sm text-red-600">{errors.risk_category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Ativo
              </label>
              <div className="flex items-center space-x-3 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_active')}
                    disabled={isFormLoading}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">SKU Ativo</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Target className="w-4 h-4" />
            <span>{isEdit ? 'Atualizando' : 'Criando'} SKU no sistema</span>
            {!isValid && isDirty && (
              <span className="text-red-600">• Formulário inválido</span>
            )}
          </div>
          
          <div className="flex space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isFormLoading}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            )}
            
            <button
              type="button"
              onClick={handleReset}
              disabled={isFormLoading || !isDirty}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resetar
            </button>
            
            <LoadingButton
              type="submit"
              loading={isFormLoading}
              loadingText={isEdit ? "Atualizando..." : "Salvando..."}
              disabled={!isValid}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isEdit ? 'Atualizar SKU' : 'Salvar SKU'}
            </LoadingButton>
          </div>
        </div>
      </form>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 p-4 bg-gray-50 rounded-lg">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Debug Info (Development Only)
          </summary>
          <div className="mt-2 space-y-2 text-xs">
            <div>
              <strong>Form State:</strong> 
              <span className="ml-1">
                isDirty: {isDirty.toString()}, 
                isValid: {isValid.toString()}, 
                isSubmitting: {isSubmitting.toString()}
              </span>
            </div>
            <div>
              <strong>Current Values:</strong>
              <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(watchedValues, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      )}
    </div>
  )
}

export default SkuForm
