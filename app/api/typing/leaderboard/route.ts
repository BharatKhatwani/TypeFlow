

import { NextResponse } from "next/server";

import { DBService } from "@/lib/db-service";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const { searchParams } = new URL(request.url);
        const durationParam = searchParams.get("duration");
        const duration = durationParam ? parseInt(durationParam) : 60;

        // Validate duration (ensure it's one of the allowed values)
        const allowedDurations = [15, 30, 60, 120];
        const safeDuration = allowedDurations.includes(duration) ? duration : 60;

        const leaderboardData = await DBService.getLeaderboard(10, safeDuration);

        return NextResponse.json(leaderboardData, { status: 200 });

    } catch (error) {

    }
}