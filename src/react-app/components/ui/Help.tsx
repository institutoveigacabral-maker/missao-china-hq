import { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, BookOpen, MessageCircle, ExternalLink } from 'lucide-react';
import { SecondaryButton, TertiaryButton } from '@/react-app/components/ui/Button';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
  className?: string;
}

export function HelpTooltip({ 
  content, 
  children, 
  position = 'top', 
  maxWidth = 'max-w-xs',
  className = '' 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const rect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // Check if tooltip would go off screen and adjust position
      let newPosition = position;
      
      if (position === 'top' && rect.top - tooltipRect.height < 10) {
        newPosition = 'bottom';
      } else if (position === 'bottom' && rect.bottom + tooltipRect.height > window.innerHeight - 10) {
        newPosition = 'top';
      } else if (position === 'left' && rect.left - tooltipRect.width < 10) {
        newPosition = 'right';
      } else if (position === 'right' && rect.right + tooltipRect.width > window.innerWidth - 10) {
        newPosition = 'left';
      }
      
      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  const getPositionClasses = () => {
    const base = 'absolute z-50 p-3 bg-slate-900 text-white text-sm rounded-lg shadow-lg';
    const arrow = 'after:absolute after:w-2 after:h-2 after:bg-slate-900 after:rotate-45';
    
    switch (actualPosition) {
      case 'top':
        return `${base} ${arrow} bottom-full left-1/2 transform -translate-x-1/2 mb-2 after:top-full after:left-1/2 after:-translate-x-1/2 after:-mt-1`;
      case 'bottom':
        return `${base} ${arrow} top-full left-1/2 transform -translate-x-1/2 mt-2 after:bottom-full after:left-1/2 after:-translate-x-1/2 after:-mb-1`;
      case 'left':
        return `${base} ${arrow} right-full top-1/2 transform -translate-y-1/2 mr-2 after:left-full after:top-1/2 after:-translate-y-1/2 after:-ml-1`;
      case 'right':
        return `${base} ${arrow} left-full top-1/2 transform -translate-y-1/2 ml-2 after:right-full after:top-1/2 after:-translate-y-1/2 after:-mr-1`;
      default:
        return base;
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`${getPositionClasses()} ${maxWidth} whitespace-normal`}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
}

interface HelpTextProps {
  children: React.ReactNode;
  term?: string;
  className?: string;
}

export function HelpText({ children, term, className = '' }: HelpTextProps) {
  return (
    <HelpTooltip content={children} className={className}>
      <span className="cursor-help border-b border-dotted border-slate-400 text-slate-700 hover:border-slate-600 hover:text-slate-900 transition-colors">
        {term || '?'}
      </span>
    </HelpTooltip>
  );
}

interface HelpIconProps {
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function HelpIcon({ content, position = 'top', size = 'sm', className = '' }: HelpIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <HelpTooltip content={content} position={position} className={className}>
      <HelpCircle className={`${sizeClasses[size]} text-slate-400 hover:text-slate-600 transition-colors cursor-help`} />
    </HelpTooltip>
  );
}

// Contextual Help Panel
interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function HelpPanel({ isOpen, onClose, title = 'Ajuda', children }: HelpPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          </div>
          <TertiaryButton
            onClick={onClose}
            icon={X}
            size="sm"
            aria-label="Fechar ajuda"
          >
            <span className="sr-only">Fechar</span>
          </TertiaryButton>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {children}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Precisa de mais ajuda?</span>
            <div className="flex items-center space-x-3">
              <SecondaryButton size="sm" icon={MessageCircle}>
                Suporte
              </SecondaryButton>
              <SecondaryButton size="sm" icon={BookOpen}>
                Documentação
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Help Card for specific features
interface QuickHelpProps {
  title: string;
  description: string;
  steps?: string[];
  tips?: string[];
  links?: { text: string; url: string }[];
  className?: string;
}

export function QuickHelp({ 
  title, 
  description, 
  steps = [], 
  tips = [], 
  links = [],
  className = '' 
}: QuickHelpProps) {
  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-blue-900 mb-2">{title}</h4>
          <p className="text-sm text-blue-800 mb-3">{description}</p>
          
          {steps.length > 0 && (
            <div className="mb-3">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Como usar:</h5>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 ml-2">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          
          {tips.length > 0 && (
            <div className="mb-3">
              <h5 className="text-sm font-medium text-blue-900 mb-2">💡 Dicas:</h5>
              <ul className="space-y-1 text-sm text-blue-800">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-sm text-blue-700 hover:text-blue-900 underline"
                >
                  <span>{link.text}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Help context for keyboard shortcuts
export function KeyboardShortcutsHelp() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-900">⌨️ Atalhos de Teclado</h3>
      
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Navegação Global</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Busca Global</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Cmd+K</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Voltar</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Esc</kbd>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-slate-800 mb-2">Busca e Navegação</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Navegar resultados</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">↑↓</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Selecionar</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Enter</kbd>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-3">
          <h4 className="font-medium text-slate-800 mb-2">Ações Específicas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Novo item</span>
              <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Ctrl+N</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Exportar</span>
              <kbd className="px-2 py-1 bg-slate-100 rounded text-xs">Ctrl+E</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature tour/onboarding help
interface FeatureTourProps {
  steps: {
    target: string;
    title: string;
    content: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
  }[];
  isActive: boolean;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export function FeatureTour({ 
  steps, 
  isActive, 
  currentStep, 
  onNext, 
  onPrev, 
  onClose 
}: FeatureTourProps) {
  if (!isActive || currentStep >= steps.length) return null;

  const step = steps[currentStep];
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 pointer-events-none">
      {/* Spotlight effect could be added here */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 max-w-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-600 mt-1">
                Passo {currentStep + 1} de {steps.length}
              </p>
            </div>
            <TertiaryButton
              onClick={onClose}
              icon={X}
              size="sm"
              aria-label="Fechar tour"
            >
              <span className="sr-only">Fechar</span>
            </TertiaryButton>
          </div>
          
          <p className="text-sm text-slate-700 mb-4">{step.content}</p>
          
          <div className="flex items-center justify-between">
            <SecondaryButton
              onClick={onPrev}
              disabled={currentStep === 0}
              size="sm"
            >
              Anterior
            </SecondaryButton>
            
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            
            <SecondaryButton
              onClick={currentStep === steps.length - 1 ? onClose : onNext}
              size="sm"
            >
              {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
