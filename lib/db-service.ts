// lib/db-service.ts
import clientPromise from "@/lib/mongodb";
import { UserStats, TypingTest, DailyActivity } from "@/types/typing";

export class TypingDBService {
  private static async getDb() {
    const client = await clientPromise;
    return client.db();
  }

  // ==================== USER STATS ====================
  
  static async getUserStats(userId: string): Promise<UserStats | null> {
    const db = await this.getDb();
    return await db.collection<UserStats>("userStats").findOne({ userId });
  }

  static async initializeUserStats(userId: string): Promise<UserStats> {
    const db = await this.getDb();
    const initialStats: UserStats = {
      userId,
      bestSpeed: 0,
      bestAccuracy: 0,
      currentStreak: 0,
      longestStreak: 0,
      averageSpeed: 0,
      averageAccuracy: 0,
      testsCompleted: 0,
      totalTime: 0,
      totalWordsTyped: 0,
      lastTestDate: new Date(),
      lastStreakDate: new Date(),
    };

    await db.collection("userStats").insertOne(initialStats);
    return initialStats;
  }

  static async updateUserStats(
    userId: string,
    testResult: Partial<TypingTest>
  ): Promise<void> {
    const db = await this.getDb();
    const stats = await this.getUserStats(userId);

    if (!stats) {
      await this.initializeUserStats(userId);
      return;
    }

    // Calculate new averages
    const newTestsCompleted = stats.testsCompleted + 1;
    const newAverageSpeed =
      (stats.averageSpeed * stats.testsCompleted + (testResult.wpm || 0)) /
      newTestsCompleted;
    const newAverageAccuracy =
      (stats.averageAccuracy * stats.testsCompleted + (testResult.accuracy || 0)) /
      newTestsCompleted;

    // Update streak
    const today = new Date().toDateString();
    const lastTest = new Date(stats.lastTestDate).toDateString();
    const isConsecutive = this.isConsecutiveDay(stats.lastTestDate);

    const newStreak = isConsecutive ? stats.currentStreak + 1 : 1;
    const newLongestStreak = Math.max(newStreak, stats.longestStreak);

    await db.collection("userStats").updateOne(
      { userId },
      {
        $set: {
          bestSpeed: Math.max(stats.bestSpeed, testResult.wpm || 0),
          bestAccuracy: Math.max(stats.bestAccuracy, testResult.accuracy || 0),
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          averageSpeed: newAverageSpeed,
          averageAccuracy: newAverageAccuracy,
          testsCompleted: newTestsCompleted,
          totalTime: stats.totalTime + (testResult.duration || 0),
          totalWordsTyped:
            stats.totalWordsTyped + (testResult.correctChars || 0) / 5, // avg word = 5 chars
          lastTestDate: new Date(),
          lastStreakDate: today !== lastTest ? new Date() : stats.lastStreakDate,
        },
      }
    );
  }

  // ==================== TYPING TESTS ====================

  static async saveTypingTest(test: Omit<TypingTest, "_id">): Promise<string> {
    const db = await this.getDb();
    const result = await db.collection("typingTests").insertOne({
      ...test,
      completedAt: new Date(),
    });

    // Update user stats after saving test
    await this.updateUserStats(test.userId, test);

    return result.insertedId.toString();
  }

  static async getUserTests(
    userId: string,
    limit: number = 50
  ): Promise<TypingTest[]> {
    const db = await this.getDb();
    return await db
      .collection<TypingTest>("typingTests")
      .find({ userId })
      .sort({ completedAt: -1 })
      .limit(limit)
      .toArray();
  }

  static async getTestById(testId: string): Promise<TypingTest | null> {
    const db = await this.getDb();
    const { ObjectId } = require("mongodb");
    return await db
      .collection<TypingTest>("typingTests")
      .findOne({ _id: new ObjectId(testId) });
  }

  // ==================== DAILY ACTIVITY ====================

  static async updateDailyActivity(
    userId: string,
    testResult: Partial<TypingTest>
  ): Promise<void> {
    const db = await this.getDb();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const existing = await db
      .collection<DailyActivity>("dailyActivity")
      .findOne({ userId, date: today });

    if (existing) {
      // Update existing day
      const newTestsCount = existing.testsCompleted + 1;
      const newAvgWpm =
        (existing.averageWpm * existing.testsCompleted + (testResult.wpm || 0)) /
        newTestsCount;
      const newAvgAccuracy =
        (existing.averageAccuracy * existing.testsCompleted +
          (testResult.accuracy || 0)) /
        newTestsCount;

      await db.collection("dailyActivity").updateOne(
        { userId, date: today },
        {
          $set: {
            testsCompleted: newTestsCount,
            totalTime: existing.totalTime + (testResult.duration || 0),
            bestWpm: Math.max(existing.bestWpm, testResult.wpm || 0),
            averageWpm: newAvgWpm,
            averageAccuracy: newAvgAccuracy,
          },
        }
      );
    } else {
      // Create new day
      await db.collection("dailyActivity").insertOne({
        userId,
        date: today,
        testsCompleted: 1,
        totalTime: testResult.duration || 0,
        bestWpm: testResult.wpm || 0,
        averageWpm: testResult.wpm || 0,
        averageAccuracy: testResult.accuracy || 0,
      });
    }
  }

  static async getDailyActivity(
    userId: string,
    days: number = 365
  ): Promise<DailyActivity[]> {
    const db = await this.getDb();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await db
      .collection<DailyActivity>("dailyActivity")
      .find({
        userId,
        date: { $gte: startDate.toISOString().split("T")[0] },
      })
      .sort({ date: 1 })
      .toArray();
  }

  // ==================== HELPER FUNCTIONS ====================

  private static isConsecutiveDay(lastDate: Date): boolean {
    const today = new Date();
    const last = new Date(lastDate);
    
    // Reset time to midnight for accurate day comparison
    today.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - last.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays === 1 || diffDays === 0;
  }
}