import React from "react";

type TimeOption = 15 | 30 | 60 | 120 | 180;

interface StatCardsProps {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  time: TimeOption;
}

const timeDisplay: Record<TimeOption, string> = {
  15: "15s",
  30: "30s",
  60: "60s",
  120: "120s",
  180: "180s",
};

export default function StatCards({ wpm, accuracy, timeLeft, time }: StatCardsProps) {
  return (
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
        <p className="text-orange-400 text-sm">
          {timeDisplay[time]}
        </p>
      </div>
    </div>
  );
}