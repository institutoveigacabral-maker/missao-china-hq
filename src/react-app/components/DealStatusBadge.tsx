import { Badge } from './ui/Badge';

interface DealStatusBadgeProps {
  status: string;
}

export function DealStatusBadge({ status }: DealStatusBadgeProps) {
  const getStatusConfig = (status: string): { variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'; label: string } => {
    switch (status) {
      case 'approved':
        return { variant: 'success', label: 'Aprovado' };
      case 'negotiating':
        return { variant: 'warning', label: 'Negociando' };
      case 'in_production':
        return { variant: 'info', label: 'Em Produção' };
      case 'shipped':
        return { variant: 'primary', label: 'Enviado' };
      case 'delivered':
        return { variant: 'success', label: 'Entregue' };
      case 'closed':
        return { variant: 'secondary', label: 'Fechado' };
      default:
        return { variant: 'secondary', label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
