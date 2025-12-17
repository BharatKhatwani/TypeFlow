import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TypingDBService } from "@/lib/db-service";
import { headers } from "next/headers";
import {z} from 'zod'
const InputTypingLimit = z.coerce
  .number()
  .int()
  .min(1)
  .max(100);

export async function GET(req : Request){
    try {
        const session = await auth.api.getSession({
        headers: await headers(),
        })
        
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {searchParams} = new URL(req.url);
    const rawlimit = (searchParams.get("limit") || "50");
    const limit = InputTypingLimit.parse(rawlimit);
    
    const tests = await TypingDBService.getUserTests(session.user.id, limit);
     return NextResponse.json({ tests });
    } catch (error) {
        console.error("Error fetching tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 }
    );
    }
}