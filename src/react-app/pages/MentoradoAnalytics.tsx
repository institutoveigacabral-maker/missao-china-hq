import { useState, useEffect } from 'react';
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  Activity,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface AnalyticsData {
  performanceTrend: Array<{
    month: string;
    deals: number;
    revenue: number;
    compliance: number;
    efficiency: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    deals: number;
    revenue: number;
    avgTicket: number;
  }>;
  supplierRadar: Array<{
    metric: string;
    score: number;
    benchmark: number;
  }>;
  kpis: {
    conversionRate: number;
    avgCycleTime: number;
    customerSatisfaction: number;
    repeatBusinessRate: number;
    profitMargin: number;
    roi: number;
  };
  trends: {
    revenueGrowth: number;
    dealVelocity: number;
    complianceImprovement: number;
    supplierDiversification: number;
  };
}

function MentoradoAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'deals' | 'compliance' | 'efficiency'>('revenue');
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentorado/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Set mock data for demo
      setData({
        performanceTrend: [
          { month: 'Jan', deals: 3, revenue: 45000, compliance: 88, efficiency: 75 },
          { month: 'Fev', deals: 5, revenue: 67000, compliance: 90, efficiency: 78 },
          { month: 'Mar', deals: 4, revenue: 52000, compliance: 91, efficiency: 80 },
          { month: 'Abr', deals: 7, revenue: 89000, compliance: 93, efficiency: 85 },
          { month: 'Mai', deals: 6, revenue: 78000, compliance: 94, efficiency: 87 },
          { month: 'Jun', deals: 8, revenue: 98000, compliance: 95, efficiency: 90 },
        ],
        categoryBreakdown: [
          { category: 'Eletrônicos', deals: 12, revenue: 234000, avgTicket: 19500 },
          { category: 'Têxtil', deals: 8, revenue: 156000, avgTicket: 19500 },
          { category: 'Industrial', deals: 6, revenue: 189000, avgTicket: 31500 },
          { category: 'Automotivo', deals: 4, revenue: 98000, avgTicket: 24500 },
        ],
        supplierRadar: [
          { metric: 'Qualidade', score: 92, benchmark: 85 },
          { metric: 'Custo', score: 88, benchmark: 82 },
          { metric: 'Prazo', score: 90, benchmark: 80 },
          { metric: 'Compliance', score: 95, benchmark: 88 },
          { metric: 'Comunicação', score: 87, benchmark: 83 },
          { metric: 'Inovação', score: 85, benchmark: 78 },
        ],
        kpis: {
          conversionRate: 68.5,
          avgCycleTime: 42,
          customerSatisfaction: 4.7,
          repeatBusinessRate: 76.3,
          profitMargin: 18.2,
          roi: 145,
        },
        trends: {
          revenueGrowth: 23.5,
          dealVelocity: 15.8,
          complianceImprovement: 7.2,
          supplierDiversification: 12.4,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="h-4 w-4 text-emerald-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-emerald-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Análise avançada de performance e tendências</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <PieChartIcon className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-700">Crescimento Receita</p>
            {getTrendIcon(data.trends.revenueGrowth)}
          </div>
          <p className={`text-2xl font-bold ${getTrendColor(data.trends.revenueGrowth)}`}>
            +{data.trends.revenueGrowth}%
          </p>
          <p className="text-xs text-blue-600 mt-1">vs. período anterior</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-700">Velocidade Deals</p>
            {getTrendIcon(data.trends.dealVelocity)}
          </div>
          <p className={`text-2xl font-bold ${getTrendColor(data.trends.dealVelocity)}`}>
            +{data.trends.dealVelocity}%
          </p>
          <p className="text-xs text-emerald-600 mt-1">mais rápido</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-700">Melhoria Compliance</p>
            {getTrendIcon(data.trends.complianceImprovement)}
          </div>
          <p className={`text-2xl font-bold ${getTrendColor(data.trends.complianceImprovement)}`}>
            +{data.trends.complianceImprovement}%
          </p>
          <p className="text-xs text-purple-600 mt-1">desde início</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-700">Diversificação</p>
            {getTrendIcon(data.trends.supplierDiversification)}
          </div>
          <p className={`text-2xl font-bold ${getTrendColor(data.trends.supplierDiversification)}`}>
            +{data.trends.supplierDiversification}%
          </p>
          <p className="text-xs text-amber-600 mt-1">novos fornecedores</p>
        </Card>
      </div>

      {/* Performance Trend */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Tendência de Performance</h3>
          <div className="flex space-x-2">
            {(['revenue', 'deals', 'compliance', 'efficiency'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedMetric === metric
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {metric === 'revenue' ? 'Receita' :
                 metric === 'deals' ? 'Deals' :
                 metric === 'compliance' ? 'Compliance' : 'Eficiência'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.performanceTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => 
                selectedMetric === 'revenue' ? formatCurrency(value as number) : value
              }
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', r: 6 }}
              activeDot={{ r: 8 }}
              name={selectedMetric === 'revenue' ? 'Receita (€)' :
                    selectedMetric === 'deals' ? 'Número de Deals' :
                    selectedMetric === 'compliance' ? 'Score Compliance (%)' : 'Eficiência (%)'}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="p-6 text-center">
          <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Taxa Conversão</p>
          <p className="text-2xl font-bold text-gray-900">{data.kpis.conversionRate}%</p>
          <Badge variant="success" className="mt-2">Excelente</Badge>
        </Card>

        <Card className="p-6 text-center">
          <Activity className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Ciclo Médio</p>
          <p className="text-2xl font-bold text-gray-900">{data.kpis.avgCycleTime}d</p>
          <Badge variant="success" className="mt-2">Rápido</Badge>
        </Card>

        <Card className="p-6 text-center">
          <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Satisfação</p>
          <p className="text-2xl font-bold text-gray-900">⭐ {data.kpis.customerSatisfaction}</p>
          <Badge variant="success" className="mt-2">Alto</Badge>
        </Card>

        <Card className="p-6 text-center">
          <TrendingUp className="h-8 w-8 text-amber-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Negócio Recorrente</p>
          <p className="text-2xl font-bold text-gray-900">{data.kpis.repeatBusinessRate}%</p>
          <Badge variant="success" className="mt-2">Forte</Badge>
        </Card>

        <Card className="p-6 text-center">
          <DollarSign className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Margem Lucro</p>
          <p className="text-2xl font-bold text-gray-900">{data.kpis.profitMargin}%</p>
          <Badge variant="success" className="mt-2">Saudável</Badge>
        </Card>

        <Card className="p-6 text-center">
          <BarChart3 className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">ROI</p>
          <p className="text-2xl font-bold text-gray-900">{data.kpis.roi}%</p>
          <Badge variant="success" className="mt-2">Ótimo</Badge>
        </Card>
      </div>

      {/* Category & Radar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Breakdown por Categoria</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value as number) : value,
                  name === 'revenue' ? 'Receita' : name === 'deals' ? 'Deals' : 'Ticket Médio'
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="deals" fill="#3b82f6" name="Deals" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Receita (€)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Supplier Performance Radar */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance vs. Benchmark</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={data.supplierRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar 
                name="Sua Performance" 
                dataKey="score" 
                stroke="#ef4444" 
                fill="#ef4444" 
                fillOpacity={0.6} 
              />
              <Radar 
                name="Benchmark Mercado" 
                dataKey="benchmark" 
                stroke="#6b7280" 
                fill="#6b7280" 
                fillOpacity={0.3} 
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recomendações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-white rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Performance Crescente</h4>
              <p className="text-sm text-gray-600 mt-1">
                Sua receita está crescendo {data.trends.revenueGrowth}% acima da média do mercado. 
                Continue focando em deals de maior valor agregado.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Alta Taxa de Conversão</h4>
              <p className="text-sm text-gray-600 mt-1">
                Com {data.kpis.conversionRate}% de conversão, você está {Math.round(data.kpis.conversionRate - 50)}% 
                acima da média. Mantenha o foco em qualificação.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Excelente Compliance</h4>
              <p className="text-sm text-gray-600 mt-1">
                Score de compliance {data.trends.complianceImprovement}% acima da meta. 
                Considere compartilhar best practices com outros mentorados.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white rounded-lg">
            <div className="flex-shrink-0 h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
              <Activity className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Oportunidade: Diversificação</h4>
              <p className="text-sm text-gray-600 mt-1">
                Considere expandir para categorias de maior margem como Industrial, 
                onde seu ticket médio pode aumentar em até 60%.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default MentoradoAnalytics;
