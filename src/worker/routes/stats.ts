import { Hono } from 'hono';
import { Env } from '../../shared/types';

const stats = new Hono<{ Bindings: Env }>();

// Get dashboard stats
stats.get('/dashboard', async (c) => {
  try {
    const db = c.env.DB;

    // Get SKU stats
    const skuStats = await db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        COUNT(DISTINCT product_category) as categories
      FROM iot_skus
    `).first() as any;

    // Get supplier stats
    const supplierStats = await db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_approved = 1 THEN 1 ELSE 0 END) as approved,
        AVG(quality_rating) as avg_rating,
        AVG(compliance_score) as avg_compliance
      FROM suppliers
    `).first() as any;

    // Get regulation stats
    const regulationStats = await db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_mandatory = 1 THEN 1 ELSE 0 END) as mandatory,
        COUNT(DISTINCT region) as regions,
        COUNT(DISTINCT category) as categories
      FROM regulations
    `).first() as any;

    // Get compliance status breakdown
    const complianceBreakdown = await db.prepare(`
      SELECT 
        compliance_status,
        COUNT(*) as count
      FROM sku_regulations
      GROUP BY compliance_status
    `).all() as any;

    // Get recent activity (last 7 days)
    const recentActivity = await db.prepare(`
      SELECT 
        COUNT(*) as new_skus
      FROM iot_skus
      WHERE created_at >= datetime('now', '-7 days')
    `).first() as any;

    const stats = {
      skus: {
        total: skuStats?.total || 0,
        active: skuStats?.active || 0,
        categories: skuStats?.categories || 0
      },
      suppliers: {
        total: supplierStats?.total || 0,
        approved: supplierStats?.approved || 0,
        avgRating: Math.round((supplierStats?.avg_rating || 0) * 10) / 10,
        avgCompliance: Math.round((supplierStats?.avg_compliance || 0))
      },
      regulations: {
        total: regulationStats?.total || 0,
        mandatory: regulationStats?.mandatory || 0,
        regions: regulationStats?.regions || 0,
        categories: regulationStats?.categories || 0
      },
      compliance: {
        breakdown: complianceBreakdown.results || [],
        pending: complianceBreakdown.results?.find((r: any) => r.compliance_status === 'pending')?.count || 0,
        approved: complianceBreakdown.results?.find((r: any) => r.compliance_status === 'approved')?.count || 0,
        failed: complianceBreakdown.results?.find((r: any) => r.compliance_status === 'failed')?.count || 0
      },
      activity: {
        newSkusLastWeek: recentActivity?.new_skus || 0
      }
    };

    return c.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return c.json({ 
      success: false,
      error: 'Failed to fetch dashboard stats' 
    }, 500);
  }
});

// Get system stats
stats.get('/', async (c) => {
  try {
    const stats = {
      uptime: Date.now(),
      version: '1.0.0',
      environment: c.env.ENVIRONMENT || 'development',
      features: {
        mentorado: true,
        analytics: true,
        compliance: true,
        sourcing: true
      },
      health: 'ok'
    };

    return c.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    return c.json({ 
      success: false,
      error: 'Internal server error' 
    }, 500);
  }
});

export { stats as statsRoutes };
