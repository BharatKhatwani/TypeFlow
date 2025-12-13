import React from "react";
import { words } from "@/lib/words";

type TimeOption = 15 | 30 | 60 | 120 | 180;

export function useTypingTest(initialTime: TimeOption = 60) {
  const [time, setTime] = React.useState<TimeOption>(initialTime);
  const [generatedWords, setGeneratedWords] = React.useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = React.useState(0);
  const [currentCharIndex, setCurrentCharIndex] = React.useState(0);
  const [inputValue, setInputValue] = React.useState("");
  const [isTestActive, setIsTestActive] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<number>(initialTime);
  const [correctChars, setCorrectChars] = React.useState(0);
  const [totalChars, setTotalChars] = React.useState(0);
  const [userInputs, setUserInputs] = React.useState<string[]>([]);
  const [testEnded, setTestEnded] = React.useState(false);
  const [wpmHistory, setWpmHistory] = React.useState<
    { second: number; wpm: number }[]
  >([]);
  const inputRef = React.useRef<HTMLDivElement>(null);

  // Generate random words
  const generateWords = React.useCallback(() => {
    let arr: string[] = [];
    for (let i = 0; i < 60; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      arr.push(words[randomIndex]);
    }
    setGeneratedWords(arr);
    setUserInputs(new Array(60).fill(""));
  }, []);

  // Initialize words on mount
  React.useEffect(() => {
    generateWords();
  }, [generateWords]);

  // Calculate WPM
  const calculateWPM = React.useCallback(() => {
    if (testEnded) {
      const timeElapsed = time / 60;
      if (timeElapsed === 0 || correctChars === 0) return 0;
      return Math.round((correctChars / 5) / timeElapsed);
    }
    
    if (isTestActive && timeLeft > 0) {
      const timeElapsed = (time - timeLeft) / 60;
      if (timeElapsed === 0) return 0;
      return Math.round((correctChars / 5) / timeElapsed);
    }
    
    return 0;
  }, [testEnded, time, correctChars, isTestActive, timeLeft]);

  // Calculate Accuracy
  const calculateAccuracy = React.useCallback(() => {
    if (totalChars === 0) return 0;
    return Math.round((correctChars / totalChars) * 100);
  }, [correctChars, totalChars]);

  // Timer countdown with WPM tracking
  React.useEffect(() => {
    if (isTestActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        const updatedTimeLeft = timeLeft - 1;  
        setTimeLeft(updatedTimeLeft);

        const second = time - updatedTimeLeft;
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
  }, [isTestActive, timeLeft, time, calculateWPM]);

  // Update time left when time option changes
  React.useEffect(() => {
    if (!isTestActive) {
      setTimeLeft(time);
    }
  }, [time, isTestActive]);

  // Handle key press
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (timeLeft === 0 || testEnded) {
      e.preventDefault();
      return;
    }

    if (!isTestActive && timeLeft > 0 && !testEnded) {
      setIsTestActive(true);
      setTimeLeft(time);
    }

    const currentWord = generatedWords[currentWordIndex];

    if (e.key.length === 1 && e.key !== " ") {
      const newInput = inputValue + e.key;
      setInputValue(newInput);

      const newUserInputs = [...userInputs];
      newUserInputs[currentWordIndex] = newInput;
      setUserInputs(newUserInputs);

      setTotalChars(prev => prev + 1);

      if (currentCharIndex < currentWord.length && e.key === currentWord[currentCharIndex]) {
        setCorrectChars(prev => prev + 1);
      }

      setCurrentCharIndex(prev => prev + 1);
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (inputValue.length > 0) {
        const newInput = inputValue.slice(0, -1);
        setInputValue(newInput);

        const newUserInputs = [...userInputs];
        newUserInputs[currentWordIndex] = newInput;
        setUserInputs(newUserInputs);

        setCurrentCharIndex(prev => Math.max(prev - 1, 0));
      }
    }

    if (e.key === " ") {
      e.preventDefault();
      if (inputValue.length > 0 && currentWordIndex < generatedWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setCurrentCharIndex(0);
        setInputValue("");
        setTotalChars(prev => prev + 1);
        setCorrectChars(prev => prev + 1);
      }
    }
  }, [timeLeft, testEnded, isTestActive, time, generatedWords, currentWordIndex, inputValue, userInputs, currentCharIndex]);

  // Reset test
  const resetTest = React.useCallback(() => {
    setIsTestActive(false);
    setTimeLeft(time);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setInputValue("");
    setCorrectChars(0);
    setTotalChars(0);
    setTestEnded(false);
    setWpmHistory([]);
    generateWords();
    inputRef.current?.focus();
  }, [time, generateWords]);

  return {
    time,
    setTime,
    generatedWords,
    currentWordIndex,
    currentCharIndex,
    inputValue,
    isTestActive,
    timeLeft,
    userInputs,
    testEnded,
    wpmHistory,
    inputRef,
    calculateWPM,
    calculateAccuracy,
    handleKeyDown,
    resetTest,
  };
}