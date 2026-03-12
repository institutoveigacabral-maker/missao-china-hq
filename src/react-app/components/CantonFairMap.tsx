import { useState } from 'react';
import { MapPin, Eye, Maximize2 } from 'lucide-react';

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

interface CantonFairMapProps {
  phase: number;
  selectedArea: string | null;
  onAreaClick: (area: string) => void;
  fairData: Record<string, AreaInfo>;
}

export default function CantonFairMap({ 
  phase, 
  selectedArea, 
  onAreaClick, 
  fairData 
}: CantonFairMapProps) {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // URLs dos mapas das fases
  const mapImages = {
    1: 'https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/canton-fair-mapa.png',
    2: 'https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/canton-fair-mapa2.png',
    3: 'https://mocha-cdn.com/0199b593-2bd4-70b8-b750-6e0ef41c10a8/canton-fair-mapa3.png'
  };

  // Coordenadas das áreas no mapa (percentuais relativos à imagem) - Ajustadas para melhor precisão
  const areaCoordinates: Record<number, Record<string, { x: number; y: number; width: number; height: number }>> = {
    1: {
      'A': { x: 25, y: 20, width: 20, height: 25 }, // Área A - Electronics & Appliance
      'B': { x: 50, y: 20, width: 20, height: 25 }, // Área B - Manufacturing  
      'C': { x: 25, y: 50, width: 20, height: 25 }, // Área C - Vehicles & Two Wheels
      'D': { x: 50, y: 50, width: 20, height: 25 }  // Área D - Light & Electrical
    },
    2: {
      'A': { x: 20, y: 25, width: 22, height: 30 },  // Área A - Houseware
      'B': { x: 50, y: 25, width: 22, height: 30 },  // Área B - Gift & Decorations
      'C': { x: 20, y: 60, width: 22, height: 30 },  // Área C - Building & Furniture
      'D': { x: 50, y: 60, width: 22, height: 30 }   // Área D - International
    },
    3: {
      'A': { x: 15, y: 20, width: 25, height: 35 },  // Área A - Toys & Children
      'B': { x: 45, y: 20, width: 25, height: 35 },  // Área B - Fashion
      'C': { x: 15, y: 60, width: 25, height: 30 },  // Área C - Home Textiles
      'D': { x: 45, y: 60, width: 25, height: 30 }   // Área D - Health & Recreation
    }
  };

  const currentMapImage = mapImages[phase as keyof typeof mapImages];
  const currentAreaCoords = areaCoordinates[phase] || {};

  const MapContainer = ({ children }: { children: React.ReactNode }) => {
    const containerClass = isFullscreen 
      ? "fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      : "relative bg-slate-50";
    
    if (isFullscreen) {
      return (
        <div className={containerClass} onClick={() => setIsFullscreen(false)}>
          <div className="max-w-7xl max-h-full w-full h-full relative" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      );
    }
    
    return <div className={containerClass}>{children}</div>;
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Mapa Interativo - Fase {phase}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-slate-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>Clique nas áreas para explorar</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                title="Ver em tela cheia"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-sm font-medium">Tela Cheia</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Map Container */}
        <MapContainer>
          {/* Base Map Image */}
          <div className="relative w-full" style={{ paddingBottom: isFullscreen ? '80vh' : '60%' }}>
            <img
              src={currentMapImage}
              alt={`Canton Fair Fase ${phase}`}
              className="absolute inset-0 w-full h-full object-contain bg-white"
              style={{ objectFit: 'contain' }}
            />
            
            {/* Interactive Area Overlays */}
            {Object.entries(currentAreaCoords).map(([areaKey, coords]) => {
              const areaData = fairData[areaKey];
              if (!areaData) return null;

              const isSelected = selectedArea === areaKey;
              const isHovered = hoveredArea === areaKey;
              
              return (
                <div
                  key={areaKey}
                  className={`absolute cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'ring-4 ring-red-500 ring-opacity-75 z-20' 
                      : isHovered 
                        ? 'ring-2 ring-blue-500 ring-opacity-50 z-10'
                        : 'hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50'
                  }`}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    width: `${coords.width}%`,
                    height: `${coords.height}%`,
                  }}
                  onClick={() => onAreaClick(areaKey)}
                  onMouseEnter={() => setHoveredArea(areaKey)}
                  onMouseLeave={() => setHoveredArea(null)}
                >
                  {/* Overlay Background */}
                  <div 
                    className={`w-full h-full rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'bg-red-500 bg-opacity-30' 
                        : isHovered 
                          ? 'bg-blue-500 bg-opacity-20'
                          : 'bg-transparent hover:bg-blue-400 hover:bg-opacity-10'
                    }`}
                  />
                  
                  {/* Area Label */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-bold text-white shadow-lg transition-all duration-200 ${
                      isSelected 
                        ? 'bg-red-600 scale-110' 
                        : isHovered 
                          ? 'bg-blue-600 scale-105'
                          : 'bg-slate-700 opacity-90'
                    }`}>
                      <div className="text-center">
                        <div className="text-sm sm:text-lg font-bold">Área {areaKey}</div>
                        <div className="text-xs opacity-90">
                          {(areaData.totalExhibitors / 1000).toFixed(1)}k expo.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Fullscreen close button */}
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-all z-30"
              >
                ✕
              </button>
            )}
          </div>

          

          {/* Hover Tooltip - Simplificado e melhor posicionado */}
          {hoveredArea && fairData[hoveredArea] && !isFullscreen && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-200 p-3 max-w-xs z-30">
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 ${fairData[hoveredArea].color} rounded flex-shrink-0 mt-0.5`}></div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Área {hoveredArea}</h4>
                  <p className="text-xs text-slate-600 mb-2 line-clamp-2">{fairData[hoveredArea].description}</p>
                  
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Expositores:</span>
                      <span className="font-medium text-slate-700">{fairData[hoveredArea].totalExhibitors.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Visitantes:</span>
                      <span className="font-medium text-slate-700">{fairData[hoveredArea].estimatedVisitors.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Halls:</span>
                      <span className="font-medium text-slate-700">{fairData[hoveredArea].halls.length}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="mt-2 w-full flex items-center justify-center space-x-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded px-2 py-1 transition-colors"
                    onClick={() => onAreaClick(hoveredArea)}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Ver Detalhes</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </MapContainer>
      </div>

      {/* Area Stats Bar - Layout Otimizado */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200 p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-slate-900 text-sm">Áreas da Fase {phase}</h3>
          <p className="text-xs text-slate-600">Clique nas áreas para explorar detalhes</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(fairData).map(([areaKey, areaData]) => {
            const isSelected = selectedArea === areaKey;
            
            return (
              <div 
                key={areaKey}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected 
                    ? 'bg-red-50 border-red-400 shadow-lg ring-2 ring-red-200' 
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => onAreaClick(areaKey)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${areaData.color} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                    {areaKey}
                  </div>
                  <div className={`text-lg font-bold ${isSelected ? 'text-red-600' : 'text-slate-900'}`}>
                    {areaData.totalExhibitors.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-700 line-clamp-1">
                    {areaData.description}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-medium text-slate-900">{areaData.totalExhibitors.toLocaleString()}</div>
                      <div className="text-slate-500">Expositores</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-slate-900">{areaData.halls.length}</div>
                      <div className="text-slate-500">Halls</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isSelected ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((areaData.totalExhibitors / 5000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
