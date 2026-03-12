import { useState, useMemo } from 'react';
;
import { 
  Brain, Target, ArrowRight, CheckCircle, TrendingUp,
  Globe, Layers, Network, Cpu,
  Download, RefreshCw, Wallet, Truck, Database, Coins, Percent
} from 'lucide-react';
import StatusIndicator from '@/react-app/components/StatusIndicator';
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';

export default function Logistics() {
  const [activeTab, setActiveTab] = useState('neural-dashboard');
  const [selectedCostLayer, setSelectedCostLayer] = useState('origem');
  const [selectedCycle, setSelectedCycle] = useState(1);

  // Neural Dashboard State
  const [rateCNY, setRateCNY] = useState<number>(0.78); // 1 CNY -> BRL
  const [rateUSD, setRateUSD] = useState<number>(5.6);  // 1 USD -> BRL
  const [loading, setLoading] = useState(false);

  // Enhanced navigation tabs based on neural logistics structure
  const navigationTabs = [
    { id: 'neural-dashboard', name: 'Dashboard Neural', icon: Brain },
    { id: 'cost-layers', name: 'Camadas de Custo', icon: Layers },
    { id: 'neural-flows', name: 'Fluxos Neurais', icon: Network },
    { id: 'tripartite', name: 'Estrutura Tripartite', icon: Globe },
    { id: 'roi-analysis', name: 'Análise ROI', icon: TrendingUp }
  ];

  // Cost layers structure for neural dashboard
  const LAYERS = [
    { key: "origem", label: "Produção OEM + Origem" },
    { key: "transporte", label: "Transporte Internacional" },
    { key: "nacionalizacao", label: "Nacionalização e Tributos" },
    { key: "armazenagem", label: "Armazenagem e Distribuição" },
    { key: "compliance", label: "Compliance e Licenças" },
    { key: "financeiro", label: "Financeiro / Câmbio" },
    { key: "operacional", label: "Estrutura Operacional" },
  ] as const;

  type LayerKey = typeof LAYERS[number]["key"];
  type Costs = Record<LayerKey, number>;

  const defaultCostsBRL: Costs = {
    origem: 200_000,
    transporte: 42_000,
    nacionalizacao: 109_000,
    armazenagem: 231_000,
    compliance: 165_000,
    financeiro: 26_000,
    operacional: 210_000,
  };

  const defaultCycles = [
    { ciclo: "1", receitaBRL: 1_100_000, lucroBRL: 300_000, roiPct: 32, reinvestPct: 70 },
    { ciclo: "2", receitaBRL: 1_500_000, lucroBRL: 500_000, roiPct: 45, reinvestPct: 70 },
    { ciclo: "3", receitaBRL: 2_200_000, lucroBRL: 850_000, roiPct: 55, reinvestPct: 70 },
  ];

  const [costsBRL, setCostsBRL] = useState<Costs>(defaultCostsBRL);
  const [cycles, setCycles] = useState(defaultCycles);

  // Neural logistics key metrics from the report
  // Metrics are now calculated dynamically from the dashboard data

  // Calculated metrics for dashboard
  const totalBRL = useMemo(() =>
    Object.values(costsBRL).reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0)
  , [costsBRL]);

  const layerPieData = useMemo(() => {
    return LAYERS.map(l => ({ name: l.label, value: costsBRL[l.key] }));
  }, [costsBRL]);

  const barData = useMemo(() => {
    return LAYERS.map(l => ({ camada: l.label, brl: costsBRL[l.key] }));
  }, [costsBRL]);

  const kpis = useMemo(() => {
    const camadaMaisCara = LAYERS
      .map(l => ({ label: l.label, value: costsBRL[l.key] }))
      .sort((a, b) => b.value - a.value)[0];
    const receitaTotal = cycles.reduce((acc, c) => acc + c.receitaBRL, 0);
    const roiC3 = cycles.find(c => c.ciclo === "3")?.roiPct ?? 0;
    return { camadaMaisCara, receitaTotal, roiC3 };
  }, [costsBRL, cycles]);

  const multiCurrency = useMemo(() => {
    const toCNY = (vBRL: number) => (vBRL / rateCNY);
    const toUSD = (vBRL: number) => (vBRL / rateUSD);
    return LAYERS.map(l => ({
      camada: l.label,
      brl: costsBRL[l.key],
      cny: toCNY(costsBRL[l.key]),
      usd: toUSD(costsBRL[l.key]),
      pct: (costsBRL[l.key] / totalBRL) * 100,
    }));
  }, [costsBRL, rateCNY, rateUSD, totalBRL]);

  // Detailed cost layers from the executive report
  const costLayers = [
    {
      id: 'origem',
      name: 'Origem China',
      description: 'Produção OEM + Exportação',
      value: 157000,
      percentage: 27,
      color: 'from-red-500 to-orange-500',
      details: [
        { item: 'Produção OEM (FOB)', value: 140000, currency: 'BRL' },
        { item: 'Setup moldes e desenho', value: 6300, currency: 'BRL' },
        { item: 'Inspeção SGS', value: 2300, currency: 'BRL' },
        { item: 'Documentação exportação', value: 950, currency: 'BRL' },
        { item: 'Logística interna CN', value: 2200, currency: 'BRL' },
        { item: 'Taxas portuárias', value: 1250, currency: 'BRL' },
        { item: 'Freight forwarder', value: 1950, currency: 'BRL' },
        { item: 'Seguro ICC-A', value: 560, currency: 'BRL' },
        { item: 'QC amostras', value: 1550, currency: 'BRL' }
      ]
    }
  ];

  // Neural flows (physical, financial, informational)
  const neuralFlows = [
    {
      type: 'Físico',
      description: 'Movimentação produtos OEM → consumidor',
      color: 'from-blue-500 to-cyan-400',
      stages: [
        { name: 'Produção OEM', location: 'Shenzhen/Guangzhou', status: 'active' },
        { name: 'Consolidação', location: 'Yantian Port', status: 'active' },
        { name: 'Transporte marítimo', location: 'Oceano Pacífico', status: 'transit' },
        { name: 'Nacionalização', location: 'Santos/BR', status: 'pending' },
        { name: 'CD Neural', location: 'SP/RJ', status: 'ready' },
        { name: 'Last Mile', location: 'Franquias MUNDÃO', status: 'ready' }
      ]
    },
    {
      type: 'Financeiro',
      description: 'Capital, câmbio, hedge e crédito',
      color: 'from-emerald-500 to-green-400',
      stages: [
        { name: 'Capital BR', location: 'Grupo RÃO', status: 'active' },
        { name: 'Remessa HK', location: 'THALAMUS Holdings', status: 'active' },
        { name: 'Hedge RMB/BRL', location: 'BOC/ICBC', status: 'active' },
        { name: 'Pagamento OEM', location: 'THALAMUS Trading CN', status: 'transit' },
        { name: 'Repatriação', location: 'HK → BR', status: 'pending' },
        { name: 'Reinvestimento', location: 'Neural Cycles', status: 'ready' }
      ]
    },
    {
      type: 'Informacional',
      description: 'Dados, rastreio, QR/NFT, IA neural',
      color: 'from-violet-500 to-purple-400',
      stages: [
        { name: 'QR/NFC Embed', location: 'Produção OEM', status: 'active' },
        { name: 'Blockchain Trail', location: 'TensorChain', status: 'active' },
        { name: 'IoT Tracking', location: 'Transporte', status: 'transit' },
        { name: 'AI Analytics', location: 'MUNDÃO Backend', status: 'active' },
        { name: 'User Feedback', location: 'App MUNDÃO', status: 'ready' },
        { name: 'Neural Learning', location: 'TensorChain IA', status: 'continuous' }
      ]
    }
  ];

  // ROI analysis by cycles
  const roiAnalysis = [
    {
      cycle: 1,
      revenue: 1100000,
      profit: 300000,
      roi: 32,
      payback: '9 meses',
      details: {
        costs: 940000,
        margin: '27%',
        skus: 10,
        efficiency: 'baseline'
      }
    },
    {
      cycle: 2,
      revenue: 1500000,
      profit: 500000,
      roi: 45,
      payback: '6 meses',
      details: {
        costs: 1000000,
        margin: '33%',
        skus: 18,
        efficiency: '+8% neural'
      }
    },
    {
      cycle: 3,
      revenue: 2200000,
      profit: 850000,
      roi: 55,
      payback: '4 meses',
      details: {
        costs: 1350000,
        margin: '39%',
        skus: 28,
        efficiency: '+12% neural'
      }
    }
  ];

  // Tripartite structure with detailed financial flows
  const tripartiteStructure = [
    {
      country: '🇨🇳 China',
      entity: 'THALAMUS TRADING LTD',
      role: 'Operações & Sourcing',
      location: 'Shenzhen WFOE',
      status: 'active',
      capitalDeployed: '¥430K',
      functions: [
        'Sourcing OEM direto',
        'Controle qualidade SGS',
        'Exportação formal',
        'Relacionamento fornecedores',
        'Logística interna CN'
      ],
      kpis: {
        suppliers: 23,
        activeSkus: 10,
        avgLeadTime: '45 dias',
        qualityScore: '94%'
      }
    },
    {
      country: '🇭🇰 Hong Kong',
      entity: 'THALAMUS HOLDINGS HK',
      role: 'Hub Financeiro & Tesouraria',
      location: 'Central District',
      status: 'active',
      capitalDeployed: 'HK$ 850K',
      functions: [
        'Gestão cambial otimizada',
        'Hedge RMB/BRL 70%',
        'Contratos internacionais',
        'Repatriação estruturada',
        'Interface fiscal'
      ],
      kpis: {
        hedgeEfficiency: '94%',
        fxSavings: '1.2%',
        complianceRate: '100%',
        transferSpeed: '48h'
      }
    },
    {
      country: '🇧🇷 Brasil',
      entity: 'Grupo RÃO Participações',
      role: 'Distribuição Neural',
      location: 'São Paulo/Rio',
      status: 'active',
      capitalDeployed: 'R$ 420K',
      functions: [
        'Nacionalização products',
        'Distribuição MUNDÃO neural',
        'Compliance ANVISA/ANATEL',
        'CD operacional',
        'Last mile tokenizada'
      ],
      kpis: {
        skusCertified: '8/10',
        distributionSpeed: '24h',
        complianceRate: '92%',
        customerSat: '4.2/5'
      }
    }
  ];

  const getStatusColor = (status: string): 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
      case 'active': return 'success';
      case 'transit': return 'info';
      case 'pending': return 'warning';
      case 'ready': return 'success';
      case 'continuous': return 'info';
      default: return 'info';
    }
  };

  function handleCostChange(key: LayerKey, value: string) {
    const v = Number(value.replace(/[^\d.-]/g, ""));
    setCostsBRL(prev => ({ ...prev, [key]: Number.isFinite(v) ? v : 0 }));
  }

  function resetDefaults() {
    setCostsBRL(defaultCostsBRL);
    setRateCNY(0.78);
    setRateUSD(5.6);
    setCycles(defaultCycles);
  }

  async function simulateRecalc() {
    setLoading(true);
    // Simula redução de 8% de custos em média nos ciclos (ganho neural)
    setTimeout(() => {
      const reduced: Costs = Object.fromEntries(
        (Object.entries(costsBRL) as [LayerKey, number][]).map(([k, v]) => [k, Math.round(v * 0.92)])
      ) as Costs;
      setCostsBRL(reduced);
      setLoading(false);
    }, 700);
  }

  const renderNeuralDashboard = () => (
    <div className="w-full space-y-6">
      {/* Header com ações */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Logística Neural — THALAMUS ↔ MUNDÃO</h2>
          <p className="text-slate-600">Sistema multimoeda com otimização neural automática</p>
        </div>
        <div className="flex items-center gap-2">
          <SecondaryButton onClick={resetDefaults} icon={RefreshCw}>Resetar</SecondaryButton>
          <PrimaryButton onClick={simulateRecalc} loading={loading} icon={TrendingUp}>
            Otimizar (–8%)
          </PrimaryButton>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Wallet className="h-4 w-4"/>
            <span className="text-sm font-medium">Custo Total (BRL)</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">R$ {totalBRL.toLocaleString("pt-BR")}</div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Database className="h-4 w-4"/>
            <span className="text-sm font-medium">Camada mais onerosa</span>
          </div>
          <div className="text-base font-semibold text-slate-900">
            {kpis.camadaMaisCara.label}
          </div>
          <div className="text-sm text-slate-600">R$ {kpis.camadaMaisCara.value.toLocaleString("pt-BR")}</div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Percent className="h-4 w-4"/>
            <span className="text-sm font-medium">ROI Ciclo 3</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{kpis.roiC3}%</div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Coins className="h-4 w-4"/>
            <span className="text-sm font-medium">Receita 3 ciclos</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">R$ {kpis.receitaTotal.toLocaleString("pt-BR")}</div>
        </div>
      </div>

      {/* Taxas de câmbio e inputs */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 text-slate-700 mb-4">
            <Coins className="h-4 w-4"/>
            <span className="text-sm font-medium">Taxas de câmbio</span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">1 CNY → BRL</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={rateCNY} 
                  onChange={e => setRateCNY(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">1 USD → BRL</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={rateUSD} 
                  onChange={e => setRateUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">Atualize as taxas para ver conversões automáticas BRL ⇄ CNY/USD.</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 text-slate-700 mb-4">
            <Truck className="h-4 w-4"/>
            <span className="text-sm font-medium">Custos por Camada (editar)</span>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {LAYERS.map(l => (
              <div key={l.key} className="space-y-1">
                <label className="text-xs text-slate-500 block">{l.label} — BRL</label>
                <input
                  type="number"
                  value={costsBRL[l.key]}
                  onChange={(e) => handleCostChange(l.key, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráficos principais */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-[420px]">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Distribuição Percentual dos Custos</h3>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={layerPieData} dataKey="value" nameKey="name" outerRadius={120}>
                  {layerPieData.map((_, idx) => (<Cell key={idx} />))}
                </Pie>
                <Tooltip formatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 h-[420px]">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Custos por Camada (BRL)</h3>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`}/>
                <YAxis type="category" dataKey="camada" width={180} />
                <Tooltip formatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`} />
                <Legend />
                <Bar dataKey="brl" name="BRL" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabela multimoeda */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-sm font-medium text-slate-900 mb-4">Tabela Multimoeda (BRL / CNY / USD)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b border-slate-200">
                <th className="py-3 pr-3 font-medium">Camada</th>
                <th className="py-3 pr-3 font-medium">BRL</th>
                <th className="py-3 pr-3 font-medium">CNY</th>
                <th className="py-3 pr-3 font-medium">USD</th>
                <th className="py-3 pr-3 font-medium">% Total</th>
              </tr>
            </thead>
            <tbody>
              {multiCurrency.map((row) => (
                <tr key={row.camada} className="border-t border-slate-100">
                  <td className="py-3 pr-3 text-slate-900">{row.camada}</td>
                  <td className="py-3 pr-3 font-medium">R$ {row.brl.toLocaleString("pt-BR")}</td>
                  <td className="py-3 pr-3">¥ {row.cny.toFixed(0)}</td>
                  <td className="py-3 pr-3">$ {row.usd.toFixed(0)}</td>
                  <td className="py-3 pr-3">{row.pct.toFixed(1)}%</td>
                </tr>
              ))}
              <tr className="border-t border-slate-200 font-semibold bg-slate-50">
                <td className="py-3 pr-3 text-slate-900">TOTAL</td>
                <td className="py-3 pr-3">R$ {totalBRL.toLocaleString("pt-BR")}</td>
                <td className="py-3 pr-3">¥ {(totalBRL / rateCNY).toFixed(0)}</td>
                <td className="py-3 pr-3">$ {(totalBRL / rateUSD).toFixed(0)}</td>
                <td className="py-3 pr-3">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Ciclos e ROI */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-[380px]">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Receita por Ciclo (BRL)</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cycles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ciclo" />
                <YAxis tickFormatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`} />
                <Tooltip formatter={(v) => `R$ ${Number(v).toLocaleString('pt-BR')}`} />
                <Legend />
                <Line type="monotone" dataKey="receitaBRL" name="Receita" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 h-[380px]">
          <h3 className="text-sm font-medium text-slate-900 mb-4">ROI por Ciclo (%)</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cycles}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ciclo" />
                <YAxis />
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
                <Bar dataKey="roiPct" name="ROI (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-end gap-3">
        <SecondaryButton icon={Download}>Exportar CSV</SecondaryButton>
        <PrimaryButton icon={TrendingUp}>Publicar</PrimaryButton>
      </div>
    </div>
  );

  

  const renderCostLayers = () => (
    <div className="space-y-6">
      {/* Layer Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Análise Profunda por Camada de Custo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {costLayers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setSelectedCostLayer(layer.id)}
              className={`p-4 rounded-xl text-left transition-all border-2 text-sm ${
                selectedCostLayer === layer.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${layer.color} mb-3 flex items-center justify-center text-white font-bold text-lg`}>
                {layer.percentage}%
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">{layer.name}</h4>
              <p className="text-xs text-slate-600 mb-2">{layer.description}</p>
              <p className="text-sm font-bold text-slate-900">R$ {layer.value.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNeuralFlows = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Fluxos Neurais Simultâneos</h3>
        <p className="text-slate-600 mb-8">
          O sistema THALAMUS opera com 3 fluxos integrados que se retroalimentam via TensorChain IA.
          Cada nó gera dados que otimizam os demais fluxos em tempo real.
        </p>

        <div className="space-y-8">
          {neuralFlows.map((flow, flowIndex) => (
            <div key={flowIndex} className="border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">Fluxo {flow.type}</h4>
                  <p className="text-slate-600">{flow.description}</p>
                </div>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${flow.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {flow.type[0]}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {flow.stages.map((stage, stageIndex) => (
                  <div key={stageIndex} className="relative">
                    <div className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-r ${flow.color}`}>
                          {stageIndex + 1}
                        </div>
                        <StatusIndicator status={getStatusColor(stage.status)} text={stage.status} />
                      </div>
                      <h5 className="font-semibold text-slate-900 mb-1 text-sm">{stage.name}</h5>
                      <p className="text-xs text-slate-600">{stage.location}</p>
                    </div>
                    
                    {stageIndex < flow.stages.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Neural Integration Summary */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-6 text-white mt-8">
          <h4 className="text-xl font-bold mb-4">🧠 Integração Neural TensorChain</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h5 className="font-semibold mb-2">Dados Capturados</h5>
              <ul className="space-y-1 text-violet-200">
                <li>• Tempo real de cada etapa</li>
                <li>• Custos por transação</li>
                <li>• Quality scores fornecedores</li>
                <li>• Performance cambial</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">IA Processa</h5>
              <ul className="space-y-1 text-violet-200">
                <li>• Padrões de eficiência</li>
                <li>• Gargalos recorrentes</li>
                <li>• Oportunidades arbitragem</li>
                <li>• Riscos preditivos</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Otimização Automática</h5>
              <ul className="space-y-1 text-violet-200">
                <li>• Rerouting dinâmico</li>
                <li>• Hedge timing perfeito</li>
                <li>• Fornecedor switch</li>
                <li>• Margem adaptativa</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTripartite = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Estrutura Tripartite THALAMUS Detalhada</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tripartiteStructure.map((entity, index) => (
            <div key={index} className="relative">
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border-2 border-slate-200 hover:border-blue-300 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-900">{entity.country}</h4>
                  <StatusIndicator status="success" text={entity.status} />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-slate-800">{entity.entity}</h5>
                    <p className="text-sm text-slate-600">{entity.role}</p>
                    <p className="text-xs text-slate-500">{entity.location}</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <h6 className="text-sm font-medium text-blue-800 mb-2">Capital Deployed</h6>
                    <p className="text-lg font-bold text-blue-900">{entity.capitalDeployed}</p>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-medium text-slate-700 mb-2">Funções Principais:</h6>
                    <ul className="space-y-1">
                      {entity.functions.map((func, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-slate-600">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{func}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h6 className="text-sm font-medium text-slate-700 mb-2">KPIs Operacionais:</h6>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(entity.kpis).map(([key, value]) => (
                        <div key={key} className="bg-slate-50 rounded p-2">
                          <div className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          <div className="font-bold text-slate-900">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {index < tripartiteStructure.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-blue-500" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Financial Flow Summary */}
        <div className="mt-8 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white">
          <h4 className="text-xl font-bold mb-4">💰 Fluxo Financeiro Integrado</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-semibold mb-3">Brasil → Hong Kong</h5>
              <div className="space-y-2 text-sm text-green-100">
                <p>• Remessa USD via SWIFT</p>
                <p>• IOF 0,38% otimizado</p>
                <p>• Spread controlado 1-1,5%</p>
                <p>• Tempo: 24-48h</p>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Hong Kong → China</h5>
              <div className="space-y-2 text-sm text-green-100">
                <p>• Conversão HKD→RMB</p>
                <p>• Hedge 70% exposure</p>
                <p>• BOC/ICBC channels</p>
                <p>• Taxa: 0,5% interbancária</p>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Repatriação Lucros</h5>
              <div className="space-y-2 text-sm text-green-100">
                <p>• HK→BR estruturada</p>
                <p>• Tax efficiency 0,5%</p>
                <p>• Reinvestimento ciclos</p>
                <p>• ROI compounding</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderROIAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Análise ROI Neural por Ciclo</h3>
        
        {/* Cycle Selector */}
        <div className="flex space-x-4 mb-8">
          {roiAnalysis.map((cycle) => (
            <button
              key={cycle.cycle}
              onClick={() => setSelectedCycle(cycle.cycle)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCycle === cycle.cycle
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Ciclo {cycle.cycle}
            </button>
          ))}
        </div>

        {/* Selected Cycle Analysis */}
        {(() => {
          const cycle = roiAnalysis.find(c => c.cycle === selectedCycle);
          if (!cycle) return null;

          return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-6">Ciclo {cycle.cycle} — Performance</h4>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h5 className="text-sm font-medium text-blue-700 mb-1">Receita Projetada</h5>
                      <p className="text-2xl font-bold text-blue-900">R$ {cycle.revenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h5 className="text-sm font-medium text-green-700 mb-1">Lucro Líquido</h5>
                      <p className="text-2xl font-bold text-green-900">R$ {cycle.profit.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h5 className="text-sm font-medium text-purple-700 mb-1">ROI</h5>
                      <p className="text-2xl font-bold text-purple-900">{cycle.roi}%</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <h5 className="text-sm font-medium text-amber-700 mb-1">Payback</h5>
                      <p className="text-2xl font-bold text-amber-900">{cycle.payback}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h5 className="font-medium text-slate-800 mb-3">Detalhes Operacionais</h5>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-600">Custos totais:</span>
                        <div className="font-bold text-slate-900">R$ {cycle.details.costs.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Margem líquida:</span>
                        <div className="font-bold text-slate-900">{cycle.details.margin}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">SKUs ativas:</span>
                        <div className="font-bold text-slate-900">{cycle.details.skus}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Eficiência neural:</span>
                        <div className="font-bold text-slate-900">{cycle.details.efficiency}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-6">Evolução Neural</h4>
                
                {/* ROI Progression Chart */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-6 border border-violet-200 mb-6">
                  <h5 className="font-medium text-violet-800 mb-4">Progressão ROI</h5>
                  <div className="space-y-3">
                    {roiAnalysis.map((c) => (
                      <div key={c.cycle} className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          c.cycle === selectedCycle ? 'bg-violet-600' : 'bg-violet-400'
                        }`}>
                          {c.cycle}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-700">ROI {c.roi}%</span>
                            <span className="text-sm text-slate-600">{c.payback}</span>
                          </div>
                          <div className="w-full bg-violet-200 rounded-full h-2">
                            <div
                              className="bg-violet-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(c.roi / 55) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neural Efficiency Gains */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
                  <h5 className="font-medium text-cyan-800 mb-4">🧠 Ganhos Neurais Acumulados</h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-cyan-700">Aprendizado fornecedores:</span>
                      <span className="font-bold text-cyan-900">+{cycle.cycle * 3}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-700">Otimização logística:</span>
                      <span className="font-bold text-cyan-900">+{cycle.cycle * 2}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-700">Eficiência cambial:</span>
                      <span className="font-bold text-cyan-900">+{cycle.cycle * 1.5}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-700">Automação processos:</span>
                      <span className="font-bold text-cyan-900">+{cycle.cycle * 4}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );

  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'neural-dashboard': return renderNeuralDashboard();
      case 'cost-layers': return renderCostLayers();
      case 'neural-flows': return renderNeuralFlows();
      case 'tripartite': return renderTripartite();
      case 'roi-analysis': return renderROIAnalysis();
      default: return renderNeuralDashboard();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        {/* Enhanced Header with Neural Branding */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(79, 70, 229, 0.4) 2px, transparent 2px)',
              backgroundSize: '50px 50px'
            }} />
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-10 h-10 text-cyan-400" />
                  <h1 className="text-3xl font-bold">THALAMUS Neural Logistics</h1>
                </div>
                <p className="text-blue-200 text-lg mb-4 leading-relaxed">
                  Sistema logístico circular e neural com <strong className="text-cyan-300">3 fluxos simultâneos</strong>:
                  <br />
                  Físico + Financeiro + Informacional = <strong className="text-amber-300">ROI exponencial 32% → 55%</strong>
                </p>
                <div className="flex items-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Tripartite 🇧🇷↔🇭🇰↔🇨🇳</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4" />
                    <span>TensorChain IA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>8-12% optimization/cycle</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-cyan-300">R$ {totalBRL.toLocaleString("pt-BR")}</div>
                <div className="text-blue-200">Total Neural (6m)</div>
                <div className="text-sm text-blue-300 mt-2">Sistema Otimizado</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
          <div className="flex flex-wrap gap-1">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
