// POST /api/evaluate-step
// Evaluates a student's answer for the current step using the AI.

import { NextRequest, NextResponse } from "next/server";
import { evaluateStep } from "@/lib/ai/service";
import type { EvaluateStepRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: EvaluateStepRequest = await req.json();

    // Validate required fields
    if (!body.goal || !body.planTitle || !body.currentStep || !body.studentAnswer) {
      return NextResponse.json(
        {
          error: "Missing required fields: goal, planTitle, currentStep, studentAnswer",
        },
        { status: 400 }
      );
    }

    if (typeof body.studentAnswer !== "string" || body.studentAnswer.trim().length === 0) {
      return NextResponse.json(
        { error: "studentAnswer must be a non-empty string" },
        { status: 400 }
      );
    }

    const result = await evaluateStep(
      body.goal,
      body.planTitle,
      body.currentStep,
      body.studentAnswer.trim(),
      body.previousAcceptedAnswers ?? {}
    );

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        {
          error: "AI service not configured",
          detail: message,
          action: "Add OPENAI_API_KEY to your .env.local file and restart the dev server.",
        },
        { status: 503 }
      );
    }

    console.error("[/api/evaluate-step]", message);
    return NextResponse.json({ error: "Failed to evaluate step", detail: message }, { status: 500 });
  }
}
