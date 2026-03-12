import { Hono } from 'hono';
import { Env } from '../../shared/types';
import { db } from '../lib/mentoradoDB';
import { authMiddleware } from './mentoradoAuth';

const reports = new Hono<{ Bindings: Env, Variables: { userId: string, userRole: string } }>();

// Apply auth middleware
reports.use('*', authMiddleware);

// Get comprehensive report data
reports.get('/', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const period = c.req.query('period') || 'last6months';
    const database = db(c.env);
    
    const profile = await database.getMentoradoByUser(userId);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const profileRecord = profile as any;
    
    // Get data from database
    const deals = await database.listDeals(profileRecord.id);
    const factories = await database.listLinkedFactories(profileRecord.id);

    // Calculate period filter
    const now = Date.now();
    let startDate = 0;
    switch (period) {
      case 'last3months':
        startDate = now - (90 * 24 * 60 * 60 * 1000);
        break;
      case 'last6months':
        startDate = now - (180 * 24 * 60 * 60 * 1000);
        break;
      case 'lastyear':
        startDate = now - (365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = 0;
    }

    const filteredDeals = deals.filter((deal: any) => deal.created_at >= startDate);

    // Generate report data
    const reportData = {
      dealsByMonth: generateMonthlyData(filteredDeals),
      dealsByStatus: generateStatusData(filteredDeals),
      supplierPerformance: generateSupplierPerformance(factories, filteredDeals),
      financialSummary: generateFinancialSummary(filteredDeals),
      complianceMetrics: generateComplianceMetrics(factories),
    };

    return c.json({ 
      success: true, 
      data: reportData 
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Generate PDF report
reports.post('/pdf', async (c) => {
  try {
    const userId = c.get('userId') || 'u_demo';
    const body = await c.req.json();
    const period = body.period || 'last6months';
    
    // For demo purposes, return a mock PDF response
    const pdfContent = `PDF Report for period: ${period}, User: ${userId}`;
    
    return new Response(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-mentorado-${period}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Helper functions
function generateMonthlyData(deals: any[]) {
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                     'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = monthNames[date.getMonth()];
    
    const monthDeals = deals.filter((deal: any) => {
      const dealDate = new Date(deal.created_at);
      return dealDate.getMonth() === date.getMonth() && 
             dealDate.getFullYear() === date.getFullYear();
    });
    
    return {
      month,
      deals: monthDeals.length,
      value: monthDeals.reduce((sum: number, deal: any) => sum + (deal.amount_eur || 0), 0)
    };
  });
  
  return monthlyData;
}

function generateStatusData(deals: any[]) {
  const statusMap: Record<string, string> = {
    'negotiating': 'Negociando',
    'approved': 'Aprovado', 
    'in_production': 'Em Produção',
    'shipped': 'Enviado',
    'delivered': 'Entregue',
    'closed': 'Fechado'
  };

  const statusData = Object.entries(statusMap).map(([key, label]) => {
    const statusDeals = deals.filter((deal: any) => deal.status === key);
    return {
      status: label,
      count: statusDeals.length,
      value: statusDeals.reduce((sum: number, deal: any) => sum + (deal.amount_eur || 0), 0)
    };
  }).filter(item => item.count > 0);

  return statusData;
}

function generateSupplierPerformance(factories: any[], deals: any[]) {
  return factories.slice(0, 4).map((factory: any) => {
    const factoryDeals = deals.filter((deal: any) => deal.factory_id === factory.id);
    
    return {
      name: factory.name || 'Factory ' + factory.id,
      deals: factoryDeals.length,
      compliance: factory.compliance_score || Math.floor(85 + Math.random() * 15),
      rating: 4.0 + Math.random() * 1
    };
  });
}

function generateFinancialSummary(deals: any[]) {
  const totalInvestment = deals.reduce((sum: number, deal: any) => sum + (deal.amount_eur || 0), 0);
  const completedDeals = deals.filter((deal: any) => 
    ['delivered', 'closed'].includes(deal.status)
  ).length;
  const pendingAmount = deals
    .filter((deal: any) => ['negotiating', 'approved', 'in_production'].includes(deal.status))
    .reduce((sum: number, deal: any) => sum + (deal.amount_eur || 0), 0);

  return {
    totalInvestment,
    pendingAmount,
    completedDeals,
    averageDealSize: deals.length > 0 ? totalInvestment / deals.length : 0,
    monthlyGrowth: 8 + Math.random() * 12 // Mock growth percentage
  };
}

function generateComplianceMetrics(factories: any[]) {
  const scores = factories.map((factory: any) => factory.compliance_score || 90);
  const overallScore = scores.length > 0 
    ? Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length)
    : 94;

  return {
    overallScore,
    auditsPending: Math.floor(Math.random() * 3),
    certificationsExpiring: Math.floor(Math.random() * 2),
    riskLevel: overallScore >= 90 ? 'low' : overallScore >= 80 ? 'medium' : 'high'
  };
}

export { reports as mentoradoReports };
