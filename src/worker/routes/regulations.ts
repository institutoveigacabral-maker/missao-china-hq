import { Hono } from 'hono'
import { Env } from '../../shared/types'

export const regulationRoutes = new Hono<{ Bindings: Env }>()

// Get all regulations with filters and search
regulationRoutes.get('/', async (c) => {
  try {
    const search = c.req.query('search') || ''
    const region = c.req.query('region') || ''
    const category = c.req.query('category') || ''
    const severity = c.req.query('severity') || ''
    const mandatoryOnly = c.req.query('mandatoryOnly') === 'true'
    
    let query = 'SELECT * FROM regulations WHERE 1=1'
    const params: any[] = []
    
    // Search filter
    if (search) {
      query += ` AND (
        regulation_code LIKE ? OR 
        regulation_name LIKE ? OR 
        description LIKE ? OR
        enforcement_authority LIKE ?
      )`
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern)
    }
    
    // Region filter
    if (region) {
      query += ' AND region = ?'
      params.push(region)
    }
    
    // Category filter
    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }
    
    // Severity filter
    if (severity) {
      query += ' AND severity_level = ?'
      params.push(severity)
    }
    
    // Mandatory only filter
    if (mandatoryOnly) {
      query += ' AND is_mandatory = 1'
    }
    
    query += ' ORDER BY severity_level DESC, created_at DESC'
    
    const stmt = c.env.DB.prepare(query)
    const { results } = await stmt.bind(...params).all()
    
    return c.json({
      success: true,
      data: results || [],
      count: results?.length || 0
    })
  } catch (error) {
    console.error('Error fetching regulations:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch regulations',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get regulation by ID with requirements and deadlines
regulationRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const regulation = await c.env.DB.prepare(`
      SELECT * FROM regulations WHERE id = ?
    `).bind(id).first()
    
    if (!regulation) {
      return c.json({ 
        success: false,
        error: 'Regulation not found' 
      }, 404)
    }
    
    // Get requirements
    const { results: requirements } = await c.env.DB.prepare(`
      SELECT * FROM regulation_requirements 
      WHERE regulation_id = ?
      ORDER BY is_mandatory DESC, requirement_type
    `).bind(id).all()
    
    // Get deadlines
    const { results: deadlines } = await c.env.DB.prepare(`
      SELECT * FROM regulation_deadlines 
      WHERE regulation_id = ?
      ORDER BY deadline_date ASC
    `).bind(id).all()
    
    // Get checklist
    const { results: checklist } = await c.env.DB.prepare(`
      SELECT * FROM regulation_compliance_checklists 
      WHERE regulation_id = ?
      ORDER BY item_order ASC, is_critical DESC
    `).bind(id).all()
    
    return c.json({
      success: true,
      data: {
        ...regulation,
        requirements: requirements || [],
        deadlines: deadlines || [],
        checklist: checklist || []
      }
    })
  } catch (error) {
    console.error('Error fetching regulation:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch regulation',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Create new regulation
regulationRoutes.post('/', async (c) => {
  try {
    const data = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO regulations (
        regulation_code, regulation_name, region, category,
        description, official_link, validity_start_date,
        validity_end_date, last_update_date, severity_level,
        is_mandatory, jurisdiction_id, category_id,
        implementation_date, enforcement_authority,
        penalty_description, testing_standards,
        certification_body, annual_maintenance,
        documentation_retention_years
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.regulation_code,
      data.regulation_name,
      data.region,
      data.category,
      data.description || null,
      data.official_link || null,
      data.validity_start_date || null,
      data.validity_end_date || null,
      data.last_update_date || null,
      data.severity_level || 'medium',
      data.is_mandatory !== undefined ? data.is_mandatory : true,
      data.jurisdiction_id || null,
      data.category_id || null,
      data.implementation_date || null,
      data.enforcement_authority || null,
      data.penalty_description || null,
      data.testing_standards || null,
      data.certification_body || null,
      data.annual_maintenance || false,
      data.documentation_retention_years || 5
    ).run()
    
    return c.json({
      success: true,
      data: { id: result.meta.last_row_id, ...data }
    }, 201)
  } catch (error) {
    console.error('Error creating regulation:', error)
    return c.json({ 
      success: false,
      error: 'Failed to create regulation',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Update regulation
regulationRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    
    await c.env.DB.prepare(`
      UPDATE regulations SET
        regulation_code = ?, regulation_name = ?, region = ?,
        category = ?, description = ?, official_link = ?,
        validity_start_date = ?, validity_end_date = ?,
        last_update_date = ?, severity_level = ?, is_mandatory = ?,
        jurisdiction_id = ?, category_id = ?, implementation_date = ?,
        enforcement_authority = ?, penalty_description = ?,
        testing_standards = ?, certification_body = ?,
        annual_maintenance = ?, documentation_retention_years = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.regulation_code,
      data.regulation_name,
      data.region,
      data.category,
      data.description || null,
      data.official_link || null,
      data.validity_start_date || null,
      data.validity_end_date || null,
      data.last_update_date || null,
      data.severity_level,
      data.is_mandatory,
      data.jurisdiction_id || null,
      data.category_id || null,
      data.implementation_date || null,
      data.enforcement_authority || null,
      data.penalty_description || null,
      data.testing_standards || null,
      data.certification_body || null,
      data.annual_maintenance,
      data.documentation_retention_years,
      id
    ).run()
    
    return c.json({
      success: true,
      data: { id, ...data }
    })
  } catch (error) {
    console.error('Error updating regulation:', error)
    return c.json({ 
      success: false,
      error: 'Failed to update regulation',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Delete regulation
regulationRoutes.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    // Delete related records first
    await c.env.DB.prepare(`DELETE FROM regulation_requirements WHERE regulation_id = ?`).bind(id).run()
    await c.env.DB.prepare(`DELETE FROM regulation_deadlines WHERE regulation_id = ?`).bind(id).run()
    await c.env.DB.prepare(`DELETE FROM regulation_compliance_checklists WHERE regulation_id = ?`).bind(id).run()
    await c.env.DB.prepare(`DELETE FROM sku_regulations WHERE regulation_id = ?`).bind(id).run()
    
    // Delete the regulation
    await c.env.DB.prepare(`DELETE FROM regulations WHERE id = ?`).bind(id).run()
    
    return c.json({
      success: true,
      message: 'Regulation deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting regulation:', error)
    return c.json({ 
      success: false,
      error: 'Failed to delete regulation',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get regulation statistics
regulationRoutes.get('/stats/summary', async (c) => {
  try {
    const stats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_mandatory = 1 THEN 1 ELSE 0 END) as mandatory_count,
        SUM(CASE WHEN severity_level = 'high' THEN 1 ELSE 0 END) as high_severity_count,
        COUNT(DISTINCT region) as region_count,
        COUNT(DISTINCT category) as category_count
      FROM regulations
    `).first()
    
    return c.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching regulation stats:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch regulation statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get regulations by region
regulationRoutes.get('/by-region/:region', async (c) => {
  try {
    const region = c.req.param('region')
    
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM regulations 
      WHERE region = ?
      ORDER BY severity_level DESC, created_at DESC
    `).bind(region).all()
    
    return c.json({
      success: true,
      data: results || [],
      count: results?.length || 0
    })
  } catch (error) {
    console.error('Error fetching regulations by region:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch regulations by region',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Add requirement to regulation
regulationRoutes.post('/:id/requirements', async (c) => {
  try {
    const regulationId = c.req.param('id')
    const data = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO regulation_requirements (
        regulation_id, requirement_type, requirement_text,
        is_mandatory, documentation_needed, testing_required
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      regulationId,
      data.requirement_type,
      data.requirement_text,
      data.is_mandatory !== undefined ? data.is_mandatory : true,
      data.documentation_needed || null,
      data.testing_required || false
    ).run()
    
    return c.json({
      success: true,
      data: { id: result.meta.last_row_id, ...data }
    }, 201)
  } catch (error) {
    console.error('Error adding requirement:', error)
    return c.json({ 
      success: false,
      error: 'Failed to add requirement',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Add deadline to regulation
regulationRoutes.post('/:id/deadlines', async (c) => {
  try {
    const regulationId = c.req.param('id')
    const data = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO regulation_deadlines (
        regulation_id, deadline_date, deadline_type,
        description, impact_level, notification_days
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      regulationId,
      data.deadline_date,
      data.deadline_type,
      data.description || null,
      data.impact_level || 'medium',
      data.notification_days || 30
    ).run()
    
    return c.json({
      success: true,
      data: { id: result.meta.last_row_id, ...data }
    }, 201)
  } catch (error) {
    console.error('Error adding deadline:', error)
    return c.json({ 
      success: false,
      error: 'Failed to add deadline',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})
