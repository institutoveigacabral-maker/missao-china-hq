import { useState } from 'react';
import { Package, Search, Plus, Filter, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { useSkus, useSkuStats } from '../hooks/useSkus';

export default function SkuManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { skus, loading, error } = useSkus({
    search: searchTerm,
    category: selectedCategory,
    status: selectedStatus,
    activeOnly: true,
  });

  const { stats } = useSkuStats();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">Gestão de SKUs</h1>
                  <p className="text-purple-100 text-sm">Produtos IoT e compliance tracking</p>
                </div>
              </div>
              <p className="text-lg text-purple-100 max-w-2xl">
                Catálogo completo de SKUs neurais com rastreamento de conformidade regulatória
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-6xl font-bold text-white mb-2">{stats?.total || 0}</div>
              <div className="text-purple-100 text-lg">SKUs Ativos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total SKUs</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Aprovados</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.approved_count || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.active_count || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Alto Risco</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.high_risk_count || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar SKUs por código, nome, descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all ${
                  showFilters
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
              </button>

              <button className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Novo SKU</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Todas</option>
                    <option value="IoT">IoT</option>
                    <option value="Toys">Brinquedos</option>
                    <option value="Lighting">Iluminação</option>
                    <option value="Mobility">Mobilidade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Todos</option>
                    <option value="approved">Aprovado</option>
                    <option value="pending">Pendente</option>
                    <option value="rejected">Rejeitado</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SKUs List */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando SKUs...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar SKUs</h3>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      ) : skus.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum SKU encontrado</h3>
            <p className="text-gray-600 mb-6">Comece adicionando seu primeiro SKU ao sistema</p>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
              Adicionar SKU
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {skus.map((sku) => (
            <Card key={sku.id} className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-100">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">
                      {sku.product_name}
                    </h3>
                    <p className="text-sm text-gray-600 font-mono">{sku.sku_code}</p>
                  </div>
                  {getStatusIcon(sku.regulatory_status)}
                </div>

                {sku.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{sku.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium border border-indigo-200">
                    {sku.product_category}
                  </span>
                  <span className={`px-3 py-1.5 rounded-xl text-sm font-medium border-2 ${getRiskColor(sku.risk_category)}`}>
                    Risco: {sku.risk_category}
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
                    {sku.regulatory_status}
                  </span>
                </div>

                {sku.target_markets && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Mercados Alvo</p>
                    <p className="text-sm text-gray-700">{sku.target_markets}</p>
                  </div>
                )}

                {sku.supplier_name && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Fornecedor</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700">{sku.supplier_name}</p>
                      {sku.supplier_score && (
                        <span className="text-sm text-emerald-600 font-semibold">★ {sku.supplier_score.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <button className="flex-1 px-4 py-2 text-indigo-700 bg-indigo-50 border-2 border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all text-sm font-semibold">
                    Editar
                  </button>
                  <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl text-sm font-semibold">
                    Ver Detalhes
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
