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
    <div className="min-h-screen bg-slate-950">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-white/8 bg-slate-950/80 backdrop-blur-lg px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-md shadow-violet-900/50">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7.8-9 9 4 1.2 7.8 3.6 9 9 1.2-5.4 5-7.8 9-9-4-1.2-7.8-3.6-9-9z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-white truncate">{plan.planTitle}</h1>
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
        {/* Left sidebar */}
        <div className="hidden lg:block">
          <StepSidebar steps={plan.steps} currentIndex={currentStepIndex} />
        </div>

        {/* Center – active step */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Plan description */}
          {currentStepIndex === 0 && (
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-5 py-4">
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-1">Your Plan</p>
              <p className="text-sm text-violet-200 leading-relaxed">{plan.planDescription}</p>
            </div>
          )}

          {/* Mobile progress */}
          <div className="lg:hidden">
            <ProgressBar current={currentStepIndex} total={plan.steps.length} />
          </div>

          {/* Step card */}
          <div className="rounded-xl border border-white/8 bg-slate-900 shadow-xl overflow-hidden">
            {/* Step header */}
            <div className="px-6 py-5 border-b border-white/6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white shadow-md shadow-violet-900/40">
                  {currentStep.id}
                </span>
                <h2 className="text-base font-semibold text-white">{currentStep.title}</h2>
              </div>
            </div>

            {/* Step instruction */}
            <div className="px-6 py-5">
              <p className="text-sm text-slate-400 leading-relaxed">{currentStep.instruction}</p>
            </div>

            {/* Response form */}
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
                    className="w-full rounded-lg border border-white/8 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition disabled:opacity-50"
                  />
                </div>

                {error && <ErrorBanner message={error} />}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={!answer.trim() || isSubmitting}
                    className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-900/40 hover:from-violet-500 hover:to-fuchsia-500 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? "Evaluating…" : "Submit Answer"}
                  </button>

                  {latestFeedback?.hint && !showHint && (
                    <button
                      type="button"
                      onClick={() => setShowHint(true)}
                      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/10 transition"
                    >
                      Show Hint
                    </button>
                  )}
                </div>

                {showHint && latestFeedback?.hint && (
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1">Hint</p>
                    <p className="text-sm text-amber-200">{latestFeedback.hint}</p>
                  </div>
                )}
              </form>
            )}
          </div>

          {isSubmitting && <LoadingSpinner message="The AI is evaluating your answer…" />}

          {hasFeedback && !isSubmitting && latestFeedback && (
            <FeedbackCard
              feedback={latestFeedback}
              isLastStep={isLastStep}
              onNext={handleAdvance}
              onRetry={handleRetry}
            />
          )}
        </main>

        {/* Right – prior answers */}
        <aside className="hidden xl:block w-64 shrink-0 space-y-4">
          <PriorAnswersPanel steps={plan.steps} acceptedAnswers={acceptedAnswers} />
        </aside>
      </div>
    </div>
  );
}
