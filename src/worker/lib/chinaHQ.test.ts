import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CHQ, CHQSync, chqFetch } from './chinaHQ';
import type { Env } from '../../shared/types';

describe('CHQ endpoint helpers', () => {
  it('generates correct factories endpoint by mentorado', () => {
    expect(CHQ.factoriesByMentorado('m_123')).toBe('/v1/factories?mentorado=m_123');
  });

  it('generates correct factory details endpoint', () => {
    expect(CHQ.factoryDetails('f_456')).toBe('/v1/factories/f_456');
  });

  it('generates correct factory compliance endpoint', () => {
    expect(CHQ.factoryCompliance('f_456')).toBe('/v1/factories/f_456/compliance');
  });

  it('generates correct deals endpoint by mentorado', () => {
    expect(CHQ.dealsByMentorado('m_123')).toBe('/v1/deals?mentorado=m_123');
  });

  it('generates correct deal create endpoint', () => {
    expect(CHQ.dealCreate()).toBe('/v1/deals');
  });

  it('generates correct deal update endpoint', () => {
    expect(CHQ.dealUpdate('d_789')).toBe('/v1/deals/d_789');
  });

  it('generates correct QA reports by factory', () => {
    expect(CHQ.qaReportsByFactory('f_456')).toBe('/v1/qa-reports?factory=f_456');
  });

  it('generates correct QA reports by deal', () => {
    expect(CHQ.qaReportsByDeal('d_789')).toBe('/v1/qa-reports?deal=d_789');
  });

  it('generates correct supplier endpoints', () => {
    expect(CHQ.suppliersByMentorado('m_123')).toBe('/v1/suppliers?mentorado=m_123');
    expect(CHQ.supplierDetails('s_001')).toBe('/v1/suppliers/s_001');
  });

  it('generates correct document endpoints', () => {
    expect(CHQ.documentGenerate()).toBe('/v1/documents/generate');
    expect(CHQ.documentDownload('doc_1')).toBe('/v1/documents/doc_1/download');
  });

  it('generates correct analytics endpoints', () => {
    expect(CHQ.dashboardKpis('m_123')).toBe('/v1/analytics/dashboard?mentorado=m_123');
    expect(CHQ.supplierMetrics('m_123')).toBe('/v1/analytics/suppliers?mentorado=m_123');
  });
});

describe('CHQSync', () => {
  let mockEnv: Env;

  beforeEach(() => {
    mockEnv = {
      DB: {} as any,
      MOCHA_USERS_SERVICE_API_URL: '',
      MOCHA_USERS_SERVICE_API_KEY: '',
      CHQ_API_BASE: undefined,
      CHQ_API_KEY: 'test-key',
    };
  });

  it('returns mock KPIs when in development mode (no CHQ_API_BASE)', async () => {
    const sync = new CHQSync(mockEnv);
    const kpis = await sync.getKpis('m_123');

    expect(kpis).toEqual({
      complianceScore: 94,
      monthlyProgress: 85,
      totalFactoryVisits: 12,
      averageLeadTime: 28,
      qualityScore: 96,
      costSavings: 180000,
    });
  });

  it('returns mock KPIs when CHQ_API_BASE contains "internal"', async () => {
    mockEnv.CHQ_API_BASE = 'https://api.chinahq.internal';
    const sync = new CHQSync(mockEnv);
    const kpis = await sync.getKpis('m_123');

    expect(kpis.complianceScore).toBe(94);
    expect(kpis.qualityScore).toBe(96);
  });

  it('returns mock KPIs when CHQ_API_BASE contains "localhost"', async () => {
    mockEnv.CHQ_API_BASE = 'http://localhost:8787';
    const sync = new CHQSync(mockEnv);
    const kpis = await sync.getKpis('m_123');

    expect(kpis.averageLeadTime).toBe(28);
  });
});

describe('chqFetch', () => {
  it('constructs the correct URL with default base', async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response('{}'));
    vi.stubGlobal('fetch', mockFetch);

    const env: Env = {
      DB: {} as any,
      MOCHA_USERS_SERVICE_API_URL: '',
      MOCHA_USERS_SERVICE_API_KEY: '',
      CHQ_API_KEY: 'my-key',
    };

    await chqFetch('/v1/test', env);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.chinahq.internal/v1/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': 'my-key',
          'content-type': 'application/json',
        }),
      })
    );

    vi.unstubAllGlobals();
  });

  it('uses CHQ_API_BASE when provided', async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response('{}'));
    vi.stubGlobal('fetch', mockFetch);

    const env: Env = {
      DB: {} as any,
      MOCHA_USERS_SERVICE_API_URL: '',
      MOCHA_USERS_SERVICE_API_KEY: '',
      CHQ_API_BASE: 'https://custom-api.example.com',
      CHQ_API_KEY: 'key-2',
    };

    await chqFetch('/v1/data', env);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://custom-api.example.com/v1/data',
      expect.anything()
    );

    vi.unstubAllGlobals();
  });
});
