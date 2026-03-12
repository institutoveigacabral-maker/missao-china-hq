import { z } from 'zod'

export const skuSchema = z.object({
  sku_code: z.string().min(3, 'O código do SKU deve ter no mínimo 3 caracteres'),
  product_name: z.string().min(2, 'Nome do produto obrigatório'),
  product_category: z.string().min(1, 'Categoria obrigatória'),
  description: z.string(),
  technical_specs: z.string(),
  regulatory_status: z.enum(['pending', 'approved', 'rejected']),
  supplier_id: z.coerce.number().optional(),
  lab_test_status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
  certification_level: z.string(),
  risk_category: z.enum(['low', 'medium', 'high']),
  target_markets: z.string(),
  compliance_notes: z.string(),
  is_active: z.boolean(),
})

export type SkuFormData = z.infer<typeof skuSchema>
