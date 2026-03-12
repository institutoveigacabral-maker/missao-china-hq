import toast from 'react-hot-toast'
import { createCustomToast } from '@/react-app/components/ui/CustomToast'

interface ToastOptions {
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  style?: React.CSSProperties
}

export const useToast = () => {
  
  // Success toast with custom icon
  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      duration: options?.duration || 4000,
      position: options?.position,
      style: options?.style,
      icon: '✅',
    })
  }

  // Error toast with custom icon
  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      duration: options?.duration || 5000,
      position: options?.position, 
      style: options?.style,
      icon: '❌',
    })
  }

  // Warning toast
  const warning = (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration || 4000,
      position: options?.position,
      style: {
        background: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fbbf24',
        ...options?.style,
      },
      icon: '⚠️',
    })
  }

  // Info toast
  const info = (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration || 4000,
      position: options?.position,
      style: {
        background: '#dbeafe',
        color: '#1e40af',
        border: '1px solid #3b82f6',
        ...options?.style,
      },
      icon: 'ℹ️',
    })
  }

  // Loading toast
  const loading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      position: options?.position,
      style: options?.style,
    })
  }

  // Custom toast for specific actions
  const custom = (message: string, icon: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration || 4000,
      position: options?.position,
      style: options?.style,
      icon: icon,
    })
  }

  // Dismiss toast
  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  }

  // Promise toast - useful for async operations
  const promise = <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
    options?: ToastOptions
  ) => {
    return toast.promise(promise, msgs, {
      position: options?.position,
      style: options?.style,
    })
  }

  // Specific toasts for common actions in the app
  const skuSaved = (skuCode: string) => {
    return success(`SKU ${skuCode} salvo com sucesso!`)
  }

  const skuSelected = (skuCode: string) => {
    return info(`SKU ${skuCode} selecionado para análise`)
  }

  const skuAnalysisStarted = (skuCode: string) => {
    return loading(`🧠 Analisando ${skuCode} com TensorChain...`)
  }

  const skuAnalysisCompleted = (skuCode: string, score: number) => {
    return success(`✨ Análise ${skuCode} concluída! Score: ${score}%`)
  }

  const supplierUpdated = (supplierName: string) => {
    return success(`Fornecedor ${supplierName} atualizado!`)
  }

  const supplierSelected = (supplierName: string) => {
    return info(`🏭 Fornecedor ${supplierName} selecionado`)
  }

  const supplierScoreUpdated = (supplierCode: string, newScore: number) => {
    return success(`📊 Score ${supplierCode} atualizado: ${newScore.toFixed(1)}`)
  }

  const complianceCheck = (status: 'success' | 'warning' | 'error', message: string) => {
    switch (status) {
      case 'success':
        return success(`✅ Compliance: ${message}`)
      case 'warning':
        return warning(`⚠️ Compliance: ${message}`)
      case 'error':
        return error(`❌ Compliance: ${message}`)
    }
  }

  const regulationUpdated = (regulationCode: string) => {
    return success(`📋 Regulamentação ${regulationCode} atualizada`)
  }

  const certificateUploaded = (certificateType: string) => {
    return success(`📄 Certificado ${certificateType} carregado com sucesso`)
  }

  const exportStarted = (type: string) => {
    return info(`📊 Exportação ${type} iniciada...`)
  }

  const exportCompleted = (type: string, fileName: string) => {
    return success(`📁 ${type} exportado: ${fileName}`)
  }

  const importStarted = (type: string) => {
    return loading(`📥 Importando ${type}...`)
  }

  const importCompleted = (type: string, count: number) => {
    return success(`📊 ${count} ${type} importados com sucesso!`)
  }

  const dataRefreshed = () => {
    return success(`🔄 Dados atualizados!`)
  }

  const dataRefreshError = () => {
    return error(`❌ Erro ao atualizar dados`)
  }

  const neuralSyncStarted = () => {
    return loading(`🧠 Sincronizando rede neural...`)
  }

  const neuralSyncCompleted = () => {
    return success(`✨ TensorChain sincronizado! Sistema neural ativo`)
  }

  const cantonFairBoothBooked = (booth: string) => {
    return success(`🏢 Booth ${booth} confirmado na Canton Fair!`)
  }

  const riskAssessmentCompleted = (riskLevel: string) => {
    const icon = riskLevel === 'low' ? '🟢' : riskLevel === 'medium' ? '🟡' : '🔴'
    return info(`${icon} Avaliação de risco: ${riskLevel}`)
  }

  const backupStarted = () => {
    return loading(`💾 Criando backup dos dados...`)
  }

  const backupCompleted = () => {
    return success(`✅ Backup concluído com sucesso!`)
  }

  const systemAlert = (alertType: 'info' | 'warning' | 'critical', message: string) => {
    switch (alertType) {
      case 'info':
        return info(`🔔 Sistema: ${message}`)
      case 'warning':
        return warning(`⚠️ Alerta: ${message}`)
      case 'critical':
        return error(`🚨 Crítico: ${message}`)
    }
  }

  const verticalSelected = (vertical: string) => {
    return info(`🎯 Vertical ${vertical} selecionada`)
  }

  const searchPerformed = (query: string, results: number) => {
    return info(`🔍 Busca "${query}": ${results} resultados`)
  }

  const filterApplied = (filterType: string, count: number) => {
    return info(`🔧 Filtro ${filterType} aplicado: ${count} items`)
  }

  const actionCompleted = (action: string) => {
    return success(`✨ ${action} concluído!`)
  }

  const actionFailed = (action: string, reason?: string) => {
    const message = reason ? `${action}: ${reason}` : action
    return error(`❌ Falha: ${message}`)
  }

  // Enhanced Neural flow specific toasts with CustomToast
  const tensorChainUpdate = (progress: number) => {
    return createCustomToast.neural(
      'TensorChain Sincronizando',
      `Sistema neural ${progress}% sincronizado`,
      'NEURAL'
    )
  }

  const ecosystemAlert = (ecosystem: string, message: string) => {
    return createCustomToast.neural(
      `${ecosystem} Neural Alert`,
      message,
      ecosystem,
      {
        label: 'Ver Detalhes',
        onClick: () => {
          window.location.href = `/playbook?vertical=${ecosystem}`
        }
      }
    )
  }

  // Advanced custom toast methods
  const skuAnalysisProgress = (skuCode: string, progress: number) => {
    return createCustomToast.sku(
      `Análise SKU ${skuCode}`,
      `TensorChain processando... ${progress}% completo`,
      {
        label: 'Ver Progresso',
        onClick: () => {
          window.location.href = `/playbook?sku=${skuCode}`
        }
      }
    )
  }

  const supplierAuditAlert = (supplierName: string, riskLevel: string) => {
    const type = riskLevel === 'high' ? 'error' : riskLevel === 'medium' ? 'warning' : 'info'
    return createCustomToast[type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info'](
      `Auditoria ${supplierName}`,
      `Nível de risco: ${riskLevel.toUpperCase()}`,
      {
        label: 'Revisar',
        onClick: () => {
          window.location.href = `/suppliers?search=${encodeURIComponent(supplierName)}`
        }
      }
    )
  }

  const complianceDeadlineAlert = (regulationCode: string, daysLeft: number) => {
    const isUrgent = daysLeft <= 7
    return createCustomToast.compliance(
      `Deadline Compliance ${regulationCode}`,
      `${daysLeft} dias restantes para conformidade`,
      {
        label: isUrgent ? 'URGENTE' : 'Ver Detalhes',
        onClick: () => {
          window.location.href = `/regulations?search=${regulationCode}`
        }
      }
    )
  }

  const neuralInsight = (insight: string, vertical?: string) => {
    return createCustomToast.neural(
      'Insight Neural Detectado',
      insight,
      vertical,
      {
        label: 'Explorar',
        onClick: () => {
          window.location.href = vertical ? `/playbook?vertical=${vertical}` : '/playbook'
        }
      }
    )
  }

  return {
    // Basic toasts
    success,
    error,
    warning,
    info,
    loading,
    custom,
    dismiss,
    promise,
    
    // SKU actions
    skuSaved,
    skuSelected,
    skuAnalysisStarted,
    skuAnalysisCompleted,
    
    // Supplier actions
    supplierUpdated,
    supplierSelected,
    supplierScoreUpdated,
    
    // Compliance actions
    complianceCheck,
    regulationUpdated,
    certificateUploaded,
    riskAssessmentCompleted,
    
    // Data actions
    exportStarted,
    exportCompleted,
    importStarted,
    importCompleted,
    dataRefreshed,
    dataRefreshError,
    
    // Neural system actions
    neuralSyncStarted,
    neuralSyncCompleted,
    tensorChainUpdate,
    ecosystemAlert,
    
    // Canton Fair actions
    cantonFairBoothBooked,
    
    // System actions
    backupStarted,
    backupCompleted,
    systemAlert,
    verticalSelected,
    searchPerformed,
    filterApplied,
    actionCompleted,
    actionFailed,
    
    // Advanced custom toast methods
    skuAnalysisProgress,
    supplierAuditAlert,
    complianceDeadlineAlert,
    neuralInsight,
    
    // Direct access to custom toast creators
    customToast: createCustomToast,
  }
}

export default useToast
