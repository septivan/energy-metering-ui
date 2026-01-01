'use client';

import { useState, useEffect } from 'react';
import { getDashboardSummary } from '@/lib/apiClient';
// import { useWebSocket } from '@/hooks/useWebSocket';
import { DashboardSummary } from '@/lib/types';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBanner from '@/components/common/ErrorBanner';
// import ConnectionStatus from '@/components/common/ConnectionStatus';

// const WS_URL = process.env.NEXT_PUBLIC_WS_URL || '';
// const POLLING_INTERVAL = Number(process.env.NEXT_PUBLIC_POLLING_INTERVAL) || 5000;

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isPaused, setIsPaused] = useState(false);

  // WebSocket connection for real-time updates
  // const { isConnected, lastMessage, error: wsError, retryCount } = useWebSocket(WS_URL, isPaused);

  // const handleTogglePause = () => {
  //   if (isPaused) {
  //     // When resuming, refresh the page for clean state
  //     window.location.reload();
  //   } else {
  //     // When pausing, just set state
  //     setIsPaused(true);
  //   }
  // };

  // Initial data fetch
  useEffect(() => {
    fetchSummary();
  }, []);

  // Update readings when WebSocket message received
  // useEffect(() => {
  //   if (lastMessage && !isPaused) {
  //     updateReadingByMetric(lastMessage);
  //   }
  // }, [lastMessage, isPaused]);

  // Fallback polling when WebSocket disconnected
  // useEffect(() => {
  //   let intervalId: NodeJS.Timeout | null = null;

  //   if (!isConnected && !isPaused) {
  //     // Start polling when disconnected and not paused
  //     intervalId = setInterval(() => {
  //       fetchSummary();
  //     }, POLLING_INTERVAL);
  //   }

  //   return () => {
  //     if (intervalId) {
  //       clearInterval(intervalId);
  //     }
  //   };
  // }, [isConnected, isPaused]);

  const fetchSummary = async () => {
    try {
      setError(null);
      const data = await getDashboardSummary();
      console.log('Dashboard summary response:', data);
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch dashboard summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard summary');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Energy Metering Dashboard</h1>

      {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <ConnectionStatus
          isConnected={isConnected}
          retryCount={retryCount}
          error={wsError}
        />
        
        <button
          onClick={handleTogglePause}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            backgroundColor: isPaused ? '#10b981' : '#ef4444',
            color: 'white',
            transition: 'background-color 0.2s'
          }}
        >
          {isPaused ? '▶ Resume Live Updates' : '⏸ Pause Live Updates'}
        </button>
      </div> */}

      {error && (
        <ErrorBanner
          title="Connection Error"
          message={error}
          onRetry={fetchSummary}
        />
      )}

      {/* {readings ? (
        <div className="metrics-grid">
          <MetricCard
            title="Voltage"
            reading={readings.volts}
          />
          <MetricCard
            title="Current"
            reading={readings.current}
          />
          <MetricCard
            title="Active Power"
            reading={readings.active_power}
          />
          <MetricCard
            title="Total Import Energy"
            reading={readings.total_import_kwh}
          />
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-title">No Data Available</div>
          <p>Unable to retrieve meter readings</p>
        </div>
      )} */}

      {/* Dashboard Summary Charts */}
      {summary && (
        <div className="charts-grid">
          <BarChart
            title="Active Clients Comparison"
            data={[
              {
                name: 'Active Clients',
                today: summary.active_clients_today,
                yesterday: summary.active_clients_yesterday,
              },
            ]}
          />
          
          <BarChart
            title="Readings Comparison"
            data={[
              {
                name: 'Readings',
                today: summary.readings_today,
                yesterday: summary.readings_yesterday,
              },
            ]}
          />
          
          <PieChart
            title="Validation Status (Today)"
            data={[
              {
                name: 'Valid',
                value: summary.validation_today.valid,
              },
              {
                name: 'Anomaly',
                value: summary.validation_today.anomaly,
              },
              {
                name: 'Invalid',
                value: summary.validation_today.invalid,
              },
            ]}
            colors={['#10b981', '#f59e0b', '#ef4444']}
          />
        </div>
      )}

      {/* <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Data Source
        </h3>
        <p style={{ fontSize: '0.75rem', color: '#666' }}>
          {isPaused
            ? '⏸ Live updates paused'
            : isConnected
            ? '📡 Real-time data via WebSocket'
            : '🔄 Polling data every 5 seconds (WebSocket unavailable)'}
        </p>
      </div> */}
    </div>
  );
}
