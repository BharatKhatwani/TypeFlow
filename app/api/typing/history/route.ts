import { NextResponse } from "next/server";
import { DBService } from "@/lib/db-service";
import { auth } from "@/lib/auth"; // Assuming auth helper exists, similar to other routes
import { headers } from "next/headers";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const history = await DBService.getTypingHistory(session.user.id, limit);

        return NextResponse.json({ history });
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json(
            { error: "Failed to fetch history" },
            { status: 500 }
        );
    }
}
