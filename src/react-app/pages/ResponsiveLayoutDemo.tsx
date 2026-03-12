import React, { useState, useEffect } from 'react'
import { Container, MobileContainer, ResponsiveGrid, MobileCardGrid, Stack, MobileHorizontalScroll } from '../components/ResponsiveLayout'
import MetricCard from '../components/MetricCard'
import { useToast } from '../hooks/useToast'

interface BreakpointIndicatorProps {
  visible: boolean
}

const BreakpointIndicator: React.FC<BreakpointIndicatorProps> = ({ visible }) => {
  return (
    <div className={`breakpoint-indicator ${visible ? 'visible' : ''}`} />
  )
}

interface DemoCardProps {
  title: string
  description: string
  color?: string
}

const DemoCard: React.FC<DemoCardProps> = ({ 
  title, 
  description, 
  color = 'bg-white' 
}) => {
  return (
    <div className={`
      ${color} 
      rounded-lg border border-gray-200 
      p-6 shadow-sm hover:shadow-md 
      transition-shadow duration-200
      layout-fade-in
    `}>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  )
}

const ResponsiveLayoutDemo: React.FC = () => {
  const [showBreakpoint, setShowBreakpoint] = useState(false)
  const toast = useToast()

  useEffect(() => {
    // Show breakpoint indicator for 3 seconds on mount
    setShowBreakpoint(true)
    const timer = setTimeout(() => setShowBreakpoint(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleCardClick = (title: string) => {
    toast.info(`Clicked: ${title}`)
  }

  const demoCards = [
    {
      title: 'Container System',
      description: 'Responsive containers with size variants (sm, md, lg, xl, full)',
      color: 'bg-blue-50'
    },
    {
      title: 'Grid Layout',
      description: 'Auto-responsive grids that adapt from 1 to 6 columns',
      color: 'bg-green-50'
    },
    {
      title: 'Stack Components',
      description: 'Vertical and horizontal stacks with spacing control',
      color: 'bg-purple-50'
    },
    {
      title: 'Mobile Optimized',
      description: 'Touch-friendly components with proper safe areas',
      color: 'bg-orange-50'
    },
    {
      title: 'Responsive Typography',
      description: 'Text scales appropriately across all device sizes',
      color: 'bg-pink-50'
    },
    {
      title: 'Animation Support',
      description: 'Smooth transitions and entrance animations included',
      color: 'bg-indigo-50'
    }
  ]

  const horizontalScrollItems = [
    { title: 'Revenue', value: '$124.5K', trend: 'up' as const, color: 'text-green-600' },
    { title: 'Users', value: '8,249', trend: 'up' as const, color: 'text-blue-600' },
    { title: 'Orders', value: '2,847', trend: 'up' as const, color: 'text-purple-600' },
    { title: 'Conversion', value: '3.2%', trend: 'up' as const, color: 'text-orange-600' },
    { title: 'Revenue', value: '$124.5K', trend: 'up' as const, color: 'text-green-600' },
    { title: 'Users', value: '8,249', trend: 'up' as const, color: 'text-blue-600' }
  ]

  return (
    <MobileContainer>
      <BreakpointIndicator visible={showBreakpoint} />
      
      {/* Hero Section */}
      <Container size="xl" className="py-8">
        <Stack spacing={6} className="text-center">
          <div className="layout-slide-up">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Responsive Layout System
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete mobile-first layout system with containers, grids, and stacks 
              optimized for all device sizes.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowBreakpoint(!showBreakpoint)}
              className="
                px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                hover:bg-blue-700 transition-colors touch-feedback
              "
            >
              Toggle Breakpoint Indicator
            </button>
            <button 
              onClick={() => toast.success('Layout system is ready!')}
              className="
                px-6 py-3 bg-green-600 text-white rounded-lg font-medium
                hover:bg-green-700 transition-colors touch-feedback
              "
            >
              Test Toast
            </button>
          </div>
        </Stack>
      </Container>

      {/* Container Sizes Demo */}
      <section className="py-12 bg-gray-50">
        <Container size="lg">
          <Stack spacing={8}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Container Sizes
              </h2>
              <p className="text-gray-600">
                Responsive containers that adapt to different screen sizes
              </p>
            </div>

            <Stack spacing={4}>
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <Container 
                  key={size} 
                  size={size} 
                  className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300"
                >
                  <div className="text-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Container Size: {size.toUpperCase()}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Max width adapts based on breakpoints
                    </p>
                  </div>
                </Container>
              ))}
            </Stack>
          </Stack>
        </Container>
      </section>

      {/* Grid System Demo */}
      <section className="py-12">
        <Container size="xl">
          <Stack spacing={8}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Responsive Grids
              </h2>
              <p className="text-gray-600">
                Auto-adapting grids for different content types
              </p>
            </div>

            {/* Standard Responsive Grid */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Standard Grid (1 → 2 → 3 columns)
              </h3>
              <ResponsiveGrid 
                cols={{ default: 1, sm: 2, lg: 3 }}
                gap={6}
              >
                {demoCards.map((card, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(card.title)}
                    className="cursor-pointer"
                  >
                    <DemoCard {...card} />
                  </div>
                ))}
              </ResponsiveGrid>
            </div>

            {/* Mobile Card Grid */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mobile-Optimized Grid
              </h3>
              <MobileCardGrid>
                {demoCards.slice(0, 4).map((card, index) => (
                  <div
                    key={index}
                    onClick={() => handleCardClick(card.title)}
                    className="cursor-pointer"
                  >
                    <DemoCard {...card} />
                  </div>
                ))}
              </MobileCardGrid>
            </div>
          </Stack>
        </Container>
      </section>

      {/* Stack Demo */}
      <section className="py-12 bg-gray-50">
        <Container size="lg">
          <Stack spacing={8}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Stack Components
              </h2>
              <p className="text-gray-600">
                Flexible layout with vertical and horizontal stacking
              </p>
            </div>

            {/* Vertical Stack */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Vertical Stack
              </h3>
              <Stack direction="vertical" spacing={4}>
                <div className="bg-blue-100 p-4 rounded-lg">Item 1</div>
                <div className="bg-green-100 p-4 rounded-lg">Item 2</div>
                <div className="bg-purple-100 p-4 rounded-lg">Item 3</div>
              </Stack>
            </div>

            {/* Horizontal Stack */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Horizontal Stack (wraps on mobile)
              </h3>
              <Stack direction="horizontal" spacing={4} wrap>
                <div className="bg-red-100 p-4 rounded-lg flex-1 min-w-0">Item A</div>
                <div className="bg-yellow-100 p-4 rounded-lg flex-1 min-w-0">Item B</div>
                <div className="bg-pink-100 p-4 rounded-lg flex-1 min-w-0">Item C</div>
              </Stack>
            </div>
          </Stack>
        </Container>
      </section>

      {/* Mobile Horizontal Scroll */}
      <section className="py-12">
        <Container size="xl">
          <Stack spacing={6}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mobile Horizontal Scroll
              </h2>
              <p className="text-gray-600">
                Touch-friendly horizontal scrolling for metric cards
              </p>
            </div>

            <MobileHorizontalScroll>
              {horizontalScrollItems.map((item, index) => (
                <div key={index} className="flex-shrink-0 w-64">
                  <MetricCard
                    title={item.title}
                    value={item.value}
                    trend={item.trend}
                  />
                </div>
              ))}
            </MobileHorizontalScroll>
          </Stack>
        </Container>
      </section>

      {/* Development Tools */}
      <section className="py-12 bg-gray-900 text-white">
        <Container size="lg">
          <Stack spacing={6}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Development Tools
              </h2>
              <p className="text-gray-300">
                Built-in tools to help with responsive development
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">
                  🎯 Breakpoint Indicator
                </h3>
                <p className="text-gray-300 mb-4">
                  Shows current breakpoint (xs, sm, md, lg, xl, 2xl) while developing
                </p>
                <code className="text-sm bg-gray-700 px-2 py-1 rounded">
                  &lt;BreakpointIndicator visible={'{showBreakpoint}'} /&gt;
                </code>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">
                  📱 Mobile-First Classes
                </h3>
                <p className="text-gray-300 mb-4">
                  Utility classes optimized for mobile development
                </p>
                <code className="text-sm bg-gray-700 px-2 py-1 rounded">
                  .mobile-container, .mobile-grid, .mobile-scroll
                </code>
              </div>
            </div>
          </Stack>
        </Container>
      </section>
    </MobileContainer>
  )
}

export default ResponsiveLayoutDemo
