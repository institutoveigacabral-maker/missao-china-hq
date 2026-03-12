import { Link as RouterLink } from 'react-router-dom';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface LinkProps {
  to?: string;
  href?: string;
  variant?: 'default' | 'subtle' | 'action';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  external?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  'aria-label'?: string;
}

export default function Link({ 
  to, 
  href, 
  variant = 'default', 
  icon: Icon, 
  iconPosition = 'left',
  external = false,
  children, 
  className = '',
  onClick,
  title,
  'aria-label': ariaLabel,
  ...otherProps
}: LinkProps) {
  const baseClasses = 'inline-flex items-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded cursor-pointer';
  
  const variantClasses = {
    default: 'text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-all duration-200',
    subtle: 'text-slate-600 hover:text-slate-800 hover:underline decoration-2 underline-offset-2 transition-all duration-200',
    action: 'text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-all duration-200'
  };
  
  const iconSizeClasses = 'w-4 h-4';
  
  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon className={`${iconSizeClasses} ${children ? 'mr-1' : ''}`} />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className={`${iconSizeClasses} ${children ? 'ml-1' : ''}`} />
      )}
    </>
  );
  
  if (to) {
    return (
      <RouterLink 
        to={to} 
        className={combinedClassName}
        onClick={onClick}
        title={title}
        aria-label={ariaLabel}
      >
        {content}
      </RouterLink>
    );
  }
  
  if (href) {
    return (
      <a 
        href={href} 
        className={combinedClassName}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        title={title}
        aria-label={ariaLabel}
        {...otherProps}
      >
        {content}
      </a>
    );
  }
  
  return (
    <span 
      className={combinedClassName} 
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      {...otherProps}
    >
      {content}
    </span>
  );
}

// Specialized link components
export function ActionLink(props: Omit<LinkProps, 'variant'>) {
  return <Link variant="action" {...props} />;
}

export function SubtleLink(props: Omit<LinkProps, 'variant'>) {
  return <Link variant="subtle" {...props} />;
}
