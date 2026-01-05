

import { NextResponse } from "next/server";
import { DBService } from "@/lib/db-service";
import { auth } from "@/lib/auth";


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

    const allowedDurations = [15, 30, 60, 120];
    const safeDuration = allowedDurations.includes(duration) ? duration : 60;

    const leaderboardData = await DBService.getLeaderboard(10, safeDuration);
    console.log("Fetched leaderboard data:", JSON.stringify(leaderboardData, null, 2));

    return NextResponse.json(
      {
        duration: safeDuration,
        currentUserId: userId,
        leaderboard: leaderboardData || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
