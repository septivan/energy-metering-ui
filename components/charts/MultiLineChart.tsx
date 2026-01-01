import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Dot,
} from 'recharts';
import { TimeSeriesData } from '@/lib/types';

interface MultiLineChartProps {
  data: TimeSeriesData;
}

// Transform data to format needed for Recharts
function transformData(data: TimeSeriesData) {
  // Collect all unique timestamps
  const timestampSet = new Set<string>();
  
  Object.values(data.metrics).forEach(metricArray => {
    metricArray.forEach(point => timestampSet.add(point.ts));
  });
  
  const timestamps = Array.from(timestampSet).sort();
  
  // Build chart data array
  return timestamps.map(ts => {
    const voltagePoint = data.metrics.Volts.find(p => p.ts === ts);
    const currentPoint = data.metrics.Current.find(p => p.ts === ts);
    const powerPoint = data.metrics.Active_Power.find(p => p.ts === ts);
    const totalImportPoint = data.metrics.Total_Import_kWh.find(p => p.ts === ts);
    
    return {
      timestamp: ts,
      voltage: voltagePoint?.value || null,
      current: currentPoint?.value || null,
      power: powerPoint?.value || null,
      total_import: totalImportPoint?.value || null,
      is_anomaly: 
        voltagePoint?.status?.toUpperCase() === 'ANOMALY' || voltagePoint?.status?.toUpperCase() === 'INVALID' ||
        currentPoint?.status?.toUpperCase() === 'ANOMALY' || currentPoint?.status?.toUpperCase() === 'INVALID' ||
        powerPoint?.status?.toUpperCase() === 'ANOMALY' || powerPoint?.status?.toUpperCase() === 'INVALID' ||
        totalImportPoint?.status?.toUpperCase() === 'ANOMALY' || totalImportPoint?.status?.toUpperCase() === 'INVALID'
    };
  });
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

export default function MultiLineChart({ data }: MultiLineChartProps) {
  const chartData = transformData(data);
  
  // Format timestamp for display
  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Metrics Over Time</h3>
      <ResponsiveContainer width="100%" height={450}>
        <RechartsLineChart
          data={chartData}
          margin={{ top: 20, right: 60, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatXAxis}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis yAxisId="left" label={{ value: 'V / A / W', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'kWh', angle: 90, position: 'insideRight' }} />
          <Tooltip 
            labelFormatter={formatXAxis}
            formatter={(value: any) => value !== null ? value.toFixed(2) : 'N/A'}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="voltage"
            stroke="#3b82f6"
            name="Voltage (V)"
            strokeWidth={2}
            dot={<CustomDot />}
            connectNulls
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="current"
            stroke="#10b981"
            name="Current (A)"
            strokeWidth={2}
            dot={<CustomDot />}
            connectNulls
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="power"
            stroke="#f59e0b"
            name="Power (W)"
            strokeWidth={2}
            dot={<CustomDot />}
            connectNulls
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="total_import"
            stroke="#8b5cf6"
            name="Total Import (kWh)"
            strokeWidth={2}
            dot={<CustomDot />}
            connectNulls
          />
        </RechartsLineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666', textAlign: 'center' }}>
        <span style={{ color: '#ef4444', fontWeight: 600 }}>●</span> Red dots indicate anomaly or invalid points
      </div>
    </div>
  );
}
