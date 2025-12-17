import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TypingDBService } from "@/lib/db-service";
import { headers } from "next/headers";
import {int, z} from "zod"

// used for fetching user activity 

const DaysSchema = z.coerce.number().int().min(1).max(365);

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
        headers: await headers(),
        })
          if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {searchParams}  = new URL(req.url);
     const days = DaysSchema.parse(searchParams.get("days") ?? "365");
 const activity = await TypingDBService.getDailyActivity(
      session.user.id,
      days
    );
    return NextResponse.json({ activity });
        
    } catch (error) {
          console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
    }
}