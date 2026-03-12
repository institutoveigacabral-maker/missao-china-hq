import { z } from 'zod'

export const skuSchema = z.object({
  sku_code: z.string().min(3, 'O código do SKU deve ter no mínimo 3 caracteres'),
  product_name: z.string().min(2, 'Nome do produto obrigatório'),
  product_category: z.string().min(1, 'Categoria obrigatória'),
  description: z.string().optional(),
  technical_specs: z.string().optional(),
  regulatory_status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  supplier_id: z.coerce.number().optional(),
  lab_test_status: z.enum(['pending', 'in_progress', 'completed', 'failed']).default('pending'),
  certification_level: z.string().optional(),
  risk_category: z.enum(['low', 'medium', 'high']).default('medium'),
  target_markets: z.string().optional(),
  compliance_notes: z.string().optional(),
  is_active: z.boolean().default(true),
})

export type SkuFormData = z.infer<typeof skuSchema>
