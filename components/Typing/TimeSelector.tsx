import React from "react";

type TimeOption = 15 | 30 | 60 | 120 | 180;

interface TimeSelectorProps {
  time: TimeOption;
  setTime: (time: TimeOption) => void;
  resetTest: () => void;
  isTestActive: boolean;
}

const timeDisplay: Record<TimeOption, string> = {
  15: "15s",
  30: "30s",
  60: "60s",
  120: "120s",
  180: "180s",
};

export default function TimeSelector({
  time,
  setTime,
  resetTest,
  isTestActive,
}: TimeSelectorProps) {
  return (
    <div className="flex justify-center">
      <div className="flex gap-4 bg-[#1d2633] px-6 py-3 rounded-xl shadow-sm border border-white/5">
        {[15, 30, 60, 120, 180].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTime(t as TimeOption);
              resetTest();
            }}
            disabled={isTestActive}
            className={`
              px-4 py-2 rounded-md text-sm transition font-medium
              ${
                time === t
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
  );
}