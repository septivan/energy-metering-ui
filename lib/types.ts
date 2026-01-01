// Type definitions for API responses

export interface Reading {
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
  is_valid: boolean;
  validation_status?: 'valid' | 'invalid';
  anomaly_reason?: string;
}

export interface LatestReadings {
  volts: Reading;
  current: Reading;
  active_power: Reading;
  total_import_kwh: Reading;
}

export interface TimeSeriesParams {
  from: string;
  to: string;
  metric?: string;
}

export interface TimeSeriesResponse {
  metric: string;
  unit: string;
  data: Array<{
    timestamp: string;
    value: number;
    is_valid: boolean;
  }>;
}

export interface BillingParams {
  client_id: string;
  start_date: string;
  end_date: string;
}

export interface BillingInvoice {
  client_id: string;
  period: {
    from: string;
    to: string;
  };
  total_kwh: number;
}

export interface AnomalyRecord {
  client_id: string;
  reading_timestamp: string;
  metric_name: string;
  metric_value: number;
  unit: string;
  anomaly_reason: string;
}

export interface AnomalyParams {
  client_id?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AnomaliesResponse {
  data: AnomalyRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}

export interface WebSocketMessage {
  type: 'reading' | 'error' | 'ping';
  data?: Reading;
  error?: string;
}

export interface DashboardSummary {
  active_clients_today: number;
  active_clients_yesterday: number;
  readings_today: number;
  readings_yesterday: number;
  validation_today: {
    valid: number;
    anomaly: number;
    invalid: number;
  };
}

export interface Client {
  client_id: string;
  name: string;
}

export interface MetricDataPoint {
  ts: string;
  value: number;
  status: 'VALID' | 'INVALID' | 'ANOMALY';
}

export interface TimeSeriesData {
  client_id: string;
  metrics: {
    Total_Import_kWh: MetricDataPoint[];
    Volts: MetricDataPoint[];
    Current: MetricDataPoint[];
    Active_Power: MetricDataPoint[];
  };
}
