"use client";

import React, { useMemo } from "react";

interface HeatmapProps {
  data: { date: string | Date; count: number }[];
}

export default function Heatmap({ data }: HeatmapProps) {
  const heatmapData = useMemo(() => {
    const today = new Date();
    const map = new Map<string, number>();

    // Normalize data
    data.forEach((item) => {
      const d = new Date(item.date).toISOString().split("T")[0];
      map.set(d, (map.get(d) || 0) + item.count);
    });

    const result = [];
    const daysToGenerate = 365;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToGenerate);

    const startDay = startDate.getDay();

    for (let i = 0; i < startDay; i++) {
        result.push(null);
    }

    
    for (let i = 0; i <= daysToGenerate; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const count = map.get(dateStr) || 0;
      result.push({ date: dateStr, count });
    }

    return result;
  }, [data]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-muted dark:bg-white/5";
    if (count < 5)  return "bg-orange-300 dark:bg-orange-900/50";
    if (count < 10) return "bg-orange-400 dark:bg-orange-800/70";
    if (count < 20) return "bg-orange-500 dark:bg-orange-600/90";
    return "bg-orange-600 dark:bg-orange-500";
  };

  return (
    <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
      <div className="min-w-max">
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {heatmapData.map((item, index) => {
              if (item === null) {
                return <div key={`pad-${index}`} className="w-3 h-3 bg-transparent" />;
              }
              return (
                <div
                  key={item.date}
                  className={`w-3 h-3 rounded-sm ${getColor(item.count)} transition-colors duration-200`}
                  title={`${item.date}: ${item.count} tests`}
                />
              );
            })}
          </div>
          
          {/* Legend / Months could be added here, simplified for now */}
          <div className="flex justify-end items-center gap-2 mt-2 text-[10px] text-muted-foreground">
              <span>Less</span>
              <div className="w-3 h-3 bg-muted dark:bg-white/5 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-300 dark:bg-orange-900/50 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-400 dark:bg-orange-800/70 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-500 dark:bg-orange-600/90 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-600 dark:bg-orange-500 rounded-sm"></div>
              <span>More</span>
          </div>
      </div>
    </div>
  );
}
