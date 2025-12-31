"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from "recharts";
import { useTheme } from "next-themes";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/90 backdrop-blur-sm p-3 rounded-lg border border-border shadow-lg">
        <p className="text-sm font-medium">Time: {label}s</p>
        <p className="text-sm">WPM: <span className="text-primary font-medium">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export default function WPMGraph({
  data,
}: {
  data: { second: number; wpm: number }[];
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Process data to remove duplicates and sort
  const uniqueData = data.reduce((acc, current) => {
    const existingIndex = acc.findIndex(item => item.second === current.second);
    if (existingIndex >= 0) {
      acc[existingIndex] = current;
    } else {
      acc.push(current);
    }
    return acc;
  }, [] as { second: number; wpm: number }[]).sort((a, b) => a.second - b.second);

  // Calculate Y-axis domain with some padding
  const calculateDomain = () => {
    if (uniqueData.length === 0) return [0, 100];
    const wpmValues = uniqueData.map(d => d.wpm);
    const minWPM = Math.max(0, Math.min(...wpmValues) - 10);
    const maxWPM = Math.max(...wpmValues) + 10;
    return [minWPM, maxWPM];
  };

  // Calculate X-axis ticks based on test duration
  const getXAxisTicks = () => {
    if (uniqueData.length === 0) return [];
    const maxSecond = Math.max(...uniqueData.map(d => d.second));
    const tickCount = Math.min(7, maxSecond);
    return Array.from({ length: tickCount + 1 }, (_, i) => Math.floor((i * maxSecond) / tickCount));
  };

  const gradientId = `wpmGradient-${isDark ? 'dark' : 'light'}`;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={uniqueData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isDark ? "#3b82f6" : "#2563eb"} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={isDark ? "#3b82f6" : "#2563eb"} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? "#374151" : "#e5e7eb"} 
            vertical={false}
          />
          <XAxis
            dataKey="second"
            tickFormatter={(value) => `${value}s`}
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
            axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
            ticks={getXAxisTicks()}
            domain={['dataMin', 'dataMax']}
          />
          <YAxis
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
            axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
            domain={calculateDomain()}
            tickFormatter={(value) => `${value}`}
            width={40}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ 
              stroke: isDark ? '#4b5563' : '#d1d5db',
              strokeWidth: 1,
              strokeDasharray: '3 3'
            }}
          />
          <Area
            type="monotone"
            dataKey="wpm"
            stroke={isDark ? "#3b82f6" : "#2563eb"}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            activeDot={{ 
              r: 6, 
              stroke: isDark ? "#1e40af" : "#1e40af", 
              strokeWidth: 2, 
              fill: isDark ? "#3b82f6" : "#2563eb" 
            }}
          />
          <ReferenceLine 
            y={uniqueData.length > 0 ? uniqueData[uniqueData.length - 1].wpm : 0} 
            stroke={isDark ? "#10b981" : "#059669"}
            strokeDasharray="3 3"
            strokeWidth={2}
            label={{
              value: `Current: ${uniqueData.length > 0 ? Math.round(uniqueData[uniqueData.length - 1].wpm) : 0} WPM`,
              position: 'right',
              fill: isDark ? "#10b981" : "#059669",
              fontSize: 12,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}