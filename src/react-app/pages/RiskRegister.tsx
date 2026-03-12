import { useState } from 'react';
import { Search, Filter, AlertTriangle, Shield, TrendingUp, Eye, CheckCircle, Globe, DollarSign, Zap, Users, Brain, Lock } from 'lucide-react';
import { SecondaryButton } from '@/react-app/components/ui/Button';
import StatusIndicator from '@/react-app/components/StatusIndicator';

export default function RiskRegister() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Enhanced risk register with expanded risks
  const risks = [
    {
      id: 'RISK-001',
      category: 'Legal & Compliance',
      threat: 'Não-conformidade legal na China (invisível a olhos ocidentais)',
      impact: 'Critical',
      probability: 'Medium',
      severity: 'Critical',
      description: 'A legislação chinesa é dinâmica e apresenta zonas cinzentas que mudam com frequência, incluindo normas não escritas aplicadas caso a caso. Práticas como "endereço virtual com contrato fake" ou uso de trading companies de fachada são comuns, mas arriscadas.',
      specificRisks: [
        'Perda retroativa da licença',
        'Rejeição bancária ao abrir ou movimentar conta',
        'Sanções fiscais ou bloqueio da operação'
      ],
      currentControls: [
        'Parceria com consultoria com histórico validado',
        'Due diligence do endereço real e de cada contrato OEM',
        'Auditoria jurídica contínua da WFOE com escritório local'
      ],
      additionalActions: [
        'Implementar revisão legal mensal com advogados especializados',
        'Criar protocolo de compliance específico para operações WFOE',
        'Estabelecer linha direta com consultoria jurídica 24/7'
      ],
      owner: 'Legal & Compliance Team',
      dueDate: '2024-12-31',
      status: 'critical'
    },
    {
      id: 'RISK-002',
      category: 'Financial Structure',
      threat: 'Conflito entre WFOE e Holding HK',
      impact: 'High',
      probability: 'Medium',
      severity: 'High',
      description: 'Embora a Holding em HK traga eficiência tributária, há riscos de conflitos ou "interesse cruzado" entre os papéis da HK (financeiro) e da WFOE (operacional), especialmente em transferências financeiras.',
      specificRisks: [
        'Dificuldade para repatriar dividendos',
        'Problemas em auditorias fiscais cruzadas',
        'Exigência de documentação multilíngue retroativa'
      ],
      currentControls: [
        'Política clara de transfer pricing',
        'Separação contábil rigorosa entre as camadas',
        'Revisão jurídica trimestral entre HK ↔ CN'
      ],
      additionalActions: [
        'Automatizar sistema de reporting cross-jurisdictional',
        'Implementar blockchain para transparência de transferências',
        'Criar manual operacional HK-CN com workflows claros'
      ],
      owner: 'Finance Team',
      dueDate: '2025-01-31',
      status: 'active'
    },
    {
      id: 'RISK-003',
      category: 'Foreign Exchange',
      threat: 'Risco cambial e controle de divisas (Forex Control)',
      impact: 'High',
      probability: 'High',
      severity: 'High',
      description: 'A China possui controle rígido sobre entrada e saída de capital estrangeiro. Transações acima de US$ 50 mil precisam de justificativas legais e envolvem múltiplas aprovações. A instabilidade do yuan (CNY) e sua relação com o real (BRL) é pouco previsível.',
      specificRisks: [
        'Bloqueio de transferências internacionais',
        'Volatilidade extrema CNY/BRL',
        'Restrições de capital controls inesperadas'
      ],
      currentControls: [
        'Holding HK como buffer multi-moeda',
        'Uso de stablecoins para ciclos internos de crédito futuro (USDC)',
        'Criação de "fundo flutuante" em USD para cobrir volatilidade'
      ],
      additionalActions: [
        'Implementar hedging automático via algoritmos',
        'Diversificar em múltiplas stablecoins (USDC, USDT, DAI)',
        'Criar reserva cambial de emergência equivalente a 3 meses'
      ],
      owner: 'Treasury Team',
      dueDate: '2024-11-30',
      status: 'active'
    },
    {
      id: 'RISK-004',
      category: 'Technology Integration',
      threat: 'Desconexão entre lote físico e slot digital',
      impact: 'Critical',
      probability: 'Medium',
      severity: 'High',
      description: 'Se o produto físico chegar ao Brasil sem estar integrado ao slot neural do app (com QR/NFC/NFT funcionando), o valor simbólico, a recompra e o tracking comportamental são perdidos.',
      specificRisks: [
        'Produto entregue → QR falha → app não reconhece → sem recompensa → desengajamento',
        'Perda do valor neural agregado',
        'Falha na gamificação e retenção de usuários'
      ],
      currentControls: [
        'Checklist técnico antes do embarque (validação de QR/NFC)',
        'MVP com protótipo funcional testado no app antes de importar em escala',
        'Logs automáticos de escaneamento para detecção precoce de falhas'
      ],
      additionalActions: [
        'Implementar sistema de backup com múltiplos identificadores',
        'Criar protocolo de ativação remota via API',
        'Desenvolver sistema de recuperação de produtos "órfãos"'
      ],
      owner: 'Technology Team',
      dueDate: '2024-12-15',
      status: 'critical'
    },
    {
      id: 'RISK-005',
      category: 'Brand & Perception',
      threat: 'Risco de "chinagem" do produto (desvio simbólico)',
      impact: 'Medium',
      probability: 'High',
      severity: 'Medium',
      description: 'Produtos importados podem ser percebidos como genéricos, baratos ou sem "alma" se não tiverem uma história, um design ou um símbolo de pertencimento à marca MUNDÃO. Isso compromete o apelo de valor e a margem percebida.',
      specificRisks: [
        'Perda de posicionamento premium',
        'Associação com produtos genéricos',
        'Redução da margem percebida pelo consumidor'
      ],
      currentControls: [
        'Estética pensada para o público local (BR)',
        'Cocriação com embaixadores de marca',
        'Lançamento com storytelling ativo via app'
      ],
      additionalActions: [
        'Desenvolver certificação "Design MUNDÃO" exclusiva',
        'Criar linha de edição limitada com numeração',
        'Implementar programa de embaixadores influenciadores'
      ],
      owner: 'Brand & Marketing Team',
      dueDate: '2025-02-28',
      status: 'monitoring'
    },
    {
      id: 'RISK-006',
      category: 'Supply Chain',
      threat: 'Saturação logística ou duplicidade de lotes',
      impact: 'Medium',
      probability: 'Medium',
      severity: 'Medium',
      description: 'Ao importar múltiplos SKUs em ciclos simultâneos, há risco de confusão entre lotes, sobreposição de estoques, produtos parados ou nacionalizados fora do tempo correto, gerando custo oculto.',
      specificRisks: [
        'Confusão entre lotes de diferentes ciclos',
        'Sobrestoque de SKUs com baixa rotatividade',
        'Custos de armazenagem excessivos'
      ],
      currentControls: [
        'Planejamento de estoque por vertical e por ciclo',
        'Integração logística com sistema de tracking de lotes',
        'Nacionalização escalonada com previsão de giro real por SKU'
      ],
      additionalActions: [
        'Implementar IA preditiva para otimização de estoque',
        'Criar sistema de alerta para produtos com rotação baixa',
        'Desenvolver marketplace interno para redistribuição'
      ],
      owner: 'Supply Chain Team',
      dueDate: '2025-01-15',
      status: 'active'
    },
    {
      id: 'RISK-007',
      category: 'Financial Credit',
      threat: 'Falha no crédito chinês',
      impact: 'High',
      probability: 'Medium',
      severity: 'High',
      description: 'O crédito bancário chinês depende de histórico bancário ativo, movimentação em conta local, emissão de fapiao e contratos com contrapartida. Mesmo com capital e giro, a falta de "score cultural" impede acesso ao funding.',
      specificRisks: [
        'Negativa de crédito por falta de histórico',
        'Limitação de capital de giro',
        'Dependência excessiva de capital próprio'
      ],
      currentControls: [
        'Construção de relacionamento com bancos Tier 1 (ICBC, BOC)',
        'Emissão regular de fapiao, mesmo em operação controlada',
        'Simulação de contratos internos Brasil ↔ WFOE'
      ],
      additionalActions: [
        'Estabelecer linhas de crédito preventivas',
        'Diversificar relacionamento bancário (3+ bancos)',
        'Criar histórico transacional robusto nos primeiros 6 meses'
      ],
      owner: 'Finance Team',
      dueDate: '2024-12-31',
      status: 'active'
    },
    {
      id: 'RISK-008',
      category: 'Cultural & Business',
      threat: 'Risco cultural nas negociações OEM',
      impact: 'Medium',
      probability: 'High',
      severity: 'Medium',
      description: 'O modelo chinês de negociação exige paciência, presença física, e relações de longo prazo. Comunicação rápida, cobrança por WhatsApp, ou exigência de formalização precoce pode romper relações promissoras.',
      specificRisks: [
        'Ruptura de negociações por inadequação cultural',
        'Perda de fornecedores preferenciais',
        'Aumento de custos por má negociação'
      ],
      currentControls: [
        'Acompanhamento em mandarim com tradutor local',
        'Encontros presenciais nas feiras + visitas à fábrica',
        'Aceitar fase informal inicial antes de fechar contrato legal'
      ],
      additionalActions: [
        'Treinamento cultural intensivo para equipe',
        'Estabelecer escritório de representação permanente',
        'Criar protocolo de relacionamento de longo prazo'
      ],
      owner: 'Sourcing Team',
      dueDate: '2025-01-31',
      status: 'monitoring'
    },
    {
      id: 'RISK-009',
      category: 'Tax & Regulatory',
      threat: 'Risco tributário multicamada no Brasil',
      impact: 'High',
      probability: 'Medium',
      severity: 'High',
      description: 'O Brasil pode tributar não apenas a importação (ICMS, IPI, PIS/COFINS), mas também o valor pago à HK como serviço, licenciamento ou remessa. Isso gera sobreposição fiscal.',
      specificRisks: [
        'Dupla tributação Brasil-HK',
        'Autuação por classificação incorreta',
        'Penalidades por transfer pricing inadequado'
      ],
      currentControls: [
        'Classificação correta da entrada (importação vs. licenciamento)',
        'Holding HK sem operação no Brasil (só remessa)',
        'Nota fiscal baseada na invoice da WFOE, com split tributário'
      ],
      additionalActions: [
        'Implementar sistema de monitoramento fiscal automatizado',
        'Criar documentação de transfer pricing robusta',
        'Estabelecer revisão fiscal trimestral preventiva'
      ],
      owner: 'Tax Team',
      dueDate: '2024-12-31',
      status: 'active'
    },
    {
      id: 'RISK-010',
      category: 'Cash Flow',
      threat: 'Escassez de liquidez entre ciclos',
      impact: 'Medium',
      probability: 'Medium',
      severity: 'Medium',
      description: 'Mesmo com lucro líquido por ciclo, se a margem for reinvestida integralmente, a operação pode ficar sem caixa para responder a desvios, atrasos ou emergências.',
      specificRisks: [
        'Falta de capital para emergências',
        'Impossibilidade de aproveitar oportunidades',
        'Dependência de financiamento externo'
      ],
      currentControls: [
        'Reserva técnica de 10% do lucro líquido por ciclo',
        'Estrutura de colateral com parte do capital inicial',
        'Renda paralela via drops digitais (NFTs, experiências, licenças)'
      ],
      additionalActions: [
        'Estabelecer linha de crédito rotativo de emergência',
        'Diversificar fontes de receita com produtos digitais',
        'Criar fundo de contingência equivalente a 2 ciclos'
      ],
      owner: 'Treasury Team',
      dueDate: '2025-02-28',
      status: 'monitoring'
    },
    {
      id: 'RISK-011',
      category: 'User Engagement',
      threat: 'Fadiga de gamificação',
      impact: 'Medium',
      probability: 'High',
      severity: 'Medium',
      description: 'Usuários podem perder o interesse se as recompensas dos produtos forem repetitivas, previsíveis ou pouco valiosas.',
      specificRisks: [
        'Redução do engagement dos usuários',
        'Diminuição da recompra neural',
        'Perda de diferencial competitivo'
      ],
      currentControls: [
        'Slots dinâmicos com IA: recompensas diferentes por perfil',
        'Recompensa cruzada (compra no pet libera cupom no fitness)',
        'Atualização sazonal com campanhas temáticas'
      ],
      additionalActions: [
        'Implementar machine learning para personalização de recompensas',
        'Criar sistema de níveis e conquistas progressivas',
        'Desenvolver economia interna com tokens e marketplace'
      ],
      owner: 'Product & UX Team',
      dueDate: '2025-01-31',
      status: 'monitoring'
    },
    {
      id: 'RISK-012',
      category: 'Brand Control',
      threat: 'Contaminação de narrativa',
      impact: 'High',
      probability: 'Medium',
      severity: 'High',
      description: 'Se o produto for vendido por fora do ecossistema (revendedores ou marketplaces) sem ativação neural, o storytelling se perde.',
      specificRisks: [
        'Perda de controle sobre a experiência da marca',
        'Venda de produtos "mudos" sem ativação neural',
        'Concorrência desleal com produtos não ativados'
      ],
      currentControls: [
        'Produtos ativados só via QR/NFC rastreável',
        'Controle de lote por blockchain',
        'NFT como passaporte de uso (sem NFT, o produto é "mudo")'
      ],
      additionalActions: [
        'Implementar sistema de autenticação anti-falsificação',
        'Criar programa de parceiros certificados exclusivos',
        'Desenvolver sistema de penalização para vendas não autorizadas'
      ],
      owner: 'Brand & Legal Team',
      dueDate: '2024-12-31',
      status: 'active'
    }
  ];

  const riskMetrics = [
    { label: 'Total Risks', value: '12', trend: '+5', trendType: 'negative' },
    { label: 'Critical', value: '3', trend: '+1', trendType: 'negative' },
    { label: 'High', value: '6', trend: '+2', trendType: 'negative' },
    { label: 'Controls Active', value: '36', trend: '+12', trendType: 'positive' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'danger';
      case 'active':
        return 'warning';
      case 'monitoring':
        return 'info';
      case 'mitigated':
        return 'success';
      default:
        return 'info';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'legal & compliance':
        return <Shield className="w-4 h-4" />;
      case 'financial structure':
        return <DollarSign className="w-4 h-4" />;
      case 'foreign exchange':
        return <Globe className="w-4 h-4" />;
      case 'technology integration':
        return <Zap className="w-4 h-4" />;
      case 'brand & perception':
        return <Eye className="w-4 h-4" />;
      case 'supply chain':
        return <TrendingUp className="w-4 h-4" />;
      case 'financial credit':
        return <DollarSign className="w-4 h-4" />;
      case 'cultural & business':
        return <Users className="w-4 h-4" />;
      case 'tax & regulatory':
        return <Shield className="w-4 h-4" />;
      case 'cash flow':
        return <DollarSign className="w-4 h-4" />;
      case 'user engagement':
        return <Brain className="w-4 h-4" />;
      case 'brand control':
        return <Lock className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trendType: string) => {
    switch (trendType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredRisks = risks.filter(risk => {
    const matchesSearch = searchTerm === '' || 
      risk.threat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || risk.severity.toLowerCase() === filterSeverity;
    const matchesCategory = filterCategory === 'all' || risk.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === filterCategory;
    
    return matchesSearch && matchesSeverity && matchesCategory;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Risk Register 2025</h1>
              </div>
              <p className="text-red-100 text-lg mb-4">
                Análise Expandida — Riscos Clássicos, Emergentes e Ocultos na Operação THALAMUS ↔ MUNDÃO
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>12 Riscos Mapeados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>36 Controles Ativos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Multi-camada de Proteção</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">85%</div>
              <div className="text-red-100">Risk Coverage</div>
              <div className="text-2xl font-bold mt-2">3</div>
              <div className="text-red-200 text-sm">Riscos Críticos</div>
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {riskMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-600">{metric.label}</h3>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
                <span className={`text-sm font-medium ${getTrendColor(metric.trendType)}`}>
                  {metric.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar riscos, ameaças, controles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-80"
                />
              </div>
              
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Todas Severidades</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Todas Categorias</option>
                <option value="legal-&-compliance">Legal & Compliance</option>
                <option value="financial-structure">Financial Structure</option>
                <option value="foreign-exchange">Foreign Exchange</option>
                <option value="technology-integration">Technology Integration</option>
                <option value="brand-&-perception">Brand & Perception</option>
                <option value="supply-chain">Supply Chain</option>
                <option value="financial-credit">Financial Credit</option>
                <option value="cultural-&-business">Cultural & Business</option>
                <option value="tax-&-regulatory">Tax & Regulatory</option>
                <option value="cash-flow">Cash Flow</option>
                <option value="user-engagement">User Engagement</option>
                <option value="brand-control">Brand Control</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <SecondaryButton icon={Filter}>
                Filtros Avançados
              </SecondaryButton>
            </div>
          </div>
        </div>

        {/* Risk Register Cards */}
        <div className="space-y-6">
          {filteredRisks.map((risk) => (
            <div key={risk.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-slate-100 text-slate-600`}>
                      {getCategoryIcon(risk.category)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-slate-900 text-lg">{risk.id}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getSeverityColor(risk.severity)}`}>
                          {risk.severity}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {risk.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">Owner: {risk.owner}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusIndicator status={getStatusColor(risk.status)} text={risk.status} />
                    <p className="text-sm text-slate-600 mt-1">Due: {new Date(risk.dueDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-800 mb-2">🚨 Threat</h4>
                  <p className="text-sm text-red-700 font-medium mb-3">{risk.threat}</p>
                  <p className="text-sm text-red-600 leading-relaxed">{risk.description}</p>
                </div>

                {risk.specificRisks && risk.specificRisks.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-orange-800 mb-3">⚠️ Specific Risk Scenarios</h4>
                    <ul className="space-y-2">
                      {risk.specificRisks.map((specificRisk, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-orange-700">{specificRisk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Current Controls</span>
                  </h4>
                  <ul className="space-y-3">
                    {risk.currentControls.map((control, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{control}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Additional Actions</span>
                  </h4>
                  <ul className="space-y-3">
                    {risk.additionalActions.map((action, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 rounded-full mt-0.5 flex-shrink-0"></div>
                        <span className="text-sm text-slate-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-600">Impact:</span>
                    <span className="ml-2 text-slate-800">{risk.impact}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Probability:</span>
                    <span className="ml-2 text-slate-800">{risk.probability}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Overall Severity:</span>
                    <span className="ml-2 text-slate-800">{risk.severity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Street-Smart Pack - Enhanced */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl p-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">🥷 Street-Smart Pack — Táticas de Campo Avançadas</h2>
            <p className="text-blue-200">Protocolos práticos baseados em experiência real de operações China ↔ Brasil</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-semibold text-yellow-300 mb-3">💰 Financial Security</h4>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-yellow-400 pl-3">
                  <strong>Conta bancária "clone":</strong> Validar beneficiário por vídeo + "penny test" antes do 30% de adiantamento.
                </div>
                <div className="border-l-4 border-green-400 pl-3">
                  <strong>Escrow multi-camada:</strong> Usar holding HK como buffer para grandes transferências.
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-semibold text-blue-300 mb-3">🔍 Quality Control</h4>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-blue-400 pl-3">
                  <strong>QC "teatro":</strong> Inspetor surpresa + cross-check de nº de série/IMEI/lot codes.
                </div>
                <div className="border-l-4 border-purple-400 pl-3">
                  <strong>Amostra selada:</strong> Duas vias lacradas com numeração + hash blockchain.
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-semibold text-green-300 mb-3">⚙️ Production Control</h4>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-green-400 pl-3">
                  <strong>Capex de moldes:</strong> Pagamento em 3 marcos + registro com plaqueta do comprador.
                </div>
                <div className="border-l-4 border-teal-400 pl-3">
                  <strong>Neural QR/NFC:</strong> Teste de ativação antes de cada lote embarcado.
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-semibold text-orange-300 mb-3">📦 Logistics Security</h4>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-orange-400 pl-3">
                  <strong>Embalagem ISTA:</strong> Teste ISTA-1A/2A em protótipo para reduzir avaria.
                </div>
                <div className="border-l-4 border-red-400 pl-3">
                  <strong>Seguro inteligente:</strong> All-risk próprio quando valor justificar + tracking IoT.
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-semibold text-purple-300 mb-3">📋 Regulatory Monitoring</h4>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-purple-400 pl-3">
                  <strong>Regulatory drift:</strong> Watchlist automático ANATEL/INMETRO/UE + gate go/no-go.
                </div>
                <div className="border-l-4 border-pink-400 pl-3">
                  <strong>Compliance neural:</strong> IA monitora mudanças normativas 24/7.
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h4 className="font-semibold text-cyan-300 mb-3">🧠 Neural Protection</h4>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-cyan-400 pl-3">
                  <strong>Anti-cloning:</strong> NFT único por produto + blockchain de autenticidade.
                </div>
                <div className="border-l-4 border-indigo-400 pl-3">
                  <strong>Narrative control:</strong> Produtos só ativam via app oficial MUNDÃO.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusion Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">✅ Conclusão da Análise de Riscos</h2>
            <div className="max-w-4xl mx-auto space-y-4 text-lg">
              <p>
                Esta matriz de riscos revela que o projeto <strong>MUNDÃO + THALAMUS</strong> opera com 
                múltiplas camadas de vulnerabilidade — mas também com <strong>respostas sistêmicas para cada uma</strong>.
              </p>
              <p>
                A proposta é robusta porque considera não só o produto e o preço, mas 
                <strong> o simbolismo, a margem narrativa e o uso contínuo</strong>.
              </p>
              <p>
                Essa arquitetura é <strong>resiliente, escalável, e com potencial de replicação para outros países</strong>, 
                com o app como orquestrador simbólico e financeiro de uma rede global.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-green-200">Riscos Mapeados</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">36</div>
                <div className="text-sm text-blue-200">Controles Ativos</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">85%</div>
                <div className="text-sm text-cyan-200">Coverage Rate</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-yellow-200">Jurisdições</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
