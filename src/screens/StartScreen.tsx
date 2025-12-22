"use client";

import { useState } from "react";
import { ErrorBanner } from "@/components/ErrorBanner";

// Reusable example goals – editable to match any domain
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-600 mb-5 shadow-lg shadow-indigo-200">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.5 3.5 0 01-4.95 0l-.347-.347z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Learning Guide</h1>
          <p className="mt-3 text-base text-slate-500 max-w-md mx-auto leading-relaxed">
            Enter any learning goal, task, or process. The AI will create a personalized
            step-by-step plan and guide you through it.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="goal" className="block text-sm font-semibold text-slate-700 mb-2">
                What do you want to learn or accomplish?
              </label>
              <textarea
                id="goal"
                rows={3}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Help me learn how to solve a linear equation..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none transition"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Be specific for best results. Any domain works — education, training, workflow, writing.
              </p>
            </div>

            {error && <ErrorBanner message={error} />}

            <button
              type="submit"
              disabled={goal.trim().length < 5}
              className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Generate My Step-by-Step Plan →
            </button>
          </form>

          {/* Example prompts */}
          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Or try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setGoal(ex)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer tagline */}
        <p className="text-center mt-6 text-xs text-slate-400">
          Powered by AI · Works for any learning goal, training flow, or process
        </p>
      </div>
    </div>
  );
}
