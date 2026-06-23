"use client";
import { FiMessageSquare, FiShield } from "react-icons/fi";
import { MdSell } from "react-icons/md";
import { Reveal } from "./Reveal";

const steps = [
  {
    step: "01", Icon: MdSell,
    title: "List Your Item",
    description: "Take photos, set your price, and publish in under 2 minutes. Always free to list.",
  },
  {
    step: "02", Icon: FiMessageSquare,
    title: "Connect with Buyers",
    description: "Chat directly with verified buyers, negotiate offers, and close deals on your terms.",
  },
  {
    step: "03", Icon: FiShield,
    title: "Get Paid Safely",
    description: "Every transaction is covered by our money-back guarantee. Safe and fast payouts.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          How ResellHub Works
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Getting started takes less than 5 minutes. Here&apos;s how to buy or sell on ResellHub.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map(({ step, Icon, title, description }, i) => (
          <Reveal key={step} delay={i * 150} className="flex flex-col items-center text-center">
            <div className="relative mb-6 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                <Icon size={32} />
              </div>
              <div className="absolute -top-3 -right-3 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-amber-900 shadow">
                {step}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
