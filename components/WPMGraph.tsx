"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function WPMGraph({
  data,
}: {
  data: { second: number; wpm: number }[];
}) {
  // Remove duplicate entries with the same second value (keep the last one)
  const uniqueData = data.reduce((acc, current) => {
    const existingIndex = acc.findIndex(item => item.second === current.second);
    if (existingIndex >= 0) {
      acc[existingIndex] = current; // Replace with latest value
    } else {
      acc.push(current);
    }
    return acc;
  }, [] as { second: number; wpm: number }[]);

  // Calculate appropriate tick count based on data range
  const getTickCount = () => {
    if (uniqueData.length === 0) return 5;
    const maxSecond = Math.max(...uniqueData.map(d => d.second));
    if (maxSecond <= 30) return 7; // 
    if (maxSecond <= 60) return 7; // 
    if (maxSecond <= 120) return 7; // 
    return 7; 
  };

  return (
    <div className="w-full bg-[#1d2633] border border-white/10 rounded-xl p-6">
      <h2 className="text-white text-lg mb-2">Results</h2>
      <p className="text-gray-400 mb-4 text-sm">Your performance summary.</p>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={uniqueData}>

          {/* Monkeytype-style grid lines */}
          <CartesianGrid  strokeDasharray="3 3" />

          {/* X-axis → time */}
          <XAxis
            dataKey="second"
            stroke="#888"
            tick={{ fill: "#aaa" }}
            label={{ value: "Time (s)", position: "insideBottomRight", offset: -5, fill: "#aaa" }}
            tickFormatter={(value) => `${value}s`}
            tickCount={getTickCount()}
            type="number"
            domain={['dataMin', 'dataMax']}
          />

          {/* Y-axis → WPM */}
          <YAxis
            stroke="#888"
            tick={{ fill: "#aaa" }}
            domain={[0, "dataMax + 10"]}
            label={{ value: "WPM", angle: -90, position: "insideLeft", fill: "#aaa" }}
          />

          {/* Tooltip on hover */}
          <Tooltip
            contentStyle={{ backgroundColor: "#1d2633" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />

          {/* Monkeytype gradient under line */}
          <defs>
            <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="90%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Smooth Monkeytype-style curve */}
          <Line
            type="monotone"
            dataKey="wpm"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5 }}
            fill="url(#wpmGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
