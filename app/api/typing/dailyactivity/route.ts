import { NextResponse } from "next/server";
import { DBService } from "@/lib/db-service";
import { auth } from "@/lib/auth";
import { z } from "zod";

const dailyActivitySchema = z.object({
    currentStreak: z.number(),
    longestStreak: z.number(),
    testsCompleted: z.number(),
    totalTime: z.number(),
    totalWordsTyped: z.number(),
    bestByDuration: z.record(
        z.string(), // duration key (e.g. "15", "30")
        z.object({
            wpm: z.number(),
            accuracy: z.number(),
        })
    ),
});

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const stats = await DBService.getUserStats(userId);

        if (!stats) {
            return NextResponse.json({ error: "User stats not found" }, { status: 404 });
        }

        // Format data matching our schema
        const responseData = {
            currentStreak: stats.currentStreak,
            longestStreak: stats.longestStreak,
            testsCompleted: stats.testsCompleted,
            totalTime: stats.totalTime,
            totalWordsTyped: stats.totalWordsTyped,
            bestByDuration: stats.bestByDuration as Record<string, any>,
        };


        const validatedData = dailyActivitySchema.parse(responseData);

        return NextResponse.json(validatedData, { status: 200 });

    } catch (error) {
        console.error("Error in /api/typing/dailyactivity:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}