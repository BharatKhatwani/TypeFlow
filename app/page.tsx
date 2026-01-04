"use client";

import Navbar from "@/components/Navbar";
import React from "react";
import { RiResetLeftFill } from "react-icons/ri";
import { TypingHeader } from "@/components/Typing/TypingHeader";
import { useTypingTest } from "@/hook/useTypingTest";
import { TestArea } from "@/components/Typing/TestArea";
import { Results } from "@/components/Typing/Results";

export default function Page() {
  const {
    time,
    setTime,
    generatedWords,
    currentWordIndex,
    currentCharIndex,
    inputValue,
    isTestActive,
    timeLeft,
    userInputs,
    inputRef,
    testEnded,
    wpmHistory,
    calculateWPM,
    calculateAccuracy,
    handleKeyDown,
    resetTest,
  } = useTypingTest();

  return (
    <div className="max-w-6xl font-mono mx-auto px-4">
      <Navbar />

      <div className="py-6">
        <div className="text-center">
          {testEnded ? (
            <Results
              wpmHistory={wpmHistory}
              wpm={calculateWPM()}
              accuracy={calculateAccuracy()}
              resetTest={resetTest}
            />
          ) : (
            <>
              {/* STAT CARDS */}
              <TypingHeader
                time={time}
                timeLeft={timeLeft}
                isTestActive={isTestActive}
                wpm={calculateWPM()}
                accuracy={calculateAccuracy()}
                onTimeChange={(t) => {
                  setTime(t);
                  resetTest();
                }}
              />

              {/* TYPING AREA */}
              <TestArea
                inputRef={inputRef}
                timeLeft={timeLeft}
                testEnded={testEnded}
                handleKeyDown={handleKeyDown}
                generatedWords={generatedWords}
                userInputs={userInputs}
                currentWordIndex={currentWordIndex}
                inputValue={inputValue}
                currentCharIndex={currentCharIndex}
              />

              {/* RESET BUTTON */}
              <div className="mt-8 flex justify-center">
                <button
                  suppressHydrationWarning
                  onClick={resetTest}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg 
                           transition font-medium shadow-sm flex items-center gap-2"
                >
                  <RiResetLeftFill className="text-xl" />
                  Reset Test
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
