"use client";
import { Button } from "@heroui/react";
import { Reveal } from "./Reveal";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-500/0 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-teal-500/0 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-64 h-64 bg-cyan-600/0 dark:bg-cyan-600/10 rounded-full blur-2xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-emerald-700/0 dark:bg-emerald-700/10 rounded-full blur-2xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      <Reveal className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Ready to Start Selling?
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          Join 120,000+ sellers who turned their unwanted items into cash. Free to list — just 2
          minutes to start.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-emerald-700 font-bold px-10 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:scale-105 shine-btn">
            Create Free Account
          </Button>
          <Button className="border-2 border-white/40 hover:border-white text-white font-semibold px-10 py-4 rounded-xl transition-all hover:scale-105 hover:bg-white/10 bg-transparent">
            Browse Listings First
          </Button>
        </div>
        <p className="text-white/40 text-xs mt-6">
          No credit card required · Free to list · Cancel anytime
        </p>
      </Reveal>
    </section>
  );
}
