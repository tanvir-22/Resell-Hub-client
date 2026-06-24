"use client";
import { Card } from "@heroui/react";
import { BsStarFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { Reveal } from "./Reveal";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Regular Seller · 200+ sales",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&fit=crop&crop=face",
    rating: 5,
    text: "I've sold over 200 items on ResellHub. The process is seamless and buyers are genuine — best platform I've used!",
  },
  {
    name: "Marcus Chen",
    role: "Tech Reseller · 500+ sales",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&fit=crop&crop=face",
    rating: 5,
    text: "As someone who flips electronics, the verified badge and buyer protection have been game-changers for my business.",
  },
  {
    name: "Priya Patel",
    role: "Buyer · 150+ purchases",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80&fit=crop&crop=face",
    rating: 5,
    text: "Found so many amazing deals here. Love how easy it is to chat with sellers and negotiate prices. Saved thousands!",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Reveal className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Loved by Our Community
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Don&apos;t just take our word for it — here&apos;s what real users are saying about
          ResellHub.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(({ name, role, avatar, rating, text }, i) => (
          <Reveal key={name} delay={i * 100}>
            <Card className="border border-gray-100 dark:border-slate-700 rounded-2xl hover:shadow-xl dark:hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all h-full bg-white dark:bg-slate-800">
              <Card.Content className="p-6">
                <div className="flex mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <BsStarFill key={j} className="text-amber-400" size={14} />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{name}</p>
                      <MdVerified className="text-emerald-500" size={14} />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{role}</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
