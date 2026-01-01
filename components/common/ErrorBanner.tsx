interface ErrorBannerProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({
  title = 'Error',
  message,
  onRetry,
}: ErrorBannerProps) {
  return (
    <div className="error-banner">
      <div className="error-title">{title}</div>
      <div>{message}</div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Retry
        </button>
      )}
    </div>
  );
}
