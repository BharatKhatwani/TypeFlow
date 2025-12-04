"use client";

import Navbar from "@/components/Navbar";
import React from "react";

// Define allowed time values
type TimeOption = 15 | 30 | 60 | 120 | 180;

export default function Page() {
  const [time, setTime] = React.useState<TimeOption | null>(60); // default: 1m

  // Correct time labels
  const timeDisplay: Record<TimeOption, string> = {
    15: "15s",
    30: "30s",
    60: "1m",
    120: "2m",
    180: "3m",
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Navbar />

      <div className="py-10">
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-6">
            {time ? `Selected: ${timeDisplay[time]}` : "Select a time"}
          </h1>

          {/* TIME SELECTOR (LIKE IMAGE) */}
          <div className="flex justify-center">
            <div className="flex gap-4 bg-[#1d2633] px-6 py-3 rounded-xl shadow-sm border border-white/5">

              {[15, 30, 60, 120, 180].map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t as TimeOption)}
                  className={`
                    px-4 py-2 rounded-md text-sm transition font-medium
                    ${
                      time === t
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {timeDisplay[t as TimeOption]}
                </button>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
