import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Factory, 
  FileText, 
  DollarSign, 
  Shield, 
  Users,
  Target,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface DashboardData {
  profile: {
    companyName: string;
    cnpj: string;
    segment: string;
    memberSince: string;
    status: string;
    capital: number;
  };
  metrics: {
    totalDeals: number;
    totalRevenue: number;
    avgCompliance: number;
    pendingDocuments: number;
    totalInvestment: number;
    activeFactories: number;
    complianceScore: number;
    monthlyProgress: number;
    documentsGenerated: number;
  };
  activeDeals: {
    id: string;
    title: string;
    status: string;
    amount_eur: number;
    factory_name: string;
    created_at: string;
  }[];
  upcomingEvents: {
    id: string;
    event_name: string;
    event_date: string;
    location: string;
  }[];
  recentDeals: Array<{
    id: string;
    title: string;
    status: string;
    amount_eur: number;
  }>;
  recentDocuments: Array<{
    type: string;
    created_at: string;
  }>;
}

function MentoradoDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentorado/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar dashboard</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'onboarding': return 'warning';
      case 'suspended': return 'error';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Mentorado</h1>
          <p className="text-gray-600 mt-1">Bem-vindo ao Missão China PRO</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-800">{data.profile.companyName}</h2>
          <p className="text-sm text-gray-600 mb-2">{data.profile.segment} • CNPJ: {data.profile.cnpj}</p>
          <Badge variant={getStatusColor(data.profile.status) as 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'}>
            {data.profile.status === 'active' ? 'Ativo' : 
             data.profile.status === 'onboarding' ? 'Onboarding' : 'Suspenso'}
          </Badge>
          <p className="text-xs text-gray-500 mt-1">
            Membro desde {new Date(data.profile.memberSince).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Deals</p>
              <p className="text-2xl font-bold text-blue-900">{data.metrics.totalDeals}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700">Receita Total</p>
              <p className="text-2xl font-bold text-emerald-900">
                {formatCurrency(data.metrics.totalRevenue)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Fábricas Ativas</p>
              <p className="text-2xl font-bold text-purple-900">{data.metrics.activeFactories}</p>
            </div>
            <Factory className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Compliance Média</p>
              <p className="text-2xl font-bold text-amber-900">{data.metrics.avgCompliance}%</p>
            </div>
            <Shield className="h-8 w-8 text-amber-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-700">Docs Pendentes</p>
              <p className="text-2xl font-bold text-rose-900">{data.metrics.pendingDocuments}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-rose-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-700">Progresso Mensal</p>
              <p className="text-2xl font-bold text-indigo-900">{data.metrics.monthlyProgress}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </Card>
      </div>

      {/* Main Activity Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Deals */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Deals Ativos</h3>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          
          <div className="space-y-4">
            {data.activeDeals.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum deal ativo</p>
            ) : (
              data.activeDeals.map((deal) => (
                <div key={deal.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{deal.title}</h4>
                    <Badge 
                      variant={deal.status === 'active' ? 'success' : 
                               deal.status === 'negotiating' ? 'warning' : 'primary' as const}
                    >
                      {deal.status === 'active' ? 'Ativo' :
                       deal.status === 'negotiating' ? 'Negociando' :
                       deal.status === 'pending' ? 'Pendente' : deal.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <Building2 className="h-4 w-4 inline mr-1" />
                    {deal.factory_name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-700">
                      {formatCurrency(deal.amount_eur)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(deal.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            {data.upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum evento agendado</p>
            ) : (
              data.upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 bg-gradient-to-r from-amber-50 to-red-50 rounded-lg border border-amber-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{event.event_name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                      <div className="flex items-center text-xs text-amber-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(event.event_date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <Badge variant="warning">
                      {Math.ceil((new Date(event.event_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Documents */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Documentos Recentes</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {data.recentDocuments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum documento encontrado</p>
            ) : (
              data.recentDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {doc.type === 'commitment' ? 'Termo de Compromisso' :
                         doc.type === 'contract' ? 'Contrato' :
                         doc.type === 'qa_report' ? 'Relatório QA' : 
                         doc.type === 'invoice' ? 'Fatura' : 'Documento'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors">
                    Download
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <h3 className="text-xl font-semibold mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors text-left">
            <Users className="h-6 w-6 mb-2" />
            <h4 className="font-medium">Novo Deal</h4>
            <p className="text-sm opacity-90">Criar novo projeto</p>
          </button>
          <button className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors text-left">
            <Factory className="h-6 w-6 mb-2" />
            <h4 className="font-medium">Visitar Fábrica</h4>
            <p className="text-sm opacity-90">Agendar visita</p>
          </button>
          <button className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors text-left">
            <FileText className="h-6 w-6 mb-2" />
            <h4 className="font-medium">Gerar Documento</h4>
            <p className="text-sm opacity-90">Contratos e relatórios</p>
          </button>
        </div>
      </Card>
    </div>
  );
}

export default MentoradoDashboard;
