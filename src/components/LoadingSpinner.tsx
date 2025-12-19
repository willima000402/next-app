"use client";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="h-10 w-10 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
