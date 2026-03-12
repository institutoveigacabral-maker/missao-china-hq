import { useForm } from 'react-hook-form'
import { useApiQuery } from './useApiQuery'
import { useToast } from './useToast'
import { useState } from 'react'
import { IoTSku } from '../../shared/types'

interface SkuFormData {
  sku_code: string;
  product_name: string;
  product_category: string;
  description: string;
  technical_specs: string;
  regulatory_status: string;
  lab_test_status: string;
  certification_level: string;
  risk_category: string;
  target_markets: string;
  compliance_notes: string;
  is_active: boolean;
}

export const useSkuForm = (defaultValues?: Partial<IoTSku>, editMode = false) => {
  const form = useForm<SkuFormData>({
    defaultValues: {
      sku_code: defaultValues?.sku_code || '',
      product_name: defaultValues?.product_name || '',
      product_category: defaultValues?.product_category || '',
      description: defaultValues?.description || '',
      technical_specs: defaultValues?.technical_specs || '',
      regulatory_status: defaultValues?.regulatory_status || 'pending',
      lab_test_status: 'pending',
      certification_level: defaultValues?.certification_level || '',
      risk_category: defaultValues?.risk_category || 'medium',
      target_markets: defaultValues?.target_markets || '',
      compliance_notes: defaultValues?.compliance_notes || '',
      is_active: defaultValues?.is_active !== undefined ? defaultValues.is_active : true,
    },
  })

  const { success, error: showError } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: SkuFormData) => {
    setIsSubmitting(true)
    try {
      const url = editMode && defaultValues?.id 
        ? `/api/skus/${defaultValues.id}` 
        : '/api/skus'
      
      const method = editMode ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar SKU')
      }

      form.reset()
      success(editMode ? 'SKU atualizado com sucesso!' : 'SKU criado com sucesso!')
      
      // Trigger refresh of data
      window.location.reload()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      showError('Erro ao salvar SKU: ' + errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { form, onSubmit, isSubmitting }
}

export const useSkus = () => {
  return useApiQuery('/api/skus')
}

export const useDeleteSku = () => {
  const { success, error: showError } = useToast()
  
  const deleteSku = async (id: number) => {
    try {
      const response = await fetch(`/api/skus/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar SKU')
      }

      success('SKU deletado com sucesso!')
      window.location.reload()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      showError('Erro ao deletar SKU: ' + errorMessage)
    }
  }

  return { mutate: deleteSku }
}
