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
    <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Accepted Answers
      </h3>
      <div className="space-y-3">
        {entries.map(([stepId, answer]) => {
          const step = steps.find((s) => String(s.id) === stepId);
          return (
            <div key={stepId} className="rounded-lg bg-white border border-slate-200 px-3 py-2.5">
              <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                Step {stepId}{step ? ` – ${step.title}` : ""}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{answer}</p>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
