import { useState } from 'react';
import { useToast } from '@/react-app/hooks/useToast';
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button';
import { Bell, Code, Zap, Package } from 'lucide-react';

export default function ToastExample() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Implementação exata do exemplo fornecido
  const handleTest = () => {
    toast.success('SKU salvo com sucesso!');
    toast.error('Erro ao carregar dados');
    toast.warning('Atenção: dados desatualizados');
    toast.info('Nova versão disponível');
    
    // Toast específico para SKU
    toast.skuSaved('IOT-2024-001');
    
    // Toast com ação
    toast.promise(
      fetch('/api/data'),
      {
        loading: 'Carregando dados...',
        success: 'Dados carregados!',
        error: 'Erro ao carregar'
      }
    );
  };

  const handleAsyncTest = async () => {
    setIsLoading(true);
    
    // Simula uma operação assíncrona
    const asyncOperation = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Sucesso!') : reject('Falha na operação');
      }, 3000);
    });

    toast.promise(
      asyncOperation,
      {
        loading: 'Processando operação...',
        success: (data) => `Operação concluída: ${data}`,
        error: (error) => `Erro: ${error}`
      }
    );

    try {
      await asyncOperation;
    } catch (error) {
      // Toast promise já trata o erro
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkuOperations = () => {
    // Demonstra os métodos específicos para SKUs
    toast.skuSelected('IOT-SENSOR-2024');
    
    setTimeout(() => {
      toast.skuAnalysisStarted('IOT-SENSOR-2024');
    }, 1000);

    setTimeout(() => {
      toast.skuAnalysisCompleted('IOT-SENSOR-2024', 92);
    }, 3000);
  };

  const handleSupplierOperations = () => {
    // Demonstra os métodos específicos para fornecedores
    toast.supplierSelected('TechFlow Electronics');
    
    setTimeout(() => {
      toast.supplierScoreUpdated('TF-001', 4.7);
    }, 1500);

    setTimeout(() => {
      toast.supplierAuditAlert('TechFlow Electronics', 'low');
    }, 2500);
  };

  const handleSystemOperations = () => {
    // Demonstra operações do sistema
    toast.dataRefreshed();
    
    setTimeout(() => {
      toast.systemAlert('info', 'Sistema funcionando normalmente');
    }, 1000);

    setTimeout(() => {
      toast.neuralSyncStarted();
    }, 2000);

    setTimeout(() => {
      toast.neuralSyncCompleted();
    }, 4000);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Sistema de Toast - Exemplo de Uso
              </h1>
              <p className="text-slate-600">
                Demonstração do hook useToast conforme especificação
              </p>
            </div>
          </div>

          {/* Código de exemplo */}
          <div className="bg-slate-50 rounded-lg p-4 mt-6">
            <div className="flex items-center space-x-2 mb-3">
              <Code className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-800">Código de Exemplo</h3>
            </div>
            <pre className="text-sm text-slate-700 overflow-x-auto">
{`import { useToast } from '../hooks/useToast'

// Dentro do componente:
const toast = useToast()

// Exemplos de uso:
const handleTest = () => {
  toast.success('SKU salvo com sucesso!')
  toast.error('Erro ao carregar dados')
  toast.warning('Atenção: dados desatualizados')  
  toast.info('Nova versão disponível')
  
  // Toast específico para SKU
  toast.skuSaved('IOT-2024-001')
  
  // Toast com ação
  toast.promise(
    fetch('/api/data'),
    {
      loading: 'Carregando dados...',
      success: 'Dados carregados!',
      error: 'Erro ao carregar'
    }
  )
}`}
            </pre>
          </div>
        </div>

        {/* Basic Toasts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            1. Toasts Básicos
          </h2>
          <p className="text-slate-600 mb-6">
            Testa a implementação exata do exemplo fornecido
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PrimaryButton onClick={handleTest} className="w-full">
              Executar Exemplo Completo
            </PrimaryButton>
            
            <SecondaryButton 
              onClick={() => {
                toast.success('SKU salvo com sucesso!');
              }}
              className="w-full"
            >
              Toast Success Individual
            </SecondaryButton>
            
            <SecondaryButton 
              onClick={() => {
                toast.error('Erro ao carregar dados');
              }}
              className="w-full"
            >
              Toast Error Individual
            </SecondaryButton>
            
            <SecondaryButton 
              onClick={() => {
                toast.warning('Atenção: dados desatualizados');
              }}
              className="w-full"
            >
              Toast Warning Individual
            </SecondaryButton>
          </div>
        </div>

        {/* Promise Toasts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            2. Toast com Promise
          </h2>
          <p className="text-slate-600 mb-6">
            Demonstra o método toast.promise() para operações assíncronas
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PrimaryButton 
              onClick={handleAsyncTest} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processando...' : 'Testar Promise Toast'}
            </PrimaryButton>
            
            <SecondaryButton 
              onClick={() => {
                const mockApi = new Promise((resolve) => {
                  setTimeout(() => resolve('API respondeu com sucesso'), 2000);
                });
                
                toast.promise(mockApi, {
                  loading: 'Chamando API...',
                  success: 'API call bem-sucedida!',
                  error: 'Falha na API'
                });
              }}
              className="w-full"
            >
              Promise Sempre Sucesso
            </SecondaryButton>
          </div>
        </div>

        {/* SKU Specific Toasts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              3. Toasts Específicos para SKU
            </h2>
          </div>
          <p className="text-slate-600 mb-6">
            Demonstra métodos especializados para operações de SKU
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SecondaryButton onClick={handleSkuOperations} className="w-full">
              Fluxo SKU Completo
            </SecondaryButton>
            
            <SecondaryButton 
              onClick={() => toast.skuSaved('IOT-2024-001')}
              className="w-full"
            >
              SKU Salvo
            </SecondaryButton>
            
            <SecondaryButton 
              onClick={() => toast.skuAnalysisProgress('SMART-LED-003', 75)}
              className="w-full"
            >
              Análise em Progresso
            </SecondaryButton>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900">
              4. Recursos Avançados
            </h2>
          </div>
          <p className="text-slate-600 mb-6">
            Neural toasts, supplier operations e system alerts
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SecondaryButton onClick={handleSupplierOperations} className="w-full">
              Operações Fornecedor
            </SecondaryButton>
            
            <SecondaryButton onClick={handleSystemOperations} className="w-full">
              Operações Sistema
            </SecondaryButton>
            
            <SecondaryButton 
              onClick={() => {
                toast.neuralInsight('Novo padrão de compra detectado para vertical IoT', 'IoT');
              }}
              className="w-full"
            >
              Neural Insight
            </SecondaryButton>
            
            <SecondaryButton 
              onClick={() => {
                toast.complianceDeadlineAlert('ANATEL-CE-2024', 5);
              }}
              className="w-full"
            >
              Compliance Alert
            </SecondaryButton>
            
            <SecondaryButton 
              onClick={() => {
                toast.tensorChainUpdate(85);
              }}
              className="w-full"
            >
              TensorChain Update
            </SecondaryButton>
            
            <SecondaryButton 
              onClick={() => {
                toast.ecosystemAlert('SMART', 'Nova oportunidade detectada');
              }}
              className="w-full"
            >
              Ecosystem Alert
            </SecondaryButton>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            📚 Instruções de Uso
          </h3>
          <div className="space-y-3 text-blue-800">
            <div>
              <strong>1. Import:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-sm">import &#123; useToast &#125; from '../hooks/useToast'</code>
            </div>
            <div>
              <strong>2. Hook:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-sm">const toast = useToast()</code>
            </div>
            <div>
              <strong>3. Básicos:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-sm">toast.success()</code>, <code className="bg-blue-100 px-2 py-1 rounded text-sm">toast.error()</code>, <code className="bg-blue-100 px-2 py-1 rounded text-sm">toast.warning()</code>, <code className="bg-blue-100 px-2 py-1 rounded text-sm">toast.info()</code>
            </div>
            <div>
              <strong>4. Promise:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-sm">toast.promise(fetch(), &#123; loading, success, error &#125;)</code>
            </div>
            <div>
              <strong>5. SKU específicos:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-sm">toast.skuSaved()</code>, <code className="bg-blue-100 px-2 py-1 rounded text-sm">toast.skuAnalysisProgress()</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
