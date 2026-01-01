'use client';

import { useState, useEffect } from 'react';
import { getAnomaliesFiltered } from '@/lib/apiClient';
import { AnomaliesResponse } from '@/lib/types';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE } from '@/lib/constants';
import { useClients } from '@/hooks/useClients';
import AnomalyTable from '@/components/tables/AnomalyTable';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBanner from '@/components/common/ErrorBanner';
import ClientSelector from '@/components/forms/ClientSelector';
import DateRangeSelector from '@/components/forms/DateRangeSelector';

export default function AnomaliesPage() {
  const { clients, selectedClient, setSelectedClient, loading: clientsLoading } = useClients();
  const [data, setData] = useState<AnomaliesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [limit] = useState(DEFAULT_PAGE_SIZE);

  // Fetch anomalies on mount and when page changes
  useEffect(() => {
    fetchAnomalies();
  }, [currentPage]);

  const fetchAnomalies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {
        page: currentPage,
        limit: limit,
      };
      
      if (selectedClient) params.client_id = selectedClient;
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      
      const result = await getAnomaliesFiltered(params);
      console.log('Anomalies response:', result); // Debug log
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch anomalies');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = () => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchAnomalies(); // Manually trigger fetch
  };

  const handleFilterReset = () => {
    setSelectedClient('');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Anomalies & Invalid Data</h1>

      {/* Filters */}
      <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>Filters</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <ClientSelector
            clients={clients}
            selectedClient={selectedClient}
            onChange={setSelectedClient}
            disabled={clientsLoading || loading}
            label="Client"
            placeholder="All Clients"
          />

          <DateRangeSelector
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            disabled={loading}
            fromLabel="From Date"
            toLabel="To Date"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleFilterApply}
            className="btn btn-primary"
            disabled={loading}
          >
            Apply Filters
          </button>
          <button
            onClick={handleFilterReset}
            className="btn btn-secondary"
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorBanner
          title="Failed to Load Anomalies"
          message={error}
          onRetry={fetchAnomalies}
        />
      )}

      {/* Loading State */}
      {loading && !data && <LoadingSpinner message="Loading anomalies..." />}

      {/* Data Display */}
      {!loading && data && data.data && (
        <>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
            Showing {data.data.length} of {data.pagination.total} anomalies (Page {data.pagination.page} of {data.pagination.total_page})
          </div>
          
          <AnomalyTable anomalies={data.data} />

          {/* Pagination - Debug info */}
          {/* <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#999', textAlign: 'center' }}>
            Debug: total_page={data.pagination.total_page}, total={data.pagination.total}, page={data.pagination.page}
          </div> */}

          {/* Pagination */}
          {data.pagination.total_page && data.pagination.total_page > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="btn btn-secondary"
              >
                Previous
              </button>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {Array.from({ length: Math.min(5, data.pagination.total_page) }, (_, i) => {
                  let pageNum;
                  if (data.pagination.total_page <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= data.pagination.total_page - 2) {
                    pageNum = data.pagination.total_page - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      style={{
                        padding: '0.5rem 1rem',
                        border: currentPage === pageNum ? '2px solid #3b82f6' : '1px solid #ddd',
                        background: currentPage === pageNum ? '#3b82f6' : '#fff',
                        color: currentPage === pageNum ? '#fff' : '#333',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: currentPage === pageNum ? 600 : 400,
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === data.pagination.total_page || loading}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && data && (!data.data || data.data.length === 0) && (
        <div className="empty-state">
          <div className="empty-state-icon">✓</div>
          <div className="empty-state-title">No Anomalies Found</div>
          <p>No anomalies match the selected filters</p>
        </div>
      )}
    </div>
  );
}
