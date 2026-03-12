import { Hono } from 'hono';
import { Env } from '../../shared/types';
import { db } from '../lib/mentoradoDB';
import { authMiddleware } from './mentoradoAuth';

const deals = new Hono<{ Bindings: Env, Variables: { userId: string, userRole: string } }>();

// Apply auth middleware
deals.use('*', authMiddleware);

// Get all deals for mentorado
deals.get('/', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    let dealsData = await database.listDeals(profileRecord.id);
    
    // Enrich with factory data (mock for development)
    dealsData = dealsData.map((deal: any) => ({
      ...deal,
      factory: {
        name: deal.factory_id === 'f_guangzhou1' ? 'Guangzhou Electronics Co.' :
              deal.factory_id === 'f_shenzhen1' ? 'Shenzhen Tech Ltd.' :
              deal.factory_id === 'f_dongguan1' ? 'Dongguan Manufacturing' :
              'Factory ' + deal.factory_id,
        city: deal.factory_id === 'f_guangzhou1' ? 'Guangzhou' :
              deal.factory_id === 'f_shenzhen1' ? 'Shenzhen' :
              deal.factory_id === 'f_dongguan1' ? 'Dongguan' : 'Unknown',
        compliance_score: Math.floor(85 + Math.random() * 15) // Mock score 85-100
      }
    }));
    
    return c.json({ 
      success: true, 
      data: dealsData 
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get deal statistics
deals.get('/stats', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const dealsData = await database.listDeals(profileRecord.id);

    const now = Date.now();
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: dealsData.length,
      byStatus: dealsData.reduce((acc: Record<string, number>, deal: any) => {
        acc[deal.status] = (acc[deal.status] || 0) + 1;
        return acc;
      }, {}),
      totalValue: dealsData.reduce((sum: number, deal: any) => sum + (deal.amount_eur || 0), 0),
      averageValue: dealsData.length > 0 
        ? dealsData.reduce((sum: number, deal: any) => sum + (deal.amount_eur || 0), 0) / dealsData.length 
        : 0,
      thisMonth: dealsData.filter((deal: any) => deal.created_at > oneMonthAgo).length
    };

    return c.json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('Error fetching deal stats:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get specific deal
deals.get('/:id', async (c) => {
  try {
    const dealId = c.req.param('id');
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const deal = await database.getDeal(dealId);
    
    if (!deal) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    const dealRecord = deal as any;
    
    // Verify deal belongs to user
    if (dealRecord.mentorado_id !== profileRecord.id) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    return c.json({ 
      success: true, 
      data: deal 
    });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create new deal
deals.post('/', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const body = await c.req.json();
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;

    // Validate required fields
    const { title, amount_eur, factory_id, status, description, product_category, quantity, unit_price, payment_terms, delivery_date, incoterm, notes } = body;
    if (!title || !amount_eur || !factory_id) {
      return c.json({ 
        error: 'Missing required fields: title, amount_eur, factory_id' 
      }, 400);
    }

    const dealId = await database.createDeal({
      mentorado_id: profileRecord.id,
      title,
      amount_eur: parseFloat(amount_eur),
      factory_id,
      status: status || 'negotiating',
      description,
      product_category,
      quantity: quantity ? parseInt(quantity) : null,
      unit_price: unit_price ? parseFloat(unit_price) : null,
      payment_terms,
      delivery_date,
      incoterm,
      notes
    });

    // Log event
    await database.logEvent(userId, 'deal_created', {
      deal_id: dealId,
      title,
      amount_eur
    });

    return c.json({ 
      success: true, 
      data: { id: dealId } 
    });
  } catch (error) {
    console.error('Error creating deal:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update deal
deals.put('/:id', async (c) => {
  try {
    const dealId = c.req.param('id');
    const userId = c.get('userId') || 'u_demo';
    const body = await c.req.json();
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const deal = await database.getDeal(dealId);
    
    if (!deal) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    const dealRecord = deal as any;
    
    // Verify deal belongs to user
    if (dealRecord.mentorado_id !== profileRecord.id) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    // Update deal
    const allowedFields = ['title', 'amount_eur', 'status', 'factory_id', 'description', 'product_category', 'quantity', 'unit_price', 'payment_terms', 'delivery_date', 'incoterm', 'notes'];
    const updateData = Object.keys(body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = body[key];
        return obj;
      }, {});

    if (Object.keys(updateData).length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400);
    }

    await database.updateDeal(dealId, updateData);

    // Log event
    await database.logEvent(userId, 'deal_updated', {
      deal_id: dealId,
      changes: updateData
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating deal:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete deal
deals.delete('/:id', async (c) => {
  try {
    const dealId = c.req.param('id');
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    const deal = await database.getDeal(dealId);
    
    if (!deal) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    const dealRecord = deal as any;
    
    // Verify deal belongs to user
    if (dealRecord.mentorado_id !== profileRecord.id) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    // Delete deal
    if (!c.env.DB) {
      return c.json({ error: 'Database not available' }, 500);
    }
    
    try {
      await c.env.DB.prepare('DELETE FROM deals_mentorado WHERE id = ?')
        .bind(dealId)
        .run();
    } catch (dbError) {
      console.error('Database delete error:', dbError);
      return c.json({ error: 'Database delete failed' }, 500);
    }

    // Log event
    await database.logEvent(userId, 'deal_deleted', {
      deal_id: dealId,
      title: dealRecord.title,
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export { deals as mentoradoDeals };
