import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MetricDataPoint } from '@/lib/types';

interface SingleMetricChartProps {
  data: MetricDataPoint[];
  metricName: string;
  unit: string;
  color: string;
}

// Transform data to format needed for Recharts
function transformData(data: MetricDataPoint[]) {
  return data.map(point => ({
    timestamp: point.ts,
    value: point.value,
    is_anomaly: point.status?.toUpperCase() === 'ANOMALY' || point.status?.toUpperCase() === 'INVALID'
  }));
}

// Custom dot to highlight anomalies
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  if (payload.is_anomaly) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="#ef4444"
        stroke="#fff"
        strokeWidth={2}
      />
    );
  }
  
  // No dot for normal data points
  return <></>;
};

export default function SingleMetricChart({ data, metricName, unit, color }: SingleMetricChartProps) {
  const chartData = transformData(data);
  
  // Format timestamp for display
  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">{metricName}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsLineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis label={{ value: unit, angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            labelFormatter={formatXAxis}
            formatter={(value: any) => value !== null ? value.toFixed(2) : 'N/A'}
          />
          
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            name={`${metricName} (${unit})`}
            strokeWidth={2}
            dot={<CustomDot />}
            connectNulls
          />
        </RechartsLineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666', textAlign: 'center' }}>
        <span style={{ color: '#ef4444', fontWeight: 600 }}>●</span> Red dots indicate ANOMALY or INVALID points
      </div>
    </div>
  );
}
