import React from 'react';
import { Command } from 'cmdk';
import { 
  Package, 
  Factory, 
  Shield, 
  Truck, 
  Home, 
  BookOpen, 
  MapPin,
  FileText,
  DollarSign,
  Building,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { useAppContext } from '@/react-app/contexts/AppContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  type: 'page' | 'action' | 'data' | 'feature';
  keywords: string[];
  priority: number;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setSelectedSKU, setSelectedRegulation, refreshData } = useAppContext();
  const [query, setQuery] = React.useState('');

  // ESC to close
  useHotkeys('escape', () => {
    if (isOpen) onClose();
  }, { enabled: isOpen });

  // Build command items
  const commands: CommandItem[] = [
    // Navigation Commands
    {
      id: 'home',
      title: 'Command Center',
      subtitle: 'Navegar',
      description: 'Dashboard principal com métricas e alertas críticos',
      icon: Home,
      action: () => navigate('/'),
      type: 'page',
      keywords: ['home', 'dashboard', 'inicio', 'principal'],
      priority: 100
    },
    {
      id: 'playbook',
      title: 'Playbook Técnico',
      subtitle: 'Navegar',
      description: 'Base de SKUs IoT e especificações completas',
      icon: BookOpen,
      action: () => navigate('/playbook'),
      type: 'page',
      keywords: ['playbook', 'skus', 'produtos', 'especificacoes'],
      priority: 90
    },
    {
      id: 'regulations',
      title: 'Normas 2025',
      subtitle: 'Navegar',
      description: 'Compêndio de regulamentações críticas BR/UE',
      icon: Shield,
      action: () => navigate('/regulations'),
      type: 'page',
      keywords: ['regulations', 'normas', 'compliance', 'anatel'],
      priority: 85
    },
    {
      id: 'suppliers',
      title: 'Fornecedores OEM/ODM',
      subtitle: 'Navegar',
      description: 'Catálogo completo com scores e auditoria',
      icon: Factory,
      action: () => navigate('/suppliers'),
      type: 'page',
      keywords: ['suppliers', 'fornecedores', 'oem', 'odm'],
      priority: 80
    },
    {
      id: 'canton-fair',
      title: 'Canton Fair 138ª',
      subtitle: 'Navegar',
      description: 'Mapa interativo com SKUs por fase e área',
      icon: MapPin,
      action: () => navigate('/canton-fair'),
      type: 'page',
      keywords: ['canton', 'fair', 'mapa', 'fases'],
      priority: 75
    },
    {
      id: 'logistics',
      title: 'Logística CN→BR/PT',
      subtitle: 'Navegar',
      description: 'Rotas, custos e lead times otimizados',
      icon: Truck,
      action: () => navigate('/logistics'),
      type: 'page',
      keywords: ['logistics', 'logistica', 'rotas', 'custos'],
      priority: 70
    },
    {
      id: 'finance',
      title: 'Tributação & Custos',
      subtitle: 'Navegar',
      description: 'Simulador landed cost BR/PT',
      icon: DollarSign,
      action: () => navigate('/finance'),
      type: 'page',
      keywords: ['finance', 'tributacao', 'custos', 'impostos'],
      priority: 65
    },
    {
      id: 'wfoe',
      title: 'WFOE China',
      subtitle: 'Navegar',
      description: 'Estrutura societária e operacional',
      icon: Building,
      action: () => navigate('/wfoe-structure'),
      type: 'page',
      keywords: ['wfoe', 'china', 'estrutura', 'societaria'],
      priority: 60
    },
    {
      id: 'risk',
      title: 'Risk Register',
      subtitle: 'Navegar',
      description: 'Gestão de riscos operacionais e estratégicos',
      icon: AlertTriangle,
      action: () => navigate('/risk-register'),
      type: 'page',
      keywords: ['risk', 'riscos', 'gestao', 'mitigacao'],
      priority: 60
    },

    // Action Commands
    {
      id: 'refresh-data',
      title: 'Atualizar Dados',
      subtitle: 'Ação',
      description: 'Recarregar todos os dados do sistema',
      icon: ArrowRight,
      action: () => {
        refreshData();
        onClose();
      },
      type: 'action',
      keywords: ['refresh', 'reload', 'atualizar', 'dados'],
      priority: 50
    },
    {
      id: 'export-skus',
      title: 'Exportar SKUs',
      subtitle: 'Ação',
      description: 'Download de relatório completo em TXT',
      icon: FileText,
      action: () => {
        window.open('/api/skus/export/txt', '_blank');
        onClose();
      },
      type: 'action',
      keywords: ['export', 'exportar', 'download', 'relatorio'],
      priority: 45
    },

    // Quick Access Commands
    {
      id: 'search-iot-temp',
      title: 'IOT-TEMP-001',
      subtitle: 'SKU Rápido',
      description: 'Acessar SKU IoT Temperature Sensor',
      icon: Package,
      action: () => {
        setSelectedSKU('IOT-TEMP-001');
        navigate('/playbook');
        onClose();
      },
      type: 'data',
      keywords: ['iot-temp-001', 'sensor', 'temperatura', 'iot'],
      priority: 40
    },
    {
      id: 'search-rfs',
      title: 'RFS-001',
      subtitle: 'SKU Rápido',
      description: 'Acessar SKU Food Service',
      icon: Package,
      action: () => {
        setSelectedSKU('RFS-001');
        navigate('/playbook');
        onClose();
      },
      type: 'data',
      keywords: ['rfs-001', 'food', 'service', 'alimentacao'],
      priority: 40
    },
    {
      id: 'anatel-reg',
      title: 'ANATEL VoLTE',
      subtitle: 'Regulamentação',
      description: 'Verificar status compliance ANATEL',
      icon: Shield,
      action: () => {
        setSelectedRegulation('ANATEL-VOLTE-2024');
        navigate('/regulations');
        onClose();
      },
      type: 'data',
      keywords: ['anatel', 'volte', 'brasil', 'telecomunicacoes'],
      priority: 35
    },

    // Feature Commands
    {
      id: 'neural-analysis',
      title: 'Análise Neural',
      subtitle: 'Funcionalidade',
      description: 'Ativar análise avançada com TensorChain',
      icon: Brain,
      action: () => {
        navigate('/playbook');
        onClose();
      },
      type: 'feature',
      keywords: ['neural', 'ia', 'analise', 'tensorchain'],
      priority: 30
    },
    {
      id: 'risk-matrix',
      title: 'Matriz de Risco',
      subtitle: 'Funcionalidade',
      description: 'Visualizar matriz de risco por SKU',
      icon: Target,
      action: () => {
        navigate('/risk-register');
        onClose();
      },
      type: 'feature',
      keywords: ['matriz', 'risco', 'visualizacao', 'sku'],
      priority: 25
    },
    {
      id: 'global-view',
      title: 'Visão Global',
      subtitle: 'Funcionalidade',
      description: 'Dashboard com visão 360° do ecossistema',
      icon: Globe,
      action: () => {
        navigate('/');
        onClose();
      },
      type: 'feature',
      keywords: ['global', 'visao', '360', 'dashboard'],
      priority: 25
    }
  ];

  // Filter commands based on query
  const filteredCommands = React.useMemo(() => {
    if (!query) return commands.slice(0, 8); // Show top commands when no query
    
    return commands
      .filter(cmd => 
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description.toLowerCase().includes(query.toLowerCase()) ||
        cmd.keywords.some(keyword => keyword.includes(query.toLowerCase()))
      )
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 8);
  }, [query, commands]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return ArrowRight;
      case 'action': return Sparkles;
      case 'data': return Package;
      case 'feature': return Brain;
      default: return ArrowRight;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-blue-100 text-blue-800';
      case 'action': return 'bg-green-100 text-green-800';
      case 'data': return 'bg-purple-100 text-purple-800';
      case 'feature': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setQuery('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <Command.Dialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200"
        label="Command Palette"
      >
        {/* Header */}
        <div className="flex items-center border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg mr-4 flex-shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Digite um comando ou navegue..."
            className="flex-1 text-lg outline-none placeholder-slate-400 bg-transparent font-medium"
            autoFocus
          />
          <div className="flex items-center space-x-2 ml-4">
            <kbd className="hidden sm:inline-block text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border font-mono">
              ESC
            </kbd>
          </div>
        </div>

        {/* Commands List */}
        <Command.List className="max-h-96 overflow-y-auto p-2">
          <Command.Empty className="py-12 text-center text-slate-500">
            <div className="space-y-4">
              <Brain className="w-12 h-12 mx-auto text-slate-300" />
              <div>
                <p className="text-lg font-medium text-slate-700 mb-2">Nenhum comando encontrado</p>
                <p className="text-sm text-slate-500">Tente: "playbook", "suppliers", "export"</p>
              </div>
            </div>
          </Command.Empty>

          {filteredCommands.map((cmd) => {
            const IconComponent = cmd.icon;
            const TypeIcon = getTypeIcon(cmd.type);
            
            return (
              <Command.Item
                key={cmd.id}
                value={`${cmd.title} ${cmd.description} ${cmd.keywords.join(' ')}`}
                onSelect={() => cmd.action()}
                className="flex items-center px-4 py-3 rounded-lg hover:bg-blue-50 cursor-pointer group transition-colors duration-200 data-[selected=true]:bg-blue-50 outline-none"
              >
                {/* Main Icon */}
                <div className="flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mr-4 group-hover:bg-blue-100 transition-colors duration-200 flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-900">
                      {cmd.title}
                    </p>
                    {cmd.subtitle && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {cmd.subtitle}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 group-hover:text-slate-600 line-clamp-2">
                    {cmd.description}
                  </p>
                </div>

                {/* Type & Action */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(cmd.type)}`}>
                    <TypeIcon className="w-3 h-3 mr-1" />
                    {cmd.type}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </Command.Item>
            );
          })}
        </Command.List>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-gradient-to-r from-blue-50 to-violet-50">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="inline-flex items-center px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono">
                  ↑↓
                </kbd>
                <span>navegar</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="inline-flex items-center px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono">
                  ↵
                </kbd>
                <span>executar</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-3 h-3 text-blue-600" />
              <span className="font-medium text-blue-600">MUNDÃO Command Palette</span>
            </div>
          </div>
        </div>
      </Command.Dialog>
    </div>
  );
};

export default CommandPalette;
