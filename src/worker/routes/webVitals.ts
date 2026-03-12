import { Hono } from 'hono'
import { Env } from '../../shared/types'

export const webVitalsRoutes = new Hono<{ Bindings: Env }>()

// Store web vitals data
webVitalsRoutes.post('/', async (c) => {
  try {
    const vitals = await c.req.json()
    
    // For now, just log the vitals
    console.log('Web Vitals received:', vitals)
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Error storing web vitals:', error)
    return c.json({ error: 'Failed to store web vitals' }, 500)
  }
})
