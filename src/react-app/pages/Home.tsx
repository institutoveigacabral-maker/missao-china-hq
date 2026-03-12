import { 
  TrendingUp, Package, Factory, Shield, ArrowUpRight, 
  ChevronRight, BarChart3, Globe, FileText, Users, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';

export default function Home() {
  const { stats, loading } = useDashboard();

  const metrics = [
    {
      label: 'SKUs Ativos',
      value: loading ? '...' : String(stats?.skus.active || 0),
      total: stats?.skus.total || 0,
      icon: Package,
      trend: '+12%',
      trendUp: true,
      color: 'blue',
    },
    {
      label: 'Fornecedores',
      value: loading ? '...' : String(stats?.suppliers.total || 0),
      total: stats?.suppliers.approved || 0,
      icon: Factory,
      trend: '+8%',
      trendUp: true,
      color: 'green',
    },
    {
      label: 'Regulamentações',
      value: loading ? '...' : String(stats?.regulations.total || 0),
      total: stats?.regulations.mandatory || 0,
      icon: Shield,
      trend: '3 novas',
      trendUp: false,
      color: 'purple',
    },
    {
      label: 'Compliance',
      value: loading ? '...' : `${Math.round(((stats?.compliance.approved || 0) / ((stats?.compliance.approved || 0) + (stats?.compliance.pending || 0) + (stats?.compliance.failed || 0) || 1)) * 100)}%`,
      total: stats?.compliance.pending || 0,
      icon: TrendingUp,
      trend: '+5%',
      trendUp: true,
      color: 'emerald',
    },
  ];

  const quickActions = [
    {
      title: 'Fornecedores',
      description: 'Gerenciar base de fornecedores',
      icon: Users,
      link: '/suppliers',
      stats: `${stats?.suppliers.total || 0} ativos`,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Regulamentações',
      description: 'Compliance e certificações',
      icon: FileText,
      link: '/regulations',
      stats: `${stats?.regulations.mandatory || 0} obrigatórias`,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Canton Fair',
      description: 'Mapa e planejamento',
      icon: Globe,
      link: '/canton-fair',
      stats: 'Próxima fase',
      color: 'from-pink-500 to-rose-600',
    },
    {
      title: 'Análises',
      description: 'Relatórios e métricas',
      icon: BarChart3,
      link: '/playbook',
      stats: 'Ver dados',
      color: 'from-blue-500 to-cyan-600',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      emerald: 'bg-emerald-50 text-emerald-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 -mx-6 -mt-6 px-6 pt-6 pb-8 mb-6 border-b border-slate-200">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-lg text-slate-600">
          Visão geral das operações China HQ
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-accent-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-5">
                <div className={`p-3 rounded-xl ${getColorClasses(metric.color)} group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="w-6 h-6" />
                </div>
                {metric.trendUp && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                    <ArrowUpRight className="w-3 h-3" />
                    {metric.trend}
                  </div>
                )}
              </div>
              
              <div className="text-3xl font-bold text-slate-900 mb-2">{metric.value}</div>
              <div className="text-sm font-medium text-slate-600 mb-3">{metric.label}</div>
              
              {metric.total > 0 && (
                <div className="text-xs text-slate-500 pt-3 border-t border-slate-100">
                  {metric.total} {metric.label === 'SKUs Ativos' ? 'total' : 
                                 metric.label === 'Fornecedores' ? 'aprovados' :
                                 metric.label === 'Regulamentações' ? 'obrigatórias' : 'pendentes'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Acesso Rápido</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-accent-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {action.description}
                </p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                  {action.stats}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Updates */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Atualizações Recentes</h3>
            <button className="text-sm font-semibold text-accent-600 hover:text-accent-700 transition-colors">
              Ver todas →
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100 hover:border-blue-200 transition-colors">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  Novo fornecedor aprovado
                </p>
                <p className="text-sm text-slate-600 mb-2">
                  Shenzhen Tech Ltd - Score 8.5
                </p>
                <p className="text-xs text-slate-500">
                  Há 2 horas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-transparent rounded-xl border border-amber-100 hover:border-amber-200 transition-colors">
              <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  Regulamentação atualizada
                </p>
                <p className="text-sm text-slate-600 mb-2">
                  ANATEL 14.430/2024 - Prazo prorrogado
                </p>
                <p className="text-xs text-slate-500">
                  Há 5 horas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-transparent rounded-xl border border-emerald-100 hover:border-emerald-200 transition-colors">
              <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  SKU certificado
                </p>
                <p className="text-sm text-slate-600 mb-2">
                  IOT-RFID-001 aprovado para Brasil
                </p>
                <p className="text-xs text-slate-500">
                  Ontem
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Tarefas Pendentes</h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
              3 itens
            </span>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-start gap-4 p-4 border-2 border-amber-200 bg-amber-50 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors">
              <input type="checkbox" className="mt-1 w-4 h-4 text-accent-600 rounded border-amber-300 focus:ring-2 focus:ring-accent-500" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Renovar certificado ANATEL
                  </p>
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                </div>
                <p className="text-sm text-slate-600">
                  Vencimento em 15 dias
                </p>
              </div>
            </label>

            <label className="flex items-start gap-4 p-4 border-2 border-slate-200 bg-white rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" className="mt-1 w-4 h-4 text-accent-600 rounded border-slate-300 focus:ring-2 focus:ring-accent-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  Auditar fornecedor Guangzhou
                </p>
                <p className="text-sm text-slate-600">
                  Agendado para próxima semana
                </p>
              </div>
            </label>

            <label className="flex items-start gap-4 p-4 border-2 border-slate-200 bg-white rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="checkbox" className="mt-1 w-4 h-4 text-accent-600 rounded border-slate-300 focus:ring-2 focus:ring-accent-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  Atualizar documentação fiscal
                </p>
                <p className="text-sm text-slate-600">
                  Novas regras DUIMP
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="relative rounded-2xl p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Missão China HQ</h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Sistema neural de expansão internacional conectando Brasil, Portugal e China 
            através de governança real, sourcing inteligente e IA aplicada.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <span className="font-semibold">THALAMUS Holdings</span>
            </div>
            <div className="px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <span className="font-semibold">Logística Neural</span>
            </div>
            <div className="px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
              <span className="font-semibold">Performance + Storytelling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
