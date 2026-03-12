import { useState } from 'react';

import { 
  QuickActionButton,
  MobileMenuOverlay,
  MobileSearchBar,
  MobileTabBar,
  MobileActionSheet
} from '@/react-app/components/ui/MobileNavigation';
import { 
  Plus, 
  Share, 
  Filter, 
  Download,
  Edit,
  Trash2,
  Star,
  Settings,
  User,
  Bell
} from 'lucide-react';
import { useToast } from '@/react-app/hooks/useToast';

export default function MobileDemo() {
  const toast = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [showSearchMode, setShowSearchMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Todos', count: 24 },
    { id: 'pending', label: 'Pendentes', count: 8 },
    { id: 'completed', label: 'Concluídos', count: 16 },
  ];

  const actionSheetItems = [
    {
      id: 'edit',
      label: 'Editar',
      icon: Edit,
      onClick: () => toast.success('Editar selecionado')
    },
    {
      id: 'share',
      label: 'Compartilhar',
      icon: Share,
      onClick: () => toast.success('Compartilhar selecionado')
    },
    {
      id: 'star',
      label: 'Adicionar aos Favoritos',
      icon: Star,
      onClick: () => toast.success('Adicionado aos favoritos')
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: Trash2,
      destructive: true,
      onClick: () => toast.error('Item excluído')
    },
  ];

  const handleSearch = (value: string) => {
    console.log('Searching for:', value);
    toast.info(`Buscando por: ${value}`);
  };

  const demoItems = [
    {
      id: 1,
      title: 'SKU IOT-TEMP-001',
      subtitle: 'Sensor de temperatura Wi-Fi',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Fornecedor Shenzhen Tech',
      subtitle: 'Score: 4.2 • 85 produtos',
      status: 'completed',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'ANATEL VoLTE 2024',
      subtitle: 'Compliance deadline: 30 dias',
      status: 'pending',
      priority: 'high'
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        {/* Demo Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            📱 Mobile Components Demo
          </h1>
          <p className="text-slate-600">
            Demonstração interativa dos componentes mobile-first desenvolvidos
          </p>
        </div>

        {/* Search Demo */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-4">🔍 Mobile Search</h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowSearchMode(!showSearchMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showSearchMode ? 'Ocultar' : 'Mostrar'} Search Mobile
            </button>
            
            {showSearchMode && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <MobileSearchBar
                  value={searchValue}
                  onChange={setSearchValue}
                  onSearch={handleSearch}
                  placeholder="Buscar SKUs, fornecedores..."
                  showCancel={searchValue.length > 0}
                  onCancel={() => {
                    setSearchValue('');
                    setShowSearchMode(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tab Bar Demo */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-6 pb-0">
            <h2 className="text-lg font-semibold mb-4">📊 Mobile Tabs</h2>
          </div>
          
          <MobileTabBar
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="border-t border-slate-200"
          />
          
          <div className="p-6">
            <p className="text-slate-600">
              Tab ativa: <strong>{tabs.find(t => t.id === activeTab)?.label}</strong>
            </p>
          </div>
        </div>

        {/* Items List with Actions */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-4">📋 Lista com Actions</h2>
          
          <div className="space-y-3">
            {demoItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg touch-feedback"
                onClick={() => setShowActionSheet(true)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 truncate">
                    {item.subtitle}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 ml-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </span>
                  
                  <div className={`w-2 h-2 rounded-full ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-slate-500 mt-4">
            💡 Toque em qualquer item para ver o Action Sheet
          </p>
        </div>

        {/* Quick Actions Demo */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-4">🎯 Quick Actions</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => setShowMenu(true)}
              className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left"
            >
              Mostrar Menu Overlay
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={() => toast.success('Floating button - Adicionar')}
                className="flex-1 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                Teste FAB Adicionar
              </button>
              <button
                onClick={() => toast.info('Floating button - Filtrar')}
                className="flex-1 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                Teste FAB Filtrar
              </button>
            </div>
          </div>
        </div>

        {/* Component Features */}
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-900">
            ✨ Funcionalidades Mobile-First
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-blue-700 mb-2">🎨 UI Components:</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Bottom Navigation (5 tabs)</li>
                <li>• Floating Action Buttons</li>
                <li>• Search Bar com cancel</li>
                <li>• Tab Bar com badges</li>
                <li>• Action Sheet nativo</li>
                <li>• Menu Overlay com handle</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-violet-700 mb-2">🚀 Otimizações:</h3>
              <ul className="text-sm text-violet-600 space-y-1">
                <li>• Touch targets 44px mínimo</li>
                <li>• Safe areas suportadas</li>
                <li>• Feedback tátil visual</li>
                <li>• Gestos nativos (swipe, tap)</li>
                <li>• Scroll otimizado</li>
                <li>• Performance mobile-first</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <QuickActionButton
        onClick={() => toast.success('Novo item adicionado!')}
        icon={Plus}
        label="Adicionar novo item"
      />
      
      <QuickActionButton
        onClick={() => toast.info('Filtros aplicados')}
        icon={Filter}
        label="Filtrar resultados"
        variant="secondary"
        className="bottom-36"
      />

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        title="Menu Principal"
      >
        <div className="space-y-1">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors touch-feedback">
            <Settings className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-900">Configurações</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors touch-feedback">
            <User className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-900">Perfil</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors touch-feedback">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-900">Notificações</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors touch-feedback">
            <Download className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-900">Exportar Dados</span>
          </button>
        </div>
      </MobileMenuOverlay>

      {/* Mobile Action Sheet */}
      <MobileActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title="Ações do Item"
        items={actionSheetItems}
      />
    </div>
  );
}
