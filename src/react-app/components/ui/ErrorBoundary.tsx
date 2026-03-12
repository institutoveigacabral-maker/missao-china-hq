import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/react-app/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to monitoring service (if available)
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      // In production, send to error monitoring service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // For now, just log to console
      console.error('Error Report:', errorReport);
      
      // In production: send to service like Sentry, LogRocket, etc.
      // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorReport) });
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  handleReportError = () => {
    const subject = encodeURIComponent(`Bug Report - ${this.state.errorId}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Error Message: ${this.state.error?.message}
URL: ${window.location.href}
Time: ${new Date().toISOString()}

Stack Trace:
${this.state.error?.stack}

Component Stack:
${this.state.errorInfo?.componentStack}

Additional Details:
[Please describe what you were doing when this error occurred]
    `);
    
    window.open(`mailto:dev@exemplo.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-red-50 border-b border-red-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-red-900">Ops! Algo deu errado</h1>
                  <p className="text-sm text-red-700">
                    Encontramos um erro inesperado na aplicação
                  </p>
                </div>
              </div>
            </div>

            {/* Error Details */}
            <div className="p-6 space-y-6">
              {/* Error Summary */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-800 mb-2">Detalhes do Erro:</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-600">ID:</span>
                    <span className="ml-2 font-mono text-slate-900">{this.state.errorId}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Mensagem:</span>
                    <span className="ml-2 text-slate-900">{this.state.error?.message}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Horário:</span>
                    <span className="ml-2 text-slate-900">{new Date().toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* What to do next */}
              <div>
                <h3 className="text-sm font-medium text-slate-800 mb-3">O que você pode fazer:</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Tentar novamente</p>
                      <p className="text-xs text-slate-600">Clique em "Tentar Novamente" - o erro pode ter sido temporário</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Home className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Voltar ao início</p>
                      <p className="text-xs text-slate-600">Navegue para a página inicial e tente uma ação diferente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Bug className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Reportar erro</p>
                      <p className="text-xs text-slate-600">Ajude-nos a corrigir este problema enviando um relatório</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <PrimaryButton
                  onClick={this.handleRetry}
                  icon={RefreshCw}
                  className="flex-1"
                >
                  Tentar Novamente
                </PrimaryButton>
                
                <SecondaryButton
                  onClick={() => window.location.href = '/'}
                  icon={Home}
                  className="flex-1"
                >
                  Voltar ao Início
                </SecondaryButton>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <SecondaryButton
                  onClick={this.handleReportError}
                  icon={Bug}
                  size="sm"
                  className="w-full text-orange-600 border-orange-200 hover:border-orange-300"
                >
                  Reportar Este Erro
                </SecondaryButton>
              </div>
            </div>

            {/* Debug Info (development only) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="border-t border-slate-200 bg-slate-50">
                <summary className="p-4 cursor-pointer text-sm font-medium text-slate-700 hover:bg-slate-100">
                  Debug Info (Development)
                </summary>
                <div className="p-4 bg-slate-100 text-xs">
                  <div className="space-y-2">
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 bg-white p-2 rounded border text-xs overflow-auto">
                        {this.state.error?.stack}
                      </pre>
                    </div>
                    
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 bg-white p-2 rounded border text-xs overflow-auto">
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </div>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple error boundary for smaller components
export function SimpleErrorBoundary({ 
  children, 
  fallback,
  className = ""
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
  className?: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className={`border border-red-200 bg-red-50 rounded-lg p-4 ${className}`}>
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Erro ao carregar componente</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Tente recarregar a página ou contacte o suporte se o problema persistir.
            </p>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
