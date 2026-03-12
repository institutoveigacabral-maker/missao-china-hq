import React from 'react'
import { z } from 'zod'

// Export the main SkuForm component
export { default as SkuForm } from './SkuForm'
export { default as ComplianceScoreEngine } from '../ComplianceScoreEngine'

// Additional form schemas for other entities
export const supplierSchema = z.object({
  supplier_code: z.string().min(3, 'Código do fornecedor deve ter pelo menos 3 caracteres'),
  company_name: z.string().min(2, 'Nome da empresa é obrigatório'),
  supplier_type: z.enum(['manufacturer', 'distributor', 'agent']),
  country: z.string().min(1, 'País é obrigatório'),
  city: z.string().optional(),
  contact_person: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  quality_rating: z.number().min(0).max(10).optional(),
  compliance_score: z.number().min(0).max(100).optional(),
  risk_level: z.enum(['low', 'medium', 'high']).default('medium'),
  is_approved: z.boolean().default(false),
  notes: z.string().max(1000, 'Notas devem ter no máximo 1000 caracteres').optional()
})

export const regulationSchema = z.object({
  regulation_code: z.string().min(3, 'Código da regulamentação deve ter pelo menos 3 caracteres'),
  regulation_name: z.string().min(2, 'Nome da regulamentação é obrigatório'),
  region: z.string().min(1, 'Região é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().max(2000, 'Descrição deve ter no máximo 2000 caracteres').optional(),
  official_link: z.string().url('Link oficial inválido').optional().or(z.literal('')),
  validity_start_date: z.string().optional(),
  validity_end_date: z.string().optional(),
  severity_level: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  is_mandatory: z.boolean().default(true)
})

export const testReportSchema = z.object({
  report_code: z.string().min(3, 'Código do relatório deve ter pelo menos 3 caracteres'),
  sku_id: z.number().positive('ID do SKU deve ser positivo'),
  lab_id: z.number().positive('ID do laboratório deve ser positivo'),
  regulation_id: z.number().positive('ID da regulamentação deve ser positivo').optional(),
  test_type: z.string().min(1, 'Tipo de teste é obrigatório'),
  test_status: z.enum(['pending', 'in_progress', 'completed', 'failed']).default('pending'),
  test_start_date: z.string().optional(),
  test_completion_date: z.string().optional(),
  test_result: z.enum(['pending', 'pass', 'fail', 'conditional']).default('pending'),
  cost_amount: z.number().min(0, 'Custo deve ser positivo').optional(),
  currency: z.string().length(3, 'Moeda deve ter 3 caracteres').default('CNY'),
  notes: z.string().max(1000, 'Notas devem ter no máximo 1000 caracteres').optional()
})

// Form hook generator for consistent form handling - removed due to type compatibility issues
// Use useForm directly with zodResolver in each component

// Generic form field component
interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  helperText?: string
  disabled?: boolean
  options?: Array<{ value: string; label: string }>
  rows?: number
}

export const FormField: React.FC<FormFieldProps & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  options,
  rows,
  className = '',
  ...props
}) => {
  const baseClasses = `
    w-full min-h-touch px-4 py-3 text-base border rounded-lg 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${error 
      ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 bg-white hover:border-gray-400'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''}
    ${className}
  `

  const renderInput = () => {
    if (options) {
      return (
        <select 
          name={name}
          disabled={disabled}
          className={baseClasses}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows || 3}
          className={baseClasses}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      )
    }

    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        className={baseClasses}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    )
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
}

// Form section wrapper for better organization
interface FormSectionProps {
  title: string
  description?: string
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'blue' | 'green' | 'yellow'
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon,
  children,
  className = '',
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-slate-50',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    yellow: 'bg-yellow-50'
  }

  return (
    <div className={`${variantClasses[variant]} rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

// Form validation indicator
interface FormValidationProps {
  errors: Record<string, any>
  className?: string
}

export const FormValidation: React.FC<FormValidationProps> = ({
  errors,
  className = ''
}) => {
  const errorCount = Object.keys(errors).length

  if (errorCount === 0) return null

  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-5 h-5 text-red-600">⚠️</div>
        <h3 className="font-medium text-red-800">
          {errorCount === 1 ? '1 erro encontrado' : `${errorCount} erros encontrados`}
        </h3>
      </div>
      <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
        {Object.entries(errors).map(([field, error]) => (
          <li key={field}>
            <span className="font-medium">{field}:</span> {error?.message}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Form actions wrapper
interface FormActionsProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'between'
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  className = '',
  align = 'between'
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  }

  return (
    <div className={`flex items-center ${alignClasses[align]} pt-6 border-t border-slate-200 ${className}`}>
      {children}
    </div>
  )
}

// Export types for external use
export type SupplierFormData = z.infer<typeof supplierSchema>
export type RegulationFormData = z.infer<typeof regulationSchema>
export type TestReportFormData = z.infer<typeof testReportSchema>

// Main forms bundle export for lazy loading
const AdvancedFormsBundle = {
  SkuForm: React.lazy(() => import('./SkuForm')),
  ComplianceScoreEngine: React.lazy(() => import('../ComplianceScoreEngine')),
}

export default AdvancedFormsBundle
