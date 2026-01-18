import { DBService } from "./db-service";
import { UserStats } from "@/types/typing";
import { UpdateFilter } from "mongodb";

export type TestResult = {
  duration: 15 | 30 | 60 | 120 | 180;
  wpm: number;
  accuracy: number;
  wordsTyped: number;
  timeTaken: number;
  testDate: Date;
};

export async function handleTestFinish(
  userId: string,
  test: TestResult
): Promise<UserStats | null> {

  // 1️⃣ Ensure stats exist
  let stats = await DBService.getUserStats(userId);

  if (!stats) {
    await DBService.initializeUserStats(userId);
    stats = await DBService.getUserStats(userId);
    if (!stats) throw new Error("Failed to initialize user stats");
  }

  // 2️⃣ ----- BEST BY DURATION -----
  const durationKey = test.duration;
  const prevBest = stats.bestByDuration[durationKey];

  const shouldUpdateBest =
    test.wpm > prevBest.wpm ||
    (test.wpm === prevBest.wpm && test.accuracy > prevBest.accuracy);

  // 3️⃣ ----- TOTALS -----
  const testsCompleted = stats.testsCompleted + 1;
  const totalTime = stats.totalTime + test.timeTaken;
  const totalWordsTyped = stats.totalWordsTyped + test.wordsTyped;

  // 4️⃣ ----- STREAK LOGIC -----
  const lastDate = new Date(stats.lastStreakDate);
  lastDate.setHours(0, 0, 0, 0);

  const today = new Date(test.testDate);
  today.setHours(0, 0, 0, 0);

  const diffDays =
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

  let currentStreak = stats.currentStreak;

  if (stats.currentStreak === 0) {
    currentStreak = 1;
  } else if (diffDays === 1) {
    currentStreak += 1;
  } else if (diffDays > 1) {
    currentStreak = 1;
  }

  const longestStreak = Math.max(stats.longestStreak, currentStreak);

  // 5️⃣ ----- BUILD SAFE UPDATE QUERY -----
  const updateQuery: UpdateFilter<UserStats> = {
    $set: {
      testsCompleted,
      totalTime,
      totalWordsTyped,
      lastTestDate: test.testDate,
      lastStreakDate: today,
      currentStreak,
      longestStreak,
    },
  };

  if (shouldUpdateBest) {
    if (!updateQuery.$set) {
      updateQuery.$set = {};
    }
    (updateQuery.$set as Record<string, unknown>)[`bestByDuration.${durationKey}`] = {
      wpm: test.wpm,
      accuracy: test.accuracy,
    };
  }

  // 6️⃣ Persist + return updated stats
  await DBService.addTypingTest(userId, test); // Save individual test record
  return DBService.updateUserStats(userId, updateQuery);
}


export async function DailyActivity(userId: string) {
  const stats = await DBService.getUserStats(userId);
  if (!stats) throw new Error("User stats not found");

  return {
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    testsCompleted: stats.testsCompleted,
    totalTime: stats.totalTime,
    totalWordsTyped: stats.totalWordsTyped,
    bestByDuration: stats.bestByDuration,
  };
}
