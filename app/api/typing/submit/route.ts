
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import {z } from "zod";
import { auth } from "@/lib/auth";
import { TypingDBService } from "@/lib/db-service";
import { TypingTestInputSchema } from "@/types/validator/Typing";
// import { b } from "motion/react-client";

export async function POST(req : Request){
  try {
    const session = await auth.api.getSession({
      headers :await  headers(), 
    })
    if(!session){
        return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const data = TypingTestInputSchema.parse(body);

const testId = await TypingDBService.saveTypingTest({
  userId: session.user.id,
      ...data,
      rawWpm: data.rawWpm ?? data.wpm,
})
  return NextResponse.json({
      success: true,
      testId,
    });
    
  } catch (error) {
     
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid typing test data" },
        { status: 400 }
      );
    }

    console.error("Typing test submit failed:", error);
    return NextResponse.json(
      { error: "Failed to submit typing test" },
      { status: 500 }
    );
  }
}