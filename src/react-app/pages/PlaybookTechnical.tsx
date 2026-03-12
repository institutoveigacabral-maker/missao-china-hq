import { useState } from 'react';
import { 
  Brain, 
  Target, 
  Zap, 
  Package, 
  TrendingUp, 
  Shield, 
  Globe,
  Star,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Layers,
  Network
} from 'lucide-react';

export default function PlaybookTechnical() {
  const [selectedVertical, setSelectedVertical] = useState('iot');

  const verticals = [
    {
      id: 'iot',
      name: 'IoT & Smart Devices',
      icon: '📡',
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      skus: [
        { name: 'Embalagens QR/NFC', neural: 'Rastreio + recompensa', moq: '5k', leadTime: '35 dias' },
        { name: 'Smart Lockers', neural: 'Tokenização + tracking', moq: '100', leadTime: '45 dias' },
        { name: 'NFC Tags', neural: 'Identificação neural', moq: '10k', leadTime: '25 dias' }
      ]
    },
    {
      id: 'pet',
      name: 'Pet Tech',
      icon: '🐾',
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      skus: [
        { name: 'Coleiras GPS', neural: 'Tracking + gamificação', moq: '500', leadTime: '40 dias' },
        { name: 'Bebedouros IoT', neural: 'Consumo + saúde', moq: '300', leadTime: '35 dias' },
        { name: 'Brinquedos Smart', neural: 'Interação + dados', moq: '1k', leadTime: '30 dias' }
      ]
    },
    {
      id: 'fitness',
      name: 'Fitness V4L',
      icon: '💪',
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      skus: [
        { name: 'Luvas Training', neural: 'Performance + desafios', moq: '2k', leadTime: '30 dias' },
        { name: 'Straps Resistance', neural: 'Progressão + NFT', moq: '3k', leadTime: '28 dias' },
        { name: 'Kits Completos', neural: 'Ecosistema + recompra', moq: '1k', leadTime: '35 dias' }
      ]
    },
    {
      id: 'kids',
      name: 'Infantil & Kids',
      icon: '🧸',
      color: 'from-green-500 to-emerald-500',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      skus: [
        { name: 'Brinquedos Educativos', neural: 'Aprendizado + evolução', moq: '5k', leadTime: '40 dias' },
        { name: 'Roupas Smart', neural: 'Crescimento + cashback', moq: '2k', leadTime: '35 dias' },
        { name: 'IoT Kids Safety', neural: 'Segurança + peace of mind', moq: '1k', leadTime: '42 dias' }
      ]
    }
  ];

  const neuralFeatures = [
    {
      title: 'QR Dinâmicos',
      description: 'Cada produto tem código único que ativa slot neural',
      icon: Zap,
      metric: '100%',
      label: 'Coverage'
    },
    {
      title: 'NFC Embarcado',
      description: 'Identificação física para autenticação e experiência',
      icon: Shield,
      metric: '90k',
      label: 'Units'
    },
    {
      title: 'NFT Rewards',
      description: 'Colecionáveis digitais que desbloqueiam benefícios',
      icon: Star,
      metric: '5',
      label: 'Tiers'
    },
    {
      title: 'IA Preditiva',
      description: 'Recomendações personalizadas por comportamento',
      icon: Brain,
      metric: '85%',
      label: 'Accuracy'
    }
  ];

  const cycles = [
    {
      number: 1,
      revenue: 'R$ 1.1M',
      profit: 'R$ 300k',
      roi: '32%',
      skus: 10,
      status: 'active'
    },
    {
      number: 2,
      revenue: 'R$ 1.5M',
      profit: 'R$ 500k',
      roi: '45%',
      skus: 18,
      status: 'planned'
    },
    {
      number: 3,
      revenue: 'R$ 2.2M',
      profit: 'R$ 850k',
      roi: '55%',
      skus: 28,
      status: 'projected'
    }
  ];

  const selectedVerticalData = verticals.find(v => v.id === selectedVertical);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 lg:p-12 shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <Brain className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      Playbook Técnico Neural
                    </h1>
                    <p className="text-xl text-purple-200">
                      MUNDÃO + THALAMUS — Arquitetura de Produtos Inteligentes
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <Package className="w-6 h-6 text-cyan-400 mb-2" />
                    <div className="text-3xl font-bold text-white">90k</div>
                    <div className="text-purple-200 text-sm">Unidades 1º Lote</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <Layers className="w-6 h-6 text-emerald-400 mb-2" />
                    <div className="text-3xl font-bold text-white">4</div>
                    <div className="text-purple-200 text-sm">Verticais Ativas</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <TrendingUp className="w-6 h-6 text-amber-400 mb-2" />
                    <div className="text-3xl font-bold text-white">55%</div>
                    <div className="text-purple-200 text-sm">ROI Ciclo 3</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <Network className="w-6 h-6 text-pink-400 mb-2" />
                    <div className="text-3xl font-bold text-white">100%</div>
                    <div className="text-purple-200 text-sm">Neural Coverage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {neuralFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">{feature.metric}</div>
                  <div className="text-xs text-slate-500">{feature.label}</div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Vertical Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Target className="w-7 h-7 text-indigo-600" />
            Verticais de Produto
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {verticals.map((vertical) => (
              <button
                key={vertical.id}
                onClick={() => setSelectedVertical(vertical.id)}
                className={`relative overflow-hidden rounded-xl p-5 text-left transition-all duration-300 ${
                  selectedVertical === vertical.id
                    ? `bg-gradient-to-br ${vertical.color} text-white shadow-2xl scale-105`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl">{vertical.icon}</span>
                  {selectedVertical === vertical.id && (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">{vertical.name}</h3>
                <div className={`text-sm ${selectedVertical === vertical.id ? 'text-white/80' : 'text-slate-500'}`}>
                  {vertical.skus.length} SKUs
                </div>
              </button>
            ))}
          </div>

          {/* Selected Vertical Details */}
          {selectedVerticalData && (
            <div className="space-y-6">
              <div className={`bg-gradient-to-br ${selectedVerticalData.color} rounded-2xl p-8 text-white`}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-6xl">{selectedVerticalData.icon}</span>
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{selectedVerticalData.name}</h3>
                    <p className="text-white/80 text-lg">
                      {selectedVerticalData.skus.length} produtos inteligentes com tecnologia neural embarcada
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedVerticalData.skus.map((sku, index) => (
                  <div 
                    key={index}
                    className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-bold text-slate-900">{sku.name}</h4>
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    
                    <div className={`${selectedVerticalData.bgColor} ${selectedVerticalData.textColor} rounded-lg p-3 mb-4`}>
                      <div className="text-sm font-medium mb-1">🧠 Neural Feature</div>
                      <div className="text-xs">{sku.neural}</div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">MOQ:</span>
                        <span className="font-semibold text-slate-900">{sku.moq}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Lead Time:</span>
                        <span className="font-semibold text-slate-900">{sku.leadTime}</span>
                      </div>
                    </div>

                    <button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium">
                      Ver Detalhes
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cycles Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-emerald-600" />
            Ciclos Neurais — ROI Progressivo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cycles.map((cycle, index) => (
              <div 
                key={index}
                className={`relative overflow-hidden rounded-xl p-6 border-2 ${
                  cycle.status === 'active' 
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white border-emerald-600 shadow-xl' 
                    : cycle.status === 'planned'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-600 shadow-lg'
                    : 'bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-medium opacity-80 mb-1">Ciclo {cycle.number}</div>
                    <div className="text-3xl font-bold">{cycle.roi}</div>
                    <div className="text-sm opacity-80">ROI</div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    cycle.status === 'active' ? 'bg-white/20' : 'bg-black/10'
                  }`}>
                    {cycle.status}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="opacity-80">Receita</span>
                    <span className="font-bold">{cycle.revenue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-80">Lucro</span>
                    <span className="font-bold">{cycle.profit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-80">SKUs Ativos</span>
                    <span className="font-bold">{cycle.skus}</span>
                  </div>
                </div>

                {cycle.status === 'active' && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Em progresso</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-start gap-4">
              <Globe className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Estratégia de Crescimento Exponencial
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Cada ciclo reinveste <strong>70% do lucro</strong> enquanto aprende com dados neurais. 
                  O sistema identifica SKUs de melhor performance, otimiza mix de produtos e expande 
                  verticais com maior engajamento. ROI cresce de <strong>32% → 55%</strong> em 3 ciclos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Vision */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-8 text-white shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">🚀 Visão Estratégica Neural</h2>
            <p className="text-lg text-indigo-200 max-w-3xl mx-auto">
              Transformando produtos físicos em experiências inteligentes conectadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">Margem + Dados</h3>
              <p className="text-indigo-200 text-sm">
                Cada produto gera margem financeira E dados comportamentais para IA preditiva
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">♻️</div>
              <h3 className="text-xl font-bold mb-2">Recorrência Neural</h3>
              <p className="text-indigo-200 text-sm">
                Sistema recompensa recompra inteligente baseada em padrões de uso e preferências
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="text-xl font-bold mb-2">Escalabilidade Global</h3>
              <p className="text-indigo-200 text-sm">
                Arquitetura replicável para novos mercados com mínimas adaptações locais
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
