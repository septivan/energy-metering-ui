/**
 * Utility functions
 */

/**
 * Format a date string to locale string
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a datetime string to locale string
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Get start of current month in YYYY-MM-DD format
 */
export function getStartOfMonth(): string {
  const date = new Date();
  date.setDate(1);
  return date.toISOString().slice(0, 10);
}

/**
 * Get end of current month in YYYY-MM-DD format
 */
export function getEndOfMonth(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return date.toISOString().slice(0, 10);
}

/**
 * Format a number with specified decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Format a filename by replacing spaces with underscores
 */
export function formatFilename(name: string): string {
  return name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * Create a download filename for billing PDF
 */
export function createBillingFilename(
  clientName: string,
  startDate: string,
  endDate: string
): string {
  const formattedName = formatFilename(clientName);
  return `billing_${formattedName}_${startDate}_to_${endDate}.pdf`;
}

/**
 * Safely parse JSON with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Create a delay promise (useful for testing/debugging)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
