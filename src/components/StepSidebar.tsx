"use client";

import type { Step } from "@/types";

interface StepSidebarProps {
  steps: Step[];
  currentIndex: number;
}

const statusConfig = {
  completed: {
    dot: "bg-indigo-500",
    text: "text-indigo-700",
    label: "Completed",
    labelClass: "bg-indigo-50 text-indigo-600",
    connector: "bg-indigo-300",
  },
  active: {
    dot: "bg-indigo-500 ring-4 ring-indigo-100",
    text: "text-slate-900 font-semibold",
    label: "In Progress",
    labelClass: "bg-amber-50 text-amber-600",
    connector: "bg-slate-200",
  },
  pending: {
    dot: "bg-slate-200",
    text: "text-slate-400",
    label: "Pending",
    labelClass: "bg-slate-50 text-slate-400",
    connector: "bg-slate-200",
  },
};

export function StepSidebar({ steps, currentIndex }: StepSidebarProps) {
  return (
    <nav className="w-64 shrink-0" aria-label="Steps">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 px-1">
        Your Progress
      </h2>
      <ol className="relative">
        {steps.map((step, idx) => {
          const status = step.status ?? "pending";
          const cfg = statusConfig[status];
          const isLast = idx === steps.length - 1;

          return (
            <li key={step.id} className="relative flex gap-3 pb-6 last:pb-0">
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute left-3 top-6 w-0.5 h-full -translate-x-1/2 ${cfg.connector}`}
                  aria-hidden="true"
                />
              )}

              {/* Step dot */}
              <div className="relative z-10 flex-shrink-0">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${cfg.dot}`}
                >
                  {status === "completed" ? (
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-[10px] font-bold text-white">{step.id}</span>
                  )}
                </span>
              </div>

              {/* Step info */}
              <div className="min-w-0 flex-1 pt-0.5">
                <p className={`text-sm leading-snug transition-colors ${cfg.text}`}>{step.title}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.labelClass}`}>
                  {cfg.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
