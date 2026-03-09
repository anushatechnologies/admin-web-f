// dateUtils.ts

/**
 * Parse date safely
 */
export const parseDate = (value: string | Date): Date => {
  return value instanceof Date ? value : new Date(value);
};

/**
 * Format date → dd-mm-yyyy
 */
export const formatDate = (value: string | Date): string => {
  const date = parseDate(value);
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

/**
 * Format date → yyyy-mm-dd (for inputs)
 */
export const formatDateForInput = (value: string | Date): string => {
  const date = parseDate(value);
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${y}-${m}-${d}`;
};

/**
 * Compare dates
 */
export const isBefore = (d1: any, d2: any): boolean => {
  return parseDate(d1).getTime() < parseDate(d2).getTime();
};

export const isAfter = (d1: any, d2: any): boolean => {
  return parseDate(d1).getTime() > parseDate(d2).getTime();
};

export const isSameDay = (d1: any, d2: any): boolean => {
  const date1 = parseDate(d1);
  const date2 = parseDate(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Add days
 */
export const addDays = (value: any, days: number): Date => {
  const date = parseDate(value);
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Convert ISO date to readable e.g. "2025-01-04T12:22" → "04 Jan 2025"
 */
export const formatReadableDate = (value: string | Date): string => {
  const date = parseDate(value);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// dateUtils.js

/**
 * Convert date to DD-MM-YYYY
 */
export const formatDateIndian = (date: any): string => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Convert date & time to DD-MM-YYYY HH:mm
 */
export const formatDateTimeIndian = (date: any): string => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const datePart = d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const timePart = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${datePart} ${timePart}`;
};

/**
 * Get today's date in DD-MM-YYYY
 */
export const todayIndian = (): string => {
  return formatDateIndian(new Date());
};
