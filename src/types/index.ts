// ─── Shared Types ────────────────────────────────────────────────────────────
// These types are shared between the frontend and backend (API routes).

export type StepStatus = "pending" | "active" | "completed";

export interface Step {
  id: number;
  title: string;
  instruction: string;
  status?: StepStatus;
}

export interface Plan {
  goal: string;
  planTitle: string;
  planDescription: string;
  steps: Step[];
}

// Keyed by step id (as string) → accepted answer text
export type AcceptedAnswers = Record<string, string>;

// ─── API Request / Response types ────────────────────────────────────────────

export interface GeneratePlanRequest {
  goal: string;
}

export interface GeneratePlanResponse extends Plan {}

export interface EvaluateStepRequest {
  goal: string;
  planTitle: string;
  currentStep: Step;
  studentAnswer: string;
  previousAcceptedAnswers: AcceptedAnswers;
}

export interface EvaluateStepResponse {
  stepId: number;
  evaluation: "pass" | "retry";
  feedback: string;
  hint: string | null;
  acceptedAnswer: string | null;
  nextStepUnlocked: boolean;
}

export interface FinalizeRequest {
  goal: string;
  planTitle: string;
  acceptedAnswers: AcceptedAnswers;
}

export interface FinalizeResponse {
  finalSummary: string;
  finalOutput: string;
}

// ─── Client-side session state ────────────────────────────────────────────────

export type SessionPhase = "idle" | "loading-plan" | "active" | "loading-final" | "complete";

export interface FeedbackEntry {
  stepId: number;
  evaluation: "pass" | "retry";
  feedback: string;
  hint: string | null;
}

export interface SessionState {
  phase: SessionPhase;
  goal: string;
  plan: Plan | null;
  currentStepIndex: number;
  acceptedAnswers: AcceptedAnswers;
  feedbackHistory: FeedbackEntry[];
  latestFeedback: FeedbackEntry | null;
  finalSummary: string | null;
  finalOutput: string | null;
  error: string | null;
}
