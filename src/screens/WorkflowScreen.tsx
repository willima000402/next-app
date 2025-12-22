"use client";

import { useState, useEffect } from "react";
import { StepSidebar } from "@/components/StepSidebar";
import { ProgressBar } from "@/components/ProgressBar";
import { FeedbackCard } from "@/components/FeedbackCard";
import { PriorAnswersPanel } from "@/components/PriorAnswersPanel";
import { ErrorBanner } from "@/components/ErrorBanner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import type { LearningSession } from "@/hooks/useLearningSession";

interface WorkflowScreenProps {
  session: LearningSession;
}

export function WorkflowScreen({ session }: WorkflowScreenProps) {
  const { state, submitAnswer, advanceStep } = session;
  const { plan, currentStepIndex, latestFeedback, acceptedAnswers, error } = state;

  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Reset answer field when moving to a new step
  useEffect(() => {
    setAnswer("");
    setShowHint(false);
  }, [currentStepIndex]);

  if (!plan) return null;

  const currentStep = plan.steps[currentStepIndex];
  const isLastStep = currentStepIndex === plan.steps.length - 1;
  const hasFeedback = latestFeedback !== null;
  const isPassing = latestFeedback?.evaluation === "pass";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    await submitAnswer(answer);
    setIsSubmitting(false);
  }

  async function handleAdvance() {
    await advanceStep();
  }

  function handleRetry() {
    setAnswer("");
    setShowHint(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.5 3.5 0 01-4.95 0l-.347-.347z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-slate-900 truncate">{plan.planTitle}</h1>
              <p className="text-xs text-slate-500 truncate">{plan.goal}</p>
            </div>
          </div>
          <div className="w-56 shrink-0 hidden sm:block">
            <ProgressBar current={currentStepIndex} total={plan.steps.length} />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
        {/* Left sidebar – step list */}
        <div className="hidden lg:block">
          <StepSidebar steps={plan.steps} currentIndex={currentStepIndex} />
        </div>

        {/* Center – active step */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Plan description (shown once above step 1) */}
          {currentStepIndex === 0 && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Your Plan</p>
              <p className="text-sm text-indigo-800 leading-relaxed">{plan.planDescription}</p>
            </div>
          )}

          {/* Mobile progress */}
          <div className="lg:hidden">
            <ProgressBar current={currentStepIndex} total={plan.steps.length} />
          </div>

          {/* Step card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Step header */}
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {currentStep.id}
                </span>
                <h2 className="text-base font-semibold text-slate-900">{currentStep.title}</h2>
              </div>
            </div>

            {/* Step instruction */}
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 leading-relaxed">{currentStep.instruction}</p>
            </div>

            {/* Response form – hide while showing passing feedback */}
            {!isPassing && (
              <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Your Response
                  </label>
                  <textarea
                    rows={5}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer, attempt, or response here..."
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none transition disabled:opacity-60"
                  />
                </div>

                {error && <ErrorBanner message={error} />}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={!answer.trim() || isSubmitting}
                    className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? "Evaluating…" : "Submit Answer"}
                  </button>

                  {/* Hint button */}
                  {latestFeedback?.hint && !showHint && (
                    <button
                      type="button"
                      onClick={() => setShowHint(true)}
                      className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                    >
                      💡 Show Hint
                    </button>
                  )}
                </div>

                {/* Hint display */}
                {showHint && latestFeedback?.hint && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Hint</p>
                    <p className="text-sm text-amber-800">{latestFeedback.hint}</p>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Loading state */}
          {isSubmitting && <LoadingSpinner message="The AI is evaluating your answer…" />}

          {/* Feedback card */}
          {hasFeedback && !isSubmitting && latestFeedback && (
            <FeedbackCard
              feedback={latestFeedback}
              isLastStep={isLastStep}
              onNext={handleAdvance}
              onRetry={handleRetry}
            />
          )}
        </main>

        {/* Right – prior answers context panel */}
        <aside className="hidden xl:block w-64 shrink-0 space-y-4">
          <PriorAnswersPanel steps={plan.steps} acceptedAnswers={acceptedAnswers} />
        </aside>
      </div>
    </div>
  );
}
