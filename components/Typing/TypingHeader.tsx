"use client";

import React from "react";

type TimeOption = 15 | 30 | 60 | 120 | 180;

type TypingHeaderProps = {
  time: TimeOption;
  timeLeft: number;
  isTestActive: boolean;
  wpm: number;
  accuracy: number;
  onTimeChange: (time: TimeOption) => void;
};

const timeDisplay: Record<TimeOption, string> = {
  15: "15s",
  30: "30s",
  60: "60s",
  120: "120s",
  180: "180s",
};

export function TypingHeader({
  time,
  timeLeft,
  isTestActive,
  wpm,
  accuracy,
  onTimeChange,
}: TypingHeaderProps) {
  return (
    <div className="py-6 text-center">
      {/* TIME SELECTOR */}
      <div className="flex justify-center">
        <div className="flex gap-4 bg-[#1d2633] cursor-pointer px-6 py-3 rounded-xl shadow-sm border border-white/5">
          {[15, 30, 60, 120, 180].map((t) => (
            <button
              key={t}
              suppressHydrationWarning
              onClick={() => onTimeChange(t as TimeOption)}
              disabled={isTestActive}
              className={`
                px-4 py-2 rounded-md text-sm transition font-medium cursor-pointer
                ${time === t
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }
                ${isTestActive ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {timeDisplay[t as TimeOption]}
            </button>
          ))}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="mt-10 flex justify-center gap-6">
        <div className="w-60 h-28 bg-[#1d2633] border border-white/10 rounded-xl 
                        flex flex-col items-center justify-center shadow-sm">
          <h1 className="text-white text-2xl py-2 font-bold">WPM</h1>
          <p className="text-orange-400 text-xl font-semibold">{wpm}</p>
        </div>

        <div className="w-60 h-28 bg-[#1d2633] border border-white/10 rounded-xl 
                        flex flex-col items-center justify-center shadow-sm">
          <h1 className="text-white text-2xl py-2 font-bold">Accuracy</h1>
          <p className="text-orange-400 text-xl font-semibold">{accuracy}%</p>
        </div>

        <div className="w-60 h-28 bg-[#1d2633] border border-white/10 rounded-xl 
                        flex flex-col items-center justify-center shadow-sm">
          <h1 className="text-white text-2xl py-2 font-bold">{timeLeft}s</h1>
          <p className="text-orange-400 text-sm">{timeDisplay[time]}</p>
        </div>
      </div>
    </div>
  );
}
