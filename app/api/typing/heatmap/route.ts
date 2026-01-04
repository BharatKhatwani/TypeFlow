import { NextResponse } from "next/server";
import { DBService } from "@/lib/db-service";
import { auth } from "@/lib/auth";
import { z } from "zod";

const heatmapSchema = z.array(z.object({
    date: z.string().or(z.date()),
    count: z.number(),
}));

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const heatmapData = await DBService.getTypingHeatmap(userId);

        // Validate output format
        const validatedData = heatmapSchema.parse(heatmapData);

        return NextResponse.json(validatedData, { status: 200 });

    } catch (error) {
        console.error("Error in /api/typing/heatmap:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}