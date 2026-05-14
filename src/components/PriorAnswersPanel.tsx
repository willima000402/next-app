"use client";

import type { AcceptedAnswers, Step } from "@/types";

interface PriorAnswersPanelProps {
  steps: Step[];
  acceptedAnswers: AcceptedAnswers;
}

export function PriorAnswersPanel({ steps, acceptedAnswers }: PriorAnswersPanelProps) {
  const entries = Object.entries(acceptedAnswers);

  if (entries.length === 0) return null;

  return (
    <aside className="rounded-xl border border-white/8 bg-slate-900 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Accepted Answers
      </h3>
      <div className="space-y-3">
        {entries.map(([stepId, answer]) => {
          const step = steps.find((s) => String(s.id) === stepId);
          return (
            <div key={stepId} className="rounded-lg bg-slate-800/60 border border-white/6 px-3 py-2.5">
              <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-wide mb-1">
                Step {stepId}{step ? ` – ${step.title}` : ""}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{answer}</p>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
