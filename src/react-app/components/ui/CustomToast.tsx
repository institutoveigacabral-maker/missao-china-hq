import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X, Brain, Zap, Package, Factory, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface CustomToastProps {
  t: any;
  type: 'success' | 'error' | 'warning' | 'info' | 'neural' | 'sku' | 'supplier' | 'compliance';
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  neural?: boolean;
  ecosystem?: string;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  neural: Brain,
  sku: Package,
  supplier: Factory,
  compliance: Shield,
};

const colors = {
  success: 'text-green-600 bg-green-50 border-green-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  neural: 'text-violet-600 bg-violet-50 border-violet-200',
  sku: 'text-blue-600 bg-blue-50 border-blue-200',
  supplier: 'text-orange-600 bg-orange-50 border-orange-200',
  compliance: 'text-green-600 bg-green-50 border-green-200',
};

const gradients = {
  success: 'from-green-500 to-emerald-400',
  error: 'from-red-500 to-rose-400',
  warning: 'from-yellow-500 to-amber-400',
  info: 'from-blue-500 to-cyan-400',
  neural: 'from-violet-500 to-purple-400',
  sku: 'from-blue-500 to-indigo-400',
  supplier: 'from-orange-500 to-red-400',
  compliance: 'from-green-500 to-teal-400',
};

export const CustomToast: React.FC<CustomToastProps> = ({ 
  t, 
  type, 
  title, 
  message, 
  action,
  neural = false,
  ecosystem
}) => {
  const Icon = icons[type];
  const colorClass = colors[type];
  const gradientClass = gradients[type];

  const getEcosystemIcon = (eco?: string) => {
    const ecosystemIcons: Record<string, string> = {
      'CASA': '🏠',
      'SMART': '⚡',
      'IOT': '⚙️',
      'RIDER': '🚴',
      'RFS': '🍽️',
      'FITNESS': '💪',
      'PET': '🐾'
    };
    return ecosystemIcons[eco || ''] || '🔗';
  };

  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${colorClass} border backdrop-blur-md transform transition-all duration-300 hover:scale-105`}
      style={{
        animation: t.visible 
          ? 'slideInRight 0.3s ease-out forwards' 
          : 'slideOutRight 0.3s ease-in forwards'
      }}
    >
      {/* Neural indicator */}
      {neural && (
        <div className={`w-1 bg-gradient-to-b ${gradientClass} rounded-l-xl`} />
      )}

      <div className="flex-1 w-0 p-4 sm:p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0 relative">
            <Icon className="h-6 w-6 sm:h-5 sm:w-5" />
            {neural && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full animate-pulse">
                <div className="absolute inset-0 w-3 h-3 bg-violet-400 rounded-full animate-ping opacity-75"></div>
              </div>
            )}
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">
                {title}
              </p>
              {ecosystem && (
                <span className="text-lg" title={ecosystem}>
                  {getEcosystemIcon(ecosystem)}
                </span>
              )}
            </div>
            
            {message && (
              <p className="mt-1 text-sm opacity-90 leading-relaxed">
                {message}
              </p>
            )}

            {neural && (
              <div className="mt-2 flex items-center gap-2 text-xs opacity-75">
                <Zap className="w-3 h-3" />
                <span>Sistema Neural Ativo</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {action && (
        <div className="flex border-l border-gray-200/60">
          <button
            onClick={() => {
              action.onClick();
              toast.dismiss(t.id);
            }}
            className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-white/50"
          >
            {action.label}
          </button>
        </div>
      )}
      
      <div className="flex border-l border-gray-200/60">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-xl p-4 flex items-center justify-center hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-white/50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Glow effect for neural toasts */}
      {neural && (
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientClass} opacity-20 blur-xl rounded-xl pointer-events-none scale-110`} />
      )}
    </div>
  );
};

// Enhanced toast creator functions
export const createCustomToast = {
  success: (title: string, message?: string, action?: CustomToastProps['action']) => {
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="success"
        title={title}
        message={message}
        action={action}
      />
    ), { duration: 4000 });
  },

  error: (title: string, message?: string, action?: CustomToastProps['action']) => {
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="error"
        title={title}
        message={message}
        action={action}
      />
    ), { duration: 6000 });
  },

  warning: (title: string, message?: string, action?: CustomToastProps['action']) => {
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="warning"
        title={title}
        message={message}
        action={action}
      />
    ), { duration: 5000 });
  },

  info: (title: string, message?: string, action?: CustomToastProps['action']) => {
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="info"
        title={title}
        message={message}
        action={action}
      />
    ), { duration: 4000 });
  },

  neural: (title: string, message?: string, ecosystem?: string, action?: CustomToastProps['action']) => {
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="neural"
        title={title}
        message={message}
        action={action}
        neural={true}
        ecosystem={ecosystem}
      />
    ), { duration: 5000 });
  },

  sku: (title: string, message?: string, action?: CustomToastProps['action']) => {
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="sku"
        title={title}
        message={message}
        action={action}
      />
    ), { duration: 4000 });
  },

  supplier: (title: string, message?: string, action?: CustomToastProps['action']) => {
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="supplier"
        title={title}
        message={message}
        action={action}
      />
    ), { duration: 4000 });
  },

  compliance: (title: string, message?: string, action?: CustomToastProps['action']) => {
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="compliance"
        title={title}
        message={message}
        action={action}
      />
    ), { duration: 4000 });
  },
};

// CSS animations (to be added to index.css)
const styles = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.animate-enter {
  animation: slideInRight 0.3s ease-out forwards;
}

.animate-leave {
  animation: slideOutRight 0.3s ease-in forwards;
}
`;

export { styles as customToastStyles };
