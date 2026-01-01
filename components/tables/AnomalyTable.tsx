import { AnomalyRecord } from '@/lib/types';

interface AnomalyTableProps {
  anomalies: AnomalyRecord[];
}

// Format timestamp to dd-mm-yyyy HH24:MI:SS GMT+7
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} GMT+7`;
}

export default function AnomalyTable({ anomalies }: AnomalyTableProps) {
  if (anomalies.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">✓</div>
        <div className="empty-state-title">No Anomalies Detected</div>
        <p>All readings are within normal parameters</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Metric</th>
            <th>Value</th>
            <th>Reason</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {anomalies.map((anomaly, index) => (
            <tr key={index}>
              <td>{anomaly.client_id || 'N/A'}</td>
              <td>{anomaly.metric_name || 'N/A'}</td>
              <td style={{ textAlign: 'right' }}>
                {anomaly.metric_value !== null && anomaly.metric_value !== undefined 
                  ? `${anomaly.metric_value.toFixed(2)} ${anomaly.unit || ''}` 
                  : 'N/A'}
              </td>
              <td>{anomaly.anomaly_reason || 'N/A'}</td>
              <td>{anomaly.reading_timestamp ? formatTimestamp(anomaly.reading_timestamp) : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
