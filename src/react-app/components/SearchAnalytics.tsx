import { useState, useEffect } from 'react';
import { Search, TrendingUp, Filter, BarChart3, Target, Clock, Users, Package, Factory, Shield, FileText, Zap } from 'lucide-react';
import { getSearchStats, type SearchItem } from '@/react-app/utils/searchDataPreparer';

interface SearchAnalyticsProps {
  searchData: SearchItem[];
  isVisible: boolean;
  onClose: () => void;
}

interface SearchMetrics {
  totalSearches: number;
  topQueries: Array<{ query: string; count: number }>;
  categoryDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  avgResponseTime: number;
  successRate: number;
}

const SearchAnalytics: React.FC<SearchAnalyticsProps> = ({ searchData, isVisible, onClose }) => {
  const [metrics, setMetrics] = useState<SearchMetrics>({
    totalSearches: 0,
    topQueries: [],
    categoryDistribution: {},
    typeDistribution: {},
    avgResponseTime: 0,
    successRate: 0
  });

  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    if (isVisible) {
      // Simulate loading analytics data
      const stats = getSearchStats(searchData);
      
      // Mock analytics data - in production this would come from analytics service
      setMetrics({
        totalSearches: 1247,
        topQueries: [
          { query: 'IOT-TEMP-001', count: 156 },
          { query: 'anatel', count: 134 },
          { query: 'suppliers china', count: 98 },
          { query: 'regulations 2025', count: 87 },
          { query: 'RFS-001', count: 76 },
          { query: 'playbook', count: 65 },
          { query: 'shenzhen', count: 54 },
          { query: 'compliance', count: 43 }
        ],
        categoryDistribution: stats.byCategory,
        typeDistribution: stats.byType,
        avgResponseTime: 142,
        successRate: 94.2
      });
    }
  }, [isVisible, searchData]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sku': return <Package className="w-4 h-4" />;
      case 'supplier': return <Factory className="w-4 h-4" />;
      case 'regulation': return <Shield className="w-4 h-4" />;
      case 'page': return <FileText className="w-4 h-4" />;
      case 'feature': return <Zap className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sku': return 'bg-blue-100 text-blue-800';
      case 'supplier': return 'bg-green-100 text-green-800';
      case 'regulation': return 'bg-red-100 text-red-800';
      case 'page': return 'bg-purple-100 text-purple-800';
      case 'feature': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BarChart3 className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Search Analytics</h2>
              </div>
              <p className="text-purple-100">
                Métricas de uso da busca global • Última atualização: {new Date().toLocaleTimeString('pt-BR')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Fechar analytics"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-700">Período:</span>
            {(['1h', '24h', '7d', '30d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  timeframe === period
                    ? 'bg-purple-100 text-purple-800 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {period === '1h' ? '1 hora' :
                 period === '24h' ? '24 horas' :
                 period === '7d' ? '7 dias' : '30 dias'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Metrics */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-blue-800">Total de Buscas</h3>
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-900">{metrics.totalSearches.toLocaleString()}</div>
              <div className="text-sm text-blue-600">+23% vs período anterior</div>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-green-800">Taxa de Sucesso</h3>
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-900">{metrics.successRate}%</div>
              <div className="text-sm text-green-600">+1.2% vs período anterior</div>
            </div>

            <div className="bg-orange-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-orange-800">Tempo Médio</h3>
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-900">{metrics.avgResponseTime}ms</div>
              <div className="text-sm text-orange-600">-15ms vs período anterior</div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-purple-800">Usuários Ativos</h3>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-900">89</div>
              <div className="text-sm text-purple-600">+12 novos usuários</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Queries */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">🔥 Consultas Mais Populares</h3>
              <div className="space-y-3">
                {metrics.topQueries.map((query, index) => (
                  <div key={query.query} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="font-medium text-slate-900">{query.query}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 w-20">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${(query.count / metrics.topQueries[0].count) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">{query.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Distribution */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6">📊 Distribuição por Tipo</h3>
              <div className="space-y-3">
                {Object.entries(metrics.typeDistribution).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(type)}
                      <span className="font-medium text-slate-900 capitalize">{type}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(type)}`}>
                        {type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 w-16">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(metrics.typeDistribution))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-700">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">💡 Insights de Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Melhor Performance</span>
                </div>
                <p className="text-sm text-slate-700">
                  Busca por SKUs IoT tem 98% de taxa de sucesso
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Oportunidade</span>
                </div>
                <p className="text-sm text-slate-700">
                  42% das buscas são por regulamentações específicas
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Recomendação</span>
                </div>
                <p className="text-sm text-slate-700">
                  Adicionar filtros rápidos para supplier countries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAnalytics;
