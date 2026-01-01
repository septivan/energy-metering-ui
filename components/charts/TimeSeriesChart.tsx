import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TimeSeriesChartProps {
  data: Array<{
    timestamp: string;
    value: number;
    is_valid: boolean;
  }>;
  metric: string;
  unit: string;
  showInvalid?: boolean;
}

export default function TimeSeriesChart({
  data,
  metric,
  unit,
  showInvalid = true,
}: TimeSeriesChartProps) {
  // Filter data based on showInvalid flag
  const filteredData = showInvalid
    ? data
    : data.filter((point) => point.is_valid);

  // Transform data for Recharts
  const chartData = filteredData.map((point) => ({
    time: new Date(point.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    value: point.value,
    valid: point.is_valid ? 'Valid' : 'Invalid',
  }));

  if (chartData.length === 0) {
    return (
      <div className="empty-state">
        <p>No data available for the selected range</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          angle={-45}
          textAnchor="end"
          height={100}
          style={{ fontSize: '0.75rem' }}
        />
        <YAxis
          label={{ value: unit, angle: -90, position: 'insideLeft' }}
          style={{ fontSize: '0.875rem' }}
        />
        <Tooltip
          contentStyle={{
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#0066cc"
          strokeWidth={2}
          dot={{ r: 3 }}
          name={metric}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
