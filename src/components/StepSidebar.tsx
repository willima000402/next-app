"use client";

import type { Step } from "@/types";

interface StepSidebarProps {
  steps: Step[];
  currentIndex: number;
}

const statusConfig = {
  completed: {
    dot: "bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-md shadow-violet-900/40",
    text: "text-slate-300",
    label: "Completed",
    labelClass: "bg-violet-500/15 text-violet-400",
    connector: "bg-violet-500/30",
  },
  active: {
    dot: "bg-gradient-to-br from-violet-500 to-fuchsia-600 ring-4 ring-violet-500/20 shadow-md shadow-violet-900/40",
    text: "text-white font-semibold",
    label: "In Progress",
    labelClass: "bg-amber-500/15 text-amber-400",
    connector: "bg-white/8",
  },
  pending: {
    dot: "bg-slate-700",
    text: "text-slate-500",
    label: "Pending",
    labelClass: "bg-slate-700/40 text-slate-500",
    connector: "bg-white/8",
  },
};

export function StepSidebar({ steps, currentIndex }: StepSidebarProps) {
  return (
    <nav className="w-64 shrink-0" aria-label="Steps">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 px-1">
        Your Progress
      </h2>
      <ol className="relative">
        {steps.map((step, idx) => {
          const status = step.status ?? "pending";
          const cfg = statusConfig[status];
          const isLast = idx === steps.length - 1;

          return (
            <li key={step.id} className="relative flex gap-3 pb-6 last:pb-0">
              {!isLast && (
                <div
                  className={`absolute left-3 top-6 w-0.5 h-full -translate-x-1/2 ${cfg.connector}`}
                  aria-hidden="true"
                />
              )}

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
