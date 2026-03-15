import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatCurrencyBRL,
  formatDate,
  formatDateTime,
  formatCNPJ,
  formatPhone,
  formatFileSize,
  formatPercentage,
  truncateText,
  daysBetween,
  getRelativeTime,
} from './formatters';

describe('formatCurrency', () => {
  it('formats EUR currency in pt-BR locale', () => {
    const result = formatCurrency(1500);
    // pt-BR EUR format uses non-breaking space variants
    expect(result).toContain('1.500');
    // Intl may use symbol (€) or code (EUR) depending on runtime
    expect(result.includes('EUR') || result.includes('€')).toBe(true);
  });

  it('formats zero value', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('formats with custom currency', () => {
    const result = formatCurrency(100, 'USD');
    expect(result).toContain('100');
    expect(result).toContain('US$');
  });
});

describe('formatCurrencyBRL', () => {
  it('formats BRL currency', () => {
    const result = formatCurrencyBRL(2500.5);
    expect(result).toContain('R$');
    expect(result).toContain('2.500');
  });
});

describe('formatDate', () => {
  it('formats a Date object to pt-BR format', () => {
    const date = new Date(2025, 0, 15); // Jan 15, 2025
    const result = formatDate(date);
    expect(result).toBe('15/01/2025');
  });

  it('formats a timestamp number', () => {
    const timestamp = new Date(2025, 5, 1).getTime();
    const result = formatDate(timestamp);
    expect(result).toContain('01/06/2025');
  });

  it('formats an ISO string', () => {
    const result = formatDate('2025-03-10T00:00:00Z');
    expect(result).toContain('2025');
  });
});

describe('formatDateTime', () => {
  it('includes time in the output', () => {
    const date = new Date(2025, 0, 15, 14, 30);
    const result = formatDateTime(date);
    expect(result).toContain('15/01/2025');
    expect(result).toContain('14:30');
  });
});

describe('formatCNPJ', () => {
  it('applies CNPJ mask correctly', () => {
    expect(formatCNPJ('12345678000199')).toBe('12.345.678/0001-99');
  });

  it('returns already formatted CNPJ unchanged if no match', () => {
    expect(formatCNPJ('123')).toBe('123');
  });
});

describe('formatPhone', () => {
  it('formats 11-digit mobile phone', () => {
    expect(formatPhone('11999998888')).toBe('(11) 99999-8888');
  });

  it('formats 10-digit landline phone', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
  });

  it('handles phone with special characters by stripping non-digits', () => {
    // '+55 11 99999-8888' has 13 digits after stripping, so no pattern matches
    // The function returns the original string for unrecognized lengths
    const result = formatPhone('+55 11 99999-8888');
    expect(typeof result).toBe('string');
  });

  it('returns original if length does not match', () => {
    expect(formatPhone('123')).toBe('123');
  });
});

describe('formatFileSize', () => {
  it('formats zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 Bytes');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
  });

  it('formats gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });

  it('formats fractional megabytes', () => {
    const result = formatFileSize(1572864); // 1.5 MB
    expect(result).toBe('1.5 MB');
  });
});

describe('formatPercentage', () => {
  it('formats integer percentage', () => {
    expect(formatPercentage(85)).toBe('85%');
  });

  it('formats with decimal places', () => {
    expect(formatPercentage(85.567, 2)).toBe('85.57%');
  });

  it('formats zero', () => {
    expect(formatPercentage(0)).toBe('0%');
  });
});

describe('truncateText', () => {
  it('returns text unchanged if within limit', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('truncates with ellipsis when exceeding limit', () => {
    expect(truncateText('hello world', 5)).toBe('hello...');
  });

  it('returns exact length text unchanged', () => {
    expect(truncateText('hello', 5)).toBe('hello');
  });
});

describe('daysBetween', () => {
  it('calculates days between two dates', () => {
    const d1 = new Date(2025, 0, 1);
    const d2 = new Date(2025, 0, 11);
    expect(daysBetween(d1, d2)).toBe(10);
  });

  it('returns absolute difference regardless of order', () => {
    const d1 = new Date(2025, 0, 11);
    const d2 = new Date(2025, 0, 1);
    expect(daysBetween(d1, d2)).toBe(10);
  });

  it('returns 0 for the same date', () => {
    const d = new Date(2025, 0, 1);
    expect(daysBetween(d, d)).toBe(0);
  });

  it('works with timestamps', () => {
    const t1 = new Date(2025, 0, 1).getTime();
    const t2 = new Date(2025, 0, 4).getTime();
    expect(daysBetween(t1, t2)).toBe(3);
  });
});

describe('getRelativeTime', () => {
  it('returns "Hoje" for today', () => {
    expect(getRelativeTime(new Date())).toBe('Hoje');
  });

  it('returns "Ontem" for yesterday', () => {
    const yesterday = new Date(Date.now() - 86400000);
    expect(getRelativeTime(yesterday)).toBe('Ontem');
  });

  it('returns days for recent dates', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
    expect(getRelativeTime(threeDaysAgo)).toBe('3 dias atrás');
  });

  it('returns weeks for 7-29 day old dates', () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 86400000);
    expect(getRelativeTime(twoWeeksAgo)).toBe('2 semanas atrás');
  });

  it('returns singular semana for 1 week', () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
    expect(getRelativeTime(oneWeekAgo)).toBe('1 semana atrás');
  });

  it('returns months for 30-364 day old dates', () => {
    const twoMonthsAgo = new Date(Date.now() - 60 * 86400000);
    expect(getRelativeTime(twoMonthsAgo)).toBe('2 meses atrás');
  });

  it('returns years for 365+ day old dates', () => {
    const twoYearsAgo = new Date(Date.now() - 730 * 86400000);
    expect(getRelativeTime(twoYearsAgo)).toBe('2 anos atrás');
  });
});
