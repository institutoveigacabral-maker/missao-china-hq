import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { skuSchema, SkuFormData } from '../schemas/skuSchema'
import { useApiQuery } from './useApiQuery'
import { useToast } from './useToast'
import { useState } from 'react'

export const useSkuForm = (defaultValues?: Partial<SkuFormData & { id?: number }>, editMode = false) => {
  const form = useForm<SkuFormData>({
    resolver: zodResolver(skuSchema),
    defaultValues: defaultValues || {
      sku_code: '',
      product_name: '',
      product_category: '',
      description: '',
      technical_specs: '',
      regulatory_status: 'pending',
      lab_test_status: 'pending',
      certification_level: '',
      risk_category: 'medium',
      target_markets: '',
      compliance_notes: '',
      is_active: true,
    },
  })

  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit: SubmitHandler<SkuFormData> = async (data) => {
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
      toast.success(editMode ? 'SKU atualizado com sucesso!' : 'SKU criado com sucesso!')
      
      // Trigger refresh of data
      window.location.reload()
    } catch (error) {
      toast.error('Erro ao salvar SKU: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return { form, onSubmit, isSubmitting }
}

interface SkuResponse {
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

export const useSkus = () => {
  return useApiQuery<{ data: SkuResponse[] }>('/api/skus')
}

export const useDeleteSku = () => {
  const toast = useToast()
  
  const deleteSku = async (id: number) => {
    try {
      const response = await fetch(`/api/skus/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar SKU')
      }

      toast.success('SKU deletado com sucesso!')
      window.location.reload()
    } catch (error) {
      toast.error('Erro ao deletar SKU: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    }
  }

  return { mutate: deleteSku }
}
