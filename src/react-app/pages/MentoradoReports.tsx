import { useState, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  DollarSign, 
  Factory, 
  Target,
  Award,
  AlertCircle,
  FileSpreadsheet,
  FileText as FileTextIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';

interface ReportData {
  dealsByMonth: Array<{ month: string; deals: number; value: number }>;
  dealsByStatus: Array<{ status: string; count: number; value: number }>;
  supplierPerformance: Array<{ name: string; deals: number; compliance: number; rating: number }>;
  financialSummary: {
    totalInvestment: number;
    pendingAmount: number;
    completedDeals: number;
    averageDealSize: number;
    monthlyGrowth: number;
  };
  complianceMetrics: {
    overallScore: number;
    auditsPending: number;
    certificationsExpiring: number;
    riskLevel: string;
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function MentoradoReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('last6months');
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mentorado/reports?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const result = await response.json();
      setReportData(result.data);
    } catch {
      setError('Failed to load report data');
      // Set mock data for demo
      setReportData({
        dealsByMonth: [
          { month: 'Jan', deals: 3, value: 45000 },
          { month: 'Fev', deals: 5, value: 67000 },
          { month: 'Mar', deals: 4, value: 52000 },
          { month: 'Abr', deals: 7, value: 89000 },
          { month: 'Mai', deals: 6, value: 78000 },
          { month: 'Jun', deals: 8, value: 98000 },
        ],
        dealsByStatus: [
          { status: 'Negociando', count: 5, value: 67000 },
          { status: 'Aprovado', count: 8, value: 156000 },
          { status: 'Em Produção', count: 3, value: 89000 },
          { status: 'Entregue', count: 12, value: 234000 },
        ],
        supplierPerformance: [
          { name: 'Guangzhou Tech Co.', deals: 8, compliance: 95, rating: 4.8 },
          { name: 'Shenzhen Manufacturing', deals: 6, compliance: 92, rating: 4.6 },
          { name: 'Shanghai Industries', deals: 4, compliance: 88, rating: 4.3 },
          { name: 'Ningbo Factory Ltd', deals: 3, compliance: 90, rating: 4.5 },
        ],
        financialSummary: {
          totalInvestment: 546000,
          pendingAmount: 156000,
          completedDeals: 28,
          averageDealSize: 19500,
          monthlyGrowth: 12.5,
        },
        complianceMetrics: {
          overallScore: 94,
          auditsPending: 2,
          certificationsExpiring: 1,
          riskLevel: 'low',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = async () => {
    try {
      const response = await fetch('/api/mentorado/reports/pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ period: selectedPeriod }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-mentorado-${selectedPeriod}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao gerar relatório PDF');
    }
  };

  const exportToCSVReport = () => {
    if (!reportData) return;

    const headers = ['Fornecedor', 'Deals', 'Compliance (%)', 'Rating'];
    const rows = reportData.supplierPerformance.map(supplier => [
      supplier.name,
      supplier.deals,
      supplier.compliance,
      supplier.rating
    ]);

    exportToCSV({
      headers,
      rows,
      filename: `relatorio-fornecedores-${selectedPeriod}`
    });
  };

  const exportToExcelReport = () => {
    if (!reportData) return;

    const headers = ['Fornecedor', 'Deals', 'Compliance (%)', 'Rating', 'Performance Score'];
    const rows = reportData.supplierPerformance.map(supplier => [
      supplier.name,
      supplier.deals,
      `${supplier.compliance}%`,
      supplier.rating,
      Math.round((supplier.deals / 10) * 100) + '%'
    ]);

    exportToExcel({
      headers,
      rows,
      filename: `relatorio-fornecedores-${selectedPeriod}`
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar relatórios</h2>
          <p className="text-gray-600">Não foi possível carregar os dados dos relatórios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Análise de performance e insights do negócio</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="last3months">Últimos 3 meses</option>
            <option value="last6months">Últimos 6 meses</option>
            <option value="lastyear">Último ano</option>
            <option value="all">Todo o período</option>
          </select>
          <div className="flex space-x-2">
            <Button
              onClick={exportToCSVReport}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <FileTextIcon className="h-4 w-4" />
              <span>CSV</span>
            </Button>
            <Button
              onClick={exportToExcelReport}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel</span>
            </Button>
            <Button
              onClick={generatePDFReport}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Investimento Total</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(reportData.financialSummary.totalInvestment)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Deals Concluídos</p>
              <p className="text-2xl font-bold text-green-900">{reportData.financialSummary.completedDeals}</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Ticket Médio</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(reportData.financialSummary.averageDealSize)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Crescimento Mensal</p>
              <p className="text-2xl font-bold text-orange-900">+{reportData.financialSummary.monthlyGrowth}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Score Compliance</p>
              <p className="text-2xl font-bold text-red-900">{reportData.complianceMetrics.overallScore}%</p>
            </div>
            <Award className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deals por Mês */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Evolução de Deals</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData.dealsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'value' ? formatCurrency(value as number) : value,
                  name === 'value' ? 'Valor (€)' : 'Deals'
                ]}
              />
              <Area yAxisId="left" type="monotone" dataKey="deals" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area yAxisId="right" type="monotone" dataKey="value" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Deals por Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Deals por Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.dealsByStatus}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                label={({ status, count }) => `${status}: ${count}`}
              >
                {reportData.dealsByStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Deals']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Supplier Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance dos Fornecedores</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.supplierPerformance.map((supplier, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Factory className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{supplier.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.deals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={supplier.compliance >= 90 ? 'success' : supplier.compliance >= 80 ? 'warning' : 'error'}
                    >
                      {supplier.compliance}%
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ⭐ {supplier.rating}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(supplier.deals / 10) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Compliance Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Status de Compliance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {reportData.complianceMetrics.overallScore}%
            </div>
            <p className="text-sm text-gray-600">Score Geral</p>
            <div className="mt-2">
              <Badge variant="success">Excelente</Badge>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {reportData.complianceMetrics.auditsPending}
            </div>
            <p className="text-sm text-gray-600">Auditorias Pendentes</p>
            <div className="mt-2">
              <Badge variant="warning">Atenção</Badge>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {reportData.complianceMetrics.certificationsExpiring}
            </div>
            <p className="text-sm text-gray-600">Certificações Vencendo</p>
            <div className="mt-2">
              <Badge variant={getRiskColor(reportData.complianceMetrics.riskLevel) as 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'}>
                {reportData.complianceMetrics.riskLevel === 'low' ? 'Baixo Risco' : 
                 reportData.complianceMetrics.riskLevel === 'medium' ? 'Médio Risco' : 'Alto Risco'}
              </Badge>
            </div>
          </div>
        </div>

        {reportData.complianceMetrics.riskLevel !== 'low' && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <p className="text-orange-800 font-medium">Recomendações</p>
            </div>
            <ul className="mt-2 text-sm text-orange-700 space-y-1">
              <li>• Acompanhar de perto as certificações próximas do vencimento</li>
              <li>• Agendar auditorias pendentes com fornecedores</li>
              <li>• Revisar procedimentos de compliance periodicamente</li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}

export default MentoradoReports;
