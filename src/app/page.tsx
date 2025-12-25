"use client";

// ─── App Root ─────────────────────────────────────────────────────────────────
// Phase-based routing — no React Router needed.
// The session hook drives which screen is shown.

import { useLearningSession } from "@/hooks/useLearningSession";
import { StartScreen } from "@/screens/StartScreen";
import { WorkflowScreen } from "@/screens/WorkflowScreen";
import { FinalScreen } from "@/screens/FinalScreen";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Home() {
  const session = useLearningSession();
  const { state } = session;

  // ── Loading state: plan generation in progress ─────────────────────────────
  if (state.phase === "loading-plan") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <LoadingSpinner message="Generating your personalised step-by-step plan…" />
          <p className="mt-2 text-xs text-slate-400 max-w-xs mx-auto">
            The AI is designing a guided workflow tailored to your goal.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading state: final synthesis in progress ─────────────────────────────
  if (state.phase === "loading-final") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <LoadingSpinner message="Synthesising your final output…" />
          <p className="mt-2 text-xs text-slate-400 max-w-xs mx-auto">
            Assembling your completed work into a final summary.
          </p>
        </div>
      </div>
    );
  }

  // ── Idle: show start screen ────────────────────────────────────────────────
  if (state.phase === "idle") {
    return (
      <StartScreen
        onStart={(goal) => session.startSession(goal)}
        error={state.error}
      />
    );
  }

  // ── Active: show guided workflow ───────────────────────────────────────────
  if (state.phase === "active") {
    return <WorkflowScreen session={session} />;
  }

  // ── Complete: show final results ───────────────────────────────────────────
  if (state.phase === "complete") {
    return <FinalScreen session={session} />;
  }

  // Fallback (should not reach here)
  return null;
}
