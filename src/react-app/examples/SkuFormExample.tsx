import { useState } from 'react';
import SkuForm from '@/react-app/components/SkuForm';
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button';
import { Package, Plus, Edit, Eye } from 'lucide-react';
import { useToast } from '@/react-app/hooks/useToast';

export default function SkuFormExample() {
  const [showForm, setShowForm] = useState(false);
  const [editingSku, setEditingSku] = useState<any>(null);
  const [savedSkus, setSavedSkus] = useState<any[]>([]);
  const toast = useToast();

  // Example SKU for editing demo
  const exampleSku = {
    id: 1,
    sku_code: 'IOT-DEMO-001',
    product_name: 'Smart Temperature Sensor',
    product_category: 'IoT',
    description: 'Sensor de temperatura Wi-Fi com conectividade IoT para monitoramento remoto',
    technical_specs: 'Wi-Fi 2.4GHz, Temperatura: -40°C a +125°C, Precisão: ±0.5°C, Alimentação: 3.3V',
    regulatory_status: 'pending',
    risk_category: 'medium',
    target_markets: 'Brasil, Portugal',
    is_active: true
  };

  const handleSave = (sku: any) => {
    setSavedSkus(prev => {
      const existing = prev.findIndex(s => s.sku_code === sku.sku_code);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = sku;
        return updated;
      }
      return [...prev, sku];
    });
    setShowForm(false);
    setEditingSku(null);
    toast.success(`SKU ${sku.sku_code} salvo com sucesso!`);
  };

  const handleEdit = (sku: any) => {
    setEditingSku(sku);
    setShowForm(true);
  };

  const handleNewSku = () => {
    setEditingSku(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSku(null);
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Package className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Sistema de Formulário SKU</h1>
              </div>
              <p className="text-blue-100 text-lg mb-4">
                Demonstração do componente SkuForm com useAsyncOperation integrado
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Formulário Responsivo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Validação Completa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Loading States</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{savedSkus.length}</div>
              <div className="text-blue-100">SKUs Salvos</div>
              <div className="text-sm text-blue-200 mt-1">
                No Exemplo
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Controles de Demonstração</h2>
          <div className="flex flex-wrap gap-3">
            <PrimaryButton
              onClick={handleNewSku}
              icon={Plus}
              disabled={showForm}
            >
              Novo SKU
            </PrimaryButton>
            <SecondaryButton
              onClick={() => handleEdit(exampleSku)}
              icon={Edit}
              disabled={showForm}
            >
              Editar SKU Exemplo
            </SecondaryButton>
            <SecondaryButton
              onClick={() => setSavedSkus([])}
              disabled={savedSkus.length === 0}
            >
              Limpar Lista
            </SecondaryButton>
          </div>
        </div>

        {/* Form Display */}
        {showForm && (
          <SkuForm
            sku={editingSku}
            onSave={handleSave}
            onCancel={handleCancel}
            isEdit={!!editingSku}
          />
        )}

        {/* Saved SKUs List */}
        {savedSkus.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">SKUs Salvos ({savedSkus.length})</h3>
            <div className="space-y-3">
              {savedSkus.map((sku, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-mono text-sm font-bold text-blue-600">{sku.sku_code}</div>
                    <div className="font-medium text-slate-900">{sku.product_name}</div>
                    <div className="text-sm text-slate-600">{sku.product_category} • {sku.regulatory_status}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      sku.risk_category === 'low' ? 'bg-green-100 text-green-800' :
                      sku.risk_category === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sku.risk_category}
                    </span>
                    <SecondaryButton
                      onClick={() => handleEdit(sku)}
                      icon={Edit}
                      size="sm"
                    >
                      Editar
                    </SecondaryButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code Examples */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Exemplo de Código Corrigido</h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">✅ Import Correto</h4>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-sm overflow-x-auto">
                <code>{`import { useAsyncOperation } from '@/react-app/hooks/useAdvancedLoading'
import { useToast } from '@/react-app/hooks/useToast'
import { LoadingButton } from '@/react-app/components/ui/LoadingButton'`}</code>
              </pre>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">✅ Uso do Hook</h4>
              <pre className="bg-slate-900 text-slate-300 p-3 rounded text-sm overflow-x-auto">
                <code>{`export const SkuForm = ({ sku, onSave }) => {
  const { execute, isLoading } = useAsyncOperation('save-sku')
  const toast = useToast()

  const handleSubmit = async (formData) => {
    await execute(
      () => saveSkuToApi(formData),
      {
        loadingMessage: 'Salvando SKU...',
        successMessage: \`SKU \${formData.sku_code} salvo com sucesso!\`,
        errorMessage: 'Erro ao salvar SKU',
        onSuccess: (savedSku) => {
          toast.skuSaved(savedSku.sku_code)
          onSave?.(savedSku)
        }
      }
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
      
      <LoadingButton
        type="submit"
        loading={isLoading}
        loadingText="Salvando..."
        className="w-full"
      >
        Salvar SKU
      </LoadingButton>
    </form>
  )
}`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Features Summary */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">🚀 Recursos do SkuForm</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-bold text-green-800 mb-3">⚡ Performance</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• useAsyncOperation integrado</li>
                <li>• Loading states automáticos</li>
                <li>• Error handling robusto</li>
                <li>• Toast notifications</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3">🎨 UI/UX</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Formulário responsivo</li>
                <li>• Validação em tempo real</li>
                <li>• Status indicators visuais</li>
                <li>• Feedback imediato</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-3">🛠️ Funcionalidades</h4>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• Criar e editar SKUs</li>
                <li>• TypeScript completo</li>
                <li>• API integration</li>
                <li>• Memory leak safe</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
}
