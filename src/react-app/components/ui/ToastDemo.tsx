import { useToast } from '@/react-app/hooks/useToast';
import { 
  Bell, 
  Info, 
  Zap,
  Package,
  Shield
} from 'lucide-react';

export default function ToastDemo() {
  const toast = useToast();

  const demoActions = [
    {
      title: 'Toast Básicos',
      actions: [
        {
          label: 'Sucesso',
          color: 'bg-green-600 hover:bg-green-700',
          onClick: () => toast.success('Operação realizada com sucesso!')
        },
        {
          label: 'Erro',
          color: 'bg-red-600 hover:bg-red-700',
          onClick: () => toast.error('Ocorreu um erro inesperado')
        },
        {
          label: 'Aviso',
          color: 'bg-yellow-600 hover:bg-yellow-700',
          onClick: () => toast.warning('Atenção necessária')
        },
        {
          label: 'Info',
          color: 'bg-blue-600 hover:bg-blue-700',
          onClick: () => toast.info('Informação importante')
        }
      ]
    },
    {
      title: 'Toasts Neurais',
      actions: [
        {
          label: 'Neural Sync',
          color: 'bg-violet-600 hover:bg-violet-700',
          onClick: () => toast.neuralSyncStarted()
        },
        {
          label: 'TensorChain',
          color: 'bg-purple-600 hover:bg-purple-700',
          onClick: () => toast.tensorChainUpdate(75)
        },
        {
          label: 'Ecosystem Alert',
          color: 'bg-indigo-600 hover:bg-indigo-700',
          onClick: () => toast.ecosystemAlert('SMART', 'Nova oportunidade de produto identificada')
        },
        {
          label: 'Neural Insight',
          color: 'bg-violet-600 hover:bg-violet-700',
          onClick: () => toast.neuralInsight('Padrão de compra otimizado detectado', 'IoT')
        }
      ]
    },
    {
      title: 'Toasts Específicos',
      actions: [
        {
          label: 'SKU Salvo',
          color: 'bg-blue-600 hover:bg-blue-700',
          onClick: () => toast.skuSaved('IOT-SENSOR-001')
        },
        {
          label: 'Análise SKU',
          color: 'bg-cyan-600 hover:bg-cyan-700',
          onClick: () => toast.skuAnalysisProgress('SMART-LED-003', 60)
        },
        {
          label: 'Fornecedor Auditoria',
          color: 'bg-orange-600 hover:bg-orange-700',
          onClick: () => toast.supplierAuditAlert('TechFlow Electronics', 'medium')
        },
        {
          label: 'Compliance Deadline',
          color: 'bg-red-600 hover:bg-red-700',
          onClick: () => toast.complianceDeadlineAlert('ANATEL-CE-2024', 5)
        }
      ]
    },
    {
      title: 'Toasts Customizados',
      actions: [
        {
          label: 'Custom Success',
          color: 'bg-emerald-600 hover:bg-emerald-700',
          onClick: () => toast.customToast.success(
            'Upload Completo',
            'Certificado ANATEL carregado com sucesso',
            {
              label: 'Ver Documento',
              onClick: () => console.log('Abrindo documento...')
            }
          )
        },
        {
          label: 'Custom Neural',
          color: 'bg-violet-600 hover:bg-violet-700',
          onClick: () => toast.customToast.neural(
            'Sincronização Neural',
            'Conectando com fornecedores da vertical CASA',
            'CASA',
            {
              label: 'Monitorar',
              onClick: () => console.log('Abrindo monitoramento...')
            }
          )
        },
        {
          label: 'Custom Compliance',
          color: 'bg-green-600 hover:bg-green-700',
          onClick: () => toast.customToast.compliance(
            'Auditoria Aprovada',
            'Fornecedor TechFlow passou na auditoria QA',
            {
              label: 'Ver Relatório',
              onClick: () => console.log('Abrindo relatório...')
            }
          )
        },
        {
          label: 'Custom Error',
          color: 'bg-red-600 hover:bg-red-700',
          onClick: () => toast.customToast.error(
            'Falha na Importação',
            'Erro ao processar arquivo CSV de SKUs',
            {
              label: 'Tentar Novamente',
              onClick: () => console.log('Tentando novamente...')
            }
          )
        }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="w-6 h-6 text-blue-600" />
        <h2 className="text-lg font-bold text-slate-900">Sistema de Toasts Avançado</h2>
      </div>

      <p className="text-slate-600 mb-8">
        Demonstração completa do sistema de notificações personalizado do MUNDÃO, 
        incluindo toasts básicos, neurais e específicos para cada contexto da aplicação.
      </p>

      <div className="space-y-8">
        {demoActions.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center space-x-2">
              {section.title === 'Toast Básicos' && <Info className="w-4 h-4" />}
              {section.title === 'Toasts Neurais' && <Zap className="w-4 h-4 text-violet-600" />}
              {section.title === 'Toasts Específicos' && <Package className="w-4 h-4 text-blue-600" />}
              {section.title === 'Toasts Customizados' && <Shield className="w-4 h-4 text-green-600" />}
              <span>{section.title}</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {section.actions.map((action, actionIndex) => (
                <button
                  key={actionIndex}
                  onClick={action.onClick}
                  className={`${action.color} text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Toast Statistics */}
      <div className="mt-8 bg-slate-50 rounded-lg p-4">
        <h4 className="font-medium text-slate-800 mb-3">📊 Recursos do Sistema</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">15+</div>
            <div className="text-xs text-slate-600">Tipos de Toast</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-violet-600">7</div>
            <div className="text-xs text-slate-600">Verticais Neurais</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">∞</div>
            <div className="text-xs text-slate-600">Customizações</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">4</div>
            <div className="text-xs text-slate-600">Níveis de Prioridade</div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">💡 Como Usar</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>Básicos:</strong> toast.success(), toast.error(), toast.warning(), toast.info()</p>
          <p>• <strong>Neurais:</strong> toast.neuralSyncStarted(), toast.tensorChainUpdate(), toast.ecosystemAlert()</p>
          <p>• <strong>Específicos:</strong> toast.skuSaved(), toast.supplierUpdated(), toast.complianceCheck()</p>
          <p>• <strong>Customizados:</strong> toast.customToast.neural() com botões de ação</p>
        </div>
      </div>
    </div>
  );
}
