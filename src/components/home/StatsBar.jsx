"use client";
import { StatCounter } from "./StatCounter";

export function StatsBar() {
  return (
    <section className="relative z-10" style={{ marginTop: "-4rem" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x divide-gray-100 dark:divide-slate-700">
          <StatCounter value={500} suffix="K+" label="Active Listings" />
          <StatCounter value={120} suffix="K+" label="Verified Sellers" />
          <StatCounter value={50} suffix="+" label="Categories" />
          <StatCounter isStatic staticDisplay="4.9" suffix="★" label="Avg. Rating" />
        </div>
      </div>
    </section>
  );
}
