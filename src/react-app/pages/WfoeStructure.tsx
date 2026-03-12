import { useState } from 'react';
import { 
  Target, 
  Building2, 
  DollarSign, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  CreditCard,
  Database,
  Truck,
  Zap,
  Calendar,
  Globe,
  ArrowRight,
  Star,
  Factory,
  Eye,
  TrendingUp,
  Package
} from 'lucide-react';
import StatusIndicator from '@/react-app/components/StatusIndicator';

export default function WfoeStructure() {
  const [selectedSection, setSelectedSection] = useState('overview');

  // Updated corporate structure with THALAMUS branding
  const corporateStructure = {
    levels: [
      {
        id: 'pj-br',
        name: '🇧🇷 PJ Brasil',
        type: 'Controladora',
        description: 'Pessoa jurídica brasileira controladora do grupo',
        status: 'active'
      },
      {
        id: 'hk-holdco',
        name: '🇭🇰 THALAMUS HOLDINGS (HK) LIMITED',
        type: 'Hong Kong Holding Company',
        description: 'Hub financeiro/fiscal - Repatriação, compliance fiscal e relacionamento bancário',
        status: 'active'
      },
      {
        id: 'wfoe',
        name: '🇨🇳 WFOE Shenzhen (THALAMUS)',
        type: 'Wholly Foreign-Owned Enterprise',
        description: 'Interface neural do MUNDÃO no Oriente - Fapiao, import/export, contratos OEM',
        status: 'incorporating'
      }
    ]
  };

  // Financial structure details
  const financialStructure = {
    capitalInicial: {
      total: '¥1.350.000',
      equivalent: '~R$1.050.000',
      breakdown: [
        { item: 'Ciclo operacional (compra, frete, nacionalização)', value: '¥700.000' },
        { item: 'Fundo para habilitação de crédito futuro', value: '¥200.000' },
        { item: 'Certificações (INMETRO, ANATEL, ANVISA)', value: '¥150.000' },
        { item: 'MVP neural com QR, NFC, NFTs e IA embarcada', value: '¥100.000' }
      ]
    },
    bancosRecomendados: [
      'ICBC, HSBC, Bank of China',
      'Wise Business para remessas rápidas (< USD 100 mil)',
      'SWIFT direto para grandes valores'
    ]
  };

  // Operational cycle - 6 months
  const operationalCycle = {
    duration: '6 meses',
    steps: [
      'Compra de fornecedores OEM (China)',
      'Exportação com invoice da WFOE',
      'Nacionalização Brasil',
      'Venda via App MUNDÃO (B2C) ou Franquias (B2B)',
      'Geração de lucro líquido',
      'Reinvestimento de 70%',
      'Após 2 ciclos: habilitação para crédito comercial local'
    ],
    expectedResult: 'Ciclo autossustentável, com geração de dados, margem e previsibilidade de caixa'
  };

  // Product verticals and SKUs
  const productVerticals = [
    {
      vertical: 'RÃO / Food',
      skus: ['Embalagens QR/NFC', 'Nori', 'Hashi', 'Sacola com Lacre'],
      description: 'Cada SKU = um neurônio da rede neural do MUNDÃO'
    },
    {
      vertical: 'Logística',
      skus: ['Smart Lockers tokenizáveis'],
      description: 'Infraestrutura inteligente conectada'
    },
    {
      vertical: 'Pet Tech',
      skus: ['Coleiras GPS', 'Bebedouros', 'Brinquedos'],
      description: 'Produtos inteligentes para pets'
    },
    {
      vertical: 'Fitness (V4L)',
      skus: ['Luvas', 'Straps', 'Elásticos', 'Kits'],
      description: 'Equipamentos fitness conectados'
    },
    {
      vertical: 'Infantil',
      skus: ['Brinquedos', 'Roupas', 'Maquiagem', 'IoT Kids'],
      description: 'Produtos infantis com tecnologia'
    }
  ];

  // Neural architecture details
  const neuralArchitecture = {
    concept: 'Cada produto vendido ou escaneado ativa um slot neural no app, criando padrões de comportamento, fidelidade e recomendação futura',
    motorCortex: [
      'Coordena slots por vertical',
      'Reage com IA a compras, QR, missão e recompra',
      'Usa dados de uso para sugerir recompensas personalizadas'
    ],
    example: 'Compra de brinquedo → NFT de recompensa → Cupom para roupa infantil',
    technology: [
      'QR Codes dinâmicos',
      'NFC físico nos produtos',
      'NFT colecionável',
      'Tokens simbólicos integrados'
    ]
  };

  // Expected results
  const expectedResults = [
    { metric: 'Redução de custo de insumos', value: 'até 60%' },
    { metric: 'Margem líquida', value: '24–38%', note: 'mesmo com nacionalização' },
    { metric: 'Base de crédito', value: 'ativada após 2 ciclos' },
    { metric: 'Slot neural', value: 'ativo por SKU', note: 'recompensa e narrativa contínua' },
    { metric: 'Dados preditivos', value: 'geração para IA do app' },
    { metric: 'Escalabilidade', value: 'base para expansão internacional' }
  ];

  // Risk mitigation matrix
  const riskMitigation = [
    {
      risk: 'Endereço falso',
      mitigation: 'Contrato real de locação e foto documental'
    },
    {
      risk: 'Travamento cambial',
      mitigation: 'Holding HK como buffer entre moedas'
    },
    {
      risk: 'Produto não conforme',
      mitigation: 'Cláusula OEM + inspeção SGS'
    },
    {
      risk: 'Bitributação',
      mitigation: 'Holding HK + tratado Brasil–China'
    },
    {
      risk: 'Travas tributárias locais',
      mitigation: 'Split e substituição tributária planejada'
    },
    {
      risk: 'Risco de estoque',
      mitigation: 'Compras fracionadas com reinvestimento gradual'
    }
  ];

  

  const sections = [
    { id: 'overview', name: 'Visão Geral', icon: Target },
    { id: 'structure', name: 'Estrutura Financeira', icon: DollarSign },
    { id: 'cycle', name: 'Ciclo Operacional', icon: Calendar },
    { id: 'products', name: 'Produtos & Verticais', icon: Package },
    { id: 'neural', name: 'Arquitetura Neural', icon: Zap },
    { id: 'results', name: 'Resultados Esperados', icon: TrendingUp },
    { id: 'risks', name: 'Riscos & Mitigações', icon: AlertTriangle }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-800 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Target className="w-8 h-8" />
                <h1 className="text-3xl font-bold">THALAMUS HOLDINGS — Expansão Internacional</h1>
              </div>
              <p className="text-purple-100 text-lg mb-4">
                🧠 Interface Neural do MUNDÃO no Oriente — Relatório Executivo Grupo RÃO
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>PJ Brasil → HK → WFOE Shenzhen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>¥1.350.000 Capital Inicial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Arquitetura Neural MUNDÃO</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">90k</div>
              <div className="text-purple-100">Unidades 1º Lote</div>
              <div className="text-xs text-purple-300 mt-1">QR/NFC + IA</div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                    selectedSection === section.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium text-sm">{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Section */}
        {selectedSection === 'overview' && (
          <div className="space-y-6">
            {/* Corporate Structure Flow */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">🏛️ Estrutura Societária e Jurídica</h2>
              <div className="space-y-4">
                {corporateStructure.levels.map((level, index) => (
                  <div key={level.id} className="flex items-center space-x-4">
                    {index > 0 && <ArrowRight className="w-5 h-5 text-slate-400" />}
                    <div className="flex-1 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900">{level.name}</h3>
                        <StatusIndicator 
                          status={level.status === 'active' ? 'success' : level.status === 'incorporating' ? 'warning' : 'info'} 
                          text={level.status} 
                        />
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{level.type}</p>
                      <p className="text-sm text-slate-700">{level.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Benefits */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">🎯 Benefícios da Estrutura</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">WFOE permite:</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Emissão de faturas (fapiao)</li>
                    <li>• Importação direta</li>
                    <li>• Contratação local</li>
                    <li>• Assinatura de contratos OEM</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">Holding HK facilita:</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Fluxo cambial com menor carga tributária</li>
                    <li>• Redução de risco de bitributação</li>
                    <li>• Múltiplas contas internacionais</li>
                    <li>• Buffer cambial entre moedas</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">🧠 Conceito Central</h4>
                <p className="text-sm text-blue-700">
                  Transição do modelo de compra por terceiros para um sistema de abastecimento neural próprio, 
                  conectado ao app MUNDÃO com ganho de margem, acesso a crédito chinês e cadeia autônoma inteligente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Structure Section */}
        {selectedSection === 'structure' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">💰 Estrutura Financeira e Bancária</h2>
            
            {/* Capital Breakdown */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-slate-800">Capital Inicial Recomendado</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{financialStructure.capitalInicial.total}</div>
                  <div className="text-sm text-slate-600">{financialStructure.capitalInicial.equivalent}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {financialStructure.capitalInicial.breakdown.map((item, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 flex-1">{item.item}</span>
                      <span className="font-semibold text-slate-900 ml-2">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banking Strategy */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-3">🏦 Bancos Recomendados:</h4>
              <ul className="space-y-2">
                {financialStructure.bancosRecomendados.map((banco, index) => (
                  <li key={index} className="text-sm text-slate-700 flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>{banco}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>Holding HK atua como buffer cambial</strong> - reduzindo riscos de flutuação e facilitando remessas internacionais.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Operational Cycle Section */}
        {selectedSection === 'cycle' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">🔁 Ciclo Operacional — {operationalCycle.duration}</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 mb-4">Etapas do Ciclo:</h3>
              <div className="space-y-3">
                {operationalCycle.steps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">🎯 Resultado Esperado:</h4>
              <p className="text-sm text-green-700">{operationalCycle.expectedResult}</p>
            </div>

            {/* Visual Flow */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Factory className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-blue-800">Compra OEM</h4>
                <p className="text-xs text-blue-600">Fornecedores China</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Truck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-purple-800">Exportação</h4>
                <p className="text-xs text-purple-600">Invoice WFOE</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-green-800">Venda MUNDÃO</h4>
                <p className="text-xs text-green-600">B2C / B2B</p>
              </div>
            </div>
          </div>
        )}

        {/* Products & Verticals Section */}
        {selectedSection === 'products' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">📦 Produtos e Verticais</h2>
            
            <div className="mb-6 bg-blue-50 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">🧠 Conceito Neural</h3>
              <p className="text-sm text-blue-700">
                <strong>Cada SKU = um neurônio da rede neural do MUNDÃO.</strong> 
                Total estimado 1º lote: ~90.000 unidades. Todos com QR/NFC integrados ao app MUNDÃO + IA.
              </p>
            </div>

            <div className="space-y-4">
              {productVerticals.map((vertical, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{vertical.vertical}</h3>
                      <p className="text-sm text-slate-600 mt-1">{vertical.description}</p>
                    </div>
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {vertical.skus.map((sku, skuIndex) => (
                      <span key={skuIndex} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {sku}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Technology Integration */}
            <div className="mt-6 bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-800 mb-3">🔧 Tecnologia Embarcada em Todos os SKUs:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <Zap className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <span className="text-xs text-purple-700">QR Dinâmicos</span>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <span className="text-xs text-purple-700">NFC Físico</span>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <span className="text-xs text-purple-700">NFT Colecionável</span>
                </div>
                <div className="text-center">
                  <Database className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <span className="text-xs text-purple-700">Tokens Integrados</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Neural Architecture Section */}
        {selectedSection === 'neural' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">🧠 Arquitetura Neural — MUNDÃO + THALAMUS</h2>
            
            {/* Core Concept */}
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
              <h3 className="font-bold text-slate-800 mb-3">💡 Conceito Central</h3>
              <p className="text-slate-700 mb-4">{neuralArchitecture.concept}</p>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">📱 Exemplo de Fluxo Neural:</h4>
                <p className="text-sm text-purple-700">{neuralArchitecture.example}</p>
              </div>
            </div>

            {/* Motor CORTEX³ */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 mb-4">⚡ Motor CORTEX³:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {neuralArchitecture.motorCortex.map((feature, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-slate-800">Motor {index + 1}</span>
                    </div>
                    <p className="text-sm text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack */}
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-semibold text-slate-800 mb-4">🔧 Stack Tecnológico Embarcado:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {neuralArchitecture.technology.map((tech, index) => (
                  <div key={index} className="text-center p-3 bg-white rounded-lg border border-slate-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vision Statement */}
            <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
              <h4 className="font-bold text-xl mb-2">🌟 Visão Estratégica</h4>
              <p className="text-blue-100 mb-4">
                "A <strong>THALAMUS</strong> não é só uma empresa chinesa. É a <strong>interface neural do MUNDÃO no Oriente</strong>."
              </p>
              <ul className="space-y-1 text-sm text-blue-100">
                <li>• Cria inteligência logística + simbólica</li>
                <li>• Conecta storytelling com performance</li>
                <li>• Gera margem com dado, recorrência e reputação</li>
                <li>• Permite escalar com crédito, NFT ou tokenização</li>
              </ul>
            </div>
          </div>
        )}

        {/* Expected Results Section */}
        {selectedSection === 'results' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">📈 Resultados Esperados</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expectedResults.map((result, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-slate-800">{result.metric}</h3>
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">{result.value}</div>
                  {result.note && (
                    <p className="text-xs text-slate-600">{result.note}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="mt-8 bg-green-50 rounded-lg p-6">
              <h3 className="font-bold text-green-800 mb-4">🎯 Métricas de Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-700 mb-3">Financeiro:</h4>
                  <ul className="space-y-2 text-sm text-green-600">
                    <li>• Redução de custo de insumos até 60%</li>
                    <li>• Margem líquida 24-38% mesmo com nacionalização</li>
                    <li>• Base de crédito ativada após 2 ciclos</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-700 mb-3">Tecnológico:</h4>
                  <ul className="space-y-2 text-sm text-green-600">
                    <li>• Slot neural ativo por SKU</li>
                    <li>• Geração de dados preditivos para IA</li>
                    <li>• Base escalável para expansão internacional</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Strategic Impact */}
            <div className="mt-6 bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-800 mb-3">🚀 Impacto Estratégico</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">6M</div>
                  <p className="text-sm text-blue-700">Ciclo operacional autossustentável</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">90k</div>
                  <p className="text-sm text-blue-700">Unidades 1º lote com IA</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">∞</div>
                  <p className="text-sm text-blue-700">Escalabilidade neural</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Management Section */}
        {selectedSection === 'risks' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">⚠️ Riscos & Mitigações</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Risco</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-700">Mitigação Estratégica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {riskMitigation.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span className="font-medium text-red-800">{item.risk}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-green-700">{item.mitigation}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Risk Assessment Matrix */}
            <div className="mt-6 bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-3">🎯 Foco na Mitigação</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-red-800">Alto Risco</div>
                  <div className="text-xs text-red-600">Endereço, Bitributação</div>
                </div>
                <div className="text-center p-3 bg-yellow-100 rounded-lg">
                  <Eye className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-yellow-800">Médio Risco</div>
                  <div className="text-xs text-yellow-600">Câmbio, Produto</div>
                </div>
                <div className="text-center p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-green-800">Controlado</div>
                  <div className="text-xs text-green-600">Estrutura HK, SGS</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Executive Conclusion */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">✅ Conclusão Executiva</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">🎯 Síntese Estratégica</h3>
              <p className="text-blue-100 mb-4">
                A expansão do Grupo RÃO na China através da estrutura THALAMUS representa a evolução 
                de um modelo de compra terceirizada para um <strong>sistema neural próprio</strong> de abastecimento inteligente.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm">¥1.350.000 capital estruturado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm">90k unidades 1º lote com IA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm">Ciclo autossustentável 6 meses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-sm">Margem 24-38% com nacionalização</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-xl mb-4">🧠 Visão Transformacional</h3>
              <div className="bg-white/10 rounded-lg p-4 mb-4">
                <p className="text-center text-lg font-medium mb-2">
                  "TensorChain antecipa.<br />
                  Thalamus executa.<br />
                  MUNDÃO conecta."
                </p>
              </div>
              
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• <strong>Inteligência logística + simbólica</strong></li>
                <li>• <strong>Storytelling conectado com performance</strong></li>
                <li>• <strong>Margem + dados + recorrência + reputação</strong></li>
                <li>• <strong>Escalabilidade via crédito, NFT e tokenização</strong></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="text-4xl font-bold mb-2">🚀</div>
            <p className="text-lg font-medium">
              A <strong>THALAMUS</strong> não é apenas uma empresa chinesa.<br />
              É a <strong>interface neural do MUNDÃO no Oriente</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
