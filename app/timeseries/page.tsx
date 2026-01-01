'use client';

import { useState, useEffect } from 'react';
import { getClientTimeSeries } from '@/lib/apiClient';
import { TimeSeriesData } from '@/lib/types';
import { useClients } from '@/hooks/useClients';
import SingleMetricChart from '@/components/charts/SingleMetricChart';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBanner from '@/components/common/ErrorBanner';
import InfoBanner from '@/components/common/InfoBanner';
import ClientSelector from '@/components/forms/ClientSelector';

export default function TimeSeriesPage() {
  const { clients, selectedClient, setSelectedClient, loading: clientsLoading } = useClients(true);
  const [timeseriesData, setTimeseriesData] = useState<TimeSeriesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch timeseries when client selected
  useEffect(() => {
    if (selectedClient) {
      fetchTimeSeries();
    }
  }, [selectedClient]);

  const fetchTimeSeries = async () => {
    if (!selectedClient) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getClientTimeSeries(selectedClient);
      setTimeseriesData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timeseries data');
      setTimeseriesData(null);
    } finally {
      setLoading(false);
    }
  };

  if (clientsLoading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Loading clients..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Time Series Data</h1>

      {/* Client Selector */}
      <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <ClientSelector
          clients={clients}
          selectedClient={selectedClient}
          onChange={setSelectedClient}
          disabled={loading}
        />
        <InfoBanner
          message="Data limited to last 2 months"
          variant="info"
        />
      </div>

      {/* Error Display */}
      {error && (
        <ErrorBanner
          title="Error"
          message={error}
          onRetry={fetchTimeSeries}
        />
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner message="Fetching timeseries data..." />}

      {/* Chart Display */}
      {!loading && !error && timeseriesData && (
        <>
          <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
            <SingleMetricChart 
              data={timeseriesData.metrics.Volts}
              metricName="Volts"
              unit="V"
              color="#3b82f6"
            />
            <SingleMetricChart 
              data={timeseriesData.metrics.Current}
              metricName="Current"
              unit="A"
              color="#10b981"
            />
            <SingleMetricChart 
              data={timeseriesData.metrics.Active_Power}
              metricName="Active Power"
              unit="W"
              color="#f59e0b"
            />
            <SingleMetricChart 
              data={timeseriesData.metrics.Total_Import_kWh}
              metricName="Total Import"
              unit="kWh"
              color="#8b5cf6"
            />
          </div>
          <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#666', textAlign: 'center' }}>
            <strong>Volts:</strong> {timeseriesData.metrics.Volts.length} |{' '}
            <strong>Current:</strong> {timeseriesData.metrics.Current.length} |{' '}
            <strong>Active Power:</strong> {timeseriesData.metrics.Active_Power.length} |{' '}
            <strong>Total Import:</strong> {timeseriesData.metrics.Total_Import_kWh.length}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !error && timeseriesData && 
       timeseriesData.metrics.Volts.length === 0 &&
       timeseriesData.metrics.Current.length === 0 &&
       timeseriesData.metrics.Active_Power.length === 0 &&
       timeseriesData.metrics.Total_Import_kWh.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-title">No Data Available</div>
          <p>No timeseries data found for this client</p>
        </div>
      )}

      {!loading && !error && !timeseriesData && selectedClient && (
        <div className="empty-state">
          <div className="empty-state-title">Select a Client</div>
          <p>Choose a client to view timeseries data</p>
        </div>
      )}
    </div>
  );
}
