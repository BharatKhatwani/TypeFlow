// @/lib/db-service.ts
import clientPromise from "@/lib/mongodb";
import { UserStats } from "@/types/typing";
import { UpdateFilter } from "mongodb";

export class DBService {
  private static async getDb() {
    const client = await clientPromise;
    return client.db();
  }

  static async initializeUserStats(userId: string): Promise<void> {
    try {
      const db = await this.getDb();
      const userStatsCollection = db.collection<UserStats>("userStats");

      const existingStats = await userStatsCollection.findOne({ userId });

      if (existingStats) return;

      const initialStats: UserStats = {
        userId,

        bestByDuration: {
          15: { wpm: 0, accuracy: 0 },
          30: { wpm: 0, accuracy: 0 },
          60: { wpm: 0, accuracy: 0 },
          120: { wpm: 0, accuracy: 0 },
          180: { wpm: 0, accuracy: 0 },
        },

        currentStreak: 0,
        longestStreak: 0,

        testsCompleted: 0,
        totalTime: 0,
        totalWordsTyped: 0,

        lastTestDate: new Date(0),
        lastStreakDate: new Date(0),
      };

      await userStatsCollection.insertOne(initialStats);
    } catch (error) {
      console.error("Failed to initialize user stats:", error);
      throw error;
    }
  }

  static async addTypingTest(userId: string, testData: any): Promise<void> {
    try {
      const db = await this.getDb();
      const typingTestsCollection = db.collection("typingTests");

      await typingTestsCollection.insertOne({
        userId,
        ...testData,
        completedAt: new Date(), // Ensure consistent timestamp
        testDate: testData.testDate || new Date() // Support both naming conventions if needed
      });
    } catch (error) {
      console.error("Failed to add typing test:", error);
      throw error;
    }
  }

  static async updateUserStats(
    userId: string,
    updateQuery: UpdateFilter<UserStats>
  ): Promise<UserStats | null> {
    try {
      const db = await this.getDb();
      const userStatsCollection = db.collection<UserStats>("userStats");

      const result = await userStatsCollection.findOneAndUpdate(
        { userId },
        updateQuery,
        { returnDocument: "after" }
      );

      return result || null;
    } catch (error) {
      console.error("Failed to update user stats:", error);
      throw error;
    }
  }

  static async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      const db = await this.getDb();
      const userStatsCollection = db.collection<UserStats>("userStats");

      const stats = await userStatsCollection.findOne({ userId });
      return stats;
    } catch (error) {
      console.error("Failed to get user stats:", error);
      throw error;
    }
  }

  static async dailyActivityExists(
    userId: string,
    date: Date
  ): Promise<boolean> {
    try {
      const db = await this.getDb();
      const userStatsCollection = db.collection<UserStats>("userStats");

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const userStats = await userStatsCollection.findOne({
        userId,
        lastStreakDate: { $gte: startOfDay, $lte: endOfDay },
      });

      return userStats !== null;
    } catch (error) {
      console.error("Failed to check daily activity:", error);
      throw error;
    }
  }


  static async createIndexes(): Promise<void> {
    try {
      const db = await this.getDb();
      const userStatsCollection = db.collection<UserStats>("userStats");

      await userStatsCollection.createIndex({ userId: 1 }, { unique: true });
      await userStatsCollection.createIndex({ lastStreakDate: 1 });

      console.log("Indexes created successfully");
    } catch (error) {
      console.error("Failed to create indexes:", error);
      throw error;
    }
  }

  static async getTypingHistory(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const db = await this.getDb();
      const typingTestsCollection = db.collection("typingTests");

      const history = await typingTestsCollection
        .find({ userId })
        .sort({ completedAt: -1 })
        .limit(limit)
        .toArray();

      return history;
    } catch (error) {
      console.error("Failed to get typing history:", error);
      throw error;
    }
  }
  static async getTypingHeatmap(userId: string): Promise<any> {
    try {
      const db = await this.getDb();
      const typingTestsCollection = db.collection("typingTests");

      const heatmapData = await typingTestsCollection.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: {
              year: { $year: "$testDate" },
              month: { $month: "$testDate" },
              day: { $dayOfMonth: "$testDate" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            count: 1,
          },
        },
      ]).toArray();

      return heatmapData;
    } catch (error) {
      console.error("Failed to get typing heatmap:", error);
      throw error;
    }
  }
}