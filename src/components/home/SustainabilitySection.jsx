"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { TbLeaf, TbDroplet, TbSun } from "react-icons/tb";
import { Reveal } from "./Reveal";

const impacts = [
  {
    // seedling/plant — CO2 absorbed by new growth
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80&fit=crop",
    imageAlt: "Green seedling representing CO₂ prevention",
    value: "2,400",
    unit: "tonnes",
    label: "CO₂ Emissions Prevented",
    sub: "Every resale avoids the carbon cost of manufacturing new goods.",
    color: "from-emerald-500 to-green-600",
  },
  {
    // pile of second-hand clothes — directly represents items saved from landfill
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&fit=crop",
    imageAlt: "Second-hand clothing diverted from landfill",
    value: "850K",
    unit: "items",
    label: "Diverted from Landfill",
    sub: "Products that found a second home instead of the trash.",
    color: "from-violet-500 to-fuchsia-600",
  },
  {
    // clear flowing water — water conservation
    image: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80&fit=crop",
    imageAlt: "Clean water saved",
    value: "18M",
    unit: "litres",
    label: "Water Saved",
    sub: "Reusing clothes alone saves thousands of litres per item.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    // wind turbines — clean energy / energy conservation
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&q=80&fit=crop",
    imageAlt: "Wind turbines representing energy conservation",
    value: "3.2M",
    unit: "kWh",
    label: "Energy Conserved",
    sub: "Skipping production = skipping its enormous energy footprint.",
    color: "from-amber-500 to-orange-500",
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
    <section className="bg-gradient-to-br from-white via-gray-50 to-emerald-50 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 py-24 overflow-hidden relative">
      {/* Decorative blobs — subtle in light, visible in dark */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/5 dark:bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal className="text-center mb-16">
          <span className="inline-block text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-emerald-200 dark:border-emerald-500/30">
            Sustainability Impact
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Every Purchase Makes
            <span className="block bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              a Real Difference
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            Buying second-hand isn&apos;t just smart for your wallet — it&apos;s one
            of the most effective ways to reduce your environmental footprint.
            Here&apos;s what the ResellHub community has achieved together.
          </p>
        </Reveal>

        {/* Impact stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {impacts.map(({ image, imageAlt, value, unit, label, sub, color }, i) => (
            <Reveal key={label} delay={i * 90}>
              <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-lg dark:hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col group shadow-sm">
                {/* Image */}
                <div className="relative h-32 overflow-hidden flex-shrink-0">
                  <img
                    src={image}
                    alt={imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-slate-900/60 to-transparent" />
                </div>

                {/* Stats */}
                <div className="p-5 flex flex-col flex-1">
                  <p className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${color} bg-clip-text text-transparent leading-none`}>
                    <CountUp target={value} />
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold mt-1 mb-2">
                    {unit}
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-auto pt-2">
                    {sub}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/10 mb-16" />

        {/* Pillars + visual */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: pillars */}
          <div className="space-y-5">
            <Reveal>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
                How buying second-hand helps the planet
              </h3>
            </Reveal>
            {pillars.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="flex gap-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-5 hover:shadow-md dark:hover:bg-white/8 transition-all shadow-sm">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{title}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
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
