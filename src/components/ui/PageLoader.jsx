"use client";

export function PageLoader({ label = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

export function SectionLoader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      {label && (
        <p className="text-sm text-gray-400 dark:text-gray-500">{label}</p>
      )}
    </div>
  );
}
