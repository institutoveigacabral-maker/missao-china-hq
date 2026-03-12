import { useState } from 'react';
import { CheckCircle, AlertTriangle, Clock, ChevronDown, ChevronUp, Target } from 'lucide-react';

interface RequirementStatus {
  id: string;
  category: string;
  name: string;
  description: string;
  status: 'completed' | 'pending' | 'blocked';
  weight: number;
  dueDate?: string;
}

interface SkuProgressIndicatorProps {
  regulatoryStatus: string;
  riskCategory: string;
  hasSupplier: boolean;
  onUpdateProgress?: (newProgress: number, newCompliance: number) => void;
}

export default function SkuProgressIndicator({
  regulatoryStatus,
  riskCategory,
  hasSupplier,
  onUpdateProgress
}: SkuProgressIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [requirements, setRequirements] = useState<RequirementStatus[]>(() => {
    const reqs: RequirementStatus[] = [
      {
        id: 'regulatory',
        category: 'Regulatório',
        name: 'Certificação',
        description: 'ANATEL/CE/FCC aprovado',
        status: regulatoryStatus === 'certified' ? 'completed' : 
                regulatoryStatus === 'blocked' ? 'blocked' : 'pending',
        weight: 40
      },
      {
        id: 'documentation',
        category: 'Documentação',
        name: 'Documentação Técnica',
        description: 'Manuais e fichas técnicas',
        status: 'pending',
        weight: 30
      },
      {
        id: 'supplier',
        category: 'Fornecedor',
        name: 'Supplier OK',
        description: 'Fornecedor qualificado',
        status: hasSupplier ? 'completed' : 'pending',
        weight: 20
      },
      {
        id: 'docs',
        category: 'Docs',
        name: 'Finalização',
        description: 'Aprovação final e lançamento',
        status: 'pending',
        weight: 10
      }
    ];

    return reqs;
  });

  // Calculate scores
  const calculateScores = (updatedRequirements: RequirementStatus[]) => {
    const completedWeight = updatedRequirements
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.weight, 0);
    
    const totalWeight = updatedRequirements.reduce((sum, r) => sum + r.weight, 0);
    
    const progress = Math.round(totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0);
    
    // Compliance considers blocked items as negative impact and risk category
    const blockedPenalty = updatedRequirements.filter(r => r.status === 'blocked').length * 15;
    const riskAdjustment = riskCategory === 'low' ? 10 : riskCategory === 'high' ? -10 : 0;
    const compliance = Math.max(0, Math.min(100, progress - blockedPenalty + riskAdjustment));
    
    return { progress, compliance };
  };

  const { progress, compliance } = calculateScores(requirements);
  const completedCount = requirements.filter(r => r.status === 'completed').length;
  const totalCount = requirements.length;

  const toggleRequirement = (reqId: string) => {
    setRequirements(prev => {
      const updated = prev.map(req => {
        if (req.id === reqId && req.status !== 'blocked') {
          return { 
            ...req, 
            status: req.status === 'completed' ? 'pending' as const : 'completed' as const 
          };
        }
        return req;
      });
      
      // Calculate new scores and notify parent
      const { progress: newProgress, compliance: newCompliance } = calculateScores(updated);
      if (onUpdateProgress) {
        onUpdateProgress(newProgress, newCompliance);
      }
      
      return updated;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'blocked':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'blocked':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-2 sm:p-3 space-y-2">
      {/* Header with Scores */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0">
          <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs text-slate-600">
            <div>
              Progresso: <span className="font-semibold text-slate-900">{progress}%</span>
            </div>
            <div>
              Compliance: <span className="font-semibold text-slate-900">{compliance}%</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100 flex-shrink-0"
          aria-label={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
        >
          <span className="font-medium">{completedCount}/{totalCount}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(progress)}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Expanded Requirements List */}
      {isExpanded && (
        <div className="border-t border-slate-200 pt-2 space-y-2">
          <div className="text-xs text-slate-500 text-center mb-2 bg-slate-50 rounded p-2">
            💡 Clique para marcar como concluído
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {requirements.map((req) => (
              <div
                key={req.id}
                onClick={() => req.status !== 'blocked' && toggleRequirement(req.id)}
                className={`flex items-start p-2 rounded border transition-all ${
                  req.status !== 'blocked' 
                    ? 'cursor-pointer hover:shadow-sm' 
                    : 'cursor-not-allowed opacity-60'
                } ${getStatusColor(req.status)}`}
              >
                <div className="flex items-start space-x-2 flex-1 min-w-0">
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(req.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate pr-1">{req.name}</span>
                      <span className="text-xs opacity-75 flex-shrink-0">{req.weight}%</span>
                    </div>
                    <div className="text-xs opacity-80 mb-1 line-clamp-2">{req.description}</div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="truncate">{req.category}</span>
                      {req.status === 'blocked' && (
                        <span className="text-red-600 font-medium ml-1 flex-shrink-0">
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="border-t border-slate-200 bg-slate-50 rounded p-2">
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Completos: {completedCount}/{totalCount}</span>
              <span>Scores: {progress}%/{compliance}%</span>
            </div>
            
            <div className="space-y-1">
              {requirements.some(r => r.status === 'blocked') && (
                <div className="text-xs text-red-600 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">Itens bloqueados afetam compliance</span>
                </div>
              )}
              
              {riskCategory === 'high' && (
                <div className="text-xs text-orange-600 flex items-center">
                  <span className="w-3 h-3 mr-1 flex-shrink-0">🔸</span>
                  <span className="truncate">Alto risco reduz compliance</span>
                </div>
              )}
              
              {riskCategory === 'low' && (
                <div className="text-xs text-green-600 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">Baixo risco melhora compliance</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
