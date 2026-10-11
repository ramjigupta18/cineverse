import React from "react";

const Loader = () => {
  return (
    <div
      className="flex min-h-48 flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />
      <p className="text-sm text-zinc-400">
        Finding your next favorite movie...
      </p>
    </div>
  );
};

export default Loader;