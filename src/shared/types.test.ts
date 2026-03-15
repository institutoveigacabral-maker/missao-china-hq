import { describe, it, expect } from 'vitest';
import {
  MetricSchema,
  AlertSchema,
  StatusIndicatorSchema,
  ModuleStatusSchema,
  IoTSkuSchema,
  SupplierSchema,
  RegulationSchema,
} from './types';

describe('MetricSchema', () => {
  it('validates a metric with string value', () => {
    const result = MetricSchema.safeParse({
      id: 'm1',
      title: 'Total SKUs',
      value: '42',
    });
    expect(result.success).toBe(true);
  });

  it('validates a metric with numeric value', () => {
    const result = MetricSchema.safeParse({
      id: 'm1',
      title: 'Total SKUs',
      value: 42,
      change: '+5%',
      changeType: 'positive',
      trend: 'up',
    });
    expect(result.success).toBe(true);
  });

  it('rejects metric without id', () => {
    const result = MetricSchema.safeParse({
      title: 'Total SKUs',
      value: 42,
    });
    expect(result.success).toBe(false);
  });
});

describe('AlertSchema', () => {
  it('validates a complete alert', () => {
    const result = AlertSchema.safeParse({
      id: 'a1',
      type: 'warning',
      title: 'Compliance Due',
      description: 'Audit required for supplier X',
      createdAt: '2025-03-01T00:00:00Z',
      priority: 'high',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid alert type', () => {
    const result = AlertSchema.safeParse({
      id: 'a1',
      type: 'critical',
      title: 'Test',
      description: 'Test',
      createdAt: '2025-01-01',
      priority: 'low',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid priority level', () => {
    const result = AlertSchema.safeParse({
      id: 'a1',
      type: 'warning',
      title: 'Test',
      description: 'Test',
      createdAt: '2025-01-01',
      priority: 'urgent',
    });
    expect(result.success).toBe(false);
  });
});

describe('StatusIndicatorSchema', () => {
  it('validates all status types', () => {
    for (const status of ['success', 'warning', 'danger', 'info']) {
      const result = StatusIndicatorSchema.safeParse({
        status,
        text: 'Test',
      });
      expect(result.success).toBe(true);
    }
  });
});

describe('ModuleStatusSchema', () => {
  it('validates progress within bounds', () => {
    const result = ModuleStatusSchema.safeParse({
      moduleId: 'mod1',
      moduleName: 'Compliance',
      status: 'active',
      progress: 75,
      lastUpdated: '2025-03-01T00:00:00Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects progress over 100', () => {
    const result = ModuleStatusSchema.safeParse({
      moduleId: 'mod1',
      moduleName: 'Compliance',
      status: 'active',
      progress: 150,
      lastUpdated: '2025-03-01T00:00:00Z',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative progress', () => {
    const result = ModuleStatusSchema.safeParse({
      moduleId: 'mod1',
      moduleName: 'Compliance',
      status: 'active',
      progress: -10,
      lastUpdated: '2025-03-01T00:00:00Z',
    });
    expect(result.success).toBe(false);
  });
});

describe('IoTSkuSchema', () => {
  it('validates a complete IoT SKU', () => {
    const result = IoTSkuSchema.safeParse({
      id: 1,
      sku_code: 'SKU-001',
      product_name: 'Smart Sensor',
      product_category: 'Electronics',
      regulatory_status: 'approved',
      risk_category: 'low',
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-03-01T00:00:00Z',
    });
    expect(result.success).toBe(true);
  });
});

describe('SupplierSchema', () => {
  it('validates a complete supplier', () => {
    const result = SupplierSchema.safeParse({
      id: 1,
      supplier_code: 'SUP-001',
      company_name: 'Shenzhen Tech Ltd',
      supplier_type: 'OEM',
      country: 'China',
      quality_rating: 4.5,
      certification_status: 'certified',
      compliance_score: 92,
      risk_level: 'low',
      is_approved: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-03-01T00:00:00Z',
    });
    expect(result.success).toBe(true);
  });
});

describe('RegulationSchema', () => {
  it('validates a regulation entry', () => {
    const result = RegulationSchema.safeParse({
      id: 1,
      regulation_code: 'REG-001',
      regulation_name: 'INMETRO NR12',
      region: 'Brazil',
      category: 'Safety',
      severity_level: 'high',
      is_mandatory: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-03-01T00:00:00Z',
    });
    expect(result.success).toBe(true);
  });
});
