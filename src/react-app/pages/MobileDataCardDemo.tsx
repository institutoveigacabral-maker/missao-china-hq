import { useState } from 'react';
import { Container, Stack } from '../components/ResponsiveLayout';
import MobileDataCard from '@/react-app/components/MobileDataCard';
import Button from '../components/ui/Button';

// Mock components for demo
const CardActions = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
  <div className="flex space-x-2">
    <Button size="sm" onClick={onEdit}>Editar</Button>
    <Button size="sm" variant="danger" onClick={onDelete}>Excluir</Button>
  </div>
);

const MobileDataCardList = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {children}
  </div>
);

export default function MobileDataCardDemo() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock data for demonstration
  const cards = [
    {
      id: 1,
      title: 'Receita Total',
      subtitle: 'Último mês',
      value: 'R$ 245.890',
      change: '+12.5%',
      changeType: 'positive' as const,
      badge: { text: 'Ativo', variant: 'success' as const },
      icon: 'package' as const,
      status: 'active' as const,
      metadata: [
        { label: 'Meta', value: 'R$ 220.000' },
        { label: 'Projeção', value: 'R$ 250.000' }
      ]
    },
    {
      id: 2,
      title: 'SKUs Aprovados',
      subtitle: 'Este trimestre',
      value: '87',
      change: '+5.2%',
      changeType: 'positive' as const,
      badge: { text: 'Em dia', variant: 'info' as const },
      icon: 'factory' as const,
      status: 'active' as const,
      metadata: [
        { label: 'Total', value: '102' },
        { label: 'Pendentes', value: '15' }
      ]
    },
    {
      id: 3,
      title: 'Compliance Score',
      subtitle: 'Média geral',
      value: '94.2%',
      change: '-2.1%',
      changeType: 'negative' as const,
      badge: { text: 'Atenção', variant: 'warning' as const },
      icon: 'shield' as const,
      status: 'pending' as const,
      metadata: [
        { label: 'Meta', value: '95%' },
        { label: 'Mínimo', value: '90%' }
      ]
    },
    {
      id: 4,
      title: 'Fornecedores Ativos',
      subtitle: 'Cadastrados',
      value: '23',
      changeType: 'neutral' as const,
      badge: { text: 'Estável', variant: 'info' as const },
      status: 'active' as const,
      metadata: [
        { label: 'Certificados', value: '18' },
        { label: 'Em auditoria', value: '5' }
      ]
    }
  ];

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'revenue', label: 'Receita' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'suppliers', label: 'Fornecedores' }
  ];

  const filteredCards = cards.filter(card => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'revenue') return card.title.includes('Receita');
    if (activeFilter === 'compliance') return card.title.includes('Compliance') || card.title.includes('SKUs');
    if (activeFilter === 'suppliers') return card.title.includes('Fornecedores');
    return true;
  });

  const handleCardClick = (card: typeof cards[0]) => {
    console.log('Card clicked:', card.title);
  };

  const handleEdit = (id: number) => {
    console.log('Edit card:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete card:', id);
  };

  return (
    <Container className="py-6">
      <Stack spacing={6}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Demo - Mobile Data Cards</h1>
          <p className="text-purple-100">
            Demonstração de componentes responsivos para exibição de dados em dispositivos móveis
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <Button
              key={filter.id}
              size="sm"
              variant={activeFilter === filter.id ? 'primary' : 'secondary'}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Cards Grid */}
        <MobileDataCardList>
          {filteredCards.map(card => (
            <MobileDataCard
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              value={card.value}
              change={card.change}
              changeType={card.changeType}
              badge={card.badge}
              icon={card.icon}
              status={card.status}
              metadata={card.metadata}
              onClick={() => handleCardClick(card)}
            />
          ))}
        </MobileDataCardList>

        {/* Interactive Examples */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Exemplos Interativos</h2>
          
          {/* Revenue Card with Custom Action */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Card com Ações Customizadas</h3>
            <div className="max-w-md">
              <MobileDataCard
                title="Receita Mensal"
                subtitle="Janeiro 2024"
                value="R$ 156.780"
                change="+18.3%"
                changeType="positive"
                badge={{ text: 'Superou Meta', variant: 'success' }}
                icon="package"
                status="active"
                metadata={[
                  { label: 'Meta', value: 'R$ 130.000' },
                  { label: 'Último mês', value: 'R$ 132.450' }
                ]}
              />
              <div className="mt-4">
                <CardActions 
                  onEdit={() => handleEdit(1)} 
                  onDelete={() => handleDelete(1)} 
                />
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Indicadores de Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MobileDataCard
                title="Status Ativo"
                value="Operacional"
                badge={{ text: 'Online', variant: 'success' }}
                status="active"
              />
              <MobileDataCard
                title="Status Pendente"
                value="Em Análise"
                badge={{ text: 'Pendente', variant: 'warning' }}
                status="pending"
              />
              <MobileDataCard
                title="Status Inativo"
                value="Offline"
                badge={{ text: 'Erro', variant: 'error' }}
                status="inactive"
              />
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guia de Uso</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>Mobile First:</strong> Os cards são otimizados para dispositivos móveis com touch gestures.
            </p>
            <p>
              <strong>Responsivo:</strong> Layout adapta automaticamente para desktop e tablet.
            </p>
            <p>
              <strong>Acessível:</strong> Suporte completo para leitores de tela e navegação por teclado.
            </p>
            <p>
              <strong>Customizável:</strong> Badges, ícones, status e metadados configuráveis.
            </p>
          </div>
        </div>
      </Stack>
    </Container>
  );
}
