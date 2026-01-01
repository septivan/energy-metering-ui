import { useState, useEffect } from 'react';
import { getClients } from '@/lib/apiClient';
import { Client } from '@/lib/types';

interface UseClientsResult {
  clients: Client[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing clients list
 */
export function useClients(autoSelect: boolean = false): UseClientsResult & { selectedClient: string; setSelectedClient: (id: string) => void } {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClients();
      setClients(data);
      
      // Auto-select first client if enabled and not already selected
      if (autoSelect && data.length > 0 && !selectedClient) {
        setSelectedClient(data[0].client_id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch clients';
      setError(errorMessage);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    selectedClient,
    setSelectedClient,
    loading,
    error,
    refetch: fetchClients,
  };
}
