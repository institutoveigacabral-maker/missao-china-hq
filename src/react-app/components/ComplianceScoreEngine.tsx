import { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle, Clock, X, Brain, TrendingUp, Eye } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button';
import { LoadingSpinner } from '@/react-app/components/ui/LoadingStates';
import StatusIndicator from '@/react-app/components/StatusIndicator';

interface ComplianceScoreEngineProps {
  skuCode: string;
  onClose: () => void;
  className?: string;
}

interface ComplianceData {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  regulations: {
    id: string;
    name: string;
    status: 'compliant' | 'pending' | 'non-compliant';
    deadline?: string;
    criticality: 'low' | 'medium' | 'high';
  }[];
  recommendations: string[];
  timeline: {
    phase: string;
    duration: string;
    status: 'completed' | 'in-progress' | 'pending';
  }[];
}

export default function ComplianceScoreEngine({ 
  skuCode, 
  onClose, 
  className = '' 
}: ComplianceScoreEngineProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ComplianceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skuCode) {
      setError('SKU code é obrigatório');
      setLoading(false);
      return;
    }

    const fetchComplianceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/sku-analysis/${skuCode}`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar dados de compliance');
        }
        
        const analysisData = await response.json();
        
        // Transform analysis data to compliance format
        const complianceData: ComplianceData = {
          overallScore: analysisData.compliance_score || 75,
          riskLevel: analysisData.risk_assessment?.overall_risk || 'medium',
          regulations: analysisData.regulations?.slice(0, 5).map((reg: any) => ({
            id: reg.regulation_code,
            name: reg.regulation_name,
            status: reg.compliance_status || 'pending',
            deadline: reg.deadline_date,
            criticality: reg.severity_level || 'medium'
          })) || [],
          recommendations: analysisData.risk_assessment?.mitigation_actions || [
            'Priorizar certificação ANATEL',
            'Validar conformidade RED',
            'Revisar documentação técnica'
          ],
          timeline: analysisData.timeline_estimate ? [
            {
              phase: 'Análise regulatória',
              duration: '15 dias',
              status: analysisData.timeline_estimate.t_60_45?.length > 0 ? 'completed' : 'pending'
            },
            {
              phase: 'Testes e certificação',
              duration: '30 dias',
              status: analysisData.timeline_estimate.t_44_30?.length > 0 ? 'in-progress' : 'pending'
            },
            {
              phase: 'Aprovação final',
              duration: '14 dias',
              status: 'pending'
            }
          ] : []
        };
        
        setData(complianceData);
      } catch (err) {
        console.error('Compliance Engine error:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceData();
  }, [skuCode]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      case 'critical': return 'danger';
      default: return 'info';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'non-compliant':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Shield className="w-4 h-4 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-slate-200 shadow-lg p-8 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Compliance Score Engine</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center py-12">
          <LoadingSpinner size="lg" />
          <p className="text-slate-600 mt-4">Analisando compliance para SKU {skuCode}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl border border-slate-200 shadow-lg p-8 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Compliance Score Engine</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Erro na Análise</h4>
          <p className="text-slate-600 mb-4">{error}</p>
          <SecondaryButton onClick={onClose}>
            Fechar
          </SecondaryButton>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Compliance Score Engine</h3>
            <p className="text-sm text-slate-600">SKU: {skuCode}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(data.overallScore)}`}>
            {data.overallScore}%
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <StatusIndicator status={getRiskColor(data.riskLevel) as any} text={`Risco ${data.riskLevel}`} />
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                data.overallScore >= 90 ? 'bg-green-500' :
                data.overallScore >= 70 ? 'bg-blue-500' :
                data.overallScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${data.overallScore}%` }}
            />
          </div>
        </div>

        {/* Regulations Status */}
        <div>
          <h4 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Status Regulamentações</span>
          </h4>
          <div className="space-y-3">
            {data.regulations.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  {getStatusIcon(reg.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">{reg.name}</div>
                    <div className="text-sm text-slate-600">{reg.id}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIndicator 
                    status={reg.status === 'compliant' ? 'success' : reg.status === 'pending' ? 'warning' : 'danger'} 
                    text={reg.status} 
                  />
                  {reg.deadline && (
                    <span className="text-xs text-slate-500">{reg.deadline}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        {data.timeline.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Timeline de Compliance</span>
            </h4>
            <div className="space-y-3">
              {data.timeline.map((phase, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {getStatusIcon(phase.status)}
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{phase.phase}</div>
                    <div className="text-sm text-slate-600">{phase.duration}</div>
                  </div>
                  <StatusIndicator 
                    status={phase.status === 'completed' ? 'success' : phase.status === 'in-progress' ? 'warning' : 'info'} 
                    text={phase.status} 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Recomendações</span>
            </h4>
            <ul className="space-y-2">
              {data.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4 pt-4 border-t border-slate-200">
          <PrimaryButton size="sm" className="flex-1">
            Gerar Relatório Completo
          </PrimaryButton>
          <SecondaryButton size="sm" onClick={onClose}>
            Fechar
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}
