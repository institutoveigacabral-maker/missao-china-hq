import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Factory,
  Eye,
  Edit3,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface Deal {
  id: string;
  title: string;
  amount_eur: number;
  status: string;
  mentorado_id: string;
  factory_id: string;
  factory?: {
    name: string;
    city: string;
    compliance_score: number;
  };
  created_at: number;
  updated_at: number;
}

interface DealStats {
  total: number;
  byStatus: Record<string, number>;
  totalValue: number;
  averageValue: number;
  thisMonth: number;
}

function MentoradoDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<DealStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals();
    fetchStats();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentorado/deals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }

      const result = await response.json();
      setDeals(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/mentorado/deals/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.factory?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Deals</h1>
          <p className="text-gray-600 mt-1">Gerencie seus projetos e negociações</p>
        </div>
        <Button
          onClick={() => navigate('/mentorado/deals/new')}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Deal</span>
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total de Deals</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Valor Total</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Valor Médio</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.averageValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Este Mês</p>
                <p className="text-2xl font-bold text-orange-900">{stats.thisMonth}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
              >
                <option value="all">Todos os Status</option>
                <option value="negotiating">Negociando</option>
                <option value="approved">Aprovado</option>
                <option value="in_production">Em Produção</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
                <option value="closed">Fechado</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>

      {/* Deals List */}
      <div className="space-y-4">
        {error && (
          <Card className="p-6 border-red-200 bg-red-50">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        {filteredDeals.length === 0 ? (
          <Card className="p-12 text-center">
            <Factory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {deals.length === 0 ? 'Nenhum deal encontrado' : 'Nenhum deal corresponde aos filtros'}
            </h3>
            <p className="text-gray-600 mb-6">
              {deals.length === 0 
                ? 'Comece criando seu primeiro deal com uma fábrica parceira'
                : 'Tente ajustar os filtros para encontrar deals'
              }
            </p>
            {deals.length === 0 && (
              <Button
                onClick={() => navigate('/mentorado/deals/new')}
                className="bg-red-600 hover:bg-red-700"
              >
                Criar Primeiro Deal
              </Button>
            )}
          </Card>
        ) : (
          filteredDeals.map((deal) => (
            <Card key={deal.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
                    <Badge variant={getStatusColor(deal.status) as 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'}>
                      {getStatusLabel(deal.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Factory className="h-4 w-4" />
                      <span>{deal.factory?.name || 'Fábrica não especificada'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-gray-900">{formatCurrency(deal.amount_eur)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(deal.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {deal.factory && (
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{deal.factory.city}</span>
                      <span>•</span>
                      <span>Compliance: {deal.factory.compliance_score}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/mentorado/deals/${deal.id}`)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Ver</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/mentorado/deals/${deal.id}/edit`)}
                    className="flex items-center space-x-1"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Editar</span>
                  </Button>
                  <Button variant="secondary" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <h3 className="text-xl font-semibold mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/mentorado/deals/new')}
            className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors text-left"
          >
            <Plus className="h-6 w-6 mb-2" />
            <h4 className="font-medium">Novo Deal</h4>
            <p className="text-sm opacity-90">Criar nova negociação</p>
          </button>
          <button 
            onClick={() => navigate('/mentorado/suppliers')}
            className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors text-left"
          >
            <Factory className="h-6 w-6 mb-2" />
            <h4 className="font-medium">Encontrar Fornecedores</h4>
            <p className="text-sm opacity-90">Explorar fábricas parceiras</p>
          </button>
          <button 
            onClick={() => navigate('/mentorado/reports')}
            className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors text-left"
          >
            <ExternalLink className="h-6 w-6 mb-2" />
            <h4 className="font-medium">Gerar Relatório</h4>
            <p className="text-sm opacity-90">Análise de performance</p>
          </button>
        </div>
      </Card>
    </div>
  );
}

export default MentoradoDeals;
