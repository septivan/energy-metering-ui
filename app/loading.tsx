export default function Loading() {
  return (
    <div className="page-container">
      <div className="skeleton-loader">
        <div className="skeleton-title"></div>
        <div className="skeleton-grid">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
        <div className="skeleton-chart"></div>
        <div className="skeleton-chart"></div>
      </div>
    </div>
  );
}
