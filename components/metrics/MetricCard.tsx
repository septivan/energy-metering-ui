import { Reading } from '@/lib/types';

interface MetricCardProps {
  title: string;
  reading: Reading | null;
  loading?: boolean;
}

export default function MetricCard({ title, reading, loading }: MetricCardProps) {
  if (loading) {
    return (
      <div className="card">
        <div className="card-title">{title}</div>
        <div className="card-value">--</div>
        <div className="card-unit">Loading...</div>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="card">
        <div className="card-title">{title}</div>
        <div className="card-value">--</div>
        <div className="card-unit">No data</div>
      </div>
    );
  }

  const validationClass = reading.is_valid ? 'badge-valid' : 'badge-invalid';
  const validationText = reading.is_valid ? 'Valid' : 'Invalid';

  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{reading.value.toFixed(2)}</div>
      <div className="card-unit">{reading.unit}</div>
      <div>
        <span className={`badge ${validationClass}`}>{validationText}</span>
      </div>
      <div className="card-meta">
        {new Date(reading.timestamp).toLocaleString()}
      </div>
      {reading.anomaly_reason && (
        <div className="card-meta" style={{ color: '#dc3545', marginTop: '0.5rem' }}>
          {reading.anomaly_reason}
        </div>
      )}
    </div>
  );
}
