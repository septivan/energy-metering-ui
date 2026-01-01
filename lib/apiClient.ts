import {
  LatestReadings,
  TimeSeriesParams,
  TimeSeriesResponse,
  BillingParams,
  BillingInvoice,
  AnomalyRecord,
  AnomalyParams,
  AnomaliesResponse,
  DashboardSummary,
  Client,
  TimeSeriesData,
} from './types';
import { API_BASE_URL, HTTP_STATUS } from './constants';

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        response.status,
        errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or parsing error
    throw new ApiError(0, (error as Error).message);
  }
}

/**
 * Fetch latest readings for all metrics
 */
export async function getLatestReadings(): Promise<LatestReadings> {
  return fetchApi<LatestReadings>('/api/v1/readings/latest');
}

/**
 * Fetch time series data for a specific metric and date range
 */
export async function getTimeSeries(
  params: TimeSeriesParams
): Promise<TimeSeriesResponse> {
  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
    ...(params.metric && { metric: params.metric }),
  });

  return fetchApi<TimeSeriesResponse>(`/api/v1/readings/timeseries?${query}`);
}

/**
 * Fetch billing invoice data
 */
export async function getBillingInvoice(
  params: BillingParams
): Promise<BillingInvoice> {
  const query = new URLSearchParams({
    client_id: params.client_id,
  });
  
  if (params.start_date) query.append('start_date', params.start_date);
  if (params.end_date) query.append('end_date', params.end_date);

  return fetchApi<BillingInvoice>(`/api/v1/billing?${query}`);
}

/**
 * Download billing PDF report
 * Returns blob URL for download
 */
export async function downloadBillingPDF(
  params: BillingParams
): Promise<string> {
  const query = new URLSearchParams({
    client_id: params.client_id,
  });
  
  if (params.start_date) query.append('start_date', params.start_date);
  if (params.end_date) query.append('end_date', params.end_date);
  
  // Try adding format parameter for PDF
  query.append('format', 'pdf');

  const url = `${API_BASE_URL}/api/v1/billing?${query}`;
  
  console.log('Requesting PDF from:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response content-type:', response.headers.get('Content-Type'));
    
    if (!response.ok) {
      // Try to read error message from response
      let errorMessage = 'Failed to download billing PDF';
      try {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        // If not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new ApiError(response.status, errorMessage);
    }

    // Get content type
    const contentType = response.headers.get('Content-Type');
    console.log('PDF content type:', contentType);
    
    // If content-type is not PDF, try to read as text to see what we got
    if (contentType && !contentType.includes('application/pdf')) {
      const text = await response.text();
      console.error('Expected PDF but got:', text.substring(0, 200));
      throw new ApiError(500, `Expected PDF but received ${contentType}. Response: ${text.substring(0, 100)}`);
    }

    const blob = await response.blob();
    console.log('PDF blob size:', blob.size, 'bytes');
    
    if (blob.size === 0) {
      throw new ApiError(500, 'Received empty PDF file');
    }
    
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}

/**
 * Fetch anomaly records
 */
export async function getAnomalies(): Promise<AnomalyRecord[]> {
  return fetchApi<AnomalyRecord[]>('/api/v1/readings/anomalies');
}

/**
 * Fetch anomaly records with filters and pagination
 */
export async function getAnomaliesFiltered(params?: AnomalyParams): Promise<AnomaliesResponse> {
  const query = new URLSearchParams();
  
  if (params?.client_id) query.append('client_id', params.client_id);
  if (params?.from) query.append('from', params.from);
  if (params?.to) query.append('to', params.to);
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  
  const queryString = query.toString();
  const endpoint = queryString ? `/api/v1/anomalies?${queryString}` : '/api/v1/anomalies';
  
  return fetchApi<AnomaliesResponse>(endpoint);
}

/**
 * Fetch dashboard summary statistics
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return fetchApi<DashboardSummary>('/api/v1/dashboard/summary');
}

/**
 * Fetch list of clients
 */
export async function getClients(): Promise<Client[]> {
  return fetchApi<Client[]>('/api/v1/clients');
}

/**
 * Fetch timeseries data for a specific client
 */
export async function getClientTimeSeries(clientId: string): Promise<TimeSeriesData> {
  return fetchApi<TimeSeriesData>(`/api/v1/timeseries?client_id=${clientId}`);
}

export { ApiError };
