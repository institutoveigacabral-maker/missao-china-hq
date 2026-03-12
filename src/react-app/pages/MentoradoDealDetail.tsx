import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Edit3,
  Trash2,
  DollarSign,
  Calendar,
  Factory,
  FileText,
  Package,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  User
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface DealDetail {
  id: string;
  title: string;
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
  created_at: number;
  updated_at: number;
  factory?: {
    id: string;
    name: string;
    city: string;
    province: string;
    compliance_score: number;
    contact_person?: string;
  };
  timeline?: Array<{
    id: string;
    event: string;
    date: number;
    description: string;
  }>;
}

function MentoradoDealDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<DealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDealDetail();
    }
  }, [id]);

  const fetchDealDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mentorado/deals/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deal details');
      }

      const result = await response.json();
      
      // Enrich with mock factory data if not present
      const dealData = result.data;
      if (dealData && !dealData.factory) {
        dealData.factory = {
          id: dealData.factory_id,
          name: 'Factory ' + dealData.factory_id,
          city: 'Shenzhen',
          province: 'Guangdong',
          compliance_score: 92,
        };
      }
      
      setDeal(dealData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este deal?')) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/mentorado/deals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || localStorage.getItem('mentorado_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete deal');
      }

      navigate('/mentorado/deals');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete deal');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'negotiating': return 'warning';
      case 'in_production': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'negotiating': return 'Negociando';
      case 'approved': return 'Aprovado';
      case 'in_production': return 'Em Produção';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle2;
      case 'negotiating': return Clock;
      case 'in_production': return Factory;
      case 'shipped': return TrendingUp;
      case 'delivered': return CheckCircle2;
      default: return AlertCircle;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2 text-center">
            Erro ao carregar deal
          </h2>
          <p className="text-gray-600 text-center mb-6">{error || 'Deal não encontrado'}</p>
          <Button
            onClick={() => navigate('/mentorado/deals')}
            className="w-full"
          >
            Voltar para Deals
          </Button>
        </Card>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(deal.status);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/mentorado/deals')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{deal.title}</h1>
            <p className="text-gray-600 mt-1">ID: {deal.id}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => navigate(`/mentorado/deals/${id}/edit`)}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Editar</span>
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="secondary"
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            <span>{deleting ? 'Excluindo...' : 'Excluir'}</span>
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <StatusIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status do Deal</p>
              <Badge variant={getStatusColor(deal.status) as 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'} className="mt-1">
                {getStatusLabel(deal.status)}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Valor Total</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(deal.amount_eur)}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deal Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalhes do Deal</h2>
            
            <div className="space-y-6">
              {deal.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{deal.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria do Produto
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Package className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{deal.product_category || 'Não especificado'}</span>
                  </div>
                </div>

                {deal.quantity && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantidade
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900 font-medium">
                        {deal.quantity.toLocaleString('pt-BR')} unidades
                      </span>
                    </div>
                  </div>
                )}

                {deal.unit_price && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Unitário
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{formatCurrency(deal.unit_price)}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incoterm
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900 font-medium">{deal.incoterm || 'FOB'}</span>
                  </div>
                </div>

                {deal.payment_terms && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condições de Pagamento
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{deal.payment_terms}</span>
                    </div>
                  </div>
                )}

                {deal.delivery_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Entrega Estimada
                    </label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">
                        {new Date(deal.delivery_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {deal.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Adicionais
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {deal.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Timeline */}
          {deal.timeline && deal.timeline.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Histórico</h2>
              
              <div className="space-y-4">
                {deal.timeline.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      {index < deal.timeline!.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 ml-0.75 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-medium text-gray-900">{event.event}</p>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(event.date).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Factory Information */}
          {deal.factory && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fornecedor</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nome</p>
                  <div className="flex items-center space-x-2">
                    <Factory className="h-5 w-5 text-gray-400" />
                    <p className="font-medium text-gray-900">{deal.factory.name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Localização</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-900">{deal.factory.city}, {deal.factory.province}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Compliance Score</p>
                  <Badge 
                    variant={deal.factory.compliance_score >= 90 ? 'success' : 'warning' as const}
                  >
                    {deal.factory.compliance_score}%
                  </Badge>
                </div>

                {deal.factory.contact_person && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Contato</p>
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <p className="text-gray-900">{deal.factory.contact_person}</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => navigate(`/mentorado/suppliers/${deal.factory!.id}`)}
                  variant="secondary"
                  className="w-full mt-4"
                >
                  Ver Detalhes do Fornecedor
                </Button>
              </div>
            </Card>
          )}

          {/* Metadata */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Criado em:</span>
                <span className="font-medium text-gray-900">
                  {new Date(deal.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última atualização:</span>
                <span className="font-medium text-gray-900">
                  {new Date(deal.updated_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-gray-600">ID do Deal:</span>
                <span className="font-mono text-xs text-gray-900">{deal.id}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-gradient-to-br from-red-50 to-amber-50 border-red-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            
            <div className="space-y-2">
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => navigate(`/mentorado/documents`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Gerar Documento
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => navigate(`/mentorado/deals/${id}/edit`)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar Deal
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MentoradoDealDetail;
