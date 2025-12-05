"use client";

import Navbar from "@/components/Navbar";
import React from "react";
import { words } from "@/lib/words";

type TimeOption = 15 | 30 | 60 | 120 | 180;

export default function Page() {
  const [time, setTime] = React.useState<TimeOption | null>(60);
  const [generatedWords, setGeneratedWords] = React.useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentCharIndex, setCurrentCharIndex] = React.useState(0);
  const [inputValue, setInputValue] = React.useState("");


  const timeDisplay: Record<TimeOption, string> = {
    15: "15s",
    30: "30s",
    60: "60s",
    120: "120s",
    180: "180s",
  };

  // Generate 45 random words
  React.useEffect(() => {
    let arr: string[] = [];
    for (let i = 0; i < 60; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      arr.push(words[randomIndex]);
    }
    setGeneratedWords(arr);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <Navbar />

      <div className="py-6">
        <div className="text-center">

          {/* TIME SELECTOR */}
          <div className="flex justify-center">
            <div className="flex gap-4 bg-[#1d2633] px-6 py-3 rounded-xl shadow-sm border border-white/5">
              {[15, 30, 60, 120, 180].map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`
                    px-4 py-2 rounded-md text-sm transition font-medium
                    ${
                      time === t
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {timeDisplay[t]}
                </button>
              ))}
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="mt-10 flex justify-center gap-6">
            <div className="w-60 h-28 bg-[#1d2633] border border-white/10 rounded-xl 
                            flex flex-col items-center justify-center shadow-sm">
              <h1 className="text-white text-2xl py-2 font-bold">WPM</h1>
              <p className="text-gray-400 text-sm">0</p>
            </div>

            <div className="w-60 h-28 bg-[#1d2633] border border-white/10 rounded-xl 
                            flex flex-col items-center justify-center shadow-sm">
              <h1 className="text-white text-2xl py-2 font-bold">Accuracy</h1>
              <p className="text-gray-400 text-sm">0%</p>
            </div>

            <div className="w-60 h-28 bg-[#1d2633] border border-white/10 rounded-xl 
                            flex flex-col items-center justify-center shadow-sm">
              <h1 className="text-white text-2xl py-2 font-bold">Timer</h1>
              <p className="text-gray-400 text-sm">
                {time !== null ? timeDisplay[time] : "--"}
              </p>
            </div>
          </div>

          {/* GENERATED WORDS */}
       {/* GENERATED WORDS SECTION */}
<div className="mt-10 w-full flex justify-center">
  <div className="w-full max-w-4xl bg-gray-700 border border-white/10 rounded-xl 
                  px-6 py-8 shadow-sm"
                  tabIndex={0}
                  onKeyDown={(e) =>{
                     if (e.key.length === 1) {
        setInputValue((prev) => prev + e.key);
        setCurrentCharIndex((prev) => prev + 1);
      }
        if (e.key === "Backspace") {
        setInputValue((prev) => prev.slice(0, -1));
        setCurrentCharIndex((prev) => Math.max(prev - 1, 0));
      }
       if (e.key === " ") {
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
        setInputValue("");
      }


                  }}
                  
                  >

    <div className="flex flex-wrap gap-3 text-left leading-relaxed select-none">
      {generatedWords.map((word, index) => (
        <span
          key={index}
          className="text-gray-300 text-2xl tracking-wide"
        >
          {word}
        </span>
      ))}
    </div>

  </div>
</div>

       

        </div>
      </div>
    </div>
  );
}
