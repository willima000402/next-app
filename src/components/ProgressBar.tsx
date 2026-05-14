"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
        <span>
          Step {current + 1} of {total}
        </span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
