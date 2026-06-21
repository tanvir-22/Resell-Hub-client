"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Button, Card, Chip, Avatar } from "@heroui/react";
import { Navbar } from "@/components/Navbar";
import {
  FiSearch, FiShoppingBag, FiArrowRight, FiShield,
  FiSmartphone, FiHome, FiBook, FiCamera, FiMonitor, FiTruck,
  FiActivity, FiMessageSquare, FiTrendingUp, FiZap,
  FiTwitter, FiFacebook, FiInstagram, FiLinkedin,
} from "react-icons/fi";
import { MdVerified, MdSell } from "react-icons/md";
import { BsStarFill, BsTagFill, BsFillHeartFill, BsHeart } from "react-icons/bs";

/* ─────────────────────────────── helpers ────────────────────────────────── */

function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target == null) return;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setCount(Math.round(eased * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, active]);
  return count;
}

function StatCounter({ value, suffix, label, isStatic, staticDisplay }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 1800, active && !isStatic);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); io.disconnect(); } },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center px-4">
      <p className="text-3xl font-extrabold text-gray-900 tabular-nums">
        {isStatic ? staticDisplay : count}{suffix}
      </p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────── data ───────────────────────────────────── */

const categories = [
  { name: "Electronics",  Icon: FiSmartphone, count: "12,400+", color: "bg-blue-50 text-blue-600" },
  { name: "Fashion",      Icon: FiShoppingBag, count: "8,200+",  color: "bg-rose-50 text-rose-600" },
  { name: "Home & Living",Icon: FiHome,        count: "5,600+",  color: "bg-orange-50 text-orange-600" },
  { name: "Books",        Icon: FiBook,        count: "3,100+",  color: "bg-green-50 text-green-600" },
  { name: "Sports",       Icon: FiActivity,    count: "2,900+",  color: "bg-yellow-50 text-yellow-600" },
  { name: "Cameras",      Icon: FiCamera,      count: "1,800+",  color: "bg-purple-50 text-purple-600" },
  { name: "Computers",    Icon: FiMonitor,     count: "4,300+",  color: "bg-indigo-50 text-indigo-600" },
  { name: "Vehicles",     Icon: FiTruck,       count: "950+",    color: "bg-teal-50 text-teal-600" },
];

const listings = [
  {
    id: 1, title: "iPhone 15 Pro Max 256GB",
    price: "$750", originalPrice: "$1,199",
    condition: "Like New", conditionColor: "success",
    image: "https://placehold.co/400x300/7c3aed/ffffff?text=iPhone+15+Pro",
    seller: "TechDeals Pro", verified: true, rating: "4.9", saves: 47,
  },
  {
    id: 2, title: "MacBook Pro M3 14-inch",
    price: "$1,200", originalPrice: "$1,999",
    condition: "Good", conditionColor: "primary",
    image: "https://placehold.co/400x300/3b82f6/ffffff?text=MacBook+Pro+M3",
    seller: "AppleHub Store", verified: true, rating: "4.8", saves: 89,
  },
  {
    id: 3, title: "Sony PlayStation 5 Bundle",
    price: "$380", originalPrice: "$499",
    condition: "Like New", conditionColor: "success",
    image: "https://placehold.co/400x300/1e40af/ffffff?text=PlayStation+5",
    seller: "GameVault", verified: false, rating: "4.7", saves: 123,
  },
  {
    id: 4, title: "Canon EOS R6 Mark II",
    price: "$1,600", originalPrice: "$2,499",
    condition: "Good", conditionColor: "primary",
    image: "https://placehold.co/400x300/ea580c/ffffff?text=Canon+EOS+R6",
    seller: "LensWorld", verified: true, rating: "5.0", saves: 56,
  },
  {
    id: 5, title: "Nike Air Jordan 1 Retro OG",
    price: "$185", originalPrice: "$280",
    condition: "Good", conditionColor: "primary",
    image: "https://placehold.co/400x300/dc2626/ffffff?text=Air+Jordan+1",
    seller: "SneakerHub", verified: true, rating: "4.6", saves: 34,
  },
  {
    id: 6, title: "DJI Mavic 3 Pro Drone",
    price: "$1,400", originalPrice: "$2,199",
    condition: "Like New", conditionColor: "success",
    image: "https://placehold.co/400x300/0891b2/ffffff?text=DJI+Mavic+3",
    seller: "FlyHigh Drones", verified: true, rating: "4.9", saves: 78,
  },
];

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

const features = [
  { Icon: FiShield,    title: "Buyer Protection",  desc: "Full refund guaranteed if item isn't as described.", textColor: "text-violet-600", bgColor: "bg-violet-50" },
  { Icon: FiZap,       title: "Instant Listings",  desc: "Our smart tool makes listing any item blazing fast.",textColor: "text-amber-600",  bgColor: "bg-amber-50"  },
  { Icon: MdVerified,  title: "Verified Sellers",  desc: "Shop from identity-verified sellers with proven reviews.", textColor: "text-blue-600",   bgColor: "bg-blue-50"   },
  { Icon: FiTrendingUp,title: "Price Insights",    desc: "AI-powered price suggestions for max competitiveness.",  textColor: "text-emerald-600",bgColor: "bg-emerald-50"},
];

const testimonials = [
  {
    name: "Sarah Johnson", role: "Regular Seller · 200+ sales",
    initials: "SJ", bg: "bg-violet-600",
    rating: 5,
    text: "I've sold over 200 items on ResellHub. The process is seamless and buyers are genuine — best platform I've used!",
  },
  {
    name: "Marcus Chen", role: "Tech Reseller · 500+ sales",
    initials: "MC", bg: "bg-blue-600",
    rating: 5,
    text: "As someone who flips electronics, the verified badge and buyer protection have been game-changers for my business.",
  },
  {
    name: "Priya Patel", role: "Buyer · 150+ purchases",
    initials: "PP", bg: "bg-pink-500",
    rating: 5,
    text: "Found so many amazing deals here. Love how easy it is to chat with sellers and negotiate prices. Saved thousands!",
  },
];

const socialIcons = [FiTwitter, FiFacebook, FiInstagram, FiLinkedin];
const footerLinks = [
  { title: "Marketplace", links: ["Browse All", "New Listings", "Trending", "Near Me", "Deals"] },
  { title: "Selling",     links: ["Start Selling", "Seller Guide", "Pricing", "Promotions", "Analytics"] },
  { title: "Support",     links: ["Help Center", "Safety Tips", "Contact Us", "Report Issue", "Trust & Safety"] },
];

/* ─────────────────────────────── page ───────────────────────────────────── */

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [saved, setSaved]             = useState({});

  const toggleSave = (id) => setSaved((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white pt-20 pb-36">
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="animate-blob absolute -top-48 -right-48 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl" />
          <div className="animate-blob animation-delay-2s absolute top-1/2 -left-48 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="animate-blob animation-delay-4s absolute bottom-0 right-1/4 w-72 h-72 bg-fuchsia-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Live badge */}
          <div className="animate-fade-in-up delay-100 inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-gray-300">
              500,000+ items listed this month
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up delay-200 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
            style={{ lineHeight: 1.1 }}
          >
            The Smartest Way to
            <br />
            <span className="hero-gradient-text">Buy &amp; Sell</span> Anything
          </h1>

          <p className="animate-fade-in-up delay-300 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Join millions of people buying and selling preloved items. Turn your
            unwanted stuff into cash — or find amazing deals near you.
          </p>

          {/* Search bar */}
          <div className="animate-fade-in-up delay-400 max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-white rounded-2xl p-1.5 gap-2 shadow-2xl shadow-violet-900/20">
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
              <Button className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap shine-btn">
                Search
              </Button>
            </div>
          </div>

          {/* Quick searches */}
          <div className="animate-fade-in-up delay-500 flex flex-wrap items-center justify-center gap-2 mb-10">
            <span className="text-gray-500 text-sm">Popular:</span>
            {["iPhone 15", "MacBook Pro", "AirPods", "Nike Shoes", "PS5"].map(
              (tag) => (
                <button
                  key={tag}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 text-gray-300 text-xs transition-all hover:scale-105"
                >
                  {tag}
                </button>
              ),
            )}
          </div>

          {/* CTA buttons */}
          <div className="animate-fade-in-up delay-600 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="flex items-center justify-center gap-2 bg-white text-violet-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg w-full sm:w-auto hover:scale-105">
              Browse Listings <FiArrowRight size={18} />
            </Button>
            <Button className="flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 hover:border-white/70 text-white font-semibold px-8 py-4 rounded-xl transition-all w-full sm:w-auto hover:scale-105 hover:bg-white/5">
              <MdSell size={18} /> Start Selling Free
            </Button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10" style={{ marginTop: "-4rem" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x divide-gray-100">
            <StatCounter value={500} suffix="K+" label="Active Listings" />
            <StatCounter value={120} suffix="K+" label="Verified Sellers" />
            <StatCounter value={50} suffix="+" label="Categories" />
            <StatCounter
              isStatic
              staticDisplay="4.9"
              suffix="★"
              label="Avg. Rating"
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From electronics to fashion, find exactly what you&apos;re looking
            for across hundreds of categories.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(({ name, Icon, count, color }, i) => (
            <Reveal key={name} delay={i * 60}>
              <button className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all bg-white text-left w-full hover:-translate-y-1">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{count} items</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="text-center mt-8">
          <button className="inline-flex items-center gap-2 text-violet-600 font-semibold text-sm hover:text-violet-700 transition-colors border border-violet-200 px-6 py-3 rounded-xl hover:bg-violet-50 hover:scale-105 transition-all">
            View all categories <FiArrowRight size={16} />
          </button>
        </Reveal>
      </section>

      {/* ── FEATURED LISTINGS ── */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                Featured Listings
              </h2>
              <p className="text-gray-500">
                Hand-picked deals from verified sellers
              </p>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-violet-600 font-semibold text-sm hover:text-violet-700 transition-colors">
              View all <FiArrowRight size={16} />
            </button>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <Card className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-violet-200 hover:shadow-xl transition-all cursor-pointer bg-white hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => toggleSave(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
                    >
                      {saved[item.id] ? (
                        <BsFillHeartFill size={14} className="text-rose-500" />
                      ) : (
                        <BsHeart
                          size={14}
                          className="text-gray-400 hover:text-rose-500 transition-colors"
                        />
                      )}
                    </button>
                    <Chip
                      color={item.conditionColor}
                      variant="flat"
                      className="absolute top-3 left-3 text-xs font-semibold"
                    >
                      {item.condition}
                    </Chip>
                  </div>

                  {/* Info */}
                  <Card.Content className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-extrabold text-violet-600">
                        {item.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {item.originalPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        {item.verified && (
                          <MdVerified className="text-blue-500" size={14} />
                        )}
                        <span className="truncate max-w-[120px]">
                          {item.seller}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <BsStarFill className="text-amber-400" size={11} />
                          {item.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <BsHeart size={11} />
                          {saved[item.id] ? item.saves + 1 : item.saves}
                        </span>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            How ResellHub Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Getting started takes less than 5 minutes. Here&apos;s how to buy or
            sell on ResellHub.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map(({ step, Icon, title, description }, i) => (
            <Reveal
              key={step}
              delay={i * 150}
              className="flex flex-col items-center text-center"
            >
              <div
                className="relative mb-6 animate-float"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-violet-200">
                  <Icon size={32} />
                </div>
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-amber-900 shadow">
                  {step}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {description}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── WHY RESELLHUB ── */}
      <section className="bg-gradient-to-br from-slate-900 to-violet-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Why Choose ResellHub?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              We&apos;ve built the safest, fastest, and most trustworthy
              reselling platform on the market.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ Icon, title, desc, textColor, bgColor }, i) => (
              <Reveal key={title} delay={i * 100}>
                <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1 h-full">
                  <Card.Content className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-5`}
                    >
                      <Icon className={textColor} size={22} />
                    </div>
                    <h3 className="text-white font-bold mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </Card.Content>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Loved by Our Community
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Don&apos;t just take our word for it — here&apos;s what real users
            are saying about ResellHub.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, initials, bg, rating, text }, i) => (
            <Reveal key={name} delay={i * 100}>
              <Card className="border border-gray-100 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all h-full bg-white">
                <Card.Content className="p-6">
                  <div className="flex mb-4">
                    {Array.from({ length: rating }).map((_, j) => (
                      <BsStarFill
                        key={j}
                        className="text-amber-400"
                        size={14}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    &ldquo;{text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar size="md">
                      <Avatar.Fallback
                        className={`${bg} text-white font-semibold text-sm`}
                      >
                        {initials}
                      </Avatar.Fallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {name}
                      </p>
                      <p className="text-xs text-gray-400">{role}</p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-violet-600 py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-blob absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="animate-blob animation-delay-2s absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        </div>
        <Reveal className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-violet-100 text-lg mb-10 max-w-xl mx-auto">
            Join 120,000+ sellers who turned their unwanted items into cash.
            Free to list — just 2 minutes to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-violet-700 font-bold px-10 py-4 rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:scale-105 shine-btn">
              Create Free Account
            </Button>
            <Button className="border-2 border-white/40 hover:border-white text-white font-semibold px-10 py-4 rounded-xl transition-all hover:scale-105 hover:bg-white/10 bg-transparent">
              Browse Listings First
            </Button>
          </div>
          <p className="text-violet-200/80 text-xs mt-6">
            No credit card required · Free to list · Cancel anytime
          </p>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                  <BsTagFill className="text-white" size={14} />
                </div>
                <span className="text-white font-bold text-xl">
                  Resell<span className="text-violet-400">Hub</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400 max-w-xs mb-6">
                The trusted marketplace for buying and selling preloved items.
                Safe, fast, and always free to list.
              </p>
              <div className="flex gap-3">
                {socialIcons.map((Icon, i) => (
                  <button
                    key={i}
                    aria-label="Social link"
                    className="w-9 h-9 bg-white/5 hover:bg-violet-600/60 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:border-violet-500"
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerLinks.map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-white font-semibold text-sm mb-4">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm hover:text-white hover:translate-x-1 transition-all inline-block"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2025 ResellHub, Inc. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (link) => (
                  <Link
                    key={link}
                    href="#"
                    className="hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
