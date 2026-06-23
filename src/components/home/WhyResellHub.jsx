"use client";
import { Card } from "@heroui/react";
import { FiShield, FiZap, FiTrendingUp } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { Reveal } from "./Reveal";

const features = [
  { Icon: FiShield,     title: "Buyer Protection",  desc: "Full refund guaranteed if item isn't as described.",       textColor: "text-emerald-600",  bgColor: "bg-emerald-50"  },
  { Icon: FiZap,        title: "Instant Listings",  desc: "Our smart tool makes listing any item blazing fast.",      textColor: "text-amber-600",   bgColor: "bg-amber-50"   },
  { Icon: MdVerified,   title: "Verified Sellers",  desc: "Shop from identity-verified sellers with proven reviews.", textColor: "text-blue-600",    bgColor: "bg-blue-50"    },
  { Icon: FiTrendingUp, title: "Price Insights",    desc: "AI-powered price suggestions for max competitiveness.",    textColor: "text-emerald-600", bgColor: "bg-emerald-50" },
];

export function WhyResellHub() {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-emerald-950 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Why Choose ResellHub?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We&apos;ve built the safest, fastest, and most trustworthy reselling platform on the
            market.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ Icon, title, desc, textColor, bgColor }, i) => (
            <Reveal key={title} delay={i * 100}>
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1 h-full">
                <Card.Content className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-5`}>
                    <Icon className={textColor} size={22} />
                  </div>
                  <h3 className="text-white font-bold mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </Card.Content>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
