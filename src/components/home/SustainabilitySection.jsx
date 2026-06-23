"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { TbLeaf, TbDroplet, TbRecycle, TbSun } from "react-icons/tb";
import { Reveal } from "./Reveal";

const impacts = [
  {
    icon: TbLeaf,
    value: "2,400",
    unit: "tonnes",
    label: "CO₂ Emissions Prevented",
    sub: "Every resale avoids the carbon cost of manufacturing new goods.",
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: TbRecycle,
    value: "850K",
    unit: "items",
    label: "Diverted from Landfill",
    sub: "Products that found a second home instead of the trash.",
    color: "from-violet-500 to-fuchsia-600",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: TbDroplet,
    value: "18M",
    unit: "litres",
    label: "Water Saved",
    sub: "Reusing clothes alone saves thousands of litres per item.",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: TbSun,
    value: "3.2M",
    unit: "kWh",
    label: "Energy Conserved",
    sub: "Skipping production = skipping its enormous energy footprint.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
  },
];

const pillars = [
  {
    icon: TbLeaf,
    title: "Reduce Waste",
    desc: "Every second-hand purchase keeps an item out of a landfill. Small choices, big difference.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: TbDroplet,
    title: "Save Resources",
    desc: "Manufacturing new products consumes water, materials, and energy. Buying used skips all of that.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: TbSun,
    title: "Lower Emissions",
    desc: "Choosing pre-owned over new reduces the carbon footprint associated with production and shipping.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
];

function CountUp({ target, duration = 1800 }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();

        // Strip non-numeric suffix (e.g. "K", "M", "t") for the animation
        const raw = parseFloat(target.replace(/[^0-9.]/g, ""));
        const suffix = target.replace(/[0-9.,]/g, "");
        const start = performance.now();

        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const cur = raw * eased;
          // Format with commas for large whole numbers, keep one decimal if fractional
          const formatted =
            raw % 1 === 0
              ? Math.round(cur).toLocaleString()
              : cur.toFixed(1);
          setDisplay(formatted + suffix);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{display}</span>;
}

export function SustainabilitySection() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 py-24 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal className="text-center mb-16">
          <span className="inline-block text-xs font-bold bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-emerald-500/30">
            Sustainability Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Every Purchase Makes
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              a Real Difference
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            Buying second-hand isn&apos;t just smart for your wallet — it&apos;s one
            of the most effective ways to reduce your environmental footprint.
            Here&apos;s what the ResellHub community has achieved together.
          </p>
        </Reveal>

        {/* Impact stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {impacts.map(({ icon: Icon, value, unit, label, sub, color, bg, text }, i) => (
            <Reveal key={label} delay={i * 90}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4 flex-shrink-0`}>
                  <Icon size={22} className={text} />
                </div>

                {/* Animated counter */}
                <p className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent leading-none`}>
                  <CountUp target={value} />
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1 mb-2">
                  {unit}
                </p>
                <p className="text-sm font-bold text-white mb-1">{label}</p>
                <p className="text-xs text-gray-400 leading-relaxed mt-auto pt-2">
                  {sub}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-16" />

        {/* Pillars + visual */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: pillars */}
          <div className="space-y-5">
            <Reveal>
              <h3 className="text-2xl font-extrabold text-white mb-6">
                How buying second-hand helps the planet
              </h3>
            </Reveal>
            {pillars.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="flex gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm mb-1">{title}</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Right: visual pledge card */}
          <Reveal delay={150}>
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl" />

              <div className="relative bg-gradient-to-br from-emerald-600/90 to-teal-700/90 rounded-3xl p-8 border border-emerald-500/30 backdrop-blur-sm">
                {/* Leaf icon big */}
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <TbLeaf size={36} className="text-white" />
                </div>

                <h4 className="text-2xl font-extrabold text-white mb-3">
                  The ResellHub
                  <br />Green Pledge
                </h4>
                <p className="text-emerald-100/80 text-sm leading-relaxed mb-6">
                  For every item sold on ResellHub, we commit to planting one
                  tree and partnering with local recycling drives to reduce
                  textile and electronics waste across Bangladesh.
                </p>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { v: "1 tree", l: "per sale" },
                    { v: "Zero",   l: "plastic packaging" },
                    { v: "100%",   l: "digital receipts" },
                  ].map(({ v, l }) => (
                    <div key={l} className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-white font-extrabold text-sm">{v}</p>
                      <p className="text-emerald-200/70 text-xs mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors text-sm shadow-lg"
                >
                  Shop Sustainably <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
