"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger/10">
        <AlertTriangle className="h-10 w-10 text-danger" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Something went wrong!</h2>
      <p className="mb-6 max-w-md text-muted">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
