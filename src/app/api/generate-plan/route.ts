// POST /api/generate-plan
// Accepts a user goal and returns a structured AI-generated step plan.

import { NextRequest, NextResponse } from "next/server";
import { generatePlan } from "@/lib/ai/service";
import type { GeneratePlanRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: GeneratePlanRequest = await req.json();

    if (!body.goal || typeof body.goal !== "string" || body.goal.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid field: goal (non-empty string required)" },
        { status: 400 }
      );
    }

    const plan = await generatePlan(body.goal.trim());
    return NextResponse.json(plan);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    // Surface missing API key as a developer-friendly error
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

    console.error("[/api/generate-plan]", message);
    return NextResponse.json({ error: "Failed to generate plan", detail: message }, { status: 500 });
  }
}
