import { z } from "zod";

export const UserStatsSchema = z.object({
  userId: z.string(),

  bestSpeed: z.number().min(0),
  bestAccuracy: z.number().min(0).max(100),

  currentStreak: z.number().min(0),
  longestStreak: z.number().min(0),

  averageSpeed: z.number().min(0),
  averageAccuracy: z.number().min(0).max(100),

  testsCompleted: z.number().min(0),
  totalTime: z.number().min(0),
  totalWordsTyped: z.number().min(0),

  lastTestDate: z.coerce.date(),
  lastStreakDate: z.coerce.date(),
});
