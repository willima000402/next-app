// POST /api/finalize
// Synthesizes a final summary and output from all accepted step answers.

import { NextRequest, NextResponse } from "next/server";
import { finalizeSession } from "@/lib/ai/service";
import type { FinalizeRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: FinalizeRequest = await req.json();

    if (!body.goal || !body.planTitle || !body.acceptedAnswers) {
      return NextResponse.json(
        { error: "Missing required fields: goal, planTitle, acceptedAnswers" },
        { status: 400 }
      );
    }

    if (Object.keys(body.acceptedAnswers).length === 0) {
      return NextResponse.json(
        { error: "acceptedAnswers must contain at least one entry" },
        { status: 400 }
      );
    }

    const result = await finalizeSession(body.goal, body.planTitle, body.acceptedAnswers);
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

    console.error("[/api/finalize]", message);
    return NextResponse.json(
      { error: "Failed to generate final output", detail: message },
      { status: 500 }
    );
  }
}
