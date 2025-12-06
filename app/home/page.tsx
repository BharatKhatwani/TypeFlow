"use client";

import Navbar from "@/components/Navbar";
import React from "react";
import { words } from "@/lib/words";
import { RiResetLeftFill } from "react-icons/ri";
import WPMGraph from "@/components/WPMGraph";

type TimeOption = 15 | 30 | 60 | 120 | 180;

export default function Page() {
  const [time, setTime] = React.useState<TimeOption>(60);
  const [generatedWords, setGeneratedWords] = React.useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentCharIndex, setCurrentCharIndex] = React.useState(0);
  const [inputValue, setInputValue] = React.useState("");
  const [isTestActive, setIsTestActive] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<number>(60);
  const [correctChars, setCorrectChars] = React.useState(0);
  const [totalChars, setTotalChars] = React.useState(0);
  const [userInputs, setUserInputs] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLDivElement>(null);
  const [testEnded, setTestEnded] = React.useState(false);
  // const [storedWPM , setStoredWPM] = React.useState<number | null>(null);
 const [wpmHistory, setWpmHistory] = React.useState<
  { second: number; wpm: number }[]
>([]);


  const timeDisplay: Record<TimeOption, string> = {
    15: "15s",
    30: "30s",
    60: "60s",
    120: "120s",
    180: "180s",
  };

  // Generate random words on mount
  React.useEffect(() => {
    generateWords();
  }, []);

  const generateWords = () => {
    let arr: string[] = [];
    for (let i = 0; i < 60; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      arr.push(words[randomIndex]);
    }
    setGeneratedWords(arr);
    setUserInputs(new Array(60).fill(""));
  };

// Timer countdown
React.useEffect(() => {
  if (isTestActive && timeLeft > 0) {
    const timer = setTimeout(() => {

      const updatedTimeLeft = timeLeft - 1;  
      setTimeLeft(updatedTimeLeft);

      const second = time - updatedTimeLeft;   // FIXED

      const currentWPM = calculateWPM();

      setWpmHistory((prevHistory) => [
        ...prevHistory,
        { second, wpm: currentWPM },
      ]);

    }, 1000);

    return () => clearTimeout(timer);

  } else if (timeLeft === 0 && isTestActive) {
    setIsTestActive(false);
    setTestEnded(true);
  }
}, [isTestActive, timeLeft]);


  // Update time left when time option changes
  React.useEffect(() => {
    if (!isTestActive) {
      setTimeLeft(time);
    }
  }, [time, isTestActive]);

  // Calculate WPM
  const calculateWPM = () => {
    // If test has ended, use the full time duration to show final WPM
    if (testEnded) {
      const timeElapsed = time / 60; // in minutes
      if (timeElapsed === 0 || correctChars === 0) return 0;
      return Math.round((correctChars / 5) / timeElapsed);
    }
    
    // If test is active, use elapsed time
    if (isTestActive && timeLeft > 0) {
      const timeElapsed = (time - timeLeft) / 60; // in minutes
      if (timeElapsed === 0) return 0;
      return Math.round((correctChars / 5) / timeElapsed);
    }
    
    // Test hasn't started yet
    return 0;
  };

  // Calculate Accuracy
  const calculateAccuracy = () => {
    if (totalChars === 0) return 0;
    return Math.round((correctChars / totalChars) * 100);
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // CRITICAL: Block ALL input when timer is 0 or test has ended - don't restart test!
    if (timeLeft === 0 || testEnded) {
      e.preventDefault();
      return; // Stop here - don't execute any code below
    }

    // Start test ONLY on first key press AND timer is not 0 AND test hasn't ended
    if (!isTestActive && timeLeft > 0 && !testEnded) {
      setIsTestActive(true);
      setTimeLeft(time);
    }

    const currentWord = generatedWords[currentWordIndex];

    // Handle regular character input (NOT space or backspace)
    if (e.key.length === 1 && e.key !== " ") {
      const newInput = inputValue + e.key;
      setInputValue(newInput);

      // Update user inputs array
      const newUserInputs = [...userInputs];
      newUserInputs[currentWordIndex] = newInput;
      setUserInputs(newUserInputs);

      setTotalChars(totalChars + 1);

      // Check if character is correct
      if (currentCharIndex < currentWord.length && e.key === currentWord[currentCharIndex]) {
        setCorrectChars(correctChars + 1);
      }

      setCurrentCharIndex(currentCharIndex + 1);
    }

    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault();
      if (inputValue.length > 0) {
        const newInput = inputValue.slice(0, -1);
        setInputValue(newInput);

        const newUserInputs = [...userInputs];
        newUserInputs[currentWordIndex] = newInput;
        setUserInputs(newUserInputs);

        setCurrentCharIndex(Math.max(currentCharIndex - 1, 0));
      }
    }

    // Handle space (move to next word)
    if (e.key === " ") {
      e.preventDefault();
      if (inputValue.length > 0 && currentWordIndex < generatedWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setCurrentCharIndex(0);
        setInputValue("");
        setTotalChars(totalChars + 1); // Count space as a character
        setCorrectChars(correctChars + 1); // Assume space is correct
      }
    }
  };

  // Get character class for styling
const getCharClass = (wordIndex: number, charIndex: number, char: string) => {
  if (wordIndex < currentWordIndex) {
    const userInput = userInputs[wordIndex];
    if (charIndex < userInput.length) {
      return userInput[charIndex] === char ? "text-green-400" : "text-red-400";
    }
    return "text-gray-500"; // Missed characters
  }

  if (wordIndex === currentWordIndex) {
    if (charIndex < inputValue.length) {
      return inputValue[charIndex] === char ? "text-green-400" : "text-red-400";
    }

    if (charIndex === currentCharIndex) {
      return "relative text-white cursor-mt"; // Monkeytype cursor
    }

    return "text-gray-400";
  }

  return "text-gray-500"; // Future words
};


  // Reset test
  const resetTest = () => {
    setIsTestActive(false);
    setTimeLeft(time);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setInputValue("");
    setCorrectChars(0);
    setTotalChars(0);
    setTestEnded(false);
    generateWords();
    inputRef.current?.focus();
  };

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

          {/* STAT CARDS */}
          <div className="mt-10 flex justify-center gap-6">
            <div className="w-60 h-28 bg-[#1d2633] border border-white/10 rounded-xl 
                            flex flex-col items-center justify-center shadow-sm">
              <h1 className="text-white text-2xl py-2 font-bold">WPM</h1>
              <p className="text-orange-400 text-xl font-semibold">{calculateWPM()}</p>
            </div>

            <div className="w-60 h-28 bg-[#1d2633] border border-white/10 rounded-xl 
                            flex flex-col items-center justify-center shadow-sm">
              <h1 className="text-white text-2xl py-2 font-bold">Accuracy</h1>
              <p className="text-orange-400 text-xl font-semibold">{calculateAccuracy()}%</p>
            </div>

            <div className="w-60 h-28 bg-[#1d2633] border border-white/10 rounded-xl 
                            flex flex-col items-center justify-center shadow-sm">
              <h1 className="text-white text-2xl py-2 font-bold">{timeLeft}s</h1>
              <p className="text-orange-400 text-sm">
                {time !== null ? timeDisplay[time] : "--"}
              </p>
            </div>
          </div>

          {/* TYPING AREA */}
          <div className="mt-10 w-full flex justify-center">
            <div
              ref={inputRef}
              className={`w-full max-w-4xl bg border border-white/10 rounded-xl 
                        px-8 py-10 shadow-sm cursor-text transition-opacity
                        ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              tabIndex={0}
              onClick={() => {
                if (timeLeft > 0 && !testEnded) {
                  inputRef.current?.focus();
                }
              }}
              onKeyDown={handleKeyDown}
            >
              <div className="flex flex-wrap gap-3 text-left leading-relaxed select-none">
                {generatedWords.map((word, wordIndex) => (
                  <div key={wordIndex} className="inline-flex">
                    {word.split("").map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className={`text-2xl tracking-wide transition-colors ${getCharClass(
                          wordIndex,
                          charIndex,
                          char
                        )}`}
                      >
                        {char}
                      </span>
                    ))}
                    {/* Show extra characters typed */}
                    {wordIndex === currentWordIndex &&
                      inputValue.length > word.length &&
                      inputValue
                        .slice(word.length)
                        .split("")
                        .map((char, idx) => (
                          <span key={`extra-${idx}`} className="text-2xl text-red-400">
                            {char}
                          </span>
                        ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RESET BUTTON */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={resetTest}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg 
                       transition font-medium shadow-sm flex items-center gap-2"
            >
              <RiResetLeftFill className="text-xl" />
              Reset Test
            </button>
          </div>

          {/* Resukt*/}
       {testEnded && (
  <div className="mt-10">
    <WPMGraph data={wpmHistory} />
  </div>
)}

      
        </div>
      </div>
    </div>
  );
}