"use client";

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  const isApiKeyError =
    message.includes("OPENAI_API_KEY") ||
    message.includes("AI service not configured");

  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold">
          !
        </span>
        <div>
          <p className="text-sm font-semibold text-red-300 mb-1">
            {isApiKeyError ? "API Key Not Configured" : "Something went wrong"}
          </p>
          {isApiKeyError ? (
            <div className="text-sm text-red-400 space-y-1">
              <p>The OpenAI API key is missing or invalid.</p>
              <p>
                Add <code className="bg-red-500/20 px-1 rounded font-mono text-xs">OPENAI_API_KEY=your_key</code> to your{" "}
                <code className="bg-red-500/20 px-1 rounded font-mono text-xs">.env.local</code> file and restart the dev server.
              </p>
            </div>
          ) : (
            <p className="text-sm text-red-400">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
