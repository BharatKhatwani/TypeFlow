export default function getCharClass(
  wordIndex: number,
  charIndex: number,
  char: string,
  currentWordIndex: number,
  inputValue: string,
  currentCharIndex: number,
  userInputs: string[]
) {
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
}
