
import { ObjectId } from "mongodb";
export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  joinedDate: Date;
  avatar?: string;
}

export interface UserStats {
  userId: string;


  bestByDuration: {
    15: {
      wpm: number;
      accuracy: number;
    };
    30: {
      wpm: number;
      accuracy: number;
    };
    60: {
      wpm: number;
      accuracy: number;
    };
    120: {
      wpm: number;
      accuracy: number;
    };
    180: {
      wpm: number;
      accuracy: number;
    }
  }



  // Totals
  currentStreak: number;
  longestStreak: number;

  // Totals (still useful)
  testsCompleted: number;
  totalTime: number; // seconds
  totalWordsTyped: number;

  // Dates
  lastTestDate: Date;
  lastStreakDate: Date;
}



export interface TypingTest {
  _id?: ObjectId;

  userId: string;

  wpm: number;
  accuracy: number;
  rawWpm?: number;

  duration: number;

  mode?: string;
  language?: string;
  textContent?: string;

  errors?: number;
  correctChars?: number;
  incorrectChars?: number;

  completedAt: Date; // DB controlled
}

export interface DailyActivity {
  userId: string;
  date: string; // YYYY-MM-DD format
  testsCompleted: number;
  totalTime: number; // in seconds
  bestWpm: number;

}

// MongoDB Collections Structure
export const collections = {
  users: "users", // Handled by Better Auth
  userStats: "userStats",
  typingTests: "typingTests",
  dailyActivity: "dailyActivity",
};


export interface TypingTestInput{
    duration : number , 
    wpm : number , 
  accuracy : number , 
    wordsTyped: number;
  timeTaken: number;
  testDate?: Date;
}
export interface LeaderboardEntry {
  userId: string;
  wpm: number;
  accuracy: number;
  testsCompleted: number;
  name?: string;
  image?: string;
  email?: string;
}
export interface TypingTest {
  _id?: ObjectId;
  userId: string;
  duration: number;
  wpm: number;
  accuracy: number;
  wordsTyped: number;
  timeTaken: number;
  completedAt: Date;
  testDate: Date;
}
