import React from 'react'
import { useSkuForm } from '../../hooks/useSkuCrud'
import { TouchInput, TouchButton } from '../Touch'
import { Controller } from 'react-hook-form'
import { Spinner } from '../Loading'

interface SkuFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: any
  editMode?: boolean
  onSuccess?: () => void
}

export const SkuFormAdvanced: React.FC<SkuFormProps> = ({ 
  defaultValues, 
  editMode = false, 
  onSuccess 
}) => {
  const { form, onSubmit, isSubmitting } = useSkuForm(defaultValues, editMode)
  const { register, handleSubmit, control, formState: { errors } } = form

  const handleFormSubmit = onSubmit

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">
          {editMode ? 'Editar SKU' : 'Novo SKU'}
        </h3>
        <p className="text-blue-100 text-sm">
          {editMode ? 'Atualize as informações do produto' : 'Adicione um novo produto ao sistema'}
        </p>
      </div>

      <form onSubmit={handleSubmit(async (data) => {
        await handleFormSubmit(data)
        if (onSuccess) {
          onSuccess()
        }
      })} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TouchInput
            label="Código do SKU"
            placeholder="Ex: SKU-001"
            {...register('sku_code')}
            error={errors.sku_code?.message as string}
            className="font-mono"
          />

          <TouchInput
            label="Nome do Produto"
            placeholder="Ex: Smartphone Android"
            {...register('product_name')}
            error={errors.product_name?.message as string}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TouchInput
            label="Categoria"
            placeholder="Ex: Eletrônicos"
            {...register('product_category')}
            error={errors.product_category?.message as string}
          />

          <Controller
            control={control}
            name="risk_category"
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria de Risco
                </label>
                <select 
                  {...field} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Baixo Risco</option>
                  <option value="medium">Médio Risco</option>
                  <option value="high">Alto Risco</option>
                </select>
              </div>
            )}
          />
        </div>

        <TouchInput
          label="Descrição"
          placeholder="Descrição detalhada do produto..."
          {...register('description')}
          error={errors.description?.message as string}
          multiline
          rows={3}
        />

        <TouchInput
          label="Especificações Técnicas"
          placeholder="Especificações técnicas do produto..."
          {...register('technical_specs')}
          error={errors.technical_specs?.message as string}
          multiline
          rows={3}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="regulatory_status"
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Regulatório
                </label>
                <select 
                  {...field} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Rejeitado</option>
                </select>
              </div>
            )}
          />

          <Controller
            control={control}
            name="lab_test_status"
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status do Teste Laboratorial
                </label>
                <select 
                  {...field} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="completed">Concluído</option>
                  <option value="failed">Falhou</option>
                </select>
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TouchInput
            label="Nível de Certificação"
            placeholder="Ex: CE, FCC, RoHS"
            {...register('certification_level')}
            error={errors.certification_level?.message as string}
          />

          <TouchInput
            label="Mercados Alvo"
            placeholder="Ex: Brasil, Portugal, EU"
            {...register('target_markets')}
            error={errors.target_markets?.message as string}
          />
        </div>

        <TouchInput
          label="Notas de Compliance"
          placeholder="Observações sobre conformidade..."
          {...register('compliance_notes')}
          error={errors.compliance_notes?.message as string}
          multiline
          rows={3}
        />

        <Controller
          control={control}
          name="is_active"
          render={({ field }) => (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_active"
                checked={field.value}
                onChange={field.onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Produto Ativo
              </label>
            </div>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <TouchButton 
            type="button" 
            variant="outline"
            onClick={() => onSuccess && onSuccess()}
          >
            Cancelar
          </TouchButton>
          
          <TouchButton 
            type="submit" 
            loading={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>Salvando...</span>
              </div>
            ) : (
              editMode ? 'Salvar Alterações' : 'Criar SKU'
            )}
          </TouchButton>
        </div>
      </form>
    </div>
  )
}
