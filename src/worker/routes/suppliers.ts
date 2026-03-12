import { Hono } from 'hono'
import { Env } from '../../shared/types'

export const supplierRoutes = new Hono<{ Bindings: Env }>()

// Get all suppliers with filters and search
supplierRoutes.get('/', async (c) => {
  try {
    const search = c.req.query('search') || ''
    const category = c.req.query('category') || ''
    const minScore = c.req.query('minScore') || '0'
    const certified = c.req.query('certified') || ''
    
    let query = 'SELECT * FROM suppliers WHERE 1=1'
    const params: any[] = []
    
    // Search filter
    if (search) {
      query += ` AND (
        company_name LIKE ? OR 
        supplier_type LIKE ? OR 
        city LIKE ? OR 
        country LIKE ? OR 
        product_lines LIKE ? OR 
        vertical LIKE ?
      )`
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern)
    }
    
    // Category filter
    if (category) {
      query += ' AND vertical = ?'
      params.push(category)
    }
    
    // Score filter
    if (parseFloat(minScore) > 0) {
      query += ' AND overall_score >= ?'
      params.push(parseFloat(minScore))
    }
    
    // Certification filter
    if (certified === 'true') {
      query += ' AND certifications IS NOT NULL AND certifications != ""'
    }
    
    query += ' ORDER BY overall_score DESC, created_at DESC'
    
    const stmt = c.env.DB.prepare(query)
    const { results } = await stmt.bind(...params).all()
    
    return c.json({
      success: true,
      data: results || [],
      count: results?.length || 0
    })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch suppliers',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get supplier by ID
supplierRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const result = await c.env.DB.prepare(`
      SELECT * FROM suppliers WHERE id = ?
    `).bind(id).first()
    
    if (!result) {
      return c.json({ 
        success: false,
        error: 'Supplier not found' 
      }, 404)
    }
    
    return c.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error fetching supplier:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch supplier',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Create new supplier
supplierRoutes.post('/', async (c) => {
  try {
    const data = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO suppliers (
        supplier_code, company_name, supplier_type, country, city,
        contact_person, email, phone, quality_rating, certification_status,
        compliance_score, risk_level, is_approved, notes,
        vertical, product_lines, certifications, moq, lead_time_days,
        preferred_incoterm, payment_terms, price_range_fob_usd,
        monthly_capacity, compliance_destination, qc_history,
        accepts_inspection, sealed_sample, fair_booth,
        factory_visit_status, contract_status,
        score_capacity, score_cost, score_lead_time, score_compliance,
        score_communication, score_qc, overall_score,
        negotiation_notes, wechat_qr, protocols
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `).bind(
      data.supplier_code,
      data.company_name,
      data.supplier_type,
      data.country,
      data.city || null,
      data.contact_person || null,
      data.email || null,
      data.phone || null,
      data.quality_rating || 0,
      data.certification_status || 'pending',
      data.compliance_score || 0,
      data.risk_level || 'medium',
      data.is_approved || false,
      data.notes || null,
      data.vertical || null,
      data.product_lines || null,
      data.certifications || null,
      data.moq || null,
      data.lead_time_days || null,
      data.preferred_incoterm || 'FOB',
      data.payment_terms || null,
      data.price_range_fob_usd || null,
      data.monthly_capacity || null,
      data.compliance_destination || null,
      data.qc_history || 'pending',
      data.accepts_inspection || false,
      data.sealed_sample || false,
      data.fair_booth || null,
      data.factory_visit_status || 'pending',
      data.contract_status || 'prospect',
      data.score_capacity || 0,
      data.score_cost || 0,
      data.score_lead_time || 0,
      data.score_compliance || 0,
      data.score_communication || 0,
      data.score_qc || 0,
      data.overall_score || 0,
      data.negotiation_notes || null,
      data.wechat_qr || null,
      data.protocols || null
    ).run()
    
    return c.json({
      success: true,
      data: { id: result.meta.last_row_id, ...data }
    }, 201)
  } catch (error) {
    console.error('Error creating supplier:', error)
    return c.json({ 
      success: false,
      error: 'Failed to create supplier',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Update supplier
supplierRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    
    await c.env.DB.prepare(`
      UPDATE suppliers SET
        supplier_code = ?, company_name = ?, supplier_type = ?,
        country = ?, city = ?, contact_person = ?, email = ?, phone = ?,
        quality_rating = ?, certification_status = ?, compliance_score = ?,
        risk_level = ?, is_approved = ?, notes = ?,
        vertical = ?, product_lines = ?, certifications = ?,
        moq = ?, lead_time_days = ?, preferred_incoterm = ?,
        payment_terms = ?, price_range_fob_usd = ?,
        monthly_capacity = ?, compliance_destination = ?,
        qc_history = ?, accepts_inspection = ?, sealed_sample = ?,
        fair_booth = ?, factory_visit_status = ?, contract_status = ?,
        score_capacity = ?, score_cost = ?, score_lead_time = ?,
        score_compliance = ?, score_communication = ?, score_qc = ?,
        overall_score = ?, negotiation_notes = ?, wechat_qr = ?,
        protocols = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.supplier_code,
      data.company_name,
      data.supplier_type,
      data.country,
      data.city || null,
      data.contact_person || null,
      data.email || null,
      data.phone || null,
      data.quality_rating || 0,
      data.certification_status || 'pending',
      data.compliance_score || 0,
      data.risk_level || 'medium',
      data.is_approved || false,
      data.notes || null,
      data.vertical || null,
      data.product_lines || null,
      data.certifications || null,
      data.moq || null,
      data.lead_time_days || null,
      data.preferred_incoterm || 'FOB',
      data.payment_terms || null,
      data.price_range_fob_usd || null,
      data.monthly_capacity || null,
      data.compliance_destination || null,
      data.qc_history || 'pending',
      data.accepts_inspection || false,
      data.sealed_sample || false,
      data.fair_booth || null,
      data.factory_visit_status || 'pending',
      data.contract_status || 'prospect',
      data.score_capacity || 0,
      data.score_cost || 0,
      data.score_lead_time || 0,
      data.score_compliance || 0,
      data.score_communication || 0,
      data.score_qc || 0,
      data.overall_score || 0,
      data.negotiation_notes || null,
      data.wechat_qr || null,
      data.protocols || null,
      id
    ).run()
    
    return c.json({
      success: true,
      data: { id, ...data }
    })
  } catch (error) {
    console.error('Error updating supplier:', error)
    return c.json({ 
      success: false,
      error: 'Failed to update supplier',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Delete supplier
supplierRoutes.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    await c.env.DB.prepare(`
      DELETE FROM suppliers WHERE id = ?
    `).bind(id).run()
    
    return c.json({
      success: true,
      message: 'Supplier deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return c.json({ 
      success: false,
      error: 'Failed to delete supplier',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get supplier statistics
supplierRoutes.get('/stats/summary', async (c) => {
  try {
    const stats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total,
        AVG(overall_score) as avg_score,
        SUM(CASE WHEN is_approved = 1 THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN certifications IS NOT NULL AND certifications != '' THEN 1 ELSE 0 END) as certified_count,
        COUNT(DISTINCT vertical) as category_count
      FROM suppliers
    `).first()
    
    return c.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching supplier stats:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch supplier statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get suppliers by category
supplierRoutes.get('/by-category/:category', async (c) => {
  try {
    const category = c.req.param('category')
    
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM suppliers 
      WHERE vertical = ?
      ORDER BY overall_score DESC
    `).bind(category).all()
    
    return c.json({
      success: true,
      data: results || [],
      count: results?.length || 0
    })
  } catch (error) {
    console.error('Error fetching suppliers by category:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch suppliers by category',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})
