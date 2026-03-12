import { Hono } from 'hono'
import { Env } from '../../shared/types'

export const skuRoutes = new Hono<{ Bindings: Env }>()

// Get all SKUs with filters and search
skuRoutes.get('/', async (c) => {
  try {
    const search = c.req.query('search') || ''
    const category = c.req.query('category') || ''
    const status = c.req.query('status') || ''
    const riskLevel = c.req.query('riskLevel') || ''
    const activeOnly = c.req.query('activeOnly') === 'true'
    
    let query = 'SELECT * FROM iot_skus WHERE 1=1'
    const params: any[] = []
    
    // Search filter
    if (search) {
      query += ` AND (
        sku_code LIKE ? OR 
        product_name LIKE ? OR 
        description LIKE ? OR 
        technical_specs LIKE ?
      )`
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern)
    }
    
    // Category filter
    if (category) {
      query += ' AND product_category = ?'
      params.push(category)
    }
    
    // Status filter
    if (status) {
      query += ' AND regulatory_status = ?'
      params.push(status)
    }
    
    // Risk level filter
    if (riskLevel) {
      query += ' AND risk_category = ?'
      params.push(riskLevel)
    }
    
    // Active only filter
    if (activeOnly) {
      query += ' AND is_active = 1'
    }
    
    query += ' ORDER BY created_at DESC'
    
    const stmt = c.env.DB.prepare(query)
    const { results } = await stmt.bind(...params).all()
    
    return c.json({
      success: true,
      data: results || [],
      count: results?.length || 0
    })
  } catch (error) {
    console.error('Error fetching SKUs:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch SKUs',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get SKU by ID with supplier info
skuRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const sku = await c.env.DB.prepare(`
      SELECT 
        s.*,
        sup.company_name as supplier_name,
        sup.country as supplier_country,
        sup.overall_score as supplier_score
      FROM iot_skus s
      LEFT JOIN suppliers sup ON s.supplier_id = sup.id
      WHERE s.id = ?
    `).bind(id).first()
    
    if (!sku) {
      return c.json({ 
        success: false,
        error: 'SKU not found' 
      }, 404)
    }
    
    // Get compliance requirements
    const { results: compliance } = await c.env.DB.prepare(`
      SELECT 
        sr.*,
        r.regulation_name,
        r.region,
        r.category
      FROM sku_regulations sr
      LEFT JOIN regulations r ON sr.regulation_id = r.id
      WHERE sr.sku_id = ?
    `).bind(id).all()
    
    return c.json({
      success: true,
      data: {
        ...sku,
        compliance: compliance || []
      }
    })
  } catch (error) {
    console.error('Error fetching SKU:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch SKU',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Create new SKU
skuRoutes.post('/', async (c) => {
  try {
    const data = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO iot_skus (
        sku_code, product_name, product_category, description,
        technical_specs, regulatory_status, supplier_id,
        lab_test_status, certification_level, risk_category, 
        target_markets, compliance_notes, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.sku_code,
      data.product_name,
      data.product_category,
      data.description || null,
      data.technical_specs || null,
      data.regulatory_status || 'pending',
      data.supplier_id || null,
      data.lab_test_status || 'pending',
      data.certification_level || null,
      data.risk_category || 'medium',
      data.target_markets || null,
      data.compliance_notes || null,
      data.is_active !== undefined ? data.is_active : true
    ).run()
    
    return c.json({
      success: true,
      data: { id: result.meta.last_row_id, ...data }
    }, 201)
  } catch (error) {
    console.error('Error creating SKU:', error)
    return c.json({ 
      success: false,
      error: 'Failed to create SKU',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Update SKU
skuRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const data = await c.req.json()
    
    await c.env.DB.prepare(`
      UPDATE iot_skus SET
        sku_code = ?, product_name = ?, product_category = ?,
        description = ?, technical_specs = ?, regulatory_status = ?,
        supplier_id = ?, lab_test_status = ?, certification_level = ?, 
        risk_category = ?, target_markets = ?, compliance_notes = ?, 
        is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.sku_code,
      data.product_name,
      data.product_category,
      data.description || null,
      data.technical_specs || null,
      data.regulatory_status,
      data.supplier_id || null,
      data.lab_test_status,
      data.certification_level || null,
      data.risk_category,
      data.target_markets || null,
      data.compliance_notes || null,
      data.is_active,
      id
    ).run()
    
    return c.json({
      success: true,
      data: { id, ...data }
    })
  } catch (error) {
    console.error('Error updating SKU:', error)
    return c.json({ 
      success: false,
      error: 'Failed to update SKU',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Delete SKU
skuRoutes.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    // Delete related compliance records first
    await c.env.DB.prepare(`
      DELETE FROM sku_regulations WHERE sku_id = ?
    `).bind(id).run()
    
    // Delete the SKU
    await c.env.DB.prepare(`
      DELETE FROM iot_skus WHERE id = ?
    `).bind(id).run()
    
    return c.json({
      success: true,
      message: 'SKU deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting SKU:', error)
    return c.json({ 
      success: false,
      error: 'Failed to delete SKU',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get SKU statistics
skuRoutes.get('/stats/summary', async (c) => {
  try {
    const stats = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count,
        SUM(CASE WHEN regulatory_status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN risk_category = 'high' THEN 1 ELSE 0 END) as high_risk_count,
        COUNT(DISTINCT product_category) as category_count
      FROM iot_skus
    `).first()
    
    return c.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching SKU stats:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch SKU statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Get SKUs by category
skuRoutes.get('/by-category/:category', async (c) => {
  try {
    const category = c.req.param('category')
    
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM iot_skus 
      WHERE product_category = ?
      ORDER BY created_at DESC
    `).bind(category).all()
    
    return c.json({
      success: true,
      data: results || [],
      count: results?.length || 0
    })
  } catch (error) {
    console.error('Error fetching SKUs by category:', error)
    return c.json({ 
      success: false,
      error: 'Failed to fetch SKUs by category',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// Add compliance requirement to SKU
skuRoutes.post('/:id/compliance', async (c) => {
  try {
    const skuId = c.req.param('id')
    const data = await c.req.json()
    
    const result = await c.env.DB.prepare(`
      INSERT INTO sku_regulations (
        sku_id, regulation_id, compliance_status, compliance_date,
        expiry_date, certificate_number, test_report_url, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      skuId,
      data.regulation_id,
      data.compliance_status || 'pending',
      data.compliance_date || null,
      data.expiry_date || null,
      data.certificate_number || null,
      data.test_report_url || null,
      data.notes || null
    ).run()
    
    return c.json({
      success: true,
      data: { id: result.meta.last_row_id, ...data }
    }, 201)
  } catch (error) {
    console.error('Error adding compliance:', error)
    return c.json({ 
      success: false,
      error: 'Failed to add compliance requirement',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})
