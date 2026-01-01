import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  title: string;
  data: Array<{
    name: string;
    today: number;
    yesterday: number;
  }>;
  dataKeyToday?: string;
  dataKeyYesterday?: string;
}

export default function BarChart({
  title,
  data,
  dataKeyToday = 'today',
  dataKeyYesterday = 'yesterday',
}: BarChartProps) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKeyToday} fill="#3b82f6" name="Today" />
          <Bar dataKey={dataKeyYesterday} fill="#94a3b8" name="Yesterday" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
