"use client";

import type { LearningSession } from "@/hooks/useLearningSession";

interface FinalScreenProps {
  session: LearningSession;
}

export function FinalScreen({ session }: FinalScreenProps) {
  const { state, reset } = session;
  const { plan, acceptedAnswers, finalSummary, finalOutput } = state;

  if (!plan) return null;

  const completedSteps = plan.steps.filter((s) => s.status === "completed" || acceptedAnswers[String(s.id)]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-500 mb-5 shadow-lg shadow-emerald-100">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">You&apos;re done!</h1>
          <p className="mt-3 text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
            {plan.planTitle}
          </p>
        </div>

        {/* Final summary */}
        {finalSummary && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-3">
              Summary
            </h2>
            <p className="text-sm text-emerald-900 leading-relaxed">{finalSummary}</p>
          </div>
        )}

        {/* Final assembled output */}
        {finalOutput && (
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-4">
              Your Final Output
            </h2>
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
              {finalOutput}
            </div>
          </div>
        )}

        {/* Completed steps */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-5">
            Completed Steps
          </h2>
          <ol className="space-y-5">
            {plan.steps.map((step) => {
              const accepted = acceptedAnswers[String(step.id)];
              return (
                <li key={step.id} className="flex gap-4">
                  {/* Done indicator */}
                  <span className="flex h-7 w-7 shrink-0 mt-0.5 items-center justify-center rounded-full bg-indigo-500 text-white">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 mb-1">
                      {step.id}. {step.title}
                    </p>
                    {accepted ? (
                      <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                        <p className="text-xs text-slate-500 leading-relaxed">{accepted}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No accepted answer recorded</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Restart */}
        <div className="text-center">
          <button
            onClick={reset}
            className="rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
          >
            Start a New Journey →
          </button>
          <p className="mt-3 text-xs text-slate-400">
            Try a different goal, domain, or workflow
          </p>
        </div>
      </div>
    </div>
  );
}
