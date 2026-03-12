import React, { useState } from 'react';
;
import { useResponsiveSidebar } from '@/react-app/hooks/useSafeSidebar';
import { TertiaryButton, PrimaryButton } from '@/react-app/components/ui/Button';
import { Menu, X, Monitor, Smartphone, Tablet, Settings } from 'lucide-react';
import { useToast } from '@/react-app/hooks/useToast';

export default function SidebarDemo() {
  const toast = useToast();
  const sidebar = useResponsiveSidebar();
  const [demoConfig, setDemoConfig] = useState({
    preventBodyScroll: true,
    closeOnEscape: true,
    closeOnClickOutside: true
  });

  const deviceIcon = sidebar.isMobile ? Smartphone : sidebar.isTablet ? Tablet : Monitor;

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                🛡️ Sidebar Seguro - Demo Interativa
              </h1>
              <p className="text-slate-600 mt-1">
                Demonstração completa do sistema de sidebar com prevenção de memory leaks
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              {React.createElement(deviceIcon, { className: "w-4 h-4" })}
              <span>
                {sidebar.isMobile ? 'Mobile' : sidebar.isTablet ? 'Tablet' : 'Desktop'}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Controles do Sidebar
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Status do Sidebar
                </label>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  sidebar.isOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {sidebar.isOpen ? 'Aberto' : 'Fechado'}
                </span>
              </div>

              <div className="flex space-x-2">
                <PrimaryButton
                  onClick={sidebar.toggle}
                  icon={sidebar.isOpen ? X : Menu}
                  size="sm"
                  className="flex-1"
                >
                  {sidebar.isOpen ? 'Fechar' : 'Abrir'}
                </PrimaryButton>
                
                <TertiaryButton
                  onClick={() => {
                    sidebar.open();
                    toast.success('Sidebar aberto programaticamente');
                  }}
                  size="sm"
                >
                  Abrir
                </TertiaryButton>
                
                <TertiaryButton
                  onClick={() => {
                    sidebar.close();
                    toast.success('Sidebar fechado programaticamente');
                  }}
                  size="sm"
                >
                  Fechar
                </TertiaryButton>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 rounded p-3">
                <strong>Atalhos:</strong><br />
                • ESC: Fechar sidebar<br />
                • Click fora: Fechar sidebar<br />
                • Resize para desktop: Auto fechar
              </div>
            </div>
          </div>

          {/* Device Info */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-semibold mb-4">
              📱 Informações do Dispositivo
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Largura da tela:</span>
                <span className="text-sm font-medium">{window.innerWidth}px</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Tipo:</span>
                <span className="text-sm font-medium">
                  {sidebar.isMobile ? '📱 Mobile' : sidebar.isTablet ? '📟 Tablet' : '🖥️ Desktop'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Overlay ativo:</span>
                <span className={`text-sm font-medium ${
                  sidebar.shouldShowOverlay ? 'text-green-600' : 'text-slate-400'
                }`}>
                  {sidebar.shouldShowOverlay ? '✅ Sim' : '❌ Não'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Scroll do body:</span>
                <span className={`text-sm font-medium ${
                  document.body.style.overflow === 'hidden' ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {document.body.style.overflow === 'hidden' ? '🔒 Bloqueado' : '✅ Normal'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Demo */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            ⚙️ Configuração e Testes
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {Object.entries(demoConfig).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setDemoConfig(prev => ({
                    ...prev,
                    [key]: e.target.checked
                  }))}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                // Simulate click outside
                document.dispatchEvent(new MouseEvent('mousedown', {
                  bubbles: true,
                  clientX: window.innerWidth / 2,
                  clientY: window.innerHeight / 2
                }));
                toast.info('Simulando click fora do sidebar');
              }}
              className="p-3 text-left rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="font-medium text-sm">🖱️ Simular Click Fora</div>
              <div className="text-xs text-slate-500 mt-1">
                Testa o comportamento de fechamento automático
              </div>
            </button>

            <button
              onClick={() => {
                // Simulate escape key
                document.dispatchEvent(new KeyboardEvent('keydown', {
                  key: 'Escape',
                  bubbles: true
                }));
                toast.info('Simulando tecla ESC');
              }}
              className="p-3 text-left rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="font-medium text-sm">⌨️ Simular ESC</div>
              <div className="text-xs text-slate-500 mt-1">
                Testa o fechamento por teclado
              </div>
            </button>
          </div>
        </div>

        {/* Memory Leak Prevention Info */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-green-800">
            🛡️ Prevenção de Memory Leaks Ativa
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-green-700 mb-2">✅ Proteções Implementadas:</h3>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Event listeners com cleanup automático</li>
                <li>• Estado seguro com verificação de mount</li>
                <li>• Timers cancelados no unmount</li>
                <li>• Body scroll restaurado automaticamente</li>
                <li>• Refs nullificados na limpeza</li>
                <li>• AbortController para requests</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-blue-700 mb-2">🎯 Funcionalidades Seguras:</h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Responsive breakpoints automáticos</li>
                <li>• Keyboard navigation (ESC, Tab)</li>
                <li>• Click outside detection</li>
                <li>• Body scroll management</li>
                <li>• ARIA labels para acessibilidade</li>
                <li>• Focus management seguro</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-4">
            💻 Exemplo de Uso
          </h2>
          
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-green-400">
              <code>{`// Import do hook seguro
import { useSafeSidebar } from '@/hooks/useSafeSidebar';

// No componente
const sidebar = useSafeSidebar({
  breakpoint: 1024,
  preventBodyScroll: true,
  closeOnEscape: true,
  closeOnClickOutside: true
});

// Uso no JSX
<div ref={sidebar.sidebarRef}>
  <aside className={\`\${sidebar.isOpen ? 'open' : 'closed'}\`}>
    <button onClick={sidebar.close}>×</button>
    {/* Conteúdo do sidebar */}
  </aside>
</div>

// Funções disponíveis
sidebar.open()    // Abrir
sidebar.close()   // Fechar  
sidebar.toggle()  // Alternar
sidebar.isOpen    // Estado atual`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
