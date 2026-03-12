import { useState, useMemo } from 'react';
import CantonFairMap from '@/react-app/components/CantonFairMap';
import { 
  MapPin, 
  Calendar, 
  Building2,
  Download,
  Globe,
  Factory
} from 'lucide-react';
import { useSuppliers } from '../hooks/useSuppliers';

interface AreaInfo {
  area: string;
  phase: number;
  halls: string[];
  categories: string[];
  officialCategories: string[];
  description: string;
  color: string;
  totalExhibitors: number;
  estimatedVisitors: number;
}

export default function CantonFair() {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const { suppliers } = useSuppliers();

  // Estrutura base das fases e áreas da Canton Fair
  const fairData: Record<number, Record<string, AreaInfo>> = {
    1: {
      'A': {
        area: 'A',
        phase: 1,
        halls: ['1.1', '2.1', '3.1', '4.1', '5.1'],
        categories: ['Electronics', 'Consumer Electronics', 'Information Products'],
        officialCategories: ['Electronics & Appliance', 'Consumer Electronics and Information Products'],
        description: 'Eletrônicos e Eletrodomésticos',
        color: 'bg-blue-500',
        totalExhibitors: 0,
        estimatedVisitors: 85000
      },
      'B': {
        area: 'B', 
        phase: 1,
        halls: ['6.1', '7.1', '8.1', '9.1', '10.1'],
        categories: ['Manufacturing', 'Industrial Automation', 'Processing Machinery'],
        officialCategories: ['Manufacturing', 'Industrial Automation and Intelligent Manufacturing'],
        description: 'Manufatura e Automação Industrial',
        color: 'bg-green-500',
        totalExhibitors: 0,
        estimatedVisitors: 72000
      },
      'C': {
        area: 'C',
        phase: 1,
        halls: ['11.1', '12.1', '13.1', '14.1'],
        categories: ['New Energy Vehicles', 'Smart Mobility', 'Vehicle Parts'],
        officialCategories: ['New Energy Vehicles and Smart Mobility', 'Vehicles, Vehicle Spare Parts'],
        description: 'Veículos e Mobilidade Inteligente',
        color: 'bg-purple-500',
        totalExhibitors: 0,
        estimatedVisitors: 58000
      },
      'D': {
        area: 'D',
        phase: 1,
        halls: ['15.1', '16.1', '17.1', '18.1'],
        categories: ['Lighting Equipment', 'Electronic Products', 'New Energy'],
        officialCategories: ['Lighting Equipment', 'Electronic and Electrical Products', 'New Energy Resources'],
        description: 'Iluminação e Energia',
        color: 'bg-orange-500',
        totalExhibitors: 0,
        estimatedVisitors: 62000
      }
    },
    2: {
      'A': {
        area: 'A',
        phase: 2,
        halls: ['1.2', '2.2', '3.2', '4.2'],
        categories: ['General Ceramics', 'Kitchenware', 'Household Items'],
        officialCategories: ['General Ceramics', 'Kitchenware and Tableware', 'Household Items'],
        description: 'Casa e Cozinha',
        color: 'bg-teal-500',
        totalExhibitors: 0,
        estimatedVisitors: 78000
      },
      'B': {
        area: 'B',
        phase: 2,
        halls: ['5.2', '6.2', '7.2', '8.2'],
        categories: ['Glass Artware', 'Home Decorations', 'Gifts'],
        officialCategories: ['Glass Artware', 'Home Decorations', 'Gifts and Premiums'],
        description: 'Presentes e Decoração',
        color: 'bg-cyan-500',
        totalExhibitors: 0,
        estimatedVisitors: 91000
      },
      'C': {
        area: 'C',
        phase: 2,
        halls: ['9.2', '10.2', '11.2', '12.2'],
        categories: ['Building Materials', 'Bathroom Equipment', 'Furniture'],
        officialCategories: ['Building and Decorative Materials', 'Sanitary and Bathroom Equipment'],
        description: 'Construção e Móveis',
        color: 'bg-indigo-500',
        totalExhibitors: 0,
        estimatedVisitors: 83000
      },
      'D': {
        area: 'D',
        phase: 2,
        halls: ['13.2', '14.2', '15.2', '16.2'],
        categories: ['Furniture', 'Stone Decoration', 'Outdoor Equipment'],
        officialCategories: ['Furniture', 'Stone/Iron Decoration and Outdoor Spa Equipment'],
        description: 'Móveis e Decoração Externa',
        color: 'bg-pink-500',
        totalExhibitors: 0,
        estimatedVisitors: 67000
      }
    },
    3: {
      'A': {
        area: 'A',
        phase: 3,
        halls: ['1.3', '2.3', '3.3', '4.3'],
        categories: ['Toys', 'Children Products', 'Baby and Maternity'],
        officialCategories: ['Toys', 'Children, Baby and Maternity Products'],
        description: 'Brinquedos e Produtos Infantis',
        color: 'bg-red-500',
        totalExhibitors: 0,
        estimatedVisitors: 58000
      },
      'B': {
        area: 'B',
        phase: 3,
        halls: ['5.3', '6.3', '7.3', '8.3'],
        categories: ['Clothing', 'Sports Wear', 'Fashion Accessories'],
        officialCategories: ['Men and Women\'s Clothing', 'Sports and Casual Wear', 'Fashion Accessories'],
        description: 'Moda e Acessórios',
        color: 'bg-yellow-500',
        totalExhibitors: 0,
        estimatedVisitors: 105000
      },
      'C': {
        area: 'C',
        phase: 3,
        halls: ['9.3', '10.3', '11.3', '12.3'],
        categories: ['Home Textiles', 'Carpets', 'Tapestries'],
        officialCategories: ['Home Textiles', 'Carpets and Tapestries'],
        description: 'Têxteis do Lar',
        color: 'bg-emerald-500',
        totalExhibitors: 0,
        estimatedVisitors: 74000
      },
      'D': {
        area: 'D',
        phase: 3,
        halls: ['13.3', '14.3', '15.3', '16.3'],
        categories: ['Health Products', 'Medical Devices', 'Personal Care'],
        officialCategories: ['Health Products and Medical Devices', 'Food', 'Personal Care Products'],
        description: 'Saúde e Cuidados Pessoais',
        color: 'bg-violet-500',
        totalExhibitors: 0,
        estimatedVisitors: 87000
      }
    }
  };

  // Conta fornecedores reais com booths na Canton Fair
  const suppliersWithBooths = useMemo(() => {
    return suppliers.filter(s => s.fair_booth && s.fair_booth.trim() !== '');
  }, [suppliers]);

  const currentPhaseData = fairData[selectedPhase] || {};
  const selectedAreaData = selectedArea ? currentPhaseData[selectedArea] : null;

  const handleAreaClick = (area: string) => {
    setSelectedArea(selectedArea === area ? null : area);
  };

  const phaseInfo = {
    1: { dates: 'Out 15-19', theme: 'Eletrônicos e Tecnologia', duration: '5 dias' },
    2: { dates: 'Out 23-27', theme: 'Casa e Decoração', duration: '5 dias' },
    3: { dates: 'Out 31-Nov 4', theme: 'Moda e Saúde', duration: '5 dias' }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="w-8 h-8" />
                  <h1 className="text-2xl lg:text-3xl font-bold">Canton Fair 138ª Edição</h1>
                </div>
                <p className="text-red-100 text-base lg:text-lg mb-4">
                  Mapa Interativo - Fornecedores Cadastrados
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>3 Fases</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>12 Áreas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Factory className="w-4 h-4" />
                    <span>{suppliersWithBooths.length} Fornecedores</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Cadastrados</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right space-y-2">
                <div className="text-3xl lg:text-4xl font-bold">{suppliersWithBooths.length}</div>
                <div className="text-red-100">Fornecedores com Booth</div>
                <div className="text-sm text-red-200">
                  {phaseInfo[selectedPhase as keyof typeof phaseInfo]?.dates}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Selecionar Fase da Feira</h2>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map(phase => {
                  const info = phaseInfo[phase as keyof typeof phaseInfo];
                  return (
                    <button
                      key={phase}
                      onClick={() => {
                        setSelectedPhase(phase);
                        setSelectedArea(null);
                      }}
                      className={`p-3 rounded-lg font-medium transition-all text-left ${
                        selectedPhase === phase
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <div className="font-bold">Fase {phase}</div>
                      <div className="text-xs opacity-75 mt-1">{info?.dates}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Mapa</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(currentPhaseData).map(([areaKey, areaData]) => (
            <div
              key={areaKey}
              onClick={() => handleAreaClick(areaKey)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedArea === areaKey 
                  ? 'border-red-500 bg-red-50 shadow-md' 
                  : 'border-slate-200 bg-white hover:border-red-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${areaData.color} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                  {areaKey}
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Área {areaKey}</h3>
              <p className="text-sm text-slate-600 mb-2 line-clamp-2">{areaData.description}</p>
              <div className="space-y-1 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span>Halls:</span>
                  <span className="font-medium">{areaData.halls.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <CantonFairMap
            phase={selectedPhase}
            selectedArea={selectedArea}
            onAreaClick={handleAreaClick}
            fairData={currentPhaseData}
          />
        </div>

        {selectedAreaData && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 ${selectedAreaData.color} rounded-xl flex items-center justify-center text-white font-bold text-2xl`}>
                  {selectedArea}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Área {selectedArea} - Fase {selectedPhase}
                  </h2>
                  <p className="text-slate-600 mb-3">{selectedAreaData.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Categorias Oficiais da Canton Fair</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAreaData.officialCategories.map((category, index) => (
                    <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Halls desta Área</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {selectedAreaData.halls.map(hall => (
                    <div
                      key={hall}
                      className="px-4 py-3 bg-white border-2 border-slate-200 rounded-lg text-center hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <div className="font-bold text-slate-900">Hall {hall}</div>
                      <div className="text-xs text-slate-500 mt-1">Pavilhão</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedArea && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              Visão Geral - Fase {selectedPhase} • {phaseInfo[selectedPhase as keyof typeof phaseInfo]?.theme}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{suppliersWithBooths.length}</div>
                <div className="text-blue-600 text-sm">Fornecedores Cadastrados</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">4</div>
                <div className="text-purple-600 text-sm">Áreas Principais</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="text-2xl font-bold text-orange-700">{Object.values(currentPhaseData).reduce((total, area) => total + area.halls.length, 0)}</div>
                <div className="text-orange-600 text-sm">Halls Totais</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(currentPhaseData).map(([areaKey, areaData]) => (
                <div key={areaKey} className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:shadow-md transition-all cursor-pointer" onClick={() => handleAreaClick(areaKey)}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 ${areaData.color} rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
                      {areaKey}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Área {areaKey}</h3>
                      <p className="text-slate-600 text-sm">{areaData.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900 text-sm">Categorias Principais:</h4>
                    <div className="flex flex-wrap gap-1">
                      {areaData.officialCategories.slice(0, 2).map((category, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-white text-slate-600 rounded border">
                          {category}
                        </span>
                      ))}
                      {areaData.officialCategories.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded">
                          +{areaData.officialCategories.length - 2} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
