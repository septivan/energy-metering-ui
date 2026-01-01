interface ConnectionStatusProps {
  isConnected: boolean;
  retryCount?: number;
  error?: string | null;
}

export default function ConnectionStatus({
  isConnected,
  retryCount = 0,
  error,
}: ConnectionStatusProps) {
  const getStatus = () => {
    if (isConnected) return { text: 'Connected', className: 'status-connected' };
    if (retryCount > 0) return { text: 'Reconnecting...', className: 'status-reconnecting' };
    return { text: 'Disconnected', className: 'status-disconnected' };
  };

  const status = getStatus();

  return (
    <div className="connection-status">
      <span className={`status-dot ${status.className}`}></span>
      <span>{status.text}</span>
      {error && <span style={{ color: '#dc3545', marginLeft: '0.5rem' }}>({error})</span>}
    </div>
  );
}
