import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { DBService } from "@/lib/db-service";
import { z } from "zod";

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10),
});

export async function GET(request: Request) {
  try {
    // 1️⃣ Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2️⃣ Validate query params
    const { searchParams } = new URL(request.url);
    const result = querySchema.safeParse({
      limit: searchParams.get("limit"),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: result.error },
        { status: 400 }
      );
    }

    const { limit } = result.data;

    // 3️⃣ Fetch typing history
    const history = await DBService.getTypingHistory(userId, limit);

    // 4️⃣ Return
    return NextResponse.json(
      { history },
      { status: 200 }
    );
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
