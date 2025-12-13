import React from "react";

interface TypingAreaProps {
  generatedWords: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  inputValue: string;
  userInputs: string[];
  timeLeft: number;
  testEnded: boolean;
  inputRef: React.RefObject<HTMLDivElement>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export default function TypingArea({
  generatedWords,
  currentWordIndex,
  currentCharIndex,
  inputValue,
  userInputs,
  timeLeft,
  testEnded,
  inputRef,
  handleKeyDown,
}: TypingAreaProps) {
  const getCharClass = (wordIndex: number, charIndex: number, char: string) => {
    if (wordIndex < currentWordIndex) {
      const userInput = userInputs[wordIndex];
      if (charIndex < userInput.length) {
        return userInput[charIndex] === char ? "text-green-400" : "text-red-400";
      }
      return "text-gray-500";
    }

    if (wordIndex === currentWordIndex) {
      if (charIndex < inputValue.length) {
        return inputValue[charIndex] === char ? "text-green-400" : "text-red-400";
      }

      if (charIndex === currentCharIndex) {
        return "relative text-white cursor-mt";
      }

      return "text-gray-400";
    }

    return "text-gray-500";
  };

  return (
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
  );
}