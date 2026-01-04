import { NextResponse } from "next/server";
import { DBService } from "@/lib/db-service";
import { auth } from "@/lib/auth";
import { z } from "zod";

const statsSchema = z.object({
    userId: z.string(),
    bestByDuration: z.record(
        z.string(), // duration key
        z.object({
            wpm: z.number(),
            accuracy: z.number(),
        })
    ),
    currentStreak: z.number(),
    longestStreak: z.number(),
    testsCompleted: z.number(),
    totalTime: z.number(),
    totalWordsTyped: z.number(),
    lastTestDate: z.string().or(z.date()),
    lastStreakDate: z.string().or(z.date()),
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

        // Validate response
        const validatedStats = statsSchema.parse(stats);

        return NextResponse.json(validatedStats, { status: 200 });

    } catch (error) {
        console.error("Error in /api/typing/stats:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}