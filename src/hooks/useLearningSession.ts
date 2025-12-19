"use client";

// ─── useLearningSession ───────────────────────────────────────────────────────
// Central state management hook for the guided learning session.
// All session logic lives here. Components call exposed action functions only.

import { useReducer, useCallback } from "react";
import type {
  AcceptedAnswers,
  EvaluateStepResponse,
  FeedbackEntry,
  Plan,
  SessionPhase,
  SessionState,
  Step,
} from "@/types";

// ─── State shape ──────────────────────────────────────────────────────────────

const initialState: SessionState = {
  phase: "idle",
  goal: "",
  plan: null,
  currentStepIndex: 0,
  acceptedAnswers: {},
  feedbackHistory: [],
  latestFeedback: null,
  finalSummary: null,
  finalOutput: null,
  error: null,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_LOADING_PLAN"; goal: string }
  | { type: "SET_PLAN"; plan: Plan }
  | { type: "SET_FEEDBACK"; feedback: EvaluateStepResponse }
  | { type: "ADVANCE_STEP" }
  | { type: "SET_LOADING_FINAL" }
  | { type: "SET_FINAL"; finalSummary: string; finalOutput: string }
  | { type: "SET_ERROR"; error: string }
  | { type: "CLEAR_FEEDBACK" }
  | { type: "RESET" };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function sessionReducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "SET_LOADING_PLAN":
      return { ...initialState, phase: "loading-plan", goal: action.goal };

    case "SET_PLAN": {
      // Mark first step as active, rest as pending
      const steps: Step[] = action.plan.steps.map((s, i) => ({
        ...s,
        status: i === 0 ? "active" : "pending",
      }));
      return {
        ...state,
        phase: "active",
        plan: { ...action.plan, steps },
        currentStepIndex: 0,
        error: null,
      };
    }

    case "SET_FEEDBACK": {
      const fb = action.feedback;
      const entry: FeedbackEntry = {
        stepId: fb.stepId,
        evaluation: fb.evaluation,
        feedback: fb.feedback,
        hint: fb.hint,
      };

      // If passed, store accepted answer
      const acceptedAnswers: AcceptedAnswers =
        fb.evaluation === "pass" && fb.acceptedAnswer
          ? { ...state.acceptedAnswers, [String(fb.stepId)]: fb.acceptedAnswer }
          : state.acceptedAnswers;

      return {
        ...state,
        feedbackHistory: [...state.feedbackHistory, entry],
        latestFeedback: entry,
        acceptedAnswers,
        error: null,
      };
    }

    case "ADVANCE_STEP": {
      if (!state.plan) return state;
      const nextIndex = state.currentStepIndex + 1;
      const isLast = nextIndex >= state.plan.steps.length;

      if (isLast) {
        // Trigger finalization
        return { ...state, phase: "loading-final", latestFeedback: null };
      }

      // Update step statuses
      const steps: Step[] = state.plan.steps.map((s, i) => ({
        ...s,
        status: i < nextIndex ? "completed" : i === nextIndex ? "active" : "pending",
      }));

      return {
        ...state,
        plan: { ...state.plan, steps },
        currentStepIndex: nextIndex,
        latestFeedback: null,
      };
    }

    case "SET_LOADING_FINAL":
      return { ...state, phase: "loading-final" };

    case "SET_FINAL":
      return {
        ...state,
        phase: "complete",
        finalSummary: action.finalSummary,
        finalOutput: action.finalOutput,
        error: null,
      };

    case "SET_ERROR":
      return { ...state, error: action.error, phase: state.phase === "loading-plan" ? "idle" : state.phase };

    case "CLEAR_FEEDBACK":
      return { ...state, latestFeedback: null };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLearningSession() {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  // ── Start a new session ───────────────────────────────────────────────────
  const startSession = useCallback(async (goal: string) => {
    dispatch({ type: "SET_LOADING_PLAN", goal });

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || err.error || `HTTP ${res.status}`);
      }

      const plan = await res.json();
      dispatch({ type: "SET_PLAN", plan });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        error: err instanceof Error ? err.message : "Failed to generate plan",
      });
    }
  }, []);

  // ── Submit an answer for the current step ──────────────────────────────────
  const submitAnswer = useCallback(
    async (studentAnswer: string) => {
      if (!state.plan) return;
      const currentStep = state.plan.steps[state.currentStepIndex];

      try {
        const res = await fetch("/api/evaluate-step", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal: state.goal,
            planTitle: state.plan.planTitle,
            currentStep,
            studentAnswer,
            previousAcceptedAnswers: state.acceptedAnswers,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || err.error || `HTTP ${res.status}`);
        }

        const evaluation = await res.json();
        dispatch({ type: "SET_FEEDBACK", feedback: evaluation });
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          error: err instanceof Error ? err.message : "Failed to evaluate step",
        });
      }
    },
    [state.plan, state.currentStepIndex, state.goal, state.acceptedAnswers]
  );

  // ── Advance to the next step (called after a passing evaluation) ───────────
  const advanceStep = useCallback(async () => {
    if (!state.plan) return;
    const isLastStep = state.currentStepIndex >= state.plan.steps.length - 1;

    dispatch({ type: "ADVANCE_STEP" });

    // If it's the last step, immediately call finalize
    if (isLastStep) {
      try {
        const res = await fetch("/api/finalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal: state.goal,
            planTitle: state.plan.planTitle,
            acceptedAnswers: state.acceptedAnswers,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || err.error || `HTTP ${res.status}`);
        }

        const final = await res.json();
        dispatch({ type: "SET_FINAL", finalSummary: final.finalSummary, finalOutput: final.finalOutput });
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          error: err instanceof Error ? err.message : "Failed to generate final output",
        });
      }
    }
  }, [state.plan, state.currentStepIndex, state.goal, state.acceptedAnswers]);

  // ── Reset everything ───────────────────────────────────────────────────────
  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    startSession,
    submitAnswer,
    advanceStep,
    reset,
  };
}

export type LearningSession = ReturnType<typeof useLearningSession>;
export type { SessionPhase };
