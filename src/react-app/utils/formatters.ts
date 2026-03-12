/**
 * Format currency value to Brazilian Portuguese format with EUR currency
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format currency value to Brazilian Portuguese format with BRL currency
 */
export function formatCurrencyBRL(amount: number): string {
  return formatCurrency(amount, 'BRL');
}

/**
 * Format date to Brazilian Portuguese format
 */
export function formatDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
}

/**
 * Format datetime to Brazilian Portuguese format
 */
export function formatDateTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.toLocaleString('pt-BR');
}

/**
 * Format CNPJ with mask
 */
export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
}

/**
 * Format phone number with Brazilian mask
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return value.toFixed(decimals) + '%';
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date | string | number, date2: Date | string | number): number {
  const d1 = typeof date1 === 'string' || typeof date1 === 'number' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' || typeof date2 === 'number' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} atrás`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'mês' : 'meses'} atrás`;
  }
  
  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? 'ano' : 'anos'} atrás`;
}
