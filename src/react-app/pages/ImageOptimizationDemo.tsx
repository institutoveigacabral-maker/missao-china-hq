import { useState } from 'react'

import { 
  OptimizedImage, 
  ImageGallery, 
  useImagePreloader, 
  useAdvancedImageLoading 
} from '@/react-app/components/ui/OptimizedImage'
import { 
  useImageOptimization, 
  useBatchImageOptimization, 
  useImageFormatDetection 
} from '@/react-app/hooks/useImageOptimization'
import Button from '@/react-app/components/ui/Button'
import { Spinner } from '@/react-app/components/ui/Spinner'
import { Image, Download, Zap, Monitor, Settings, Camera } from 'lucide-react'

export default function ImageOptimizationDemo() {
  const [selectedQuality, setSelectedQuality] = useState(80)
  const [selectedFormat, setSelectedFormat] = useState<'auto' | 'webp' | 'avif' | 'jpg'>('auto')
  const [lazyLoading, setLazyLoading] = useState(true)

  // Sample images for demonstration
  const sampleImages = [
    {
      src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600',
      alt: 'Mountain landscape',
      caption: 'Mountain Landscape - WebP optimized'
    },
    {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      alt: 'Ocean sunset',
      caption: 'Ocean Sunset - AVIF support'
    },
    {
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
      alt: 'Forest path',
      caption: 'Forest Path - Lazy loaded'
    },
    {
      src: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600',
      alt: 'City skyline',
      caption: 'City Skyline - Compressed'
    },
    {
      src: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=600',
      alt: 'Beach waves',
      caption: 'Beach Waves - Optimized'
    },
    {
      src: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=600',
      alt: 'Desert dunes',
      caption: 'Desert Dunes - High quality'
    }
  ]

  const imageSources = sampleImages.map(img => img.src)
  
  // Hooks demonstration
  const preloadedImages = useImagePreloader(imageSources.slice(0, 3))
  const { supportedFormats, getBestFormat } = useImageFormatDetection()
  const advancedLoading = useAdvancedImageLoading()
  const batchOptimization = useBatchImageOptimization(imageSources)

  // Single image optimization demo
  const singleImageDemo = useImageOptimization(sampleImages[0].src, {
    quality: selectedQuality,
    format: selectedFormat,
    lazy: false,
    preload: true
  })

  const handleBatchPreload = async () => {
    await batchOptimization.preloadAll({
      concurrency: 2,
      priority: 'high'
    })
  }

  const handleAdvancedPreload = async () => {
    await advancedLoading.preloadImages(imageSources, {
      concurrency: 3,
      priority: 'high'
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                <Image className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sistema de Otimização de Imagens
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Demonstração completa do sistema de lazy loading inteligente, 
              otimização automática de formatos e performance avançada
            </p>
          </div>

          {/* Browser Support Detection */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-600" />
              Suporte do Navegador
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(supportedFormats).map(([format, supported]) => (
                <div key={format} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${supported ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-medium uppercase">{format}</span>
                  <span className="text-sm text-gray-600">
                    {supported ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Formato Recomendado:</strong> {getBestFormat()}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Configurações de Otimização
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quality Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualidade: {selectedQuality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Baixa</span>
                  <span>Alta</span>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Formato
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="auto">Auto (Melhor)</option>
                  <option value="webp">WebP</option>
                  <option value="avif">AVIF</option>
                  <option value="jpg">JPEG</option>
                </select>
              </div>

              {/* Lazy Loading Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lazy Loading
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={lazyLoading}
                    onChange={(e) => setLazyLoading(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {lazyLoading ? 'Ativado' : 'Desativado'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Single Image Demo */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Demonstração - Imagem Única
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <OptimizedImage
                  src={singleImageDemo.optimizedSrc}
                  alt="Demo image"
                  width={400}
                  height={300}
                  quality={selectedQuality}
                  format={selectedFormat}
                  lazy={false}
                  className="w-full h-64 rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Métricas de Performance</h3>
                {singleImageDemo.metrics ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tempo de Carregamento:</span>
                      <span className="font-mono">{singleImageDemo.metrics.loadTime.toFixed(2)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Formato:</span>
                      <span className="font-mono uppercase">{singleImageDemo.metrics.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cache:</span>
                      <span className={`font-mono ${singleImageDemo.metrics.cached ? 'text-green-600' : 'text-gray-600'}`}>
                        {singleImageDemo.metrics.cached ? 'Hit' : 'Miss'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span className="text-gray-600">Carregando métricas...</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={singleImageDemo.retry}
                    disabled={singleImageDemo.isLoading}
                    size="sm"
                    variant="secondary"
                  >
                    Recarregar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Batch Operations */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Operações em Lote
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Preload Simples</h3>
                <p className="text-sm text-gray-600">
                  {preloadedImages.size} de {imageSources.slice(0, 3).length} imagens carregadas
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(preloadedImages.size / 3) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Batch Optimization</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{batchOptimization.stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carregando:</span>
                    <span>{batchOptimization.stats.loading}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carregadas:</span>
                    <span>{batchOptimization.stats.loaded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Falharam:</span>
                    <span>{batchOptimization.stats.failed}</span>
                  </div>
                  {batchOptimization.stats.avgLoadTime > 0 && (
                    <div className="flex justify-between">
                      <span>Tempo Médio:</span>
                      <span>{batchOptimization.stats.avgLoadTime.toFixed(2)}ms</span>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleBatchPreload}
                  size="sm"
                  className="w-full"
                >
                  Preload em Lote
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Advanced Loading</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Carregando:</span>
                    <span>{advancedLoading.stats.loading}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carregadas:</span>
                    <span>{advancedLoading.stats.loaded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Falharam:</span>
                    <span>{advancedLoading.stats.failed}</span>
                  </div>
                </div>
                <Button 
                  onClick={handleAdvancedPreload}
                  size="sm"
                  variant="secondary"
                  className="w-full"
                >
                  Advanced Preload
                </Button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Galeria com Lazy Loading Inteligente
            </h2>
            <p className="text-gray-600 mb-6">
              As primeiras 6 imagens carregam imediatamente, as demais usam lazy loading.
              Formatos otimizados automaticamente baseado no suporte do navegador.
            </p>
            <ImageGallery 
              images={sampleImages}
              columns={3}
              className="mb-6"
            />
          </div>

          {/* Performance Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              💡 Dicas de Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Otimização Automática:</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• AVIF para navegadores compatíveis</li>
                  <li>• WebP como fallback moderno</li>
                  <li>• JPEG para máxima compatibilidade</li>
                  <li>• Lazy loading após primeira tela</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Recursos Avançados:</h3>
                <ul className="space-y-1 text-gray-700">
                  <li>• Intersection Observer nativo</li>
                  <li>• Preload inteligente por prioridade</li>
                  <li>• Métricas de performance em tempo real</li>
                  <li>• Fallback automático para imagens</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
