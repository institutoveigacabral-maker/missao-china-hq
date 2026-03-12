import { Hono } from 'hono';
import { Env } from '../../shared/types';
import { db } from '../lib/mentoradoDB';
import { authMiddleware } from './mentoradoAuth';

const analytics = new Hono<{ Bindings: Env, Variables: { userId: string, userRole: string } }>();

// Apply auth middleware
analytics.use('*', authMiddleware);

// Get comprehensive analytics data
analytics.get('/', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    
    // Get data from database
    const deals = await database.listDeals(profileRecord.id);
    const factories = await database.listLinkedFactories(profileRecord.id);

    // Generate analytics data
    const analyticsData = {
      performanceTrend: generatePerformanceTrend(deals),
      categoryBreakdown: generateCategoryBreakdown(deals),
      supplierRadar: generateSupplierRadar(factories),
      kpis: calculateKPIs(deals),
      trends: calculateTrends(deals),
    };

    return c.json({ 
      success: true, 
      data: analyticsData 
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Helper functions
function generatePerformanceTrend(deals: any[]) {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                     'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const trendData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = monthNames[date.getMonth()];
    
    const monthDeals = deals.filter((deal: any) => {
      const dealDate = new Date(deal.created_at);
      return dealDate.getMonth() === date.getMonth() && 
             dealDate.getFullYear() === date.getFullYear();
    });
    
    const totalRevenue = monthDeals.reduce((sum: number, deal: any) => 
      sum + (deal.amount_eur || 0), 0);
    
    return {
      month,
      deals: monthDeals.length,
      revenue: totalRevenue,
      compliance: 85 + i * 2 + Math.random() * 3, // Mock compliance trend
      efficiency: 70 + i * 3 + Math.random() * 5, // Mock efficiency trend
    };
  });
  
  return trendData;
}

function generateCategoryBreakdown(deals: any[]) {
  const categories: Record<string, { deals: number; revenue: number }> = {};
  
  deals.forEach((deal: any) => {
    const category = deal.product_category || 'Outros';
    if (!categories[category]) {
      categories[category] = { deals: 0, revenue: 0 };
    }
    categories[category].deals++;
    categories[category].revenue += deal.amount_eur || 0;
  });

  return Object.entries(categories).map(([category, data]) => ({
    category,
    deals: data.deals,
    revenue: data.revenue,
    avgTicket: data.deals > 0 ? data.revenue / data.deals : 0,
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
}

function generateSupplierRadar(factories: any[]) {
  // Calculate average scores across all suppliers
  const qualityScores = factories.map((f: any) => f.compliance_score || 90);
  const avgQuality = qualityScores.length > 0 
    ? qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length 
    : 90;

  return [
    { metric: 'Qualidade', score: Math.round(avgQuality), benchmark: 85 },
    { metric: 'Custo', score: 88, benchmark: 82 },
    { metric: 'Prazo', score: 90, benchmark: 80 },
    { metric: 'Compliance', score: Math.round(avgQuality + 3), benchmark: 88 },
    { metric: 'Comunicação', score: 87, benchmark: 83 },
    { metric: 'Inovação', score: 85, benchmark: 78 },
  ];
}

function calculateKPIs(deals: any[]) {
  const totalDeals = deals.length;
  const completedDeals = deals.filter((d: any) => 
    ['delivered', 'closed'].includes(d.status)
  ).length;

  const conversionRate = totalDeals > 0 ? (completedDeals / totalDeals) * 100 : 0;

  // Calculate average cycle time (mock for now)
  const avgCycleTime = 42;

  // Mock other KPIs
  const customerSatisfaction = 4.7;
  const repeatBusinessRate = 76.3;
  const profitMargin = 18.2;
  const roi = 145;

  return {
    conversionRate: Math.round(conversionRate * 10) / 10,
    avgCycleTime,
    customerSatisfaction,
    repeatBusinessRate,
    profitMargin,
    roi,
  };
}

function calculateTrends(deals: any[]) {
  const now = Date.now();
  const sixMonthsAgo = now - (180 * 24 * 60 * 60 * 1000);
  const threeMonthsAgo = now - (90 * 24 * 60 * 60 * 1000);

  const recentDeals = deals.filter((d: any) => d.created_at >= threeMonthsAgo);
  const olderDeals = deals.filter((d: any) => 
    d.created_at >= sixMonthsAgo && d.created_at < threeMonthsAgo
  );

  const recentRevenue = recentDeals.reduce((sum: number, d: any) => 
    sum + (d.amount_eur || 0), 0);
  const olderRevenue = olderDeals.reduce((sum: number, d: any) => 
    sum + (d.amount_eur || 0), 0);

  const revenueGrowth = olderRevenue > 0 
    ? ((recentRevenue - olderRevenue) / olderRevenue) * 100 
    : 0;

  const dealVelocity = recentDeals.length > olderDeals.length
    ? ((recentDeals.length - olderDeals.length) / Math.max(olderDeals.length, 1)) * 100
    : 0;

  return {
    revenueGrowth: Math.round(revenueGrowth * 10) / 10,
    dealVelocity: Math.round(dealVelocity * 10) / 10,
    complianceImprovement: 7.2, // Mock
    supplierDiversification: 12.4, // Mock
  };
}

export { analytics as mentoradoAnalytics };
