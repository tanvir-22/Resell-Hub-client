"use client";

import { Spinner } from "@heroui/react";

export function PageLoader({ label = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner
          size="lg"
          classNames={{
            circle1: "border-b-violet-600",
            circle2: "border-b-violet-400",
          }}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

export function SectionLoader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Spinner
        size="md"
        classNames={{
          circle1: "border-b-violet-600",
          circle2: "border-b-violet-400",
        }}
      />
      {label && (
        <p className="text-sm text-gray-400 dark:text-gray-500">{label}</p>
      )}
    </div>
  );
}
