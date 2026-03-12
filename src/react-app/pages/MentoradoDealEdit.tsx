import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  X, 
  DollarSign, 
  FileText, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Factory
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { FormInput } from '../components/Forms/FormInput';
import { FormSelect } from '../components/Forms/FormSelect';
import { FormTextarea } from '../components/Forms/FormTextarea';

interface Supplier {
  id: string;
  name: string;
  city: string;
  province: string;
  compliance_score: number;
}

interface Deal {
  id: string;
  title: string;
  factory_id: string;
  amount_eur: number;
  status: string;
  description?: string;
  product_category?: string;
  quantity?: number;
  unit_price?: number;
  payment_terms?: string;
  delivery_date?: string;
  incoterm?: string;
  notes?: string;
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

const statusOptions = [
  { value: 'negotiating', label: 'Negociando' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'in_production', label: 'Em Produção' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'closed', label: 'Fechado' },
];

const incotermOptions = [
  { value: 'EXW', label: 'EXW - Ex Works' },
  { value: 'FOB', label: 'FOB - Free On Board' },
  { value: 'CIF', label: 'CIF - Cost, Insurance and Freight' },
  { value: 'DDP', label: 'DDP - Delivered Duty Paid' },
  { value: 'CFR', label: 'CFR - Cost and Freight' },
];

function MentoradoDealEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<DealFormData>({
    title: '',
    factory_id: '',
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
    fetchDeal();
    fetchSuppliers();
  }, [id]);

  const fetchDeal = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mentorado/deals/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Deal não encontrado');
      }

      const result = await response.json();
      const deal: Deal = result.data;

      setFormData({
        title: deal.title || '',
        factory_id: deal.factory_id || '',
        amount_eur: deal.amount_eur?.toString() || '',
        status: deal.status || 'negotiating',
        description: deal.description || '',
        product_category: deal.product_category || '',
        quantity: deal.quantity?.toString() || '',
        unit_price: deal.unit_price?.toString() || '',
        payment_terms: deal.payment_terms || '30% deposit, 70% before shipment',
        delivery_date: deal.delivery_date || '',
        incoterm: deal.incoterm || 'FOB',
        notes: deal.notes || ''
      });
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Erro ao carregar deal'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/mentorado/suppliers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || localStorage.getItem('mentorado_token')}`,
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

    setSaving(true);
    setErrors({});

    try {
      const response = await fetch(`/api/mentorado/deals/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || localStorage.getItem('mentorado_token')}`,
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
        throw new Error(errorData.error || 'Falha ao atualizar deal');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/mentorado/deals/${id}`);
      }, 1500);
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Erro ao atualizar deal'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/mentorado/deals/${id}`);
  };

  const selectedSupplier = suppliers.find(s => s.id === formData.factory_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Deal</h1>
          <p className="text-gray-600 mt-1">Atualizar informações da negociação</p>
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
        <Card className="p-6 bg-emerald-50 border-emerald-200">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Deal atualizado com sucesso!</h3>
              <p className="text-sm text-green-700">Redirecionando para os detalhes...</p>
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
              <h3 className="font-semibold text-red-900">Erro ao atualizar deal</h3>
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
              <FormInput
                label="Título do Deal"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title}
                placeholder="Ex: Importação de 5000 unidades de Smart Watches"
                required
                icon={FileText}
              />
            </div>

            <div>
              <FormSelect
                label="Fornecedor"
                name="factory_id"
                value={formData.factory_id}
                onChange={(e) => setFormData({ ...formData, factory_id: e.target.value })}
                options={suppliers.map(s => ({
                  value: s.id,
                  label: `${s.name} - ${s.city}, ${s.province}`
                }))}
                error={errors.factory_id}
                placeholder="Selecione um fornecedor"
                required
                icon={Factory}
              />
              {selectedSupplier && (
                <div className="mt-2">
                  <Badge variant={selectedSupplier.compliance_score >= 90 ? 'success' : 'warning'}>
                    Compliance: {selectedSupplier.compliance_score}%
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <FormSelect
                label="Status"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={statusOptions}
              />
            </div>

            <div className="md:col-span-2">
              <FormTextarea
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva os detalhes do produto e da negociação..."
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* Product Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalhes do Produto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Categoria do Produto"
              name="product_category"
              value={formData.product_category}
              onChange={(e) => setFormData({ ...formData, product_category: e.target.value })}
              error={errors.product_category}
              placeholder="Ex: Eletrônicos, Têxtil, Maquinário"
              required
            />

            <FormInput
              label="Quantidade (unidades)"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="5000"
              min={1}
            />

            <FormInput
              label="Preço Unitário (EUR)"
              name="unit_price"
              type="number"
              value={formData.unit_price}
              onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
              placeholder="12.50"
              step="0.01"
              min={0}
              icon={DollarSign}
            />

            <div>
              <FormInput
                label="Valor Total (EUR)"
                name="amount_eur"
                type="number"
                value={formData.amount_eur}
                onChange={(e) => setFormData({ ...formData, amount_eur: e.target.value })}
                error={errors.amount_eur}
                placeholder="62500.00"
                step="0.01"
                min={0}
                required
                icon={DollarSign}
              />
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
            <FormSelect
              label="Incoterm"
              name="incoterm"
              value={formData.incoterm}
              onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
              options={incotermOptions}
            />

            <FormInput
              label="Data de Entrega Estimada"
              name="delivery_date"
              type="date"
              value={formData.delivery_date}
              onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
              icon={Calendar}
            />

            <div className="md:col-span-2">
              <FormInput
                label="Condições de Pagamento"
                name="payment_terms"
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                placeholder="30% depósito, 70% antes do embarque"
              />
            </div>

            <div className="md:col-span-2">
              <FormTextarea
                label="Notas Adicionais"
                name="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informações adicionais sobre a negociação, requisitos especiais, etc..."
                rows={4}
                maxLength={1000}
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
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Salvar Alterações</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default MentoradoDealEdit;
