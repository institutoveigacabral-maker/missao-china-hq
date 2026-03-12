import { Hono } from 'hono'
import { Env } from '../../shared/types'

export const pingRoutes = new Hono<{ Bindings: Env }>()

// Health check endpoint
pingRoutes.get('/', async (c) => {
  try {
    return c.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'China HQ API'
    })
  } catch (error) {
    console.error('Ping error:', error)
    return c.json({ error: 'Health check failed' }, 500)
  }
})
