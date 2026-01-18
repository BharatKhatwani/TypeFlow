import getCharClass from "./getCharClass";

interface TestAreaProps {
  generatedWords: string[];

  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;

  inputValue: string;

  currentWordIndex: number;
  currentCharIndex: number;

  userInputs: string[];

  timeLeft: number;

  inputRef: React.RefObject<HTMLDivElement | null>;

  testEnded: boolean;
}

export function TestArea({
  generatedWords,
  handleKeyDown,
  inputValue,
  currentWordIndex,
  currentCharIndex,
  userInputs,
  inputRef,
  timeLeft,
  testEnded,
}: TestAreaProps) {

  return (
    <div className="mt-10 w-full flex justify-center">
      <div
        ref={inputRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`w-full max-w-5xl input-area outline-none
                    bg-[#161b22] border border-white/5 rounded-2xl px-10 py-12 
                    cursor-text transition-all duration-300
                    ${timeLeft === 0 ? "opacity-50 grayscale cursor-not-allowed" : "hover:border-white/10"}`}
      >
        <div className="flex flex-wrap gap-x-3 gap-y-4 leading-relaxed select-none font-mono text-2xl">
          {generatedWords.map((word: string, wordIndex: number) => {
            const isCurrentWord = wordIndex === currentWordIndex;

            return (
              <div
                key={wordIndex}
                className={`relative inline-flex transition-colors duration-200 
                  ${isCurrentWord ? ' rounded-lg px-2 -mx-2' : ''}`}
              >
                {word.split("").map((char, charIndex) => {
                  const isCurrentChar = isCurrentWord && charIndex === currentCharIndex;
                  const charClass = getCharClass(
                    wordIndex,
                    charIndex,
                    char,
                    currentWordIndex,
                    inputValue,
                    currentCharIndex,
                    userInputs
                  );

                  return (
                    <span
                      key={charIndex}
                      className={`relative ${charClass} ${isCurrentChar
                        ? "after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-[2px] after:bg-orange-500 after:animate-blink"
                        : ""
                        }`}
                    >
                      {char}
                    </span>
                  );
                })}

                {/* Extra characters typed */}
                {isCurrentWord &&
                  inputValue.length > word.length &&
                  inputValue
                    .slice(word.length)
                    .split("")
                    .map((c: string, idx: number) => (
                      <span key={idx} className="text-red-400 opacity-80">
                        {c}
                      </span>
                    ))}
              </div>
            );
          })}
        </div>



        {/* Helper text or Overlay when not focused could go here */}
        {!testEnded && timeLeft > 0 && (
          <div className="absolute top-4 right-6 text-xs text-white/20 font-sans">
            Click to focus
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .after\\:animate-blink::after {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
}
