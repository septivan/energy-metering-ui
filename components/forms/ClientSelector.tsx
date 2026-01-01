import { Client } from '@/lib/types';

interface ClientSelectorProps {
  clients: Client[];
  selectedClient: string;
  onChange: (clientId: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export default function ClientSelector({
  clients,
  selectedClient,
  onChange,
  disabled = false,
  label = 'Select Client',
  placeholder = '-- Select a client --',
}: ClientSelectorProps) {
  return (
    <div className="form-group">
      <label htmlFor="client" className="form-label">
        {label}
      </label>
      <select
        id="client"
        className="form-select"
        value={selectedClient}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {clients.map((client) => (
          <option key={client.client_id} value={client.client_id}>
            {client.name} ({client.client_id})
          </option>
        ))}
      </select>
    </div>
  );
}
