// Development tools initialization
// Handles proper setup of dev environment without conflicts

export const initDevTools = () => {
  const isDevelopment = import.meta.env.DEV
  
  if (!isDevelopment) {
    return
  }

  // Suppress common development warnings that are expected
  const originalWarn = console.warn
  console.warn = (...args: any[]) => {
    const message = args[0]
    
    // Filter out expected warnings
    if (
      typeof message === 'string' && (
        message.includes('WebSocket') ||
        message.includes('Service Worker not supported') ||
        message.includes('Skipping SW registration')
      )
    ) {
      // Silently ignore these in development
      return
    }
    
    originalWarn.apply(console, args)
  }

  // Add development mode indicator
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(
      '%c🚀 Missão China HQ - Development Mode',
      'background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
    )
    console.log(
      '%cℹ️ Service Worker is disabled in development to prevent HMR conflicts',
      'color: #6b7280; font-style: italic;'
    )
  }

  // Handle unhandled promise rejections gracefully
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    
    // Ignore WebSocket errors in development
    if (
      reason instanceof Error &&
      (reason.message.includes('WebSocket') || 
       reason.message.includes('closed without opened'))
    ) {
      event.preventDefault()
      return
    }
    
    // Log other errors normally
    console.error('Unhandled promise rejection:', reason)
  })
}
