'use client';

import { useState, useEffect } from 'react';
import { downloadBillingPDF } from '@/lib/apiClient';
import { BillingParams } from '@/lib/types';
import { ApiError } from '@/lib/apiClient';
import { getStartOfMonth, getEndOfMonth, createBillingFilename } from '@/lib/utils';
import { useClients } from '@/hooks/useClients';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBanner from '@/components/common/ErrorBanner';
import EmptyState from '@/components/common/EmptyState';
import InfoBanner from '@/components/common/InfoBanner';
import ClientSelector from '@/components/forms/ClientSelector';
import DateRangeSelector from '@/components/forms/DateRangeSelector';

export default function BillingPage() {
  const { clients, selectedClient, setSelectedClient, loading: clientsLoading } = useClients(true);
  const [fromDate, setFromDate] = useState(getStartOfMonth());
  const [toDate, setToDate] = useState(getEndOfMonth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGeneratedDate, setLastGeneratedDate] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // Cleanup PDF preview URL on unmount
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  const handleGenerateBilling = async () => {
    if (!selectedClient) {
      setError('Please select a client');
      return;
    }

    setLoading(true);
    setError(null);
    setPdfPreviewUrl(null);

    try {
      const params: BillingParams = {
        client_id: selectedClient,
        start_date: fromDate,
        end_date: toDate,
      };
      
      console.log('Generating billing PDF:', params);
      
      const blobUrl = await downloadBillingPDF(params);

      // Store for preview
      setPdfPreviewUrl(blobUrl);

      // Trigger download
      const clientName = clients.find(c => c.client_id === selectedClient)?.name || selectedClient;
      const filename = createBillingFilename(clientName, fromDate, toDate);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('PDF downloaded:', filename);
      
      setLastGeneratedDate(new Date().toLocaleString());
    } catch (err) {
      console.error('Billing generation error:', err);
      
      const clientName = clients.find(c => c.client_id === selectedClient)?.name || 'Unknown';
      let errorMessage = 'Failed to generate billing';
      
      if (err instanceof ApiError) {
        if (err.status === 404) {
          errorMessage = 'No billing data found for the selected period';
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(`${clientName} (${fromDate} to ${toDate}): ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="page-container">
      <h1 className="page-title">Billing Report</h1>
      
      {/* Disclaimer */}
      <InfoBanner
        icon="📊"
        title="Note"
        message="This billing is a consumption summary, not an invoice. It provides statistics on energy usage without pricing or payment information."
        variant="info"
      />

      {/* Form Section */}
      <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>Generate Billing Report</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <ClientSelector
            clients={clients}
            selectedClient={selectedClient}
            onChange={setSelectedClient}
            disabled={clientsLoading || loading}
          />
          
          <DateRangeSelector
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            disabled={loading}
          />
        </div>

        <button
          onClick={handleGenerateBilling}
          className="btn btn-primary"
          disabled={loading || !selectedClient}
        >
          {loading ? 'Generating...' : 'Generate Billing'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorBanner
          title="Billing Error"
          message={error}
          onRetry={handleGenerateBilling}
        />
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner message="Generating billing report..." />}

      {/* Success Message */}
      {!loading && !error && lastGeneratedDate && (
        <>
          <InfoBanner
            icon="✅"
            title="Billing Generated Successfully"
            message={`PDF downloaded at ${lastGeneratedDate}. Check your downloads folder for the billing report PDF.`}
            variant="success"
          />

          {/* PDF Preview */}
          {pdfPreviewUrl && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>PDF Preview</h3>
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', height: '800px' }}>
                <iframe
                  src={pdfPreviewUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Billing PDF Preview"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State - Initial state */}
      {!loading && !error && !lastGeneratedDate && (
        <EmptyState
          icon="📊"
          title="Ready to Generate Billing"
          message="Select a client and date range, then click Generate Billing to download the consumption summary PDF"
        />
      )}
    </div>
  );
}
