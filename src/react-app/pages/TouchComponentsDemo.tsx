import React, { useState } from 'react'
import { 
  TouchButton, TouchFAB, TouchInput, TouchTextArea, TouchCard, TouchCardList,
  SwipeGesture, DragGesture, PinchZoom, MultiGesture, TouchSlider,
  TouchCarousel, TouchCarouselSlide, TouchSwipeActions, createSwipeActions
} from '@/react-app/components/Touch'
import { 
  Plus, Save, Send, Download, Heart, Star, 
  User, Mail, Lock, Search, Settings,
  ArrowRight, ChevronDown, ShoppingCart,
  Smartphone, Tablet, Monitor
} from 'lucide-react'

const TouchComponentsDemo: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [sliderValue, setSliderValue] = useState(50)
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })
  const [zoomScale, setZoomScale] = useState(1)

  return (
    <div className="space-y-6 p-6">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="responsive-container py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Touch Components Demo
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Componentes otimizados para dispositivos touch com feedback tátil avançado e design mobile-first
              </p>
            </div>
          </div>
        </div>

        <div className="responsive-container py-8">
          {/* Touch Buttons Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Smartphone className="w-6 h-6 mr-3 text-blue-600" />
              Touch Buttons
            </h2>
            
            <div className="space-y-8">
              {/* Button Variants */}
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Variações</h3>
                <div className="flex flex-wrap gap-3">
                  <TouchButton variant="primary" leftIcon={Save}>
                    Primary
                  </TouchButton>
                  <TouchButton variant="secondary" leftIcon={Send}>
                    Secondary
                  </TouchButton>
                  <TouchButton variant="outline" leftIcon={Download}>
                    Outline
                  </TouchButton>
                  <TouchButton variant="ghost" leftIcon={Heart}>
                    Ghost
                  </TouchButton>
                  <TouchButton variant="danger" leftIcon={Star}>
                    Danger
                  </TouchButton>
                </div>
              </TouchCard>

              {/* Button Sizes */}
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tamanhos</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <TouchButton size="sm">Small</TouchButton>
                  <TouchButton size="md">Medium</TouchButton>
                  <TouchButton size="lg">Large</TouchButton>
                  <TouchButton size="xl">Extra Large</TouchButton>
                </div>
              </TouchCard>

              {/* Full Width & Loading */}
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estados Especiais</h3>
                <div className="space-y-3">
                  <TouchButton fullWidth rightIcon={ArrowRight}>
                    Botão Full Width
                  </TouchButton>
                  <TouchButton loading>
                    Carregando...
                  </TouchButton>
                  <TouchButton disabled leftIcon={Settings}>
                    Desabilitado
                  </TouchButton>
                </div>
              </TouchCard>
            </div>
          </section>

          {/* Touch Inputs Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Tablet className="w-6 h-6 mr-3 text-blue-600" />
              Touch Inputs
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inputs Básicos</h3>
                <div className="space-y-4">
                  <TouchInput
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    leftIcon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    clearable
                    onClear={() => setEmail('')}
                  />
                  
                  <TouchInput
                    label="Senha"
                    type="password"
                    placeholder="Digite sua senha"
                    leftIcon={Lock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  
                  <TouchInput
                    label="Buscar"
                    type="search"
                    placeholder="Digite para buscar..."
                    leftIcon={Search}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    clearable
                    onClear={() => setSearch('')}
                  />
                </div>
              </TouchCard>

              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Estados & Validação</h3>
                <div className="space-y-4">
                  <TouchInput
                    label="Input com Erro"
                    placeholder="Digite algo..."
                    error="Este campo é obrigatório"
                    leftIcon={User}
                  />
                  
                  <TouchInput
                    label="Input com Helper Text"
                    placeholder="Digite seu nome completo"
                    helperText="Será usado em documentos oficiais"
                    leftIcon={User}
                  />
                  
                  <TouchInput
                    label="Input Desabilitado"
                    placeholder="Campo desabilitado"
                    disabled
                    leftIcon={Settings}
                  />
                </div>
              </TouchCard>
            </div>

            {/* TextArea */}
            <TouchCard padding="lg" className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Area</h3>
              <TouchTextArea
                label="Mensagem"
                placeholder="Digite sua mensagem aqui..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                helperText={`${message.length}/500 caracteres`}
                rows={4}
              />
            </TouchCard>
          </section>

          {/* Touch Cards Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Monitor className="w-6 h-6 mr-3 text-blue-600" />
              Touch Cards
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Interactive Cards */}
              <TouchCard 
                padding="lg" 
                shadow="md" 
                hover 
                onClick={() => setSelectedCard('card1')}
                className={selectedCard === 'card1' ? 'ring-2 ring-blue-500' : ''}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Card Interativo</h3>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm">
                  Este card responde ao toque e tem feedback visual
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Toque para selecionar</span>
                </div>
              </TouchCard>

              <TouchCard 
                padding="lg" 
                shadow="md" 
                hover 
                onClick={() => setSelectedCard('card2')}
                className={selectedCard === 'card2' ? 'ring-2 ring-blue-500' : ''}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Shopping Card</h3>
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm">
                  Card otimizado para e-commerce mobile
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">R$ 199,90</span>
                  <TouchButton size="sm" variant="outline">
                    Comprar
                  </TouchButton>
                </div>
              </TouchCard>

              <TouchCard padding="lg" shadow="md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Card Estático</h3>
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-gray-600 text-sm">
                  Este card não é clicável, apenas informativo
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">Status: Ativo</span>
                  </div>
                </div>
              </TouchCard>
            </div>

            {/* Card List */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista de Cards</h3>
              <TouchCardList>
                {[1, 2, 3].map((item) => (
                  <TouchCard key={item} padding="md" hover onClick={() => {}}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Item {item}</h4>
                        <p className="text-sm text-gray-600">Descrição do item {item}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </TouchCard>
                ))}
              </TouchCardList>
            </div>
          </section>

          {/* Touch Feedback Demo */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Feedback Tátil
            </h2>
            
            <TouchCard padding="lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Teste o Feedback Tátil
                </h3>
                <p className="text-gray-600 mb-6">
                  Toque nos elementos para sentir o feedback visual e tátil otimizado para mobile
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="touch-feedback p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">Toque aqui</span>
                  </div>
                  <div className="touch-feedback p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">E aqui</span>
                  </div>
                  <div className="touch-feedback p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">Também aqui</span>
                  </div>
                  <div className="touch-feedback p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <Settings className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">E por último</span>
                  </div>
                </div>
              </div>
            </TouchCard>
          </section>

          {/* Touch Gestures Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-3 text-blue-600" />
              Gestos Avançados
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Swipe Gestures */}
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Swipe Gestures</h3>
                <SwipeGesture
                  onSwipeLeft={() => alert('Swipe Left!')}
                  onSwipeRight={() => alert('Swipe Right!')}
                  onSwipeUp={() => alert('Swipe Up!')}
                  onSwipeDown={() => alert('Swipe Down!')}
                  className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center"
                >
                  <p className="text-gray-600 mb-2">Arraste em qualquer direção</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                  </div>
                </SwipeGesture>
              </TouchCard>

              {/* Multi Gestures */}
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi Gestures</h3>
                <MultiGesture
                  onTap={() => alert('Tap!')}
                  onDoubleTap={() => alert('Double Tap!')}
                  onLongPress={() => alert('Long Press!')}
                  onSwipeLeft={() => alert('Swipe Left!')}
                  onSwipeRight={() => alert('Swipe Right!')}
                  className="p-8 border-2 border-dashed border-purple-300 rounded-lg text-center bg-purple-50"
                >
                  <p className="text-purple-700 mb-2">Teste diferentes gestos:</p>
                  <p className="text-sm text-purple-600">
                    Tap • Double Tap • Long Press • Swipe
                  </p>
                </MultiGesture>
              </TouchCard>
            </div>
          </section>

          {/* Interactive Components */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Componentes Interativos
            </h2>

            <div className="space-y-8">
              {/* Touch Slider */}
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Touch Slider</h3>
                <div className="space-y-6">
                  <TouchSlider
                    label="Volume"
                    value={sliderValue}
                    onChange={setSliderValue}
                    showValue
                    min={0}
                    max={100}
                    step={5}
                  />
                  
                  <TouchSlider
                    label="Temperatura"
                    value={25}
                    min={-10}
                    max={50}
                    step={1}
                    showValue
                    fillClassName="bg-gradient-to-r from-blue-400 to-red-400"
                  />
                </div>
              </TouchCard>

              {/* Touch Carousel */}
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Touch Carousel</h3>
                <TouchCarousel
                  autoPlay
                  autoPlayInterval={4000}
                  showDots
                  showArrows
                  className="h-48 rounded-lg overflow-hidden"
                >
                  <TouchCarouselSlide className="bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-white text-center">
                      <h4 className="text-xl font-bold mb-2">Slide 1</h4>
                      <p>Arraste para navegar</p>
                    </div>
                  </TouchCarouselSlide>
                  <TouchCarouselSlide className="bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                    <div className="text-white text-center">
                      <h4 className="text-xl font-bold mb-2">Slide 2</h4>
                      <p>Auto-play ativado</p>
                    </div>
                  </TouchCarouselSlide>
                  <TouchCarouselSlide className="bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <div className="text-white text-center">
                      <h4 className="text-xl font-bold mb-2">Slide 3</h4>
                      <p>Navegação infinita</p>
                    </div>
                  </TouchCarouselSlide>
                </TouchCarousel>
              </TouchCard>

              {/* Swipe Actions */}
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Swipe Actions</h3>
                <div className="space-y-3">
                  <TouchSwipeActions
                    leftActions={[
                      createSwipeActions.favorite(() => alert('Favoritado!')),
                      createSwipeActions.edit(() => alert('Editando...'))
                    ]}
                    rightActions={[
                      createSwipeActions.archive(() => alert('Arquivado!')),
                      createSwipeActions.delete(() => alert('Excluído!'))
                    ]}
                  >
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Email de João</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Arraste para esquerda ou direita para ver as ações
                      </p>
                    </div>
                  </TouchSwipeActions>

                  <TouchSwipeActions
                    rightActions={[
                      createSwipeActions.delete(() => alert('Item removido!'))
                    ]}
                  >
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Tarefa Importante</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Arraste para a esquerda para excluir
                      </p>
                    </div>
                  </TouchSwipeActions>
                </div>
              </TouchCard>
            </div>
          </section>

          {/* Advanced Gestures */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Gestos Avançados
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Drag Gesture */}
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Drag Gesture</h3>
                <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <DragGesture
                    onDragMove={(pos) => setDragPosition({ x: pos.x % 200, y: pos.y % 150 })}
                  >
                    <div
                      className="absolute w-12 h-12 bg-blue-500 rounded-lg shadow-lg cursor-move flex items-center justify-center text-white font-bold"
                      style={{
                        transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                        transition: 'transform 0.1s ease-out'
                      }}
                    >
                      📱
                    </div>
                  </DragGesture>
                </div>
                <p className="text-sm text-gray-600 mt-2">Arraste o elemento azul</p>
              </TouchCard>

              {/* Pinch Zoom */}
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pinch Zoom</h3>
                <div className="h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <PinchZoom
                    onZoomChange={setZoomScale}
                    minScale={0.5}
                    maxScale={2}
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      🔍
                    </div>
                  </PinchZoom>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Zoom: {Math.round(zoomScale * 100)}% (Use dois dedos para zoom)
                </p>
              </TouchCard>
            </div>
          </section>

          {/* Usage Guide */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Guia de Uso
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Princípios de Design
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Touch targets mínimos de 44px
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Feedback visual imediato ao toque
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Transições suaves e naturais
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Otimizado para uma mão
                  </li>
                </ul>
              </TouchCard>

              <TouchCard padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recursos Técnicos
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Classes CSS otimizadas para performance
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Suporte a gestos nativos
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Acessibilidade integrada
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Compatible com PWA
                  </li>
                </ul>
              </TouchCard>
            </div>
          </section>
        </div>

        {/* Floating Action Button */}
        <TouchFAB
          icon={Plus}
          onClick={() => console.log('FAB clicked!')}
        />
      </div>
    </div>
  )
}

export default TouchComponentsDemo
