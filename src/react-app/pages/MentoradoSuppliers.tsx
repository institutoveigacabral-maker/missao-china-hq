import { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Factory, 
  Shield, 
  Star, 
  Users,
  Eye,
  Link as LinkIcon,
  ExternalLink,
  Phone,
  Mail,
  Award
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface Supplier {
  id: string;
  name: string;
  city: string;
  province: string;
  compliance_score: number;
  last_audit: number;
  contact_person?: string;
  email?: string;
  phone?: string;
  quality_rating?: number;
  certifications?: string[];
  product_lines?: string[];
  relation?: string;
  linked?: boolean;
}

interface AvailableSupplier {
  id: string;
  supplier_code: string;
  company_name: string;
  country: string;
  city: string;
  quality_rating: number;
  compliance_score: number;
  certifications: string;
  product_lines: string;
  is_approved: boolean;
}

function MentoradoSuppliers() {
  const [linkedSuppliers, setLinkedSuppliers] = useState<Supplier[]>([]);
  const [availableSuppliers, setAvailableSuppliers] = useState<AvailableSupplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'linked' | 'available'>('linked');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLinkedSuppliers();
    fetchAvailableSuppliers();
  }, []);

  const fetchLinkedSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentorado/suppliers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch linked suppliers');
      }

      const result = await response.json();
      setLinkedSuppliers(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const fetchAvailableSuppliers = async () => {
    try {
      const response = await fetch('/api/mentorado/suppliers/available', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available suppliers');
      }

      const result = await response.json();
      setAvailableSuppliers(result.data || []);
    } catch (err) {
      console.error('Failed to fetch available suppliers:', err);
      setAvailableSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSupplier = async (factoryId: string, relation: string = 'partner') => {
    try {
      const response = await fetch('/api/mentorado/suppliers/link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          factory_id: factoryId,
          relation,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to link supplier');
      }

      // Refresh lists
      await fetchLinkedSuppliers();
      await fetchAvailableSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const filteredLinkedSuppliers = linkedSuppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailableSuppliers = availableSuppliers.filter((supplier) =>
    supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fornecedores</h1>
          <p className="text-gray-600 mt-1">Gerencie suas parcerias e encontre novos fornecedores</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('linked')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'linked'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Meus Fornecedores ({linkedSuppliers.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'available'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Disponíveis ({availableSuppliers.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar fornecedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </Card>

      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
        </Card>
      )}

      {/* Content */}
      {activeTab === 'linked' ? (
        <div className="space-y-4">
          {filteredLinkedSuppliers.length === 0 ? (
            <Card className="p-12 text-center">
              <Factory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {linkedSuppliers.length === 0 ? 'Nenhum fornecedor vinculado' : 'Nenhum fornecedor encontrado'}
              </h3>
              <p className="text-gray-600 mb-6">
                {linkedSuppliers.length === 0 
                  ? 'Vincule fornecedores para gerenciar suas parcerias'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
              {linkedSuppliers.length === 0 && (
                <Button
                  onClick={() => setActiveTab('available')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Explorar Fornecedores
                </Button>
              )}
            </Card>
          ) : (
            filteredLinkedSuppliers.map((supplier) => (
              <Card key={supplier.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                      <Badge variant={getComplianceColor(supplier.compliance_score) as 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'}>
                        {supplier.compliance_score}% Compliance
                      </Badge>
                      {supplier.relation && (
                        <Badge variant="primary">{supplier.relation}</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{supplier.city}, {supplier.province}</span>
                      </div>
                      {supplier.quality_rating && (
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4" />
                          <span>Rating: {supplier.quality_rating}/5</span>
                        </div>
                      )}
                      {supplier.last_audit && (
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <span>Último audit: {new Date(supplier.last_audit).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>

                    {(supplier.contact_person || supplier.email || supplier.phone) && (
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                        {supplier.contact_person && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{supplier.contact_person}</span>
                          </div>
                        )}
                        {supplier.email && (
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{supplier.email}</span>
                          </div>
                        )}
                        {supplier.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{supplier.phone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/mentorado/suppliers/${supplier.id}`)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Detalhes</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/mentorado/deals/new?factory_id=${supplier.id}`)}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Novo Deal</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAvailableSuppliers.length === 0 ? (
            <Card className="p-12 text-center">
              <Factory className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum fornecedor disponível
              </h3>
              <p className="text-gray-600">
                Não há fornecedores disponíveis no momento ou tente ajustar sua busca
              </p>
            </Card>
          ) : (
            filteredAvailableSuppliers.map((supplier) => (
              <Card key={supplier.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{supplier.company_name}</h3>
                      <Badge variant={getComplianceColor(supplier.compliance_score) as 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'}>
                        {supplier.compliance_score}% Compliance
                      </Badge>
                      {supplier.is_approved && (
                        <Badge variant="success">
                          <Award className="h-3 w-3 mr-1" />
                          Aprovado
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{supplier.city}, {supplier.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4" />
                        <span>Rating: {supplier.quality_rating}/5</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Factory className="h-4 w-4" />
                        <span>{supplier.supplier_code}</span>
                      </div>
                    </div>

                    {(supplier.product_lines || supplier.certifications) && (
                      <div className="mt-3 space-y-2">
                        {supplier.product_lines && (
                          <div className="text-sm text-gray-500">
                            <strong>Produtos:</strong> {supplier.product_lines}
                          </div>
                        )}
                        {supplier.certifications && (
                          <div className="text-sm text-gray-500">
                            <strong>Certificações:</strong> {supplier.certifications}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/suppliers/${supplier.id}`)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleLinkSupplier(supplier.id, 'partner')}
                      className="flex items-center space-x-1 bg-red-600 hover:bg-red-700"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>Vincular</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MentoradoSuppliers;
