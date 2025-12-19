"use client";

import type { FeedbackEntry } from "@/types";

interface FeedbackCardProps {
  feedback: FeedbackEntry;
  onNext?: () => void;
  onRetry?: () => void;
  isLastStep?: boolean;
}

export function FeedbackCard({ feedback, onNext, onRetry, isLastStep }: FeedbackCardProps) {
  const isPassing = feedback.evaluation === "pass";

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        isPassing
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${
            isPassing ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"
          }`}
        >
          {isPassing ? "✓" : "!"}
        </span>
        <span
          className={`text-sm font-semibold ${
            isPassing ? "text-emerald-800" : "text-amber-800"
          }`}
        >
          {isPassing ? "Great work!" : "Not quite yet"}
        </span>
      </div>

      {/* Feedback text */}
      <p className={`text-sm leading-relaxed mb-4 ${isPassing ? "text-emerald-800" : "text-amber-800"}`}>
        {feedback.feedback}
      </p>

      {/* Hint (on retry) */}
      {!isPassing && feedback.hint && (
        <div className="rounded-lg bg-white/70 border border-amber-200 px-4 py-3 mb-4">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Hint</p>
          <p className="text-sm text-amber-800">{feedback.hint}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {isPassing ? (
          <button
            onClick={onNext}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-95 transition-all"
          >
            {isLastStep ? "See Final Results →" : "Continue to Next Step →"}
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 active:scale-95 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
