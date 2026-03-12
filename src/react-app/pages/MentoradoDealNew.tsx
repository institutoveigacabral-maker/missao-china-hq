import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  DollarSign, 
  FileText, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface Supplier {
  id: string;
  name: string;
  city: string;
  province: string;
  compliance_score: number;
}

interface DealFormData {
  title: string;
  factory_id: string;
  amount_eur: string;
  status: string;
  description: string;
  product_category: string;
  quantity: string;
  unit_price: string;
  payment_terms: string;
  delivery_date: string;
  incoterm: string;
  notes: string;
}

function MentoradoDealNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<DealFormData>({
    title: '',
    factory_id: searchParams.get('factory_id') || '',
    amount_eur: '',
    status: 'negotiating',
    description: '',
    product_category: '',
    quantity: '',
    unit_price: '',
    payment_terms: '30% deposit, 70% before shipment',
    delivery_date: '',
    incoterm: 'FOB',
    notes: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/mentorado/suppliers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setSuppliers(result.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.factory_id) {
      newErrors.factory_id = 'Selecione um fornecedor';
    }

    if (!formData.amount_eur || parseFloat(formData.amount_eur) <= 0) {
      newErrors.amount_eur = 'Valor deve ser maior que zero';
    }

    if (!formData.product_category.trim()) {
      newErrors.product_category = 'Categoria do produto é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/mentorado/deals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          factory_id: formData.factory_id,
          amount_eur: parseFloat(formData.amount_eur),
          status: formData.status,
          description: formData.description,
          product_category: formData.product_category,
          quantity: formData.quantity ? parseInt(formData.quantity) : null,
          unit_price: formData.unit_price ? parseFloat(formData.unit_price) : null,
          payment_terms: formData.payment_terms,
          delivery_date: formData.delivery_date || null,
          incoterm: formData.incoterm,
          notes: formData.notes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar deal');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/mentorado/deals');
      }, 1500);
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Erro ao criar deal'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/mentorado/deals');
  };

  const selectedSupplier = suppliers.find(s => s.id === formData.factory_id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Deal</h1>
          <p className="text-gray-600 mt-1">Criar nova negociação com fornecedor</p>
        </div>
        <Button
          onClick={handleCancel}
          variant="secondary"
          className="flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Cancelar</span>
        </Button>
      </div>

      {/* Success Message */}
      {success && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Deal criado com sucesso!</h3>
              <p className="text-sm text-green-700">Redirecionando para a lista de deals...</p>
            </div>
          </div>
        </Card>
      )}

      {/* Error Message */}
      {errors.submit && (
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Erro ao criar deal</h3>
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Deal *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ex: Importação de 5000 unidades de Smart Watches"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fornecedor *
              </label>
              <select
                value={formData.factory_id}
                onChange={(e) => setFormData({ ...formData, factory_id: e.target.value })}
                className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.factory_id ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione um fornecedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name} - {supplier.city}, {supplier.province}
                  </option>
                ))}
              </select>
              {errors.factory_id && (
                <p className="mt-1 text-sm text-red-600">{errors.factory_id}</p>
              )}
              {selectedSupplier && (
                <div className="mt-2 flex items-center space-x-2">
                  <Badge variant={selectedSupplier.compliance_score >= 90 ? 'success' : 'warning'}>
                    Compliance: {selectedSupplier.compliance_score}%
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="negotiating">Negociando</option>
                <option value="approved">Aprovado</option>
                <option value="in_production">Em Produção</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Descreva os detalhes do produto e da negociação..."
              />
            </div>
          </div>
        </Card>

        {/* Product Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalhes do Produto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria do Produto *
              </label>
              <input
                type="text"
                value={formData.product_category}
                onChange={(e) => setFormData({ ...formData, product_category: e.target.value })}
                className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.product_category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ex: Eletrônicos, Têxtil, Maquinário"
              />
              {errors.product_category && (
                <p className="mt-1 text-sm text-red-600">{errors.product_category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade (unidades)
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="5000"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço Unitário (EUR)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="12.50"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Total (EUR) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount_eur}
                  onChange={(e) => setFormData({ ...formData, amount_eur: e.target.value })}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.amount_eur ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="62500.00"
                  min="0"
                />
              </div>
              {errors.amount_eur && (
                <p className="mt-1 text-sm text-red-600">{errors.amount_eur}</p>
              )}
              {formData.quantity && formData.unit_price && (
                <p className="mt-1 text-sm text-gray-500">
                  Calculado: €{(parseFloat(formData.quantity) * parseFloat(formData.unit_price)).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Commercial Terms */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Termos Comerciais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incoterm
              </label>
              <select
                value={formData.incoterm}
                onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="EXW">EXW - Ex Works</option>
                <option value="FOB">FOB - Free On Board</option>
                <option value="CIF">CIF - Cost, Insurance and Freight</option>
                <option value="DDP">DDP - Delivered Duty Paid</option>
                <option value="CFR">CFR - Cost and Freight</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Entrega Estimada
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condições de Pagamento
              </label>
              <input
                type="text"
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="30% depósito, 70% antes do embarque"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionais
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Informações adicionais sobre a negociação, requisitos especiais, etc..."
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Criando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Criar Deal</span>
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Help Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <FileText className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Dicas para criar um deal</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Certifique-se de que o fornecedor está vinculado antes de criar o deal</li>
              <li>• Preencha todos os campos obrigatórios marcados com *</li>
              <li>• O valor total deve refletir o acordo com o fornecedor</li>
              <li>• Escolha o Incoterm adequado para sua operação</li>
              <li>• Use as notas adicionais para registrar detalhes importantes</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default MentoradoDealNew;
