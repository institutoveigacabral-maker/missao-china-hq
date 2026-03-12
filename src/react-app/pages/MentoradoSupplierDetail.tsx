import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Factory,
  Shield,
  Star,
  Users,
  Phone,
  Mail,
  Award,
  TrendingUp,
  Calendar,
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertCircle
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
  last_audit: number;
  contact_person?: string;
  email?: string;
  phone?: string;
  quality_rating?: number;
  certifications?: string[];
  product_lines?: string[];
  relation?: string;
}

interface Deal {
  id: string;
  title: string;
  amount_eur: number;
  status: string;
  created_at: number;
}

function MentoradoSupplierDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchSupplierDetail();
      fetchSupplierDeals();
    }
  }, [id]);

  const fetchSupplierDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mentorado/suppliers/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch supplier details');
      }

      const result = await response.json();
      setSupplier(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierDeals = async () => {
    try {
      const response = await fetch(`/api/mentorado/suppliers/${id}/deals`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('mentorado_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch supplier deals');
      }

      const result = await response.json();
      setDeals(result.data || []);
    } catch (err) {
      console.error('Failed to fetch deals:', err);
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'closed':
        return 'success';
      case 'in_production':
      case 'shipped':
        return 'info';
      case 'approved':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar fornecedor</h2>
          <p className="text-gray-600 mb-4">{error || 'Fornecedor não encontrado'}</p>
          <Button onClick={() => navigate('/mentorado/suppliers')}>
            Voltar aos Fornecedores
          </Button>
        </div>
      </div>
    );
  }

  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, deal) => sum + (deal.amount_eur || 0), 0);
  const completedDeals = deals.filter(d => ['delivered', 'closed'].includes(d.status)).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/mentorado/suppliers')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{supplier.name}</h1>
            <p className="text-gray-600 mt-1">{supplier.city}, {supplier.province}</p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/mentorado/deals/new?factory_id=${supplier.id}`)}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Novo Deal</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Compliance Score</p>
              <p className="text-2xl font-bold text-blue-900">{supplier.compliance_score}%</p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Total de Deals</p>
              <p className="text-2xl font-bold text-green-900">{totalDeals}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Valor Total</p>
              <p className="text-xl font-bold text-purple-900">{formatCurrency(totalValue)}</p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Deals Concluídos</p>
              <p className="text-2xl font-bold text-orange-900">{completedDeals}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Supplier Details */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações do Fornecedor</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{supplier.city}, {supplier.province}</span>
              </div>
            </div>

            {supplier.quality_rating && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality Rating</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-900">{supplier.quality_rating}/5</span>
                </div>
              </div>
            )}

            {supplier.contact_person && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contato</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{supplier.contact_person}</span>
                </div>
              </div>
            )}

            {supplier.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{supplier.email}</span>
                </div>
              </div>
            )}

            {supplier.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{supplier.phone}</span>
                </div>
              </div>
            )}

            {supplier.last_audit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Último Audit</label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">
                    {new Date(supplier.last_audit).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {supplier.product_lines && supplier.product_lines.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Linhas de Produtos</label>
              <div className="flex flex-wrap gap-2">
                {supplier.product_lines.map((line, index) => (
                  <Badge key={index} variant="primary">{line}</Badge>
                ))}
              </div>
            </div>
          )}

          {supplier.certifications && supplier.certifications.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Certificações</label>
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.map((cert, index) => (
                  <Badge key={index} variant="success">
                    <Award className="h-3 w-3 mr-1" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Status & Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Métricas</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Compliance</span>
                <Badge variant={getComplianceColor(supplier.compliance_score) as 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'}>
                  {supplier.compliance_score}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    supplier.compliance_score >= 90 ? 'bg-green-600' :
                    supplier.compliance_score >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${supplier.compliance_score}%` }}
                ></div>
              </div>
            </div>

            {supplier.relation && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tipo de Relação</span>
                <Badge variant="primary">{supplier.relation}</Badge>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taxa de Sucesso</span>
              <span className="text-sm font-medium text-gray-900">
                {totalDeals > 0 ? Math.round((completedDeals / totalDeals) * 100) : 0}%
              </span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm">
                {supplier.compliance_score >= 90 ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Fornecedor Recomendado</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-yellow-600">Requer Atenção</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Deals History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Histórico de Deals</h2>
          <Button
            onClick={() => navigate(`/mentorado/deals/new?factory_id=${supplier.id}`)}
            size="sm"
            className="bg-red-600 hover:bg-red-700"
          >
            Novo Deal
          </Button>
        </div>

        {deals.length === 0 ? (
          <div className="text-center py-12">
            <Factory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum deal registrado</h3>
            <p className="text-gray-600 mb-6">Inicie sua primeira negociação com este fornecedor</p>
            <Button
              onClick={() => navigate(`/mentorado/deals/new?factory_id=${supplier.id}`)}
              className="bg-red-600 hover:bg-red-700"
            >
              Criar Primeiro Deal
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{deal.title || `Deal #${deal.id}`}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(deal.amount_eur || 0)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(deal.status) as 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'}>
                        {deal.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(deal.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/mentorado/deals/${deal.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default MentoradoSupplierDetail;
