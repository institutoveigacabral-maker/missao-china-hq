import { useState, useMemo } from 'react';
import { Factory, Search, Plus, MapPin, Star, Globe, Phone, Mail, Award, Clock, Package, TrendingUp, Filter, X, Edit } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { useSuppliers, Supplier } from '../hooks/useSuppliers';

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Supplier>>({});

  const { suppliers, loading, error, updateSupplier, deleteSupplier } = useSuppliers({
    search: searchTerm,
    vertical: selectedCategory,
  });

  const categories = useMemo(() => {
    const uniqueCategories = new Set(suppliers.map(s => s.vertical).filter(Boolean) as string[]);
    return Array.from(uniqueCategories);
  }, [suppliers]);

  const avgScore = suppliers.length > 0 
    ? suppliers.reduce((sum, s) => sum + s.overall_score, 0) / suppliers.length 
    : 0;
  const certifiedSuppliers = suppliers.filter(s => s.certifications).length;

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 7.5) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 6.5) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getCategoryIcon = (category: string | null) => {
    if (!category) return '🏭';
    const lower = category.toLowerCase();
    if (lower.includes('iot') || lower.includes('rfid')) return '📡';
    if (lower.includes('brinquedo') || lower.includes('toy')) return '🧸';
    if (lower.includes('iluminação') || lower.includes('lighting')) return '💡';
    if (lower.includes('mobilidade') || lower.includes('mobility')) return '🛴';
    return '🏭';
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEditFormData(supplier);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedSupplier) return;
    
    try {
      await updateSupplier(selectedSupplier.id, editFormData);
      setIsEditing(false);
      setSelectedSupplier(null);
    } catch (err) {
      console.error('Error updating supplier:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este fornecedor?')) return;
    
    try {
      await deleteSupplier(id);
      setSelectedSupplier(null);
    } catch (err) {
      console.error('Error deleting supplier:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Factory className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">Fornecedores</h1>
                  <p className="text-blue-100 text-sm">Base verificada de fornecedores</p>
                </div>
              </div>
              <p className="text-lg text-blue-100 mb-6 max-w-2xl">
                Rede de fornecedores OEM/ODM qualificados
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Globe className="w-4 h-4" />
                  <span>Fornecedores Globais</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Star className="w-4 h-4" />
                  <span>Score Médio: {avgScore.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Award className="w-4 h-4" />
                  <span>{certifiedSuppliers} Certificados</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-6xl font-bold text-white mb-2">{suppliers.length}</div>
              <div className="text-blue-100 text-lg">Fornecedores Ativos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Factory className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Star className="h-6 w-6 text-emerald-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Score Médio</p>
              <p className="text-3xl font-bold text-gray-900">{avgScore.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Certificados</p>
              <p className="text-3xl font-bold text-gray-900">{certifiedSuppliers}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Categorias</p>
              <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Category Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar fornecedores, produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all ${
                  showFilters
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
              </button>
              
              <button className="flex items-center gap-2 px-6 py-3.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Novo Fornecedor</span>
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Categorias</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                    selectedCategory === ''
                      ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">Todas</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                    {suppliers.length}
                  </span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                      selectedCategory === category
                        ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{getCategoryIcon(category)}</span>
                    <span className="font-medium">{category}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                      {suppliers.filter(s => s.vertical === category).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Exibindo <span className="font-semibold text-gray-900">{suppliers.length}</span> fornecedores
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando fornecedores...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Factory className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar fornecedores</h3>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      ) : suppliers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Factory className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum fornecedor encontrado</h3>
            <p className="text-gray-600 mb-6">Tente ajustar os filtros ou adicione novos fornecedores</p>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all">
              Adicionar Fornecedor
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-3xl">{getCategoryIcon(supplier.vertical)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-purple-700 transition-colors">
                        {supplier.company_name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {supplier.city}, {supplier.country}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className={`px-3 py-1.5 rounded-xl border-2 font-semibold text-sm flex items-center gap-1.5 ${getScoreColor(supplier.overall_score)}`}>
                    <Star className="w-4 h-4 fill-current" />
                    {supplier.overall_score.toFixed(1)}
                  </div>
                  {supplier.vertical && (
                    <div className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium">
                      {supplier.vertical}
                    </div>
                  )}
                  {supplier.fair_booth && (
                    <div className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-xl text-sm font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {supplier.fair_booth}
                    </div>
                  )}
                </div>

                {supplier.product_lines && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Produtos</h4>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{supplier.product_lines}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
                  {supplier.lead_time_days && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">{supplier.lead_time_days}d</span>
                    </div>
                  )}
                  {supplier.moq && (
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span className="text-xs">{supplier.moq}</span>
                    </div>
                  )}
                  {supplier.certifications && (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-medium">Cert.</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {supplier.email && (
                      <a
                        href={`mailto:${supplier.email}`}
                        className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Enviar email"
                      >
                        <Mail className="w-4.5 h-4.5" />
                      </a>
                    )}
                    {supplier.phone && (
                      <a
                        href={`tel:${supplier.phone}`}
                        className="p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Ligar"
                      >
                        <Phone className="w-4.5 h-4.5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(supplier)}
                      className="p-2.5 text-purple-700 bg-purple-50 border-2 border-purple-200 rounded-xl hover:bg-purple-100 transition-all"
                      title="Editar"
                    >
                      <Edit className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      onClick={() => setSelectedSupplier(supplier)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl text-sm font-semibold"
                    >
                      Detalhes
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Supplier Detail/Edit Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Editar Fornecedor' : 'Detalhes do Fornecedor'}
                </h2>
                <button
                  onClick={() => {
                    setSelectedSupplier(null);
                    setIsEditing(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {!isEditing ? (
                <>
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
                    <span className="text-4xl">{getCategoryIcon(selectedSupplier.vertical)}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedSupplier.company_name}</h3>
                      <p className="text-gray-600 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedSupplier.city}, {selectedSupplier.country}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl border-2 font-bold flex items-center gap-2 ${getScoreColor(selectedSupplier.overall_score)}`}>
                          <Star className="w-5 h-5 fill-current" />
                          {selectedSupplier.overall_score.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedSupplier.product_lines && (
                    <div className="p-5 bg-gray-50 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3">Produtos</h4>
                      <p className="text-gray-700">{selectedSupplier.product_lines}</p>
                    </div>
                  )}

                  {selectedSupplier.certifications && (
                    <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200">
                      <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Certificações
                      </h4>
                      <p className="text-emerald-700">{selectedSupplier.certifications}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {selectedSupplier.lead_time_days && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Lead Time</h5>
                        <p className="text-gray-700 font-medium">{selectedSupplier.lead_time_days} dias</p>
                      </div>
                    )}
                    {selectedSupplier.moq && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">MOQ</h5>
                        <p className="text-gray-700 font-medium">{selectedSupplier.moq}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setEditFormData(selectedSupplier);
                        setIsEditing(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg font-semibold"
                    >
                      <Edit className="w-5 h-5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(selectedSupplier.id)}
                      className="px-6 py-3.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg font-semibold"
                    >
                      Excluir
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
                      <input
                        type="text"
                        value={editFormData.company_name || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, company_name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                        <input
                          type="text"
                          value={editFormData.country || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                        <input
                          type="text"
                          value={editFormData.city || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Produtos</label>
                      <textarea
                        value={editFormData.product_lines || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, product_lines: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={editFormData.email || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                        <input
                          type="text"
                          value={editFormData.phone || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-6 py-3.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-6 py-3.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg font-semibold"
                    >
                      Salvar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
