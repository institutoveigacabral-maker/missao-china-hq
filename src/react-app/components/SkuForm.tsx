import { useState } from 'react';
import { useAsyncOperation } from '@/react-app/hooks/useAdvancedLoading';
import { useToast } from '@/react-app/hooks/useToast';
import { LoadingButton } from '@/react-app/components/ui/LoadingButton';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  X,
  FileText,
  Shield,
  Target,
  Settings
} from 'lucide-react';

interface SKUData {
  id?: number;
  sku_code: string;
  product_name: string;
  product_category: string;
  description?: string;
  technical_specs?: string;
  regulatory_status: string;
  risk_category: string;
  target_markets?: string;
  supplier_id?: number;
  is_active: boolean;
}

interface SkuFormProps {
  sku?: SKUData;
  onSave?: (sku: SKUData) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

const saveSkuToApi = async (formData: SKUData): Promise<SKUData> => {
  const method = formData.id ? 'PUT' : 'POST';
  const url = formData.id ? `/api/skus/${formData.id}` : '/api/skus';
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

export const SkuForm: React.FC<SkuFormProps> = ({ 
  sku, 
  onSave, 
  onCancel, 
  isEdit = false 
}) => {
  const { execute, isLoading } = useAsyncOperation('save-sku');
  const toast = useToast();

  const [formData, setFormData] = useState<SKUData>({
    sku_code: sku?.sku_code || '',
    product_name: sku?.product_name || '',
    product_category: sku?.product_category || 'IoT',
    description: sku?.description || '',
    technical_specs: sku?.technical_specs || '',
    regulatory_status: sku?.regulatory_status || 'pending',
    risk_category: sku?.risk_category || 'medium',
    target_markets: sku?.target_markets || 'Brasil, Portugal',
    supplier_id: sku?.supplier_id || undefined,
    is_active: sku?.is_active ?? true,
    ...sku
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.sku_code.trim()) {
      newErrors.sku_code = 'Código SKU é obrigatório';
    }
    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Nome do produto é obrigatório';
    }
    if (!formData.product_category.trim()) {
      newErrors.product_category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.warning('Por favor, corrija os erros no formulário');
      return;
    }

    await execute(
      () => saveSkuToApi(formData),
      {
        loadingMessage: isEdit ? 'Atualizando SKU...' : 'Criando novo SKU...',
        successMessage: `SKU ${formData.sku_code} ${isEdit ? 'atualizado' : 'criado'} com sucesso!`,
        errorMessage: `Erro ao ${isEdit ? 'atualizar' : 'criar'} SKU`,
        onSuccess: (savedSku) => {
          toast.skuSaved(savedSku.sku_code);
          onSave?.(savedSku);
        },
        onError: (error) => {
          console.error('Erro ao salvar SKU:', error);
        }
      }
    );
  };

  const handleInputChange = (field: keyof SKUData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'certified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'blocked':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Settings className="w-4 h-4 text-slate-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Package className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">
            {isEdit ? `Editar SKU ${sku?.sku_code}` : 'Novo SKU'}
          </h2>
        </div>
        {sku && (
          <span className={`px-3 py-1 text-sm rounded-full border ${getRiskColor(sku.risk_category)}`}>
            {sku.risk_category} risk
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Informações Básicas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Código SKU *
              </label>
              <input
                type="text"
                value={formData.sku_code}
                onChange={(e) => handleInputChange('sku_code', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.sku_code ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Ex: IOT-2024-001"
                disabled={isEdit} // SKU code shouldn't change
              />
              {errors.sku_code && (
                <p className="text-red-600 text-sm mt-1">{errors.sku_code}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => handleInputChange('product_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.product_name ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Ex: Smart Sensor IoT"
              />
              {errors.product_name && (
                <p className="text-red-600 text-sm mt-1">{errors.product_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoria *
              </label>
              <select
                value={formData.product_category}
                onChange={(e) => handleInputChange('product_category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.product_category ? 'border-red-300' : 'border-slate-300'
                }`}
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
                <p className="text-red-600 text-sm mt-1">{errors.product_category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mercados Alvo
              </label>
              <input
                type="text"
                value={formData.target_markets}
                onChange={(e) => handleInputChange('target_markets', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Brasil, Portugal, União Europeia"
              />
            </div>
          </div>
        </div>

        {/* Description and Specs */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Descrição e Especificações
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrição detalhada do produto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Especificações Técnicas
              </label>
              <textarea
                value={formData.technical_specs}
                onChange={(e) => handleInputChange('technical_specs', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Wi-Fi 2.4GHz, Bluetooth 5.0, Sensores: Temperatura, Umidade..."
              />
            </div>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status Regulatório
              </label>
              <div className="relative">
                <select
                  value={formData.regulatory_status}
                  onChange={(e) => handleInputChange('regulatory_status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="pending">Pending</option>
                  <option value="certified">Certified</option>
                  <option value="blocked">Blocked</option>
                  <option value="testing">Testing</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getStatusIcon(formData.regulatory_status)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoria de Risco
              </label>
              <select
                value={formData.risk_category}
                onChange={(e) => handleInputChange('risk_category', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status Ativo
              </label>
              <div className="flex items-center space-x-3 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">SKU Ativo</span>
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
          </div>
          
          <div className="flex space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            )}
            
            <LoadingButton
              type="submit"
              loading={isLoading}
              loadingText={isEdit ? "Atualizando..." : "Salvando..."}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isEdit ? 'Atualizar SKU' : 'Salvar SKU'}
            </LoadingButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SkuForm;
