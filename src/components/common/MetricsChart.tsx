import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MetricsChartProps {
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  name: string;
  color?: string;
}

export function MetricsChart({
  data,
  dataKey,
  xAxisKey = 'timestamp',
  name,
  color = '#8884d8',
}: MetricsChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey={xAxisKey}
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.375rem',
              color: '#F3F4F6',
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            name={name}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}