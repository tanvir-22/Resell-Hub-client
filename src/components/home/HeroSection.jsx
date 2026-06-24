"use client";
import { useState } from "react";
import { Button } from "@heroui/react";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { MdSell } from "react-icons/md";
import { TypeAnimation } from "react-type-animation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Link from "next/link";

const POPULAR_TAGS = [
  "iPhone 15",
  "MacBook Pro",
  "AirPods",
  "Nike Shoes",
  "PS5",
];

const SLIDER_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80&fit=crop",
    label: "Marketplace Shopping",
  },
  {
    url: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=700&q=80&fit=crop",
    label: "Quick Deliveries",
  },
  {
    url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=700&q=80&fit=crop",
    label: "Preloved Fashion",
  },
  {
    url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=700&q=80&fit=crop",
    label: "Sneakers & Shoes",
  },
  {
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80&fit=crop",
    label: "Watches & Accessories",
  },
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white pt-24 pb-20">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-blob absolute -top-48 -right-48 w-96 h-96 bg-emerald-600/25 rounded-full blur-3xl" />
        <div className="animate-blob animation-delay-2s absolute top-1/2 -left-48 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="animate-blob animation-delay-4s absolute bottom-0 right-1/4 w-72 h-72 bg-teal-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* ── Left: text ── */}
          <div className="flex-1 text-center lg:text-left">
            <div className="animate-fade-in-up delay-100 inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-gray-300">
                500,000+ items listed this month
              </span>
            </div>

            <h1
              className="animate-fade-in-up delay-200 text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight mb-6"
              style={{ lineHeight: 1.15 }}
            >
              The Smartest Way to
              <br />
              <span className="hero-gradient-text">
                <TypeAnimation
                  sequence={[
                    "Buy & Sell Preloved Items",
                    2000,
                    "Turn Clutter into Cash",
                    2000,
                    "Find Amazing Deals",
                    2000,
                    "Trade Your Treasures",
                    2000,
                  ]}
                  speed={55}
                  deletionSpeed={75}
                  repeat={Infinity}
                  cursor={true}
                />
              </span>
            </h1>

            <p className="animate-fade-in-up delay-300 text-lg text-gray-300 max-w-xl mb-10 mx-auto lg:mx-0">
              Join millions of people buying and selling preloved items. Turn
              your unwanted stuff into cash — or find amazing deals near you.
            </p>

            <div className="animate-fade-in-up delay-400 max-w-xl mb-8 mx-auto lg:mx-0">
              <div className="flex items-center bg-white rounded-2xl p-1.5 gap-2 shadow-2xl shadow-emerald-900/20">
                <FiSearch
                  className="text-gray-400 ml-3 flex-shrink-0"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search for anything... iPhone, Nike shoes, MacBook..."
                  className="flex-1 text-gray-900 text-sm placeholder:text-gray-400 outline-none bg-transparent py-2.5 px-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap shine-btn">
                  Search
                </Button>
              </div>
            </div>

            <div className="animate-fade-in-up delay-500 flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-10">
              <span className="text-gray-500 text-sm">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 text-gray-300 text-xs transition-all hover:scale-105"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="animate-fade-in-up delay-600 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/products">
                <Button className="flex items-center justify-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg w-full sm:w-auto hover:scale-105">
                  Browse Listings <FiArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 hover:border-white/70 text-white font-semibold px-8 py-4 rounded-xl transition-all w-full sm:w-auto hover:scale-105 hover:bg-white/5">
                  <MdSell size={18} /> Start Selling Free
                </Button>
              </Link>
            </div>
          </div>

          {/* ── Right: Swiper carousel ── */}
          <div className="w-full lg:w-[45%] animate-fade-in-up delay-300">
            <Swiper
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              effect="fade"
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation
              loop
              className="hero-swiper rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
              style={{ height: "460px" }}
            >
              {SLIDER_IMAGES.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-full">
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute bottom-12 left-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs px-3 py-1 rounded-full">
                      {img.label}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
