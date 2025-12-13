import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TypingDBService } from "@/lib/db-service";
import { headers } from "next/headers";


export async function GET(req : Request){
    try {
        const session = await auth.api.getSession({
        headers: await headers(),
        })
        
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {searchParams} = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    
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