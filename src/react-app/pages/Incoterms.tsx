import { useState } from 'react';
;
import { Settings, Package, DollarSign, Shield, AlertTriangle, CheckCircle, Truck, Plane } from 'lucide-react';
import StatusIndicator from '@/react-app/components/StatusIndicator';

export default function Incoterms() {
  const [selectedIncoterm, setSelectedIncoterm] = useState('FOB');
  const [calculatorData, setCalculatorData] = useState({
    productValue: 10000,
    freight: 800,
    insurance: 150,
    selectedIncoterm: 'FOB'
  });

  // Incoterms 2020 data
  const incoterms = [
    {
      term: 'FOB',
      fullName: 'Free on Board',
      category: 'Maritime',
      riskTransfer: 'Port of shipment',
      buyerResponsibilities: [
        'Frete marítimo/aéreo',
        'Seguro internacional',
        'Desembaraço importação',
        'Transporte interno destino',
        'Riscos em trânsito'
      ],
      sellerResponsibilities: [
        'Export clearance',
        'Transporte até porto embarque',
        'Carregamento no navio',
        'Documentação exportação'
      ],
      bestFor: 'Controle total sobre logística, seguro e custos de transporte',
      risks: [
        'Buyer assume riscos em trânsito',
        'Complexidade documentação',
        'Coordenação múltiplos fornecedores'
      ],
      usageFrequency: 45,
      avgSavings: '8-12%'
    },
    {
      term: 'CIF',
      fullName: 'Cost, Insurance and Freight',
      category: 'Maritime',
      riskTransfer: 'Port of destination',
      buyerResponsibilities: [
        'Desembaraço importação',
        'Transporte interno do porto',
        'Impostos e taxas destino'
      ],
      sellerResponsibilities: [
        'Frete até porto destino',
        'Seguro mínimo (110% CIF)',
        'Export clearance',
        'Documentação completa',
        'Riscos até porto destino'
      ],
      bestFor: 'Simplicidade operacional e menor complexidade inicial',
      risks: [
        'Seguro mínimo inadequado',
        'Menos controle sobre timing',
        'Potential markup nos custos'
      ],
      usageFrequency: 35,
      avgSavings: '3-6%'
    },
    {
      term: 'DAP',
      fullName: 'Delivered at Place',
      category: 'Multimodal',
      riskTransfer: 'Named place of destination',
      buyerResponsibilities: [
        'Desembaraço importação',
        'Impostos e taxas',
        'Descarga no local nomeado'
      ],
      sellerResponsibilities: [
        'Transporte até local acordado',
        'Seguro até destino',
        'Export clearance',
        'Todos os riscos até entrega',
        'Documentação completa'
      ],
      bestFor: 'UE com armazém fiscal, reduz complexidade logística',
      risks: [
        'Seller controla timing',
        'Menor flexibilidade rotas',
        'Dependência operacional seller'
      ],
      usageFrequency: 15,
      avgSavings: '1-4%'
    },
    {
      term: 'DDP',
      fullName: 'Delivered Duty Paid',
      category: 'Multimodal',
      riskTransfer: 'Final destination',
      buyerResponsibilities: [
        'Descarga no local final',
        'Aceitação da mercadoria'
      ],
      sellerResponsibilities: [
        'Todos os custos até destino',
        'Desembaraço importação',
        'Impostos e taxas',
        'Transport + seguro completo',
        'Todos os riscos'
      ],
      bestFor: 'Máxima simplicidade, seller assume todos os riscos',
      risks: [
        'Seller pode não conhecer impostos',
        'Markup elevado nos custos',
        'Menos controle total'
      ],
      usageFrequency: 5,
      avgSavings: '-5-0%'
    }
  ];

  // Contract clauses
  const contractClauses = [
    {
      category: 'Quality Control',
      title: 'Amostra Selada (Sealed Sample)',
      description: 'Duas vias lacradas com especificações técnicas detalhadas',
      importance: 'Critical',
      template: 'Seller shall provide two sealed samples of the products with identical specifications. Any deviation from sealed sample specifications shall constitute breach of contract.',
      enforceability: 'High'
    },
    {
      category: 'Anti-Substitution',
      title: 'No Substitution Without Consent',
      description: 'Proibição expressa de switch de materiais sem autorização',
      importance: 'Critical',
      template: 'Seller warrants no substitution of materials, components, or manufacturing processes without prior written consent from Buyer.',
      enforceability: 'High'
    },
    {
      category: 'Compliance',
      title: 'Regulatory Compliance Warranty',
      description: 'Garantia de conformidade com normas Brasil/UE',
      importance: 'High',
      template: 'Seller warrants full compliance with all applicable regulations in destination markets, including but not limited to ANATEL, CE, RED Directive.',
      enforceability: 'Medium'
    },
    {
      category: 'Inspection',
      title: 'Third-Party Inspection Rights',
      description: 'Direito de inspeção por terceiros sem aviso prévio',
      importance: 'High',
      template: 'Buyer reserves the right to conduct unannounced third-party inspections during production and pre-shipment.',
      enforceability: 'Medium'
    },
    {
      category: 'Force Majeure',
      title: 'Limited Force Majeure',
      description: 'Força maior limitada excluindo previsíveis',
      importance: 'Medium',
      template: 'Force majeure excludes foreseeable events, supplier capacity issues, and material cost fluctuations.',
      enforceability: 'High'
    },
    {
      category: 'Dispute Resolution',
      title: 'Hong Kong Arbitration',
      description: 'Arbitragem em Hong Kong para neutralidade',
      importance: 'Medium',
      template: 'All disputes shall be resolved by arbitration under HKIAC Rules, with proceedings conducted in English.',
      enforceability: 'High'
    }
  ];

  // Cost calculator
  const calculateCosts = () => {
    const { productValue, freight, insurance, selectedIncoterm } = calculatorData;
    
    let sellerCosts = productValue;
    let buyerCosts = 0;
    
    switch (selectedIncoterm) {
      case 'FOB':
        buyerCosts = freight + insurance;
        break;
      case 'CIF':
        sellerCosts += freight + insurance;
        break;
      case 'DAP':
        sellerCosts += freight + insurance;
        break;
      case 'DDP':
        sellerCosts += freight + insurance + (productValue * 0.25); // Estimated duties/taxes
        break;
    }
    
    return {
      sellerCosts: sellerCosts.toFixed(0),
      buyerCosts: buyerCosts.toFixed(0),
      totalCosts: (sellerCosts + buyerCosts).toFixed(0)
    };
  };

  const costs = calculateCosts();
  const selectedIncotermData = incoterms.find(i => i.term === selectedIncoterm);

  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getEnforceabilityColor = (enforceability: string) => {
    switch (enforceability.toLowerCase()) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Settings className="w-8 h-8" />
                <h1 className="text-3xl font-bold">Incoterms® & Negociação</h1>
              </div>
              <p className="text-indigo-100 text-lg mb-4">
                FOB/CIF/DAP — Contratos & cláusulas anti-litígio
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>4 Incoterms Principais</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>6 Cláusulas Críticas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>8-12% Savings FOB</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">FOB</div>
              <div className="text-indigo-100">Recommended for China</div>
            </div>
          </div>
        </div>

        {/* Incoterm Selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Selecionar Incoterm</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {incoterms.map((incoterm) => (
              <button
                key={incoterm.term}
                onClick={() => setSelectedIncoterm(incoterm.term)}
                className={`p-4 rounded-xl text-left transition-all ${
                  selectedIncoterm === incoterm.term
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-lg'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Settings className="w-6 h-6" />
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedIncoterm === incoterm.term ? 'bg-white/20' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {incoterm.usageFrequency}% usage
                  </span>
                </div>
                <h3 className="font-bold text-lg">{incoterm.term}</h3>
                <p className={`text-sm mt-1 ${
                  selectedIncoterm === incoterm.term ? 'text-white/80' : 'text-slate-600'
                }`}>
                  {incoterm.fullName}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Savings</span>
                  <span className="font-bold">{incoterm.avgSavings}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Incoterm Details */}
        {selectedIncotermData && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                {selectedIncotermData.term} — {selectedIncotermData.fullName}
              </h2>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full">
                  {selectedIncotermData.category}
                </span>
                <StatusIndicator status="info" text={`${selectedIncotermData.usageFrequency}% usage`} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">Best For</h3>
                <p className="text-sm text-slate-700 mb-4">{selectedIncotermData.bestFor}</p>
                
                <h4 className="font-semibold text-slate-800 mb-2">Risk Transfer Point</h4>
                <p className="text-sm text-slate-600">{selectedIncotermData.riskTransfer}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-green-800 mb-3">✅ Buyer Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedIncotermData.buyerResponsibilities.map((resp, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-blue-800 mb-3">📦 Seller Responsibilities</h3>
                <ul className="space-y-2">
                  {selectedIncotermData.sellerResponsibilities.map((resp, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-slate-700">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Key Risks</h4>
              <ul className="space-y-1">
                {selectedIncotermData.risks.map((risk, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Cost Calculator */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">💰 Cost Calculator by Incoterm</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Input Values (USD)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Value</label>
                  <input
                    type="number"
                    value={calculatorData.productValue}
                    onChange={(e) => setCalculatorData({...calculatorData, productValue: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Freight Cost</label>
                  <input
                    type="number"
                    value={calculatorData.freight}
                    onChange={(e) => setCalculatorData({...calculatorData, freight: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Insurance</label>
                  <input
                    type="number"
                    value={calculatorData.insurance}
                    onChange={(e) => setCalculatorData({...calculatorData, insurance: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Calculate for Incoterm</label>
                  <select
                    value={calculatorData.selectedIncoterm}
                    onChange={(e) => setCalculatorData({...calculatorData, selectedIncoterm: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {incoterms.map((incoterm) => (
                      <option key={incoterm.term} value={incoterm.term}>
                        {incoterm.term} - {incoterm.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Cost Breakdown</h3>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">Seller Costs:</span>
                  <span className="font-bold text-slate-900">$ {costs.sellerCosts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">Buyer Costs:</span>
                  <span className="font-bold text-slate-900">$ {costs.buyerCosts}</span>
                </div>
                <div className="border-t border-indigo-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Total Costs:</span>
                    <span className="font-bold text-indigo-800 text-lg">$ {costs.totalCosts}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-800 mb-2">Cost Distribution</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Seller Share</span>
                      <span>{((Number(costs.sellerCosts) / Number(costs.totalCosts)) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(Number(costs.sellerCosts) / Number(costs.totalCosts)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Buyer Share</span>
                      <span>{((Number(costs.buyerCosts) / Number(costs.totalCosts)) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(Number(costs.buyerCosts) / Number(costs.totalCosts)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Clauses */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">⚖️ Essential Contract Clauses</h2>
          <div className="space-y-4">
            {contractClauses.map((clause, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h4 className="font-semibold text-slate-900">{clause.title}</h4>
                      <p className="text-sm text-slate-600">{clause.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImportanceColor(clause.importance)}`}>
                      {clause.importance}
                    </span>
                    <div className={`text-sm font-medium mt-1 ${getEnforceabilityColor(clause.enforceability)}`}>
                      {clause.enforceability} enforceability
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-slate-800 mb-2">Template Language:</h5>
                  <p className="text-sm text-slate-700 italic">"{clause.template}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Practices Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Truck className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-slate-900">FOB Best Practices</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Dual bookings diferentes armadores</li>
              <li>• Seguro all-risk próprio quando valor justificar</li>
              <li>• Free time estendido negociado</li>
              <li>• Cláusula demurrage cap</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Plane className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-slate-900">CIF Considerations</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Verificar adequação seguro mínimo</li>
              <li>• Clausulas sobre timing delivery</li>
              <li>• Markup transparency nos custos</li>
              <li>• Documentação completa requirement</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h3 className="font-bold text-slate-900">Risk Mitigation</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Hong Kong arbitration clauses</li>
              <li>• Third-party inspection rights</li>
              <li>• Force majeure limitations</li>
              <li>• Clear acceptance criteria</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
