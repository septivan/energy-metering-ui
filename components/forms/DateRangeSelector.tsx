interface DateRangeSelectorProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  disabled?: boolean;
  fromLabel?: string;
  toLabel?: string;
}

export default function DateRangeSelector({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  disabled = false,
  fromLabel = 'Start Date',
  toLabel = 'End Date',
}: DateRangeSelectorProps) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="from" className="form-label">
          {fromLabel}
        </label>
        <input
          id="from"
          type="date"
          className="form-input"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="form-group">
        <label htmlFor="to" className="form-label">
          {toLabel}
        </label>
        <input
          id="to"
          type="date"
          className="form-input"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </>
  );
}
