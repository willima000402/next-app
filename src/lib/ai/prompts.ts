// ─── Prompt Templates ─────────────────────────────────────────────────────────
// Pure functions: no side-effects, no imports. Each returns a prompt string.
// Edit these to tune AI behaviour without touching any other logic.

import type { AcceptedAnswers, Step } from "@/types";

/**
 * Prompt 1 – Generate a structured step-by-step plan for a user goal.
 * Returns strict JSON matching the GeneratePlanResponse shape.
 */
export function buildGeneratePlanPrompt(goal: string): string {
  return `You are an expert educational coach and instructional designer.

A user wants help with the following goal:
"${goal}"

Your task is to create a structured, step-by-step guided learning or workflow plan with 3 to 6 steps.

IMPORTANT RULES:
- Each step must be actionable and focused on ONE clear sub-task or concept.
- Steps must be sequential – each step builds on the previous one.
- Do NOT give away the final answer in the plan. The steps should guide the user through a process.
- The plan should feel like a structured guided experience, not a list of facts.

You MUST return ONLY valid JSON. Do not include any explanation, markdown, or code fences.

Return this exact JSON structure:
{
  "goal": "<echo the user's goal exactly>",
  "planTitle": "<short, engaging title for this learning journey, max 8 words>",
  "planDescription": "<1-2 sentence description of what the user will achieve>",
  "steps": [
    {
      "id": 1,
      "title": "<concise step title, max 6 words>",
      "instruction": "<clear instruction telling the user what to think about or do for this step, 1-3 sentences>"
    }
  ]
}`;
}

/**
 * Prompt 2 – Evaluate a single step response from the user.
 * Returns strict JSON matching the EvaluateStepResponse shape.
 */
export function buildEvaluateStepPrompt(
  goal: string,
  planTitle: string,
  currentStep: Step,
  studentAnswer: string,
  previousAcceptedAnswers: AcceptedAnswers
): string {
  const priorContext =
    Object.keys(previousAcceptedAnswers).length > 0
      ? Object.entries(previousAcceptedAnswers)
          .map(([id, answer]) => `Step ${id}: ${answer}`)
          .join("\n")
      : "None yet.";

  return `You are a supportive, expert AI tutor guiding a student through a structured learning process.

OVERALL GOAL: "${goal}"
PLAN TITLE: "${planTitle}"

CURRENT STEP:
- Step ID: ${currentStep.id}
- Title: ${currentStep.title}
- Instruction: ${currentStep.instruction}

STUDENT'S ANSWER FOR THIS STEP:
"${studentAnswer}"

PREVIOUSLY ACCEPTED ANSWERS (earlier steps):
${priorContext}

YOUR TASK:
Evaluate ONLY the student's answer for the CURRENT STEP above. Do NOT evaluate or re-evaluate previous steps.

EVALUATION CRITERIA:
- "pass": The answer demonstrates genuine understanding or effort appropriate for this step. It does not need to be perfect.
- "retry": The answer is off-topic, blank, too vague, or shows a fundamental misunderstanding.

IMPORTANT RULES:
- Be encouraging and constructive. This is a learning environment.
- Give specific, targeted feedback about THIS step only.
- If evaluation is "retry", the hint should nudge them in the right direction without giving away the answer.
- If evaluation is "pass", acceptedAnswer should be a clean, concise version of their answer (or their exact answer if it's already good).
- Use prior accepted answers as context to make feedback relevant to where they are in the journey.

You MUST return ONLY valid JSON. Do not include any explanation, markdown, or code fences.

Return this exact JSON structure:
{
  "stepId": ${currentStep.id},
  "evaluation": "pass" or "retry",
  "feedback": "<specific, encouraging feedback about this step, 1-3 sentences>",
  "hint": "<a helpful hint if evaluation is retry, or null if evaluation is pass>",
  "acceptedAnswer": "<clean version of their answer if pass, or null if retry>",
  "nextStepUnlocked": true or false
}

Set nextStepUnlocked to true if and only if evaluation is "pass".`;
}

/**
 * Prompt 3 – Synthesize a final summary from all accepted answers.
 * Returns strict JSON matching the FinalizeResponse shape.
 */
export function buildFinalizePrompt(
  goal: string,
  planTitle: string,
  acceptedAnswers: AcceptedAnswers
): string {
  const answersText = Object.entries(acceptedAnswers)
    .map(([id, answer]) => `Step ${id}: ${answer}`)
    .join("\n\n");

  return `You are an expert educational coach. A student has just completed a structured guided learning journey.

OVERALL GOAL: "${goal}"
PLAN TITLE: "${planTitle}"

COMPLETED STEPS AND ACCEPTED ANSWERS:
${answersText}

YOUR TASK:
1. Write a brief, encouraging final summary of what the student accomplished and learned.
2. Assemble their accepted answers into a coherent final output – this could be a complete document, a set of conclusions, a structured plan, a worked example, or a synthesis depending on the goal.

The finalOutput should feel like the natural end product of the work they just did, not just a repeat of their answers.

You MUST return ONLY valid JSON. Do not include any explanation, markdown, or code fences.

CRITICAL: Both "finalSummary" and "finalOutput" MUST be plain strings. Do NOT nest JSON objects or arrays inside them. Use plain text with newlines if you need structure.

Return this exact JSON structure:
{
  "finalSummary": "<2-3 sentence encouraging summary of their achievement and what they learned>",
  "finalOutput": "<the assembled, synthesized final output as a plain text string – use newlines for structure, not nested JSON>"
}`;
}
