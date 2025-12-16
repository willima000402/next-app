// ─── AI Service ───────────────────────────────────────────────────────────────
// Centralised module for all OpenAI calls.
// To swap providers, only this file needs to change.

import OpenAI from "openai";
import type {
  AcceptedAnswers,
  EvaluateStepResponse,
  FinalizeResponse,
  GeneratePlanResponse,
  Step,
} from "@/types";
import {
  buildEvaluateStepPrompt,
  buildFinalizePrompt,
  buildGeneratePlanPrompt,
} from "./prompts";

// ─── Client Initialisation ───────────────────────────────────────────────────
// Created once at module load. Throws clearly if the key is missing.

function createClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "[AI Service] OPENAI_API_KEY environment variable is not set. " +
        "Add it to your .env.local file. See .env.example for reference."
    );
  }
  return new OpenAI({ apiKey });
}

// Lazy singleton – instantiated on first use so import errors are clear.
let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) _client = createClient();
  return _client;
}

// ─── Model Configuration ─────────────────────────────────────────────────────
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_TOKENS = 1500;

// ─── JSON Parsing Safeguard ──────────────────────────────────────────────────
// Extracts JSON from a response that may contain surrounding text or code fences.
function parseJsonResponse<T>(raw: string, context: string): T {
  // Strip markdown code fences if present
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Attempt to extract the first JSON object/array from the string
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        // fall through
      }
    }
    throw new Error(
      `[AI Service] Failed to parse JSON response for "${context}". Raw response:\n${raw}`
    );
  }
}

// ─── AI Jobs ─────────────────────────────────────────────────────────────────

/**
 * Generate a structured step-by-step plan for a user goal.
 */
export async function generatePlan(goal: string): Promise<GeneratePlanResponse> {
  const client = getClient();
  const prompt = buildGeneratePlanPrompt(goal);

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You are an expert educational coach. Always respond with valid JSON only. No explanations, no markdown, no code fences.",
      },
      { role: "user", content: prompt },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";
  const parsed = parseJsonResponse<GeneratePlanResponse>(raw, "generatePlan");

  // Validate required fields
  if (!parsed.steps || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
    throw new Error("[AI Service] generatePlan returned invalid plan structure.");
  }

  return parsed;
}

/**
 * Evaluate a single step answer from the student.
 */
export async function evaluateStep(
  goal: string,
  planTitle: string,
  currentStep: Step,
  studentAnswer: string,
  previousAcceptedAnswers: AcceptedAnswers
): Promise<EvaluateStepResponse> {
  const client = getClient();
  const prompt = buildEvaluateStepPrompt(
    goal,
    planTitle,
    currentStep,
    studentAnswer,
    previousAcceptedAnswers
  );

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0.3, // lower temp for more consistent evaluations
    messages: [
      {
        role: "system",
        content:
          "You are a supportive AI tutor. Always respond with valid JSON only. No explanations, no markdown, no code fences.",
      },
      { role: "user", content: prompt },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";
  const parsed = parseJsonResponse<EvaluateStepResponse>(raw, "evaluateStep");

  // Validate required fields
  if (!["pass", "retry"].includes(parsed.evaluation)) {
    throw new Error(`[AI Service] evaluateStep returned invalid evaluation: ${parsed.evaluation}`);
  }

  // Ensure logical consistency
  if (parsed.evaluation === "pass") {
    parsed.nextStepUnlocked = true;
    if (!parsed.acceptedAnswer) parsed.acceptedAnswer = studentAnswer;
  } else {
    parsed.nextStepUnlocked = false;
    parsed.acceptedAnswer = null;
  }

  return parsed;
}

/**
 * Synthesize a final summary and output from all accepted step answers.
 */
export async function finalizeSession(
  goal: string,
  planTitle: string,
  acceptedAnswers: AcceptedAnswers
): Promise<FinalizeResponse> {
  const client = getClient();
  const prompt = buildFinalizePrompt(goal, planTitle, acceptedAnswers);

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: MAX_TOKENS * 2,
    temperature: 0.6,
    messages: [
      {
        role: "system",
        content:
          "You are an expert educational coach. Always respond with valid JSON only. No explanations, no markdown, no code fences.",
      },
      { role: "user", content: prompt },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "";
  const parsed = parseJsonResponse<FinalizeResponse>(raw, "finalizeSession");

  if (!parsed.finalSummary || !parsed.finalOutput) {
    throw new Error("[AI Service] finalizeSession returned incomplete response.");
  }

  // Guard: if the AI returns a nested object instead of a string, serialise it
  if (typeof parsed.finalSummary !== "string") {
    parsed.finalSummary = JSON.stringify(parsed.finalSummary, null, 2);
  }
  if (typeof parsed.finalOutput !== "string") {
    parsed.finalOutput = JSON.stringify(parsed.finalOutput, null, 2);
  }

  return parsed;
}
