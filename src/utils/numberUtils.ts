// numberUtils.ts

/**
 * Removes commas and converts to number
 * "1,23,456" → 123456
 */
export const toNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;

  return Number(String(value).replace(/,/g, '').trim()) || 0;
};

/**
 * Converts string percent to number
 * "73%" → 73
 * "8.11" → 8.11
 */
export const toPercent = (value: any): number => {
  if (!value) return 0;
  return Number(String(value).replace('%', '').trim()) || 0;
};

/**
 * Indian number format
 * 1234567 → "12,34,567"
 */
export const formatNumber = (value: any): string => {
  const num = toNumber(value);
  return num.toLocaleString('en-IN');
};

/**
 * Format currency (Indian Rupees)
 * 1234567 → "₹12,34,567"
 */
export const formatCurrency = (value: any): string => {
  const num = toNumber(value);
  return `₹${num.toLocaleString('en-IN')}`;
};

/**
 * Convert value to fixed decimal places
 * 12.345 → "12.35"
 */
export const toFixed = (value: any, decimals: number = 2): string => {
  const num = toNumber(value);
  return num.toFixed(decimals);
};

/**
 * Safe divide
 */
export const safeDivide = (numerator: number, denominator: number): number => {
  if (!denominator || denominator === 0) return 0;
  return numerator / denominator;
};

// numberUtils.js

/**
 * Format number in Indian style (12,34,56,789)
 */
export const formatIndianNumber = (value: any) => {
  if (value === null || value === undefined || value === '') return '0';

  const num = Number(value);
  if (isNaN(num)) return '0';

  return num.toLocaleString('en-IN');
};

/**
 * Format number as Indian Rupees (₹)
 */
export const formatCurrencyINR = (value: any) => {
  if (value === null || value === undefined || value === '') return '₹0';

  const num = Number(value);
  if (isNaN(num)) return '₹0';

  return num.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });
};

/**
 * Format as percentage with 2 decimals
 */
export const formatPercentage = (value: any) => {
  if (!value && value !== 0) return '0%';

  const num = Number(value);
  if (isNaN(num)) return '0%';

  return `${num.toFixed(2)}%`;
};
