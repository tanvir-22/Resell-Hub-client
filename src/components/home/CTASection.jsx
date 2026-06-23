"use client";
import { Button } from "@heroui/react";
import { Reveal } from "./Reveal";

export function CTASection() {
  return (
    <section className="bg-emerald-600 py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-blob absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="animate-blob animation-delay-2s absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
      </div>
      <Reveal className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Ready to Start Selling?
        </h2>
        <p className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto">
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
        <p className="text-emerald-200/80 text-xs mt-6">
          No credit card required · Free to list · Cancel anytime
        </p>
      </Reveal>
    </section>
  );
}
