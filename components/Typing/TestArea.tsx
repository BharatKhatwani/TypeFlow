"use client";

export default function TestArea({
  generatedWords,
  getCharClass,
  handleKeyDown,
  inputValue,
  currentWordIndex,
  currentCharIndex,
  userInputs,
  inputRef,
  timeLeft,
  testEnded,
}: any) {
  return (
    <div className="mt-10 w-full flex justify-center">
      <div
        ref={inputRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`w-full max-w-4xl bg-[#1d2633] border border-white/10 rounded-xl px-8 py-10 
                    shadow-sm cursor-text ${
                      timeLeft === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
      >
        <div className="flex flex-wrap gap-3 leading-relaxed select-none">
          {generatedWords.map((word: string, wordIndex: number) => (
            <div key={wordIndex} className="inline-flex">
              {word.split("").map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={`text-2xl tracking-wide ${getCharClass(
                    wordIndex,
                    charIndex,
                    char
                  )}`}
                >
                  {char}
                </span>
              ))}

              {/* Extra characters typed */}
              {wordIndex === currentWordIndex &&
                inputValue.length > word.length &&
                inputValue
                  .slice(word.length)
                  .split("")
                  .map((c: string, idx: number) => (
                    <span key={idx} className="text-2xl text-red-400">
                      {c}
                    </span>
                  ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
