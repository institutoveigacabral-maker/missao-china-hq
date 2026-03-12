import { Env } from '../../shared/types';

export async function chqFetch(path: string, env: Env, init: RequestInit = {}) {
  const url = `${env.CHQ_API_BASE || 'https://api.chinahq.internal'}${path}`;
  const headers: Record<string, string> = { 
    'x-api-key': String(env.CHQ_API_KEY || 'demo-key'),
    'content-type': 'application/json'
  };
  
  // Merge with existing headers
  if (init.headers) {
    Object.assign(headers, init.headers);
  }
  
  return fetch(url, { ...init, headers });
}

// China HQ API endpoints utilizados pelo Mentorado Hub
export const CHQ = {
  // Factories endpoints
  factoriesByMentorado: (id: string) => `/v1/factories?mentorado=${id}`,
  factoryDetails: (fid: string) => `/v1/factories/${fid}`,
  factoryCompliance: (fid: string) => `/v1/factories/${fid}/compliance`,
  
  // Deals endpoints  
  dealsByMentorado: (id: string) => `/v1/deals?mentorado=${id}`,
  dealCreate: () => `/v1/deals`,
  dealUpdate: (did: string) => `/v1/deals/${did}`,
  
  // QA Reports endpoints
  qaReportsByFactory: (fid: string) => `/v1/qa-reports?factory=${fid}`,
  qaReportsByDeal: (did: string) => `/v1/qa-reports?deal=${did}`,
  
  // Suppliers endpoints
  suppliersByMentorado: (id: string) => `/v1/suppliers?mentorado=${id}`,
  supplierDetails: (sid: string) => `/v1/suppliers/${sid}`,
  
  // Documents endpoints
  documentGenerate: () => `/v1/documents/generate`,
  documentDownload: (did: string) => `/v1/documents/${did}/download`,
  
  // Analytics endpoints
  dashboardKpis: (mid: string) => `/v1/analytics/dashboard?mentorado=${mid}`,
  supplierMetrics: (mid: string) => `/v1/analytics/suppliers?mentorado=${mid}`,
};

// Helper para sincronizar dados do China HQ
export class CHQSync {
  constructor(private env: Env) {}

  async syncFactories(mentoradoId: string) {
    try {
      const response = await chqFetch(CHQ.factoriesByMentorado(mentoradoId), this.env);
      const factories = await response.json();
      
      // TODO: Implementar sincronização com DB local
      return factories;
    } catch (error) {
      console.error('Erro ao sincronizar fábricas:', error);
      throw error;
    }
  }

  async syncDeals(mentoradoId: string) {
    try {
      const response = await chqFetch(CHQ.dealsByMentorado(mentoradoId), this.env);
      const deals = await response.json();
      
      // TODO: Implementar sincronização com DB local
      return deals;
    } catch (error) {
      console.error('Erro ao sincronizar deals:', error);
      throw error;
    }
  }

  async getKpis(mentoradoId: string) {
    // Sempre usar dados mock em desenvolvimento ou se CHQ_API_BASE não estiver configurado
    const isDev = !this.env.CHQ_API_BASE || 
                  this.env.CHQ_API_BASE.includes('internal') ||
                  this.env.CHQ_API_BASE.includes('localhost');
    
    if (isDev) {
      console.log('Using mock KPIs for development');
      return this.getMockKpis(mentoradoId);
    }
    
    try {
      const response = await chqFetch(CHQ.dashboardKpis(mentoradoId), this.env);
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter KPIs, usando dados mock:', error);
      return this.getMockKpis(mentoradoId);
    }
  }

  private getMockKpis(_mentoradoId: string) {
    return {
      complianceScore: 94,
      monthlyProgress: 85,
      totalFactoryVisits: 12,
      averageLeadTime: 28,
      qualityScore: 96,
      costSavings: 180000
    };
  }
}
