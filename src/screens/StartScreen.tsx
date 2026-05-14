"use client";

import { useState } from "react";
import { ErrorBanner } from "@/components/ErrorBanner";

const EXAMPLES = [
  "Help me learn how to solve a linear equation",
  "Guide me through writing a project brief",
  "Teach me the steps of analyzing a case study",
  "Help me prepare a lesson plan",
  "Guide me through a customer support troubleshooting workflow",
  "Help me plan a training module for new employees",
];

interface StartScreenProps {
  onStart: (goal: string) => void;
  error: string | null;
}

export function StartScreen({ onStart, error }: StartScreenProps) {
  const [goal, setGoal] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (goal.trim().length < 5) return;
    onStart(goal.trim());
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 flex items-center justify-center px-4 py-16">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          {/* Logo mark */}
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-5 shadow-2xl shadow-violet-900/60 bg-gradient-to-br from-violet-500 to-fuchsia-600">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.2 5.4-5 7.8-9 9 4 1.2 7.8 3.6 9 9 1.2-5.4 5-7.8 9-9-4-1.2-7.8-3.6-9-9z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Steply
          </h1>
          <p className="mt-3 text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            Enter any learning goal, task, or process. Steply creates a
            personalized step-by-step plan and guides you through it.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="goal" className="block text-sm font-semibold text-slate-200 mb-2">
                What do you want to learn or accomplish?
              </label>
              <textarea
                id="goal"
                rows={3}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Help me learn how to solve a linear equation..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Be specific for best results. Any domain works — education, training, workflow, writing.
              </p>
            </div>

            {error && <ErrorBanner message={error} />}

            <button
              type="submit"
              disabled={goal.trim().length < 5}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 hover:from-violet-500 hover:to-fuchsia-500 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Generate My Step-by-Step Plan →
            </button>
          </form>

          {/* Example prompts */}
          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Or try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setGoal(ex)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:bg-violet-500/20 hover:border-violet-400/30 hover:text-violet-300 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer tagline */}
        <p className="text-center mt-6 text-xs text-slate-600">
          Steply · AI-guided learning for any goal, domain, or workflow
        </p>
      </div>
    </div>
  );
}
