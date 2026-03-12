import React, { useState } from 'react'

import { MobileTable } from '@/react-app/components/MobileTable'
import { TouchButton } from '@/react-app/components/Touch'
import { 
  Users, 
  Package, 
  Building2, 
  Star, 
  MapPin, 
  Smartphone,
  Monitor,
  RefreshCw,
  Download,
  Mail,
  Globe,
  Shield,
  TrendingUp,
  Clock
} from 'lucide-react'

// Sample data for different table types
const suppliersData = [
  {
    id: 1,
    supplier_code: 'SP001',
    company_name: 'Shenzhen Tech Solutions',
    country: 'China',
    city: 'Shenzhen',
    contact_person: 'Li Wei',
    email: 'li.wei@sztech.com',
    phone: '+86 138 0013 8000',
    quality_rating: 4.5,
    compliance_score: 92,
    risk_level: 'low',
    certification_status: 'approved',
    last_audit_date: '2024-09-15',
    next_audit_date: '2025-03-15',
    monthly_capacity: 50000,
    lead_time_days: 25,
    payment_terms: '30% advance, 70% before shipment',
    is_approved: true
  },
  {
    id: 2,
    supplier_code: 'SP002', 
    company_name: 'Guangzhou Manufacturing Co',
    country: 'China',
    city: 'Guangzhou',
    contact_person: 'Zhang Min',
    email: 'zhang.min@gzmanuf.com',
    phone: '+86 139 2234 5566',
    quality_rating: 4.2,
    compliance_score: 88,
    risk_level: 'medium',
    certification_status: 'pending',
    last_audit_date: '2024-08-20',
    next_audit_date: '2025-02-20',
    monthly_capacity: 30000,
    lead_time_days: 35,
    payment_terms: 'L/C at sight',
    is_approved: true
  },
  {
    id: 3,
    supplier_code: 'SP003',
    company_name: 'Dongguan Smart Devices',
    country: 'China', 
    city: 'Dongguan',
    contact_person: 'Wang Feng',
    email: 'wang.feng@dgsmart.com',
    phone: '+86 136 8899 7766',
    quality_rating: 3.8,
    compliance_score: 85,
    risk_level: 'medium',
    certification_status: 'under_review',
    last_audit_date: '2024-10-01',
    next_audit_date: '2025-04-01',
    monthly_capacity: 20000,
    lead_time_days: 30,
    payment_terms: 'T/T 30 days',
    is_approved: false
  }
]

const skusData = [
  {
    id: 1,
    sku_code: 'IOT-CAM-001',
    product_name: 'Smart Security Camera 4K',
    product_category: 'Security',
    description: 'WiFi enabled 4K security camera with night vision',
    regulatory_status: 'compliant',
    supplier_id: 1,
    lab_test_status: 'passed',
    certification_level: 'CE, FCC, RoHS',
    risk_category: 'low',
    target_markets: 'EU, US, Brazil',
    is_active: true,
    created_at: '2024-09-01'
  },
  {
    id: 2,
    sku_code: 'IOT-SEN-002',
    product_name: 'Temperature Sensor Pro',
    product_category: 'Sensors',
    description: 'Industrial grade temperature and humidity sensor',
    regulatory_status: 'pending',
    supplier_id: 2,
    lab_test_status: 'in_progress',
    certification_level: 'CE pending',
    risk_category: 'medium',
    target_markets: 'EU, Brazil',
    is_active: true,
    created_at: '2024-09-15'
  },
  {
    id: 3,
    sku_code: 'IOT-HUB-003',
    product_name: 'Smart Home Hub',
    product_category: 'Connectivity',
    description: 'Central hub for IoT device management',
    regulatory_status: 'non_compliant',
    supplier_id: 3,
    lab_test_status: 'failed',
    certification_level: 'None',
    risk_category: 'high',
    target_markets: 'Brazil only',
    is_active: false,
    created_at: '2024-08-20'
  }
]

const MobileTableDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'suppliers' | 'skus'>('suppliers')
  const [loading, setLoading] = useState(false)

  // Simulate loading
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  // Status indicators
  const StatusBadge: React.FC<{ status: string; type: 'risk' | 'certification' | 'regulatory' }> = ({ status, type }) => {
    const getStatusConfig = () => {
      switch (type) {
        case 'risk':
          switch (status) {
            case 'low': return 'bg-green-100 text-green-800'
            case 'medium': return 'bg-yellow-100 text-yellow-800'
            case 'high': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
          }
        case 'certification':
          switch (status) {
            case 'approved': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'under_review': return 'bg-blue-100 text-blue-800'
            default: return 'bg-gray-100 text-gray-800'
          }
        case 'regulatory':
          switch (status) {
            case 'compliant': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'non_compliant': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
          }
      }
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusConfig()}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  // Star rating component
  const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="text-sm font-medium">{rating}</span>
      </div>
    )
  }

  // Suppliers table columns
  const supplierColumns = [
    {
      key: 'supplier_code',
      label: 'Código',
      sortable: true,
      width: '120px'
    },
    {
      key: 'company_name',
      label: 'Empresa',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'contact_person',
      label: 'Contato',
      render: (value: string, row: any) => (
        <div className="space-y-1">
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500 flex items-center space-x-1">
            <Mail className="w-3 h-3" />
            <span>{row.email}</span>
          </div>
        </div>
      ),
      hideOnMobile: true
    },
    {
      key: 'city',
      label: 'Localização',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{value}, {row.country}</span>
        </div>
      )
    },
    {
      key: 'quality_rating',
      label: 'Qualidade',
      sortable: true,
      render: (value: number) => <StarRating rating={value} />,
      mobileRender: (value: number) => <StarRating rating={value} />
    },
    {
      key: 'compliance_score',
      label: 'Compliance',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <div className="w-12 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-medium">{value}%</span>
        </div>
      ),
      hideOnMobile: true
    },
    {
      key: 'risk_level',
      label: 'Risco',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} type="risk" />
    },
    {
      key: 'certification_status',
      label: 'Status',
      render: (value: string) => <StatusBadge status={value} type="certification" />,
      hideOnMobile: true
    },
    {
      key: 'monthly_capacity',
      label: 'Capacidade',
      render: (value: number) => `${value.toLocaleString()}/mês`,
      hideOnMobile: true
    },
    {
      key: 'lead_time_days',
      label: 'Lead Time',
      render: (value: number) => `${value} dias`,
      hideOnMobile: true
    }
  ]

  // SKUs table columns
  const skuColumns = [
    {
      key: 'sku_code',
      label: 'SKU',
      sortable: true,
      width: '120px',
      render: (value: string) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      )
    },
    {
      key: 'product_name',
      label: 'Produto',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="space-y-1">
          <div className="font-medium">{value}</div>
          <div className="text-xs text-gray-500">{row.description}</div>
        </div>
      )
    },
    {
      key: 'product_category',
      label: 'Categoria',
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Package className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'regulatory_status',
      label: 'Regulamentação',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} type="regulatory" />
    },
    {
      key: 'certification_level',
      label: 'Certificações',
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Shield className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{value}</span>
        </div>
      ),
      hideOnMobile: true
    },
    {
      key: 'lab_test_status',
      label: 'Testes',
      render: (value: string) => {
        const statusConfig = {
          passed: 'bg-green-100 text-green-800',
          in_progress: 'bg-yellow-100 text-yellow-800',
          failed: 'bg-red-100 text-red-800'
        }
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig[value as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}`}>
            {value.replace('_', ' ')}
          </span>
        )
      },
      hideOnMobile: true
    },
    {
      key: 'risk_category',
      label: 'Risco',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} type="risk" />
    },
    {
      key: 'target_markets',
      label: 'Mercados',
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{value}</span>
        </div>
      ),
      hideOnMobile: true
    },
    {
      key: 'is_active',
      label: 'Ativo',
      render: (value: boolean) => (
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="ml-2 text-sm">{value ? 'Sim' : 'Não'}</span>
        </div>
      )
    }
  ]

  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row)
    // Handle navigation to detail page
  }

  return (
    <div className="space-y-6 p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <span>Mobile Table Demo</span>
              </h1>
              <p className="mt-2 text-gray-600">
                Tabelas responsivas que se adaptam perfeitamente entre desktop e mobile
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <TouchButton
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
                leftIcon={RefreshCw}
                className={loading ? 'animate-spin' : ''}
              >
                Atualizar
              </TouchButton>
              <TouchButton
                variant="outline"
                leftIcon={Download}
              >
                Exportar
              </TouchButton>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setCurrentView('suppliers')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currentView === 'suppliers'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Fornecedores</span>
              </div>
            </button>
            <button
              onClick={() => setCurrentView('skus')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                currentView === 'skus'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>SKUs IoT</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentView === 'suppliers' ? suppliersData.length : skusData.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentView === 'suppliers' 
                    ? suppliersData.filter(s => s.is_approved).length
                    : skusData.filter(s => s.is_active).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentView === 'suppliers' 
                    ? suppliersData.filter(s => s.certification_status === 'pending').length
                    : skusData.filter(s => s.regulatory_status === 'pending').length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Monitor className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Visualização</p>
                <p className="text-lg font-bold text-gray-900">
                  <span className="hidden lg:inline">Desktop</span>
                  <span className="lg:hidden">Mobile</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Table */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentView === 'suppliers' ? 'Gestão de Fornecedores' : 'Catálogo de SKUs IoT'}
            </h3>
            <p className="text-sm text-gray-600">
              {currentView === 'suppliers' 
                ? 'Redimensione a janela para ver como a tabela se adapta entre desktop e mobile'
                : 'Visualize como dados complexos são organizados em cards expansíveis no mobile'
              }
            </p>
          </div>

          <MobileTable
            data={currentView === 'suppliers' ? suppliersData : skusData}
            columns={currentView === 'suppliers' ? supplierColumns : skuColumns}
            loading={loading}
            searchable={true}
            onRowClick={handleRowClick}
            emptyMessage={`Nenhum ${currentView === 'suppliers' ? 'fornecedor' : 'SKU'} encontrado`}
          />
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              Modo Desktop
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Tabela tradicional com todas as colunas visíveis</li>
              <li>• Ordenação clicável nos cabeçalhos</li>
              <li>• Busca global no topo da tabela</li>
              <li>• Hover effects e transições suaves</li>
              <li>• Scroll horizontal para tabelas largas</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h4 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Modo Mobile
            </h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Cards expansíveis com informações principais</li>
              <li>• Seção "Mostrar mais" para dados adicionais</li>
              <li>• Touch-friendly com targets de 44px+</li>
              <li>• Busca otimizada para mobile</li>
              <li>• Animações suaves de expand/collapse</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileTableDemo
