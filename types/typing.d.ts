export type TimeOption = 15 | 30 | 60 | 120 | 180;

export interface TypingState {
    time: TimeOption;
    generatedWords: string[];
    currentWordIndex: number;
    currentCharIndex: number;
    inputValue: string;
    isTestActive: boolean;
    timeLeft: number;
    correctChars: number;
    totalChars: number;
    userInputs: string[];
    testEnded: boolean;
    showGraph: boolean;
    wpmHistory: { second: number; wpm: number }[];
}

export interface TypingStats {
    wpm: number;
    accuracy: number;
}

