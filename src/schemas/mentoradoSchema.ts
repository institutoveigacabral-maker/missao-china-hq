import { z } from 'zod';

// Auth schemas
export const LoginSchema = z.object({ 
  email: z.string().email(), 
  code: z.string().length(6) 
});

export const MFASetupSchema = z.object({ 
  method: z.enum(['email','app']) 
});

// Mentorado schemas
export const MentoradoCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  cnpj: z.string().min(11).max(18),
  phone: z.string().min(10),
  capital_brl: z.number().nonnegative(),
});

export const MentoradoUpdateSchema = z.object({
  company: z.string().min(2).optional(),
  cnpj: z.string().min(11).max(18).optional(),
  phone: z.string().min(10).optional(),
  capital_brl: z.number().nonnegative().optional(),
});

// Deal schemas
export const DealCreateSchema = z.object({
  mentorado_id: z.string().min(3).optional(),
  factory_id: z.string().min(1, 'Fornecedor é obrigatório'),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  amount_eur: z.number().positive('Valor deve ser maior que zero'),
  status: z.enum(['negotiating','approved','in_production','shipped','delivered','closed']).default('negotiating'),
  description: z.string().optional(),
  product_category: z.string().min(2, 'Categoria do produto é obrigatória'),
  quantity: z.number().int().positive().optional().nullable(),
  unit_price: z.number().positive().optional().nullable(),
  payment_terms: z.string().optional(),
  delivery_date: z.string().optional().nullable(),
  incoterm: z.string().optional(),
  notes: z.string().optional(),
});

export const DealUpdateSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').optional(),
  amount_eur: z.number().positive('Valor deve ser maior que zero').optional(),
  status: z.enum(['negotiating','approved','in_production','shipped','delivered','closed']).optional(),
  description: z.string().optional(),
  product_category: z.string().min(2, 'Categoria do produto é obrigatória').optional(),
  quantity: z.number().int().positive().optional().nullable(),
  unit_price: z.number().positive().optional().nullable(),
  payment_terms: z.string().optional(),
  delivery_date: z.string().optional().nullable(),
  incoterm: z.string().optional(),
  notes: z.string().optional(),
});

// Document schemas
export const DocumentGenSchema = z.object({
  mentorado_id: z.string(),
  type: z.enum(['commitment','contract','qa_report','invoice']),
  deal_id: z.string().optional()
});

// Supplier schemas
export const SupplierLinkSchema = z.object({
  factory_id: z.string(),
  relation: z.enum(['visited','prospect','exclusive'])
});

// Export types
export type LoginInput = z.infer<typeof LoginSchema>;
export type MFASetupInput = z.infer<typeof MFASetupSchema>;
export type MentoradoCreateInput = z.infer<typeof MentoradoCreateSchema>;
export type MentoradoUpdateInput = z.infer<typeof MentoradoUpdateSchema>;
export type DealCreateInput = z.infer<typeof DealCreateSchema>;
export type DealUpdateInput = z.infer<typeof DealUpdateSchema>;
export type DocumentGenInput = z.infer<typeof DocumentGenSchema>;
export type SupplierLinkInput = z.infer<typeof SupplierLinkSchema>;
