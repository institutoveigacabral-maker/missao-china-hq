import { useState } from 'react';
import { 
  Shield, 
  Factory, 
  Globe,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Award,
  Zap,
  Eye,
  Edit,
  Share,
  Bookmark,
  MapPin,
  Wifi,
  Bluetooth,
  Battery,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
  Camera,
  Upload,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useToast } from '@/react-app/components/ui/Toast';

interface SkuDetailCardProps {
  sku: {
    sku_code: string;
    product_name: string;
    product_category: string;
    description?: string;
    technical_specs?: string;
    regulatory_status: string;
    
    risk_category: string;
    target_markets?: string;
    vertical?: string;
    priority?: string;
    icon?: string;
    product_image?: string;
    is_active: boolean;
  };
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onEdit?: () => void;
  className?: string;
}

export default function SkuDetailCard({ 
  sku, 
  isExpanded = false, 
  onToggleExpand, 
  onEdit,
  className = '' 
}: SkuDetailCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const toast = useToast();

  // Smart Home products data from the provided vertical
  const smartHomeProducts: Record<string, any> = {
    'CASA-001': {
      name: 'Smart Lamp RÃO',
      priority: 'Low',
      icon: '💡',
      description: 'Lâmpada Wi-Fi controlável por aplicativo e comandos de voz (Alexa, Google Home). Permite criação de rotinas de iluminação inteligente e economia de energia. Produto de alto giro, fácil homologação e margem sólida. Representa a porta de entrada do consumidor para o ecossistema Casa Inteligente.',
      tech_specs: 'Wi-Fi 2.4GHz, LED 9W, 800 lumens, Alexa/Google compatible, Life span 25,000h',
      connectivity: ['Wi-Fi', 'Voice Control'],
      estimated_price: '$12-18',
      moq: '500 units',
      lead_time: '15-20 days'
    },
    'CASA-002': {
      name: 'Smart Switch RÃO',
      priority: 'Low',
      icon: '⚡',
      description: 'Interruptor touch Wi-Fi de embutir, compatível com hubs Zigbee. Facilita retrofit de instalações elétricas convencionais sem necessidade de reforma. Integra-se ao app MUNDÃO para controle centralizado e automações neurais. Foco em OEMs da Fase 1 da Canton Fair.',
      tech_specs: 'Zigbee 3.0, Wi-Fi 2.4GHz, Touch panel, 16A max load, Wall mounting',
      connectivity: ['Wi-Fi', 'Zigbee'],
      estimated_price: '$8-15',
      moq: '1000 units',
      lead_time: '12-18 days'
    },
    'CASA-003': {
      name: 'Sensor de Presença Ceiling',
      priority: 'Low',
      icon: '👁️',
      description: 'Sensor de presença embutido no teto com ajuste de sensibilidade e timer. Permite automação de iluminação e segurança em áreas comuns. Atrativo para o ecossistema Casa por reduzir consumo energético. Ideal para integrar sensores IoT de base e dados de comportamento residencial.',
      tech_specs: 'PIR sensor, 6m range, 360° detection, Ceiling mount, Battery backup',
      connectivity: ['Wi-Fi', 'BLE'],
      estimated_price: '$15-25',
      moq: '500 units',
      lead_time: '20-25 days'
    },
    'CASA-004': {
      name: 'Painel LED Wi-Fi',
      priority: 'Low',
      icon: '📱',
      description: 'Painel de iluminação plana com conectividade e controle de intensidade. Design ultrafino e baixo consumo, ideal para retrofit em ambientes residenciais. Produto com alta aceitação global e facilidade de certificação no Brasil. Permite storytelling de eficiência e conforto sob comando da IA MUNDÃO.',
      tech_specs: 'LED Panel 300x300mm, 24W, Wi-Fi control, Dimming 1-100%, Ultra-thin 15mm',
      connectivity: ['Wi-Fi'],
      estimated_price: '$25-40',
      moq: '200 units',
      lead_time: '18-25 days'
    },
    'CASA-005': {
      name: 'Luminária de Mesa Touch',
      priority: 'Low',
      icon: '🏮',
      description: 'Luminária de mesa com ajuste de brilho por toque e porta USB de carregamento. Foco em design, praticidade e uso diário, reforçando presença da marca RÃO Home. Produto leve, ideal para OEM branding e kits promocionais. Interesse por volume e versatilidade de aplicação.',
      tech_specs: 'Touch control, USB charging port, 3 brightness levels, LED 5W, Modern design',
      connectivity: ['USB'],
      estimated_price: '$18-28',
      moq: '300 units',
      lead_time: '15-20 days'
    },
    'CASA-015': {
      name: 'Central de Controle Casarão',
      priority: 'Low',
      icon: '🏠',
      description: 'Hub integrador de dispositivos IoT (Zigbee/Wi-Fi) para controle total da casa. É o cérebro do ecossistema Casa Inteligente RÃO. Conecta sensores, luzes e eletros à IA MUNDÃO. Produto de alto valor simbólico, com OEM direto de Shenzhen Phase 1.',
      tech_specs: 'Zigbee 3.0 Hub, Wi-Fi 6, 128MB RAM, Support 100+ devices, Voice control',
      connectivity: ['Wi-Fi', 'Zigbee', 'Ethernet'],
      estimated_price: '$45-65',
      moq: '100 units',
      lead_time: '25-30 days'
    },
    'CASA-021': {
      name: 'Aspirador Robô Smart',
      priority: 'Medium',
      icon: '🤖',
      description: 'Robô autônomo com mapeamento LIDAR e Wi-Fi. Produto hero da linha Home Premium RÃO. Apelo emocional, automação real e branding forte. Margem média-alta e integração futura com IA doméstica Córtex.',
      tech_specs: 'LIDAR mapping, Wi-Fi control, 2200Pa suction, 150min runtime, Auto-charging',
      connectivity: ['Wi-Fi', 'App Control'],
      estimated_price: '$180-280',
      moq: '50 units',
      lead_time: '30-40 days'
    }
  };

  // Get enhanced product data
  const productData = smartHomeProducts[sku.sku_code] || {
    name: sku.product_name,
    priority: sku.risk_category === 'low' ? 'Low' : sku.risk_category === 'high' ? 'High' : 'Medium',
    icon: '📦',
    description: sku.description || 'Produto IoT da vertical Casa Inteligente',
    tech_specs: sku.technical_specs || 'Especificações técnicas não disponíveis',
    connectivity: ['Wi-Fi'],
    estimated_price: '$20-35',
    moq: '500 units',
    lead_time: '20-25 days'
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'certified':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
      case 'testing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'blocked':
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  const getConnectivityIcon = (tech: string) => {
    switch (tech.toLowerCase()) {
      case 'wi-fi':
      case 'wifi':
        return <Wifi className="w-3 h-3" />;
      case 'bluetooth':
      case 'ble':
        return <Bluetooth className="w-3 h-3" />;
      case 'zigbee':
        return <Zap className="w-3 h-3" />;
      case 'usb':
        return <Battery className="w-3 h-3" />;
      default:
        return <Settings className="w-3 h-3" />;
    }
  };

  const handleCopySkuCode = () => {
    navigator.clipboard.writeText(sku.sku_code);
    toast.actionCompleted(`SKU ${sku.sku_code} copiado`);
  };

  const handleShare = () => {
    const shareText = `${sku.sku_code} - ${productData.name}\n${productData.description.substring(0, 100)}...`;
    navigator.clipboard.writeText(shareText);
    toast.actionCompleted('Informações copiadas para compartilhar');
  };

  const handleImageUpload = () => {
    setShowImageUpload(!showImageUpload);
    toast.info('Funcionalidade de upload em desenvolvimento');
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left section - Product info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">{productData.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <button
                    onClick={handleCopySkuCode}
                    className="font-mono text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
                    title="Clique para copiar"
                  >
                    {sku.sku_code}
                  </button>
                  <Copy className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                  {productData.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(productData.priority)}`}>
                    🔹 {productData.priority}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {sku.product_category}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRiskColor(sku.risk_category)}`}>
                    {sku.risk_category} risk
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              {productData.description}
            </p>

            {/* Connectivity tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs text-slate-600 font-medium">Conectividade:</span>
              {productData.connectivity.map((tech: string, index: number) => (
                <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                  {getConnectivityIcon(tech)}
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right section - Image and actions */}
          <div className="flex flex-col items-center space-y-3 flex-shrink-0">
            {/* Product image */}
            <div className="relative group">
              <div className="w-32 h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden">
                {sku.product_image && !imageError ? (
                  <img
                    src={sku.product_image}
                    alt={productData.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs text-slate-500">Sem imagem</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleImageUpload}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
              >
                <Upload className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Compartilhar"
              >
                <Share className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Favoritar"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200">
          <div className="text-center">
            <div className="text-sm font-bold text-slate-900">{productData.estimated_price}</div>
            <div className="text-xs text-slate-600">Preço FOB</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-slate-900">{productData.moq}</div>
            <div className="text-xs text-slate-600">MOQ</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-slate-900">{productData.lead_time}</div>
            <div className="text-xs text-slate-600">Lead Time</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              {getStatusIcon(sku.regulatory_status)}
              <span className="text-sm font-bold text-slate-900">{sku.regulatory_status}</span>
            </div>
            <div className="text-xs text-slate-600">Status</div>
          </div>
        </div>

        {/* Expand toggle */}
        {onToggleExpand && (
          <div className="flex justify-center mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={onToggleExpand}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <span>{isExpanded ? 'Menos detalhes' : 'Mais detalhes'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Technical Specifications */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2 text-blue-600" />
              Especificações Técnicas
            </h4>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                {productData.tech_specs}
              </p>
            </div>
          </div>

          {/* Status Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                Status Regulatório
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Certificação:</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(sku.regulatory_status)}
                    <span className="text-sm font-medium">{sku.regulatory_status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Documentação:</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon('pending')}
                    <span className="text-sm font-medium">pending</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                <Globe className="w-4 h-4 mr-2 text-purple-600" />
                Mercados Alvo
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">
                    {sku.target_markets || 'Brasil, Portugal'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                  <Target className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">
                    Consumidor final, B2B
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Eye className="w-4 h-4" />
              <span>Ver Análise Completa</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
              <Factory className="w-4 h-4" />
              <span>Buscar Fornecedores</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
              <Award className="w-4 h-4" />
              <span>Certificação</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
              <ExternalLink className="w-4 h-4" />
              <span>Ficha Técnica</span>
            </button>
          </div>
        </div>
      )}

      {/* Image upload modal */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Upload de Imagem do Produto</h3>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">Arraste uma imagem ou clique para selecionar</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Selecionar Arquivo
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowImageUpload(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
