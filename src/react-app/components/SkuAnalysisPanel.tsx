import { useState } from 'react';
import { 
  Package, 
  Shield, 
  Factory, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Globe,
  FileText,
  Calendar,
  Target,
  BarChart3,
  Zap,
  X
} from 'lucide-react';
import type { SkuAnalysisData } from '@/react-app/hooks/useSkuAnalysis';
import StatusIndicator from './StatusIndicator';

interface SkuAnalysisPanelProps {
  analysisData: SkuAnalysisData;
  onClose: () => void;
}

export default function SkuAnalysisPanel({ analysisData, onClose }: SkuAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'regulations' | 'suppliers' | 'taxation' | 'timeline'>('overview');

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatCurrency = (value: number, currency: string = 'USD') => {
    const symbol = currency === 'BRL' ? 'R$' : currency === 'EUR' ? '€' : '$';
    return `${symbol} ${value.toFixed(2)}`;
  };

  const getDaysUntilDeadline = (dateStr: string) => {
    const deadline = new Date(dateStr);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'regulations', label: 'Normas', icon: Shield },
    { id: 'suppliers', label: 'Fornecedores', icon: Factory },
    { id: 'taxation', label: 'Tributação', icon: DollarSign },
    { id: 'timeline', label: 'Timeline', icon: Calendar }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 sm:p-4 text-white">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold truncate">{analysisData.sku.product_name}</h2>
                <p className="text-blue-100 font-mono text-xs sm:text-sm truncate">{analysisData.sku.sku_code}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <span className="px-2 py-1 bg-white/20 rounded-full">
                {analysisData.sku.category}
              </span>
              <span className="flex items-center space-x-1">
                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">{analysisData.sku.target_markets}</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 flex-shrink-0">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold">{analysisData.compliance_score}%</div>
              <div className="text-blue-100 text-xs sm:text-sm">Compliance</div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Fechar análise"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors border-b-2 whitespace-nowrap min-w-0 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content with Fixed Height and Scroll */}
      <div className="overflow-hidden">
        <div className="h-80 sm:h-96 overflow-y-auto border-t border-slate-200">
          <div className="p-3 sm:p-4">
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Risk Assessment Dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs sm:text-sm font-medium text-slate-600">Overall Risk</h4>
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                    </div>
                    <div className={`px-2 py-1 rounded-full border text-xs sm:text-sm font-medium ${getRiskColor(analysisData.risk_assessment.overall_risk)}`}>
                      {analysisData.risk_assessment.overall_risk}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs sm:text-sm font-medium text-slate-600">Regulatory</h4>
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-900">{analysisData.risk_assessment.regulatory_risk}%</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs sm:text-sm font-medium text-slate-600">Supplier</h4>
                      <Factory className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-900">{analysisData.risk_assessment.supplier_risk}%</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs sm:text-sm font-medium text-slate-600">Financial</h4>
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-900">{analysisData.risk_assessment.financial_risk}%</div>
                  </div>
                </div>

                {/* Risk Factors & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="border border-red-200 bg-red-50 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Risk Factors</span>
                    </h4>
                    <div className="space-y-2 max-h-28 sm:max-h-32 overflow-y-auto">
                      {analysisData.risk_assessment.risk_factors.map((factor, index) => (
                        <div key={index} className="text-xs sm:text-sm text-red-700 flex items-start">
                          <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span className="line-clamp-2">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border border-green-200 bg-green-50 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Mitigation Actions</span>
                    </h4>
                    <div className="space-y-2 max-h-28 sm:max-h-32 overflow-y-auto">
                      {analysisData.risk_assessment.mitigation_actions.map((action, index) => (
                        <div key={index} className="text-xs sm:text-sm text-green-700 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="line-clamp-2">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial Projections */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 flex-shrink-0" />
                    <span className="text-sm sm:text-base">Financial Projections</span>
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <div className="text-xs text-slate-600 mb-1">FOB Range</div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {formatCurrency(analysisData.financial_projections.fob_estimate_range.min)} - {formatCurrency(analysisData.financial_projections.fob_estimate_range.max)}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-600 mb-1">Brazil Landed</div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{formatCurrency(analysisData.financial_projections.brazil_landed_cost, 'BRL')}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-600 mb-1">Portugal Landed</div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{formatCurrency(analysisData.financial_projections.portugal_landed_cost, 'EUR')}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-600 mb-1">ROI Projection</div>
                      <div className="font-bold text-green-600 text-xs sm:text-sm">{analysisData.financial_projections.roi_projection}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'regulations' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Applicable Regulations</h3>
                  <span className="text-sm text-slate-600">{analysisData.regulations.length} regulations</span>
                </div>
                
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {analysisData.regulations.map((regulation) => (
                    <div key={regulation.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-medium text-slate-900">{regulation.regulation_name}</h4>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {regulation.region}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 font-mono">{regulation.regulation_code}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <StatusIndicator 
                            status={regulation.severity_level === 'critical' ? 'danger' : 'warning'} 
                            text={regulation.severity_level} 
                          />
                          {regulation.deadline_date && (
                            <div className="text-xs text-slate-500 mt-1">
                              {getDaysUntilDeadline(regulation.deadline_date)} days
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          regulation.compliance_status === 'compliant' ? 'bg-green-100 text-green-800' :
                          regulation.compliance_status === 'gap_identified' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {regulation.compliance_status.replace('_', ' ')}
                        </span>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-slate-700 mb-2">Key Requirements:</h5>
                        <div className="max-h-24 overflow-y-auto">
                          <ul className="space-y-1">
                            {regulation.requirements.map((req, index) => (
                              <li key={index} className="text-sm text-slate-600 flex items-start">
                                <FileText className="w-3 h-3 text-slate-400 mt-1 mr-2 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'suppliers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Recommended Suppliers</h3>
                  <span className="text-sm text-slate-600">{analysisData.suppliers.length} suppliers</span>
                </div>
                
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {analysisData.suppliers.map((supplier) => (
                    <div key={supplier.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-slate-900">{supplier.company_name}</h4>
                          <p className="text-sm text-slate-600 font-mono">{supplier.supplier_code}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-600">{supplier.country}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-slate-900">{supplier.overall_score.toFixed(1)}</div>
                          <div className="text-xs text-slate-500">Overall Score</div>
                          <StatusIndicator 
                            status={supplier.is_approved ? 'success' : 'warning'} 
                            text={supplier.is_approved ? 'Approved' : 'Pending'} 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-slate-600">Quality Rating</div>
                          <div className="font-bold text-slate-900">{supplier.quality_rating}/5</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Compliance</div>
                          <div className="font-bold text-slate-900">{supplier.compliance_score}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Lead Time</div>
                          <div className="font-bold text-slate-900">{supplier.lead_time_days} days</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">MOQ</div>
                          <div className="font-bold text-slate-900">{supplier.moq.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1">
                          {supplier.certifications.split(', ').map((cert, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              {cert}
                            </span>
                          ))}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(supplier.risk_level)} flex-shrink-0`}>
                          {supplier.risk_level} risk
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'taxation' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Brazil Taxation */}
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                      <span className="mr-2">🇧🇷</span> Brasil Taxation
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">NCM Code:</span>
                        <span className="font-mono text-green-900">{analysisData.taxation.brazil.ncm_code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">II:</span>
                        <span className="font-bold text-green-900">{analysisData.taxation.brazil.ii_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">IPI:</span>
                        <span className="font-bold text-green-900">{analysisData.taxation.brazil.ipi_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-700">ICMS:</span>
                        <span className="font-bold text-green-900">{analysisData.taxation.brazil.icms_rate}%</span>
                      </div>
                      <div className="border-t border-green-200 pt-2 flex justify-between">
                        <span className="font-medium text-green-800">Total Tax Rate:</span>
                        <span className="font-bold text-green-900">{analysisData.taxation.brazil.total_tax_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-green-800">Landed Cost Est:</span>
                        <span className="font-bold text-green-900">R$ {analysisData.taxation.brazil.landed_cost_estimate}</span>
                      </div>
                      {analysisData.taxation.brazil.afrmm_applicable && (
                        <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
                          ⚠️ AFRMM applicable (25% on freight)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Portugal Taxation */}
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
                      <span className="mr-2">🇵🇹</span> Portugal Taxation
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">HS Code:</span>
                        <span className="font-mono text-blue-900">{analysisData.taxation.portugal.hs_code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Duty:</span>
                        <span className="font-bold text-blue-900">{analysisData.taxation.portugal.duty_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">IVA:</span>
                        <span className="font-bold text-blue-900">{analysisData.taxation.portugal.iva_rate}%</span>
                      </div>
                      <div className="border-t border-blue-200 pt-2 flex justify-between">
                        <span className="font-medium text-blue-800">Total Tax Rate:</span>
                        <span className="font-bold text-blue-900">{analysisData.taxation.portugal.total_tax_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-800">Landed Cost Est:</span>
                        <span className="font-bold text-blue-900">€ {analysisData.taxation.portugal.landed_cost_estimate}</span>
                      </div>
                      <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                        💡 VAT warehouse available for deferral
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Comparison */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-3">Cost Comparison Analysis</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-slate-900">
                        {((analysisData.taxation.brazil.total_tax_rate - analysisData.taxation.portugal.total_tax_rate)).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-600">Tax Difference</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        R$ {(analysisData.taxation.brazil.landed_cost_estimate - analysisData.taxation.portugal.landed_cost_estimate * 5.2).toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-600">Potential Savings (BRL)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">PT</div>
                      <div className="text-sm text-slate-600">Recommended Route</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Project Timeline Estimate</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{analysisData.timeline_estimate.total_days}</div>
                    <div className="text-sm text-slate-600">Total Days</div>
                  </div>
                </div>

                {/* Timeline Phases */}
                <div className="space-y-4 max-h-72 overflow-y-auto">
                  {[
                    { phase: 't_60_45', title: 'T-60 a T-45 — Planejamento', color: 'blue', tasks: analysisData.timeline_estimate.t_60_45 },
                    { phase: 't_44_30', title: 'T-44 a T-30 — Amostras & Contratos', color: 'purple', tasks: analysisData.timeline_estimate.t_44_30 },
                    { phase: 't_29_15', title: 'T-29 a T-15 — DUPRO & Docs', color: 'orange', tasks: analysisData.timeline_estimate.t_29_15 },
                    { phase: 't_14_0', title: 'T-14 a T-0 — FRI & Go-Live', color: 'green', tasks: analysisData.timeline_estimate.t_14_0 }
                  ].map((phase) => (
                    <div key={phase.phase} className={`border border-${phase.color}-200 bg-${phase.color}-50 rounded-lg p-4`}>
                      <h4 className={`font-semibold text-${phase.color}-800 mb-3`}>{phase.title}</h4>
                      <div className="max-h-24 overflow-y-auto">
                        <ul className="space-y-2">
                          {phase.tasks.map((task, index) => (
                            <li key={index} className={`text-sm text-${phase.color}-700 flex items-start`}>
                              <CheckCircle className={`w-4 h-4 text-${phase.color}-600 mt-0.5 mr-2 flex-shrink-0`} />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Critical Path */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Critical Path Items
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.timeline_estimate.critical_path.map((item, index) => (
                      <span key={index} className="px-3 py-1 text-sm bg-yellow-200 text-yellow-800 rounded-full font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
