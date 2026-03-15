import { describe, it, expect } from 'vitest';
import { skuSchema } from './skuSchema';

describe('skuSchema', () => {
  const validSku = {
    sku_code: 'SKU-001',
    product_name: 'Smart Sensor',
    product_category: 'Electronics',
    description: 'High precision temperature sensor',
    technical_specs: 'Range: -40 to 125C',
    regulatory_status: 'approved' as const,
    supplier_id: 1,
    lab_test_status: 'completed' as const,
    certification_level: 'CE',
    risk_category: 'low' as const,
    target_markets: 'BR, EU',
    compliance_notes: 'Fully compliant',
    is_active: true,
  };

  it('validates a correct SKU object', () => {
    const result = skuSchema.safeParse(validSku);
    expect(result.success).toBe(true);
  });

  it('rejects sku_code shorter than 3 characters', () => {
    const result = skuSchema.safeParse({ ...validSku, sku_code: 'AB' });
    expect(result.success).toBe(false);
  });

  it('rejects empty product_name', () => {
    const result = skuSchema.safeParse({ ...validSku, product_name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid regulatory_status', () => {
    const result = skuSchema.safeParse({ ...validSku, regulatory_status: 'unknown' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid lab_test_status', () => {
    const result = skuSchema.safeParse({ ...validSku, lab_test_status: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid risk_category', () => {
    const result = skuSchema.safeParse({ ...validSku, risk_category: 'critical' });
    expect(result.success).toBe(false);
  });

  it('allows supplier_id to be optional', () => {
    const { supplier_id, ...withoutSupplier } = validSku;
    const result = skuSchema.safeParse(withoutSupplier);
    expect(result.success).toBe(true);
  });

  it('coerces supplier_id string to number', () => {
    const result = skuSchema.safeParse({ ...validSku, supplier_id: '42' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.supplier_id).toBe(42);
    }
  });

  it('validates all regulatory_status enum values', () => {
    for (const status of ['pending', 'approved', 'rejected']) {
      const result = skuSchema.safeParse({ ...validSku, regulatory_status: status });
      expect(result.success).toBe(true);
    }
  });

  it('validates all risk_category enum values', () => {
    for (const risk of ['low', 'medium', 'high']) {
      const result = skuSchema.safeParse({ ...validSku, risk_category: risk });
      expect(result.success).toBe(true);
    }
  });
});
