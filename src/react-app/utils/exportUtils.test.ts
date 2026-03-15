import { describe, it, expect } from 'vitest';
import {
  formatCurrencyForExport,
  formatDateForExport,
  formatPercentageForExport,
} from './exportUtils';

describe('formatCurrencyForExport', () => {
  it('formats EUR by default', () => {
    const result = formatCurrencyForExport(1000);
    // Intl may use symbol (€) or code (EUR) depending on runtime
    expect(result.includes('EUR') || result.includes('€')).toBe(true);
    expect(result).toContain('1.000');
  });

  it('formats BRL when specified', () => {
    const result = formatCurrencyForExport(2500, 'BRL');
    expect(result).toContain('R$');
  });

  it('formats USD when specified', () => {
    const result = formatCurrencyForExport(500, 'USD');
    expect(result).toContain('US$');
  });
});

describe('formatDateForExport', () => {
  it('formats a timestamp to pt-BR date', () => {
    const ts = new Date(2025, 0, 15).getTime();
    expect(formatDateForExport(ts)).toBe('15/01/2025');
  });

  it('formats an ISO string to pt-BR date', () => {
    const result = formatDateForExport('2025-06-01T00:00:00Z');
    expect(result).toContain('2025');
  });
});

describe('formatPercentageForExport', () => {
  it('formats percentage with one decimal', () => {
    expect(formatPercentageForExport(85.67)).toBe('85.7%');
  });

  it('formats zero', () => {
    expect(formatPercentageForExport(0)).toBe('0.0%');
  });

  it('formats 100%', () => {
    expect(formatPercentageForExport(100)).toBe('100.0%');
  });
});
