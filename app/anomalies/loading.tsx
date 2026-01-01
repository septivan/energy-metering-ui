export default function Loading() {
  return (
    <div className="page-container">
      <div className="skeleton-loader">
        <div className="skeleton-title"></div>
        <div className="skeleton-form">
          <div className="skeleton-input"></div>
          <div className="skeleton-input"></div>
          <div className="skeleton-input"></div>
        </div>
        <div className="skeleton-table"></div>
      </div>
    </div>
  );
}
