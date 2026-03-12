import { useState, useMemo } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Clock, Globe, AlertCircle, FileText, Building2, Filter, X, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

interface Regulation {
  id: string;
  regulation_code: string;
  regulation_name: string;
  region: string;
  category: string;
  type: 'Obrigatória' | 'Opcional';
  validity_date: string;
  level: 'Critical' | 'High' | 'Medium' | 'Low';
  document_proof: string;
  authority: string;
  verticals: string[];
  description?: string;
  alert_tag?: string;
  is_urgent?: boolean;
}

const regulationsData: Regulation[] = [
  // BRASIL
  {
    id: 'br-1',
    regulation_code: 'Ato ANATEL 14.430/2024',
    regulation_name: 'Telecom / Voz (VoLTE / IMS)',
    region: 'Brasil',
    category: 'Telecom',
    type: 'Obrigatória',
    validity_date: '2025-04-06',
    level: 'Critical',
    document_proof: 'Certificado de Homologação',
    authority: 'ANATEL',
    verticals: ['IoT', 'Casa', 'Mobilidade'],
    alert_tag: 'VoLTE/IMS',
    is_urgent: true
  },
  {
    id: 'br-2',
    regulation_code: 'Ato ANATEL 2.105/2025',
    regulation_name: '5G RedCap / NB-NTN / Cat-1bis',
    region: 'Brasil',
    category: 'Telecom',
    type: 'Obrigatória',
    validity_date: '2025-08-13',
    level: 'High',
    document_proof: 'Relatório de Ensaio + Certificado',
    authority: 'ANATEL',
    verticals: ['IoT', 'Mobilidade', 'Pet Tech'],
    alert_tag: '5G-RedCap',
    is_urgent: true
  },
  {
    id: 'br-3',
    regulation_code: 'Resolução ANATEL 780/2025',
    regulation_name: 'Marketplace e Recondicionados',
    region: 'Brasil',
    category: 'Telecom',
    type: 'Obrigatória',
    validity_date: 'Em vigor',
    level: 'High',
    document_proof: 'Declaração de Responsabilidade',
    authority: 'ANATEL',
    verticals: ['Marketplace', 'B2B']
  },
  {
    id: 'br-4',
    regulation_code: 'Portaria INMETRO 148/2022',
    regulation_name: 'Segurança Elétrica / Eletrodomésticos',
    region: 'Brasil',
    category: 'Segurança Elétrica',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'High',
    document_proof: 'Certificado de Conformidade + Selo',
    authority: 'INMETRO',
    verticals: ['Casa Inteligente', 'Kitchen Tech']
  },
  {
    id: 'br-5',
    regulation_code: 'Portaria INMETRO 563/2016',
    regulation_name: 'Segurança Mecânica / Brinquedos',
    region: 'Brasil',
    category: 'Segurança',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'High',
    document_proof: 'Certificado de Conformidade',
    authority: 'INMETRO',
    verticals: ['Kids', 'Educação']
  },
  {
    id: 'br-6',
    regulation_code: 'RDC ANVISA 81/2008',
    regulation_name: 'Materiais em Contato com Alimentos (MOCA)',
    region: 'Brasil',
    category: 'Sanitário',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'High',
    document_proof: 'Licença de Importação + Rotulagem',
    authority: 'ANVISA',
    verticals: ['Food Service', 'Embalagens']
  },
  {
    id: 'br-7',
    regulation_code: 'DUIMP / LPCO',
    regulation_name: 'Portal Único de Comércio Exterior',
    region: 'Brasil',
    category: 'Aduaneiro',
    type: 'Obrigatória',
    validity_date: '2025-12-31',
    level: 'Medium',
    document_proof: 'DUIMP + LPCO',
    authority: 'Receita Federal',
    verticals: ['Todas as verticais'],
    alert_tag: 'DUIMP-Fase2'
  },

  // UNIÃO EUROPEIA
  {
    id: 'eu-1',
    regulation_code: 'RED 2014/53/EU',
    regulation_name: 'Equipamentos de Rádio / RF',
    region: 'União Europeia',
    category: 'RF/Telecom',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'Critical',
    document_proof: 'Declaração UE + Testes EN 300 328',
    authority: 'CE / ANACOM',
    verticals: ['IoT', 'Casa', 'Mobilidade']
  },
  {
    id: 'eu-2',
    regulation_code: 'RED Cybersecurity 2025',
    regulation_name: 'Cibersegurança de Equipamentos de Rádio',
    region: 'União Europeia',
    category: 'Cibersegurança',
    type: 'Obrigatória',
    validity_date: '2025-08-01',
    level: 'Critical',
    document_proof: 'Avaliação de Firmware / Secure-by-Design',
    authority: 'CE / DG Connect',
    verticals: ['IoT', 'Casa', 'Fitness'],
    alert_tag: 'RED-Cyber',
    is_urgent: true
  },
  {
    id: 'eu-3',
    regulation_code: 'LVD 2014/35/EU',
    regulation_name: 'Segurança Elétrica',
    region: 'União Europeia',
    category: 'Segurança Elétrica',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'High',
    document_proof: 'Relatório EN 62368 / 60335',
    authority: 'CE',
    verticals: ['Casa', 'Fitness', 'Iluminação']
  },
  {
    id: 'eu-4',
    regulation_code: 'RoHS 2011/65/EU',
    regulation_name: 'Substâncias Perigosas',
    region: 'União Europeia',
    category: 'Ambiental',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'High',
    document_proof: 'Relatório de Substâncias',
    authority: 'CE',
    verticals: ['IoT', 'Casa', 'Kids']
  },
  {
    id: 'eu-5',
    regulation_code: 'REACH 1907/2006',
    regulation_name: 'Substâncias Químicas / SVHC',
    region: 'União Europeia',
    category: 'Química',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'High',
    document_proof: 'Comunicação na Cadeia + Dossier',
    authority: 'ECHA',
    verticals: ['Todas as verticais']
  },
  {
    id: 'eu-6',
    regulation_code: 'Baterias 2023/1542',
    regulation_name: 'Sustentabilidade / Carbon Footprint / QR Digital',
    region: 'União Europeia',
    category: 'Sustentabilidade',
    type: 'Obrigatória',
    validity_date: '2026-01-01',
    level: 'Medium',
    document_proof: 'Registro EPR + Passaporte Digital',
    authority: 'CE / ECHA',
    verticals: ['IoT', 'Mobilidade', 'Fitness'],
    alert_tag: 'BatteryPass'
  },

  // ESTADOS UNIDOS
  {
    id: 'us-1',
    regulation_code: 'FCC Part 15',
    regulation_name: 'Radiofrequência / EMC',
    region: 'Estados Unidos',
    category: 'RF/EMC',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'High',
    document_proof: 'FCC ID Grant ou SDoC',
    authority: 'FCC',
    verticals: ['IoT', 'Casa', 'Fitness']
  },
  {
    id: 'us-2',
    regulation_code: 'UL / NRTL Safety',
    regulation_name: 'Segurança Elétrica',
    region: 'Estados Unidos',
    category: 'Segurança Elétrica',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'High',
    document_proof: 'Relatórios UL 62368 / 60065',
    authority: 'OSHA / UL',
    verticals: ['Casa', 'Fitness', 'Kitchen Tech']
  },
  {
    id: 'us-3',
    regulation_code: 'California SB-327',
    regulation_name: 'Cibersegurança IoT',
    region: 'Estados Unidos',
    category: 'Cibersegurança',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'Medium',
    document_proof: 'Declaração de Políticas',
    authority: 'State of California',
    verticals: ['IoT', 'Pet', 'Fitness']
  },

  // CHINA
  {
    id: 'cn-1',
    regulation_code: 'CCC',
    regulation_name: 'China Compulsory Certification',
    region: 'China',
    category: 'Segurança/RF',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'High',
    document_proof: 'Certificado CCC + Relatório CNAS',
    authority: 'SAMR / CNCA',
    verticals: ['IoT', 'Casa', 'Mobilidade']
  },
  {
    id: 'cn-2',
    regulation_code: 'China RoHS 2',
    regulation_name: 'Substâncias Perigosas / Rotulagem',
    region: 'China',
    category: 'Ambiental',
    type: 'Obrigatória',
    validity_date: 'Permanente',
    level: 'Medium',
    document_proof: 'Relatório de Substâncias + Rótulo Verde',
    authority: 'MIIT',
    verticals: ['IoT', 'Casa', 'Fitness']
  },

  // TRANSPORTE INTERNACIONAL
  {
    id: 'int-1',
    regulation_code: 'IMDG Code 42-24',
    regulation_name: 'Transporte Marítimo / DG',
    region: 'Internacional',
    category: 'Transporte',
    type: 'Obrigatória',
    validity_date: '2026-01-01',
    level: 'Critical',
    document_proof: 'Declaração DG + Ficha de Emergência',
    authority: 'IMO',
    verticals: ['Transporte Marítimo'],
    alert_tag: 'IMDG42-24'
  },
  {
    id: 'int-2',
    regulation_code: 'IATA DGR 2025',
    regulation_name: 'Transporte Aéreo / DG',
    region: 'Internacional',
    category: 'Transporte',
    type: 'Obrigatória',
    validity_date: '2025-01-01',
    level: 'Critical',
    document_proof: 'Shipper\'s Declaration + PI',
    authority: 'IATA / ICAO',
    verticals: ['Carga Aérea']
  },

  // ESG/ISO
  {
    id: 'iso-1',
    regulation_code: 'ISO 9001:2015',
    regulation_name: 'Gestão da Qualidade',
    region: 'Internacional',
    category: 'Qualidade',
    type: 'Opcional',
    validity_date: 'Permanente',
    level: 'High',
    document_proof: 'Certificado ISO',
    authority: 'ISO / ABNT',
    verticals: ['Fábricas e Fornecedores']
  },
  {
    id: 'iso-2',
    regulation_code: 'ISO 27001:2022',
    regulation_name: 'Segurança da Informação',
    region: 'Internacional',
    category: 'Segurança',
    type: 'Opcional',
    validity_date: '2027-12-31',
    level: 'High',
    document_proof: 'Certificado ISO',
    authority: 'ISO / ABNT',
    verticals: ['Dados', 'Infra', 'IA'],
    alert_tag: 'ISO27001'
  }
];

export default function Regulations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredRegulations = useMemo(() => {
    return regulationsData.filter(regulation => {
      const matchesSearch = 
        regulation.regulation_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        regulation.regulation_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        regulation.authority.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === 'all' || regulation.region === selectedRegion;
      const matchesCategory = selectedCategory === 'all' || regulation.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || regulation.level === selectedLevel;
      const matchesType = selectedType === 'all' || regulation.type === selectedType;
      const matchesUrgent = !showUrgentOnly || regulation.is_urgent;
      
      return matchesSearch && matchesRegion && matchesCategory && matchesLevel && matchesType && matchesUrgent;
    });
  }, [searchTerm, selectedRegion, selectedCategory, selectedLevel, selectedType, showUrgentOnly]);

  const regions = [...new Set(regulationsData.map(r => r.region))];
  const categories = [...new Set(regulationsData.map(r => r.category))];
  const levels = ['Critical', 'High', 'Medium', 'Low'];
  const types = ['Obrigatória', 'Opcional'];

  const stats = useMemo(() => {
    const mandatory = regulationsData.filter(r => r.type === 'Obrigatória').length;
    const critical = regulationsData.filter(r => r.level === 'Critical').length;
    const urgent = regulationsData.filter(r => r.is_urgent).length;
    
    return { mandatory, critical, urgent };
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Critical': return AlertTriangle;
      case 'High': return AlertCircle;
      case 'Medium': return Clock;
      case 'Low': return CheckCircle;
      default: return Clock;
    }
  };

  const getRegionFlag = (region: string) => {
    switch (region) {
      case 'Brasil': return '🇧🇷';
      case 'União Europeia': return '🇪🇺';
      case 'Estados Unidos': return '🇺🇸';
      case 'China': return '🇨🇳';
      case 'Internacional': return '🌐';
      default: return '🏛️';
    }
  };

  const isDateCritical = (dateStr: string) => {
    if (dateStr === 'Permanente' || dateStr === 'Em vigor') return false;
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = (date.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 90;
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-red-700 to-pink-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">Regulamentações</h1>
                  <p className="text-orange-100 text-sm">Compliance Global 2025</p>
                </div>
              </div>
              <p className="text-lg text-orange-100 mb-6 max-w-2xl">
                Matriz regulatória completa para produtos IoT e tecnologia em mercados globais
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-white">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Globe className="w-4 h-4" />
                  <span>{regions.length} Jurisdições</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Shield className="w-4 h-4" />
                  <span>{stats.mandatory} Obrigatórias</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{stats.urgent} Urgentes</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-6xl font-bold text-white mb-2">{regulationsData.length}</div>
              <div className="text-orange-100 text-lg">Normas Mapeadas</div>
              <div className="text-sm text-orange-200 mt-1">Atualizado Out/2025</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alert */}
      {stats.urgent > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-900 mb-1">
                    {stats.urgent} Regulamentações com Prazos Críticos
                  </h3>
                  <p className="text-red-700">
                    Algumas normas têm datas de vigência próximas que exigem ação imediata
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUrgentOnly(!showUrgentOnly)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${
                  showUrgentOnly 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
                }`}
              >
                {showUrgentOnly ? 'Ver Todas' : 'Ver Urgentes'}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900">{regulationsData.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Obrigatórias</p>
              <p className="text-3xl font-bold text-gray-900">{stats.mandatory}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Críticas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.critical}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Jurisdições</p>
              <p className="text-3xl font-bold text-gray-900">{regions.length}</p>
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
                placeholder="Buscar normas, códigos ou órgãos reguladores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white transition-all"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all ${
                showFilters
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Jurisdição</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">Todas</option>
                    {regions.map(region => (
                      <option key={region} value={region}>
                        {getRegionFlag(region)} {region}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">Todas</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Nível</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">Todos</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Tipo</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">Todos</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Exibindo <span className="font-semibold text-gray-900">{filteredRegulations.length}</span> de <span className="font-semibold text-gray-900">{regulationsData.length}</span> regulamentações
          </div>
        </CardContent>
      </Card>

      {/* Regulations List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRegulations.map((regulation) => {
          const LevelIcon = getLevelIcon(regulation.level);
          const isCriticalDate = isDateCritical(regulation.validity_date);
          
          return (
            <Card 
              key={regulation.id}
              className={`group hover:shadow-xl transition-all duration-300 ${
                regulation.is_urgent ? 'border-l-4 border-l-red-500 bg-red-50/30' : 'border-2 border-transparent hover:border-orange-100'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-5">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">{getRegionFlag(regulation.region)}</span>
                    <div className={`p-2.5 rounded-xl border-2 ${getLevelColor(regulation.level)}`}>
                      <LevelIcon className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-700 transition-colors">
                          {regulation.regulation_name}
                          {regulation.is_urgent && (
                            <span className="ml-3 px-3 py-1 text-xs font-bold bg-red-600 text-white rounded-full animate-pulse">
                              URGENTE
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">{regulation.regulation_code}</span> • {regulation.region} • {regulation.category}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 min-w-[100px]">Tipo:</span>
                          <span className={`px-3 py-1 rounded-xl font-semibold text-xs ${
                            regulation.type === 'Obrigatória' 
                              ? 'bg-red-100 text-red-800 border border-red-200' 
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                            {regulation.type}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 min-w-[100px]">Nível:</span>
                          <span className={`px-3 py-1 rounded-xl font-semibold text-xs border-2 ${getLevelColor(regulation.level)}`}>
                            {regulation.level}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 min-w-[100px]">Vigência:</span>
                          <span className={`font-medium text-sm ${isCriticalDate ? 'text-red-600' : 'text-gray-700'}`}>
                            {regulation.validity_date === 'Permanente' ? 'Permanente' : 
                             regulation.validity_date === 'Em vigor' ? 'Em vigor' :
                             new Date(regulation.validity_date).toLocaleDateString('pt-BR')}
                            {isCriticalDate && (
                              <AlertTriangle className="w-4 h-4 inline ml-1.5 text-red-500" />
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 font-medium">{regulation.authority}</span>
                        </div>
                        
                        <div className="flex items-start gap-2.5">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-sm text-gray-700">{regulation.document_proof}</span>
                        </div>
                        
                        <div className="flex items-start gap-2.5">
                          <span className="text-sm text-gray-500 min-w-[60px]">Verticais:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {regulation.verticals.map((vertical, index) => (
                              <span 
                                key={index}
                                className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium"
                              >
                                {vertical}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {regulation.alert_tag && (
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold">
                          Tag: {regulation.alert_tag}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button className="px-5 py-2.5 text-orange-700 bg-orange-50 border-2 border-orange-200 rounded-xl hover:bg-orange-100 transition-all font-semibold text-sm">
                        Ver Detalhes
                      </button>
                      <button className="px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm">
                        Iniciar Compliance
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredRegulations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma regulamentação encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('all');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSelectedType('all');
                  setShowUrgentOnly(false);
                }}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-lg font-semibold"
              >
                Limpar Filtros
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer Info */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Fontes Oficiais
              </h3>
              <p className="text-sm text-gray-600">
                Dados compilados de: ANATEL, INMETRO, ANVISA, Receita Federal, CE/EU, FCC, GACC, IMO, IATA, ISO
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Última atualização</div>
              <div className="text-lg font-bold text-gray-900">Outubro 2025</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
