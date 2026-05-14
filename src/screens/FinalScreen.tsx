"use client";

import type { LearningSession } from "@/hooks/useLearningSession";

interface FinalScreenProps {
  session: LearningSession;
}

export function FinalScreen({ session }: FinalScreenProps) {
  const { state, reset } = session;
  const { plan, acceptedAnswers, finalSummary, finalOutput } = state;

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 py-16 px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <div className="relative max-w-3xl mx-auto space-y-8">
        {/* Success header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 mb-5 shadow-2xl shadow-emerald-900/50">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">You&apos;re done!</h1>
          <p className="mt-3 text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
            {plan.planTitle}
          </p>
        </div>

        {/* Final summary */}
        {finalSummary && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-7">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
              Summary
            </h2>
            <p className="text-sm text-emerald-200 leading-relaxed">{finalSummary}</p>
          </div>
        )}

        {/* Final assembled output */}
        {finalOutput && (
          <div className="rounded-2xl border border-white/8 bg-slate-900 p-7 shadow-xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-4">
              Your Final Output
            </h2>
            <div className="prose prose-sm prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
              {finalOutput}
            </div>
          </div>
        )}

        {/* Completed steps */}
        <div className="rounded-2xl border border-white/8 bg-slate-900 p-7 shadow-xl">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-5">
            Completed Steps
          </h2>
          <ol className="space-y-5">
            {plan.steps.map((step) => {
              const accepted = acceptedAnswers[String(step.id)];
              return (
                <li key={step.id} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 mt-0.5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-md shadow-violet-900/30">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white mb-1">
                      {step.id}. {step.title}
                    </p>
                    {accepted ? (
                      <div className="rounded-lg bg-slate-800/60 border border-white/6 px-4 py-3">
                        <p className="text-xs text-slate-400 leading-relaxed">{accepted}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 italic">No accepted answer recorded</p>
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
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-fuchsia-500 active:scale-95 transition-all"
          >
            Start a New Journey →
          </button>
          <p className="mt-3 text-xs text-slate-600">
            Steply · Try a different goal, domain, or workflow
          </p>
        </div>
      </div>
    </div>
  );
}
