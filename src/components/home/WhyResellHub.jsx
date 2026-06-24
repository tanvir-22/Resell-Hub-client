"use client";
import { Card } from "@heroui/react";
import { Reveal } from "./Reveal";

const features = [
  {
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80&fit=crop",
    imageAlt: "Buyer protection",
    title: "Buyer Protection",
    desc: "Full refund guaranteed if item isn't as described.",
    accent: "from-emerald-500 to-teal-500",
    badge: "100% Safe",
  },
  {
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&q=80&fit=crop",
    imageAlt: "Instant listings",
    title: "Instant Listings",
    desc: "Our smart tool makes listing any item blazing fast.",
    accent: "from-amber-500 to-orange-500",
    badge: "List in 60s",
  },
  {
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&fit=crop",
    imageAlt: "Verified sellers",
    title: "Verified Sellers",
    desc: "Shop from identity-verified sellers with proven reviews.",
    accent: "from-blue-500 to-indigo-500",
    badge: "ID Verified",
  },
  {
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fit=crop",
    imageAlt: "Price insights",
    title: "Price Insights",
    desc: "AI-powered price suggestions for max competitiveness.",
    accent: "from-purple-500 to-pink-500",
    badge: "AI Powered",
  },
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
          {features.map(({ image, imageAlt, title, desc, accent, badge }, i) => (
            <Reveal key={title} delay={i * 100}>
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all hover:-translate-y-1 h-full group">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  {/* Badge */}
                  <span className={`absolute top-3 right-3 bg-gradient-to-r ${accent} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg`}>
                    {badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-white font-bold mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
