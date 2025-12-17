import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TypingDBService } from "@/lib/db-service";
import { headers } from "next/headers";

// that is used to initial for the first user and uopdate the details accoring
export async function GET(req: Request) {
  try {
      const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let stats = await TypingDBService.getUserStats(session.user.id);

    if (!stats) {
      stats = await TypingDBService.initializeUserStats(session.user.id);
    }
    
    return NextResponse.json({ stats });
    
  } catch (error) {
     console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}