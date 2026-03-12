import { Hono } from 'hono';
import { Env } from '../../shared/types';
import { db } from '../lib/mentoradoDB';
import { authMiddleware } from './mentoradoAuth';

const suppliers = new Hono<{ Bindings: Env, Variables: { userId: string, userRole: string } }>();

// Apply auth middleware
suppliers.use('*', authMiddleware);

// Get specific supplier detail
suppliers.get('/:id', async (c) => {
  try {
    const supplierId = c.req.param('id');
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const linkedFactories = await database.listLinkedFactories(profileRecord.id);
    
    const factory = linkedFactories.find((f: any) => f.id === supplierId);
    
    if (!factory) {
      return c.json({ error: 'Supplier not found' }, 404);
    }

    return c.json({ 
      success: true, 
      data: factory 
    });
  } catch (error) {
    console.error('Error fetching supplier detail:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get deals for a specific supplier
suppliers.get('/:id/deals', async (c) => {
  try {
    const supplierId = c.req.param('id');
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const allDeals = await database.listDeals(profileRecord.id);
    
    const supplierDeals = allDeals.filter((deal: any) => deal.factory_id === supplierId);

    return c.json({ 
      success: true, 
      data: supplierDeals 
    });
  } catch (error) {
    console.error('Error fetching supplier deals:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get linked suppliers for mentorado
suppliers.get('/', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const linkedFactories = await database.listLinkedFactories(profileRecord.id);
    
    return c.json({ 
      success: true, 
      data: linkedFactories 
    });
  } catch (error) {
    console.error('Error fetching linked suppliers:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get available suppliers (from main suppliers table)
suppliers.get('/available', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Get approved suppliers from main table
    const stmt = c.env.DB.prepare(`
      SELECT * FROM suppliers 
      WHERE is_approved = 1 
      ORDER BY quality_rating DESC, compliance_score DESC
      LIMIT 50
    `);
    const { results } = await stmt.all();
    
    return c.json({ 
      success: true, 
      data: results || [] 
    });
  } catch (error) {
    console.error('Error fetching available suppliers:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Link supplier to mentorado
suppliers.post('/link', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const body = await c.req.json();
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const { factory_id, relation } = body;
    if (!factory_id) {
      return c.json({ error: 'factory_id is required' }, 400);
    }

    const profileRecord = profile as any;
    
    // Link factory to mentorado
    await database.linkFactory(profileRecord.id, factory_id, relation || 'partner');

    // Log event
    await database.logEvent(userId, 'supplier_linked', {
      factory_id,
      relation: relation || 'partner'
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error linking supplier:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get supplier statistics
suppliers.get('/stats', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const linkedFactories = await database.listLinkedFactories(profileRecord.id);
    
    const stats = {
      total: linkedFactories.length,
      averageCompliance: linkedFactories.length > 0 
        ? linkedFactories.reduce((sum: number, factory: any) => sum + (factory.compliance_score || 0), 0) / linkedFactories.length
        : 0,
      byRelation: linkedFactories.reduce((acc: Record<string, number>, factory: any) => {
        const relation = factory.relation || 'partner';
        acc[relation] = (acc[relation] || 0) + 1;
        return acc;
      }, {}),
      topPerforming: linkedFactories
        .sort((a: any, b: any) => (b.compliance_score || 0) - (a.compliance_score || 0))
        .slice(0, 5)
    };

    return c.json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('Error fetching supplier stats:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export { suppliers as mentoradoSuppliers };
