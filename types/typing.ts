// types/typing.ts - TypeScript types for your app

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  joinedDate: Date;
  avatar?: string;
}

export interface UserStats {
  userId: string;
  // Current Records
  bestSpeed: number; // WPM
  bestAccuracy: number; // percentage
  currentStreak: number; // days
  longestStreak: number; // days
  
  // Overall Averages
  averageSpeed: number; // WPM
  averageAccuracy: number; // percentage
  
  // Totals
  testsCompleted: number;
  totalTime: number; // in seconds
  totalWordsTyped: number;
  
  // Last Updated
  lastTestDate: Date;
  lastStreakDate: Date;
}

export interface TypingTest {
  _id: string;
  userId: string;
  
  // Test Results
  wpm: number;
  accuracy: number;
  rawWpm: number;
  
  // Test Details
  duration: number; // in seconds (15, 30, 60, 120)
  mode: "words" | "time" | "quote" | "custom";
  language: string; // "english", "spanish", etc.
  
  // Content
  textContent: string; // what they typed
  errors: number;
  correctChars: number;
  incorrectChars: number;
  
  // Metadata
  completedAt: Date;
  deviceType?: "desktop" | "mobile" | "tablet";
}

export interface DailyActivity {
  userId: string;
  date: string; // YYYY-MM-DD format
  testsCompleted: number;
  totalTime: number; // in seconds
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
}

// MongoDB Collections Structure
export const collections = {
  users: "users", // Handled by Better Auth
  userStats: "userStats",
  typingTests: "typingTests",
  dailyActivity: "dailyActivity",
};