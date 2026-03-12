import { Hono } from 'hono';
import { Env } from '../../shared/types';
import { db } from '../lib/mentoradoDB';
// import { CHQSync } from '../lib/chinaHQ'; // Temporarily disabled
import { MentoradoCreateSchema, MentoradoUpdateSchema } from '../../schemas/mentoradoSchema';
import { authMiddleware } from './mentoradoAuth';
import { mentoradoAnalytics } from './mentoradoAnalytics';

const mentorado = new Hono<{ Bindings: Env, Variables: { userId: string, userRole: string } }>();

// Mount analytics routes
mentorado.route('/analytics', mentoradoAnalytics);

// Apply auth middleware to all routes
mentorado.use('*', authMiddleware);

// Get current user profile
mentorado.get('/me', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const user = await database.getUser(userId);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const profile = await database.getMentoradoByUser(userId);
    
    return c.json({ 
      success: true, 
      data: { user, profile } 
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get dashboard KPIs with enhanced metrics
mentorado.get('/dashboard', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;

    // Mock KPIs data for now
    const kpis = {
      complianceScore: 94,
      monthlyProgress: 85
    };

    // Get local data with enhanced queries
    const deals = await database.listDeals(profileRecord.id);
    const documents = await database.listDocuments(profileRecord.id);
    const factories = await database.listLinkedFactories(profileRecord.id);

    // Active deals filtering
    const activeDeals = deals
      .filter((deal: any) => ['active', 'negotiating', 'pending'].includes(deal.status))
      .slice(0, 5)
      .map((deal: any) => ({
        id: deal.id,
        title: deal.title,
        status: deal.status,
        amount_eur: deal.amount_eur,
        factory_name: deal.factory_name || 'Factory Name',
        created_at: deal.created_at
      }));

    // Calculate metrics
    const totalRevenue = deals
      .filter((deal: any) => deal.status === 'closed')
      .reduce((sum: number, deal: any) => sum + (deal.amount_eur || 0), 0);

    const avgCompliance = factories.length > 0 
      ? factories.reduce((sum: number, factory: any) => sum + (factory.compliance_score || 85), 0) / factories.length
      : 85;

    // Pending documents count
    const pendingDocuments = documents.filter((doc: any) => 
      doc.type === 'pending' || !doc.url
    ).length;

    // Mock upcoming events (since events table structure differs)
    const upcomingEvents = [
      {
        id: 'e1',
        event_name: 'Canton Fair Preparation',
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Guangzhou'
      },
      {
        id: 'e2', 
        event_name: 'Factory Audit',
        event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Shenzhen'
      }
    ];

    const dashboardData = {
      profile: {
        companyName: profileRecord.company,
        cnpj: profileRecord.cnpj || 'N/A',
        segment: 'Manufacturing',
        memberSince: profileRecord.created_at,
        status: profileRecord.status,
        capital: profileRecord.capital_brl,
      },
      metrics: {
        totalDeals: deals.length,
        totalRevenue: Math.round(totalRevenue),
        avgCompliance: Math.round(avgCompliance * 100) / 100,
        pendingDocuments: pendingDocuments,
        totalInvestment: deals.reduce((sum: number, deal: any) => sum + (deal.amount_eur || 0), 0),
        activeFactories: factories.length,
        complianceScore: kpis?.complianceScore || 94,
        monthlyProgress: kpis?.monthlyProgress || 85,
        documentsGenerated: documents.length,
      },
      activeDeals,
      upcomingEvents,
      recentDeals: deals.slice(0, 5),
      recentDocuments: documents.slice(0, 3),
    };

    return c.json({ 
      success: true, 
      data: dashboardData 
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Helper functions moved outside route handlers for better performance

// Create mentorado profile
mentorado.post('/profile', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = MentoradoCreateSchema.safeParse(body);
    
    if (!parsed.success) {
      return c.json({ 
        error: 'Validation failed',
        details: parsed.error.issues 
      }, 400);
    }

    const database = db(c.env);
    
    // Create user
    const userId = await database.createUser({
      email: parsed.data.email,
      name: parsed.data.name,
      role: 'mentorado'
    });

    // Create mentorado profile
    const mentoradoId = await database.createMentorado({
      user_id: userId,
      company: parsed.data.company,
      cnpj: parsed.data.cnpj,
      phone: parsed.data.phone,
      capital_brl: parsed.data.capital_brl,
    });

    // Log event
    await database.logEvent(userId, 'profile_created', {
      mentorado_id: mentoradoId,
      company: parsed.data.company
    });

    return c.json({ 
      success: true, 
      data: { 
        user_id: userId,
        mentorado_id: mentoradoId
      } 
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update mentorado profile
mentorado.put('/profile', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const body = await c.req.json();
    const parsed = MentoradoUpdateSchema.safeParse(body);
    
    if (!parsed.success) {
      return c.json({ 
        error: 'Validation failed',
        details: parsed.error.issues 
      }, 400);
    }

    const database = db(c.env);
    const profile = await database.getMentoradoByUser(userId);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    await database.updateMentorado(profileRecord.id, parsed.data);

    // Log event
    await database.logEvent(userId, 'profile_updated', parsed.data);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export { mentorado };
