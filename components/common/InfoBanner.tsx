interface InfoBannerProps {
  icon?: string;
  title?: string;
  message: string;
  variant?: 'info' | 'warning' | 'success' | 'error';
}

const VARIANT_STYLES = {
  info: {
    background: '#e8f4fd',
    borderColor: '#0066cc',
    color: '#004085',
  },
  warning: {
    background: '#fff3cd',
    borderColor: '#ffc107',
    color: '#856404',
  },
  success: {
    background: '#d4edda',
    borderColor: '#c3e6cb',
    color: '#155724',
  },
  error: {
    background: '#f8d7da',
    borderColor: '#f5c6cb',
    color: '#721c24',
  },
};

export default function InfoBanner({
  icon = '📊',
  title,
  message,
  variant = 'info',
}: InfoBannerProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      style={{
        background: styles.background,
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        borderLeft: `4px solid ${styles.borderColor}`,
      }}
    >
      <p style={{ margin: 0, color: styles.color, fontSize: '0.9rem' }}>
        {icon && `${icon} `}
        {title && <strong>{title}: </strong>}
        {message}
      </p>
    </div>
  );
}
