import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  supplierSchema,
  FormSection,
  FormValidation,
  FormActions
} from './AdvancedFormsBundle'
import { TouchInput, TouchTextArea } from '@/react-app/components/Touch/TouchInput'
import { useAsyncOperation } from '@/react-app/hooks/useAdvancedLoading'
import { useToast } from '@/react-app/hooks/useToast'
import { LoadingButton } from '@/react-app/components/ui/LoadingButton'
import { 
  Factory, 
  Globe, 
  Mail, 
  Star,
  Shield,
  FileText
} from 'lucide-react'

interface SupplierFormProps {
  supplier?: Partial<any> & { id?: number }
  onSubmit: (data: any) => Promise<void> | void
  onCancel?: () => void
  isEdit?: boolean
  className?: string
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  supplier,
  onSubmit,
  onCancel,
  isEdit = false,
  className = ''
}) => {
  const { isLoading } = useAsyncOperation('save-supplier')
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    reset
  } = useForm<any>({
    resolver: zodResolver(supplierSchema) as any,
    defaultValues: {
      supplier_code: supplier?.supplier_code || '',
      company_name: supplier?.company_name || '',
      supplier_type: supplier?.supplier_type || 'manufacturer',
      country: supplier?.country || 'China',
      city: supplier?.city || '',
      contact_person: supplier?.contact_person || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      quality_rating: supplier?.quality_rating || 0,
      compliance_score: supplier?.compliance_score || 0,
      risk_level: supplier?.risk_level || 'medium',
      is_approved: supplier?.is_approved || false,
      notes: supplier?.notes || ''
    },
    mode: 'onChange'
  })

  const watchedValues = watch()
  const currentRiskLevel = watch('risk_level')
  const isApproved = watch('is_approved')

  const onFormSubmit = async (data: any) => {
    try {
      await onSubmit(data)
      toast.success(`Fornecedor ${data.company_name} ${isEdit ? 'atualizado' : 'criado'} com sucesso!`)
      if (!isEdit) {
        reset()
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(`Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
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

  const isFormLoading = isLoading || isSubmitting

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Factory className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">
            {isEdit ? `Editar Fornecedor ${supplier?.supplier_code}` : 'Novo Fornecedor'}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          {supplier && (
            <>
              <span className={`px-3 py-1 text-sm rounded-full border ${getRiskColor(currentRiskLevel)}`}>
                {currentRiskLevel} risk
              </span>
              {isApproved && (
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 border border-green-200">
                  ✓ Aprovado
                </span>
              )}
            </>
          )}
          {isDirty && (
            <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
              • Não salvo
            </span>
          )}
        </div>
      </div>

      {/* Form Validation Summary */}
      <FormValidation errors={errors} className="mb-6" />

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <FormSection
          title="Informações Básicas"
          icon={<FileText className="w-4 h-4" />}
          variant="default"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TouchInput
              label="Código do Fornecedor *"
              {...register('supplier_code')}
              error={errors.supplier_code?.message as string}
              placeholder="Ex: SUP-2024-001"
              disabled={isEdit || isFormLoading}
              helperText={isEdit ? "Código não pode ser alterado" : undefined}
            />

            <TouchInput
              label="Nome da Empresa *"
              {...register('company_name')}
              error={errors.company_name?.message as string}
              placeholder="Ex: Shenzhen Tech Solutions Ltd"
              disabled={isFormLoading}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Fornecedor *
              </label>
              <select
                {...register('supplier_type')}
                disabled={isFormLoading}
                className={`w-full min-h-touch px-4 py-3 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.supplier_type 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              >
                <option value="manufacturer">Fabricante</option>
                <option value="distributor">Distribuidor</option>
                <option value="agent">Agente</option>
              </select>
              {errors.supplier_type && (
                <p className="mt-2 text-sm text-red-600">{String(errors.supplier_type.message || '')}</p>
              )}
            </div>

            <TouchInput
              label="País *"
              {...register('country')}
              error={errors.country?.message as string}
              placeholder="Ex: China"
              disabled={isFormLoading}
            />

            <TouchInput
              label="Cidade"
              {...register('city')}
              error={errors.city?.message as string}
              placeholder="Ex: Shenzhen"
              disabled={isFormLoading}
            />
          </div>
        </FormSection>

        {/* Contact Information */}
        <FormSection
          title="Informações de Contato"
          icon={<Mail className="w-4 h-4" />}
          variant="blue"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TouchInput
              label="Pessoa de Contato"
              {...register('contact_person')}
              error={errors.contact_person?.message as string}
              placeholder="Ex: Zhang Wei"
              disabled={isFormLoading}
            />

            <TouchInput
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message as string}
              placeholder="Ex: contact@company.com"
              disabled={isFormLoading}
            />

            <TouchInput
              label="Telefone"
              {...register('phone')}
              error={errors.phone?.message as string}
              placeholder="Ex: +86 138 0013 8000"
              disabled={isFormLoading}
            />
          </div>
        </FormSection>

        {/* Quality and Compliance */}
        <FormSection
          title="Qualidade e Compliance"
          icon={<Star className="w-4 h-4" />}
          variant="green"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TouchInput
              label="Avaliação de Qualidade (0-10)"
              type="number"
              {...register('quality_rating', { valueAsNumber: true })}
              error={errors.quality_rating?.message as string}
              placeholder="0"
              disabled={isFormLoading}
              min="0"
              max="10"
              step="0.1"
            />

            <TouchInput
              label="Score de Compliance (0-100)"
              type="number"
              {...register('compliance_score', { valueAsNumber: true })}
              error={errors.compliance_score?.message as string}
              placeholder="0"
              disabled={isFormLoading}
              min="0"
              max="100"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Risco *
              </label>
              <select
                {...register('risk_level')}
                disabled={isFormLoading}
                className={`w-full min-h-touch px-4 py-3 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.risk_level 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              >
                <option value="low">Baixo</option>
                <option value="medium">Médio</option>
                <option value="high">Alto</option>
              </select>
              {errors.risk_level && (
                <p className="mt-2 text-sm text-red-600">{String(errors.risk_level.message || '')}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_approved')}
                  disabled={isFormLoading}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">Fornecedor Aprovado</span>
              </label>
            </div>
          </div>
        </FormSection>

        {/* Notes */}
        <FormSection
          title="Observações"
          icon={<Shield className="w-4 h-4" />}
          variant="yellow"
        >
          <TouchTextArea
            label="Notas Adicionais"
            rows={4}
            {...register('notes')}
            error={errors.notes?.message as string}
            placeholder="Observações sobre o fornecedor, histórico de problemas, certificações especiais, etc..."
            disabled={isFormLoading}
          />
        </FormSection>

        {/* Action Buttons */}
        <FormActions>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Globe className="w-4 h-4" />
            <span>{isEdit ? 'Atualizando' : 'Criando'} fornecedor no sistema</span>
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
              onClick={() => reset()}
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
              {isEdit ? 'Atualizar Fornecedor' : 'Salvar Fornecedor'}
            </LoadingButton>
          </div>
        </FormActions>
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

export default SupplierForm
