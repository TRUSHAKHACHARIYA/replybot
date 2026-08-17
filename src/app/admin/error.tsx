"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-text-primary">Admin Panel Error</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Failed to load admin data. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 inline-flex items-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
