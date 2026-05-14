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
          ? "border-emerald-500/20 bg-emerald-500/10"
          : "border-orange-500/20 bg-orange-500/10"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            isPassing
              ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-900/30"
              : "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-md shadow-orange-900/30"
          }`}
        >
          {isPassing ? "✓" : "!"}
        </span>
        <span
          className={`text-sm font-semibold ${
            isPassing ? "text-emerald-300" : "text-orange-300"
          }`}
        >
          {isPassing ? "Great work!" : "Not quite yet"}
        </span>
      </div>

      {/* Feedback text */}
      <p className={`text-sm leading-relaxed mb-4 ${isPassing ? "text-emerald-200" : "text-orange-200"}`}>
        {feedback.feedback}
      </p>

      {/* Hint (on retry) */}
      {!isPassing && feedback.hint && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3 mb-4">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1">Hint</p>
          <p className="text-sm text-amber-200">{feedback.hint}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {isPassing ? (
          <button
            onClick={onNext}
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-900/30 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all"
          >
            {isLastStep ? "See Final Results →" : "Continue to Next Step →"}
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-orange-900/30 hover:from-orange-400 hover:to-amber-400 active:scale-95 transition-all"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
