import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TypingDBService } from "@/lib/db-service";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testData = await req.json();

    // Validate test data
    if (!testData.wpm || !testData.accuracy) {
      return NextResponse.json(
        { error: "Invalid test data" },
        { status: 400 }
      );
    }

    // Save the test
    const testId = await TypingDBService.saveTypingTest({
      userId: session.user.id,
      wpm: testData.wpm,
      accuracy: testData.accuracy,
      rawWpm: testData.rawWpm || testData.wpm,
      duration: testData.duration,
      mode: testData.mode || "time",
      language: testData.language || "english",
      textContent: testData.textContent || "",
      errors: testData.errors || 0,
      correctChars: testData.correctChars || 0,
      incorrectChars: testData.incorrectChars || 0,
      completedAt: new Date(),
    });

    // Update daily activity
    await TypingDBService.updateDailyActivity(session.user.id, testData);

    return NextResponse.json({
      success: true,
      testId,
      message: "Test saved successfully",
    });
  } catch (error: any) {
    console.error("Error saving test:", error);
    return NextResponse.json(
      { error: "Failed to save test" },
      { status: 500 }
    );
  }
}