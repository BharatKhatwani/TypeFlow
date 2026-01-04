import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { handleTestFinish } from "@/lib/stats-calculator";
import { z } from "zod";

const finishTestSchema = z.object({
    duration: z.union([
        z.literal(15),
        z.literal(30),
        z.literal(60),
        z.literal(120),
        z.literal(180),
    ]),
    wpm: z.number(),
    accuracy: z.number(),
    wordsTyped: z.number(),
    timeTaken: z.number(),
});

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const json = await request.json();

        // Validate input
        const body = finishTestSchema.safeParse(json);

        if (!body.success) {
            return NextResponse.json({ error: "Invalid request body", details: body.error }, { status: 400 });
        }

        const { duration, wpm, accuracy, wordsTyped, timeTaken } = body.data;

        const updatedStats = await handleTestFinish(userId, {
            duration,
            wpm,
            accuracy,
            wordsTyped,
            timeTaken,
            testDate: new Date(),
        });

        return NextResponse.json(
            { message: "Test recorded and stats updated", stats: updatedStats },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in /api/typing/finish:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}