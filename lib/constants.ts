/**
 * Application-wide constants
 */

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_QUERY_API_URL || '';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || '';
export const POLLING_INTERVAL = Number(process.env.NEXT_PUBLIC_POLLING_INTERVAL) || 5000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// Validation Status
export const VALIDATION_STATUS = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  ANOMALY: 'ANOMALY',
} as const;

// Metric Names
export const METRICS = {
  VOLTS: 'Volts',
  CURRENT: 'Current',
  ACTIVE_POWER: 'Active_Power',
  TOTAL_IMPORT_KWH: 'Total_Import_kWh',
} as const;

// Colors for charts and status
export const STATUS_COLORS = {
  VALID: '#28a745',
  INVALID: '#dc3545',
  ANOMALY: '#ffc107',
  PRIMARY: '#0066cc',
  SECONDARY: '#6c757d',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
