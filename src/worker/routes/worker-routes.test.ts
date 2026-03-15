import { describe, it, expect } from 'vitest';
import app from '../index';

describe('Worker root route', () => {
  it('returns API running message on GET /', async () => {
    const req = new Request('http://localhost/');
    const env = {
      DB: {} as any,
      MOCHA_USERS_SERVICE_API_URL: '',
      MOCHA_USERS_SERVICE_API_KEY: '',
    };

    const res = await app.fetch(req, env as any);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ message: 'China HQ API is running' });
  });
});

describe('Ping route', () => {
  it('returns health check status on GET /api/ping', async () => {
    const req = new Request('http://localhost/api/ping');
    const env = {
      DB: {} as any,
      MOCHA_USERS_SERVICE_API_URL: '',
      MOCHA_USERS_SERVICE_API_KEY: '',
    };

    const res = await app.fetch(req, env as any);
    const body = (await res.json()) as any;

    expect(res.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.service).toBe('China HQ API');
    expect(body.timestamp).toBeDefined();
  });
});

describe('Stats route', () => {
  it('returns system stats on GET /api/stats', async () => {
    const req = new Request('http://localhost/api/stats');
    const env = {
      DB: {} as any,
      MOCHA_USERS_SERVICE_API_URL: '',
      MOCHA_USERS_SERVICE_API_KEY: '',
      ENVIRONMENT: 'test',
    };

    const res = await app.fetch(req, env as any);
    const body = (await res.json()) as any;

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.version).toBe('1.0.0');
    expect(body.data.health).toBe('ok');
    expect(body.data.features).toEqual({
      mentorado: true,
      analytics: true,
      compliance: true,
      sourcing: true,
    });
  });
});

describe('SKU Analysis route', () => {
  it('returns mock analysis data on GET /api/sku-analysis', async () => {
    const req = new Request('http://localhost/api/sku-analysis');
    const env = {
      DB: {} as any,
      MOCHA_USERS_SERVICE_API_URL: '',
      MOCHA_USERS_SERVICE_API_KEY: '',
    };

    const res = await app.fetch(req, env as any);
    const body = (await res.json()) as any;

    expect(res.status).toBe(200);
    expect(body.totalSkus).toBe(0);
    expect(body.compliantSkus).toBe(0);
    expect(body.riskDistribution).toEqual({
      low: 0,
      medium: 0,
      high: 0,
    });
  });
});

describe('Error handling', () => {
  it('returns 404 for unknown routes', async () => {
    const req = new Request('http://localhost/api/nonexistent');
    const env = {
      DB: {} as any,
      MOCHA_USERS_SERVICE_API_URL: '',
      MOCHA_USERS_SERVICE_API_KEY: '',
    };

    const res = await app.fetch(req, env as any);
    expect(res.status).toBe(404);
  });
});
