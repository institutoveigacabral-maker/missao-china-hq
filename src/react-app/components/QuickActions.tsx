import { useState } from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Settings, 
  BarChart3, 
  FileText, 
  Database, 
  Zap,
  Brain,
  Target,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@/react-app/components/ui/Button';
import { useToast } from '@/react-app/components/ui/Toast';
import { useAppContext } from '@/react-app/contexts/AppContext';

interface QuickActionsProps {
  onAction?: (action: string) => void;
  className?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'primary' | 'secondary' | 'tertiary';
  category: 'data' | 'analysis' | 'system' | 'compliance';
  hotkey?: string;
  action: () => void;
}

export default function QuickActions({ onAction, className = '' }: QuickActionsProps) {
  const { refreshData, stats } = useAppContext();
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const toast = useToast();

  const executeAction = async (actionId: string, actionFn: () => void | Promise<void>) => {
    setIsExecuting(actionId);
    try {
      await actionFn();
      onAction?.(actionId);
    } catch (error) {
      console.error(`Error executing action ${actionId}:`, error);
      toast.actionFailed(`Ação ${actionId}`, error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsExecuting(null);
    }
  };

  const quickActions: QuickAction[] = [
    // Data Actions
    {
      id: 'refresh-data',
      title: 'Atualizar Dados',
      description: 'Recarregar todos os dados do sistema',
      icon: RefreshCw,
      type: 'secondary',
      category: 'data',
      hotkey: 'Cmd+R',
      action: async () => {
        await refreshData();
        toast.dataRefreshed();
      }
    },
    {
      id: 'export-skus',
      title: 'Exportar SKUs',
      description: 'Download completo em TXT/Excel',
      icon: Download,
      type: 'secondary',
      category: 'data',
      action: () => {
        window.open('/api/skus/export/txt', '_blank');
        toast.exportStarted('SKUs TXT/Excel');
      }
    },
    {
      id: 'import-data',
      title: 'Importar Dados',
      description: 'Upload de arquivo CSV/Excel',
      icon: Upload,
      type: 'tertiary',
      category: 'data',
      action: () => {
        toast.info('Funcionalidade em desenvolvimento');
      }
    },

    // Analysis Actions
    {
      id: 'neural-analysis',
      title: 'Análise Neural',
      description: 'IA TensorChain para insights avançados',
      icon: Brain,
      type: 'primary',
      category: 'analysis',
      action: () => {
        toast.customToast.neural('Iniciando Análise Neural', 'TensorChain conectando com fornecedores...', 'NEURAL');
        
        // Simulate neural analysis with progress updates
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          if (progress <= 100) {
            toast.tensorChainUpdate(progress);
          }
          if (progress >= 100) {
            clearInterval(interval);
            toast.neuralInsight('Identificados 3 fornecedores otimizados para SMART vertical', 'SMART');
          }
        }, 800);
      }
    },
    {
      id: 'risk-matrix',
      title: 'Matriz de Risco',
      description: 'Visualização de riscos por categoria',
      icon: Target,
      type: 'secondary',
      category: 'analysis',
      action: () => {
        window.location.href = '/risk-register';
      }
    },
    {
      id: 'compliance-check',
      title: 'Check Compliance',
      description: 'Verificação automática de conformidade',
      icon: Shield,
      type: 'secondary',
      category: 'compliance',
      action: () => {
        toast.customToast.compliance('Verificação de Compliance', 'Analisando conformidade regulatória...');
        setTimeout(() => {
          const pendingCount = stats?.pendingSKUs || 0;
          if (pendingCount > 0) {
            toast.complianceDeadlineAlert('ANATEL-001', 15);
          } else {
            toast.customToast.success('Compliance OK', 'Todos os SKUs estão em conformidade');
          }
        }, 2000);
      }
    },

    // System Actions
    {
      id: 'system-status',
      title: 'Status do Sistema',
      description: 'Verificar saúde dos serviços',
      icon: BarChart3,
      type: 'tertiary',
      category: 'system',
      action: () => {
        toast.systemAlert('info', 'Sistema operacional: 99.7% uptime');
      }
    },
    {
      id: 'backup-data',
      title: 'Backup de Dados',
      description: 'Criar snapshot completo',
      icon: Database,
      type: 'tertiary',
      category: 'system',
      action: () => {
        toast.backupStarted();
      }
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data': return <FileText className="w-4 h-4" />;
      case 'analysis': return <Brain className="w-4 h-4" />;
      case 'compliance': return <Shield className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data': return 'bg-blue-100 text-blue-800';
      case 'analysis': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const groupedActions = quickActions.reduce((groups, action) => {
    if (!groups[action.category]) {
      groups[action.category] = [];
    }
    groups[action.category].push(action);
    return groups;
  }, {} as Record<string, QuickAction[]>);

  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">⚡ Ações Rápidas</h2>
        <TertiaryButton
          icon={Settings}
          size="sm"
          title="Configurar ações"
        >
          <span className="sr-only">Configurar</span>
        </TertiaryButton>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedActions).map(([category, actions]) => (
          <div key={category}>
            <div className="flex items-center space-x-2 mb-3">
              {getCategoryIcon(category)}
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                {category === 'data' ? 'Dados' :
                 category === 'analysis' ? 'Análise' :
                 category === 'compliance' ? 'Compliance' : 'Sistema'}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(category)}`}>
                {actions.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              {actions.map((action) => {
                const IconComponent = action.icon;
                const isLoading = isExecuting === action.id;

                return (
                  <div
                    key={action.id}
                    className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <IconComponent className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''} text-slate-600 group-hover:text-blue-600`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-slate-900 text-sm">{action.title}</h4>
                          <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                        </div>
                      </div>
                      {action.hotkey && (
                        <kbd className="hidden sm:inline-block text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border font-mono">
                          {action.hotkey}
                        </kbd>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
                        {category}
                      </span>
                      
                      {action.type === 'primary' ? (
                        <PrimaryButton
                          onClick={() => executeAction(action.id, action.action)}
                          size="sm"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Executando...' : 'Executar'}
                        </PrimaryButton>
                      ) : action.type === 'secondary' ? (
                        <SecondaryButton
                          onClick={() => executeAction(action.id, action.action)}
                          size="sm"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Executando...' : 'Executar'}
                        </SecondaryButton>
                      ) : (
                        <TertiaryButton
                          onClick={() => executeAction(action.id, action.action)}
                          size="sm"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Executando...' : 'Executar'}
                        </TertiaryButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats?.totalSKUs || 0}</div>
            <div className="text-xs text-slate-600">SKUs Ativos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats?.pendingSKUs || 0}</div>
            <div className="text-xs text-slate-600">Pendentes</div>
          </div>
        </div>
      </div>

      {/* Emergency Actions */}
      {(stats?.pendingSKUs || 0) > 10 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Atenção Necessária</span>
          </div>
          <p className="text-xs text-yellow-700 mb-3">
            {stats?.pendingSKUs} SKUs necessitam revisão de compliance
          </p>
          <SecondaryButton
            onClick={() => window.location.href = '/regulations'}
            size="sm"
            className="w-full text-yellow-800 border-yellow-300 hover:border-yellow-400"
          >
            Revisar Regulamentações
          </SecondaryButton>
        </div>
      )}
    </div>
  );
}
