"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiSmartphone, FiShoppingBag, FiHome, FiBook,
  FiActivity, FiCamera, FiMonitor, FiTruck,
  FiArrowRight, FiSearch,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { Reveal } from "@/components/home/Reveal";

const CATEGORIES = [
  {
    name: "Electronics",
    Icon: FiSmartphone,
    count: "12,400+",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-800",
    description: "Phones, laptops, TVs, audio gear and more.",
    popular: ["iPhones", "Laptops", "Headphones", "Smart TVs"],
  },
  {
    name: "Fashion",
    Icon: FiShoppingBag,
    count: "8,200+",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-800",
    description: "Clothing, shoes, bags and accessories.",
    popular: ["Sneakers", "Dresses", "Watches", "Bags"],
  },
  {
    name: "Home & Living",
    Icon: FiHome,
    count: "5,600+",
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-800",
    description: "Furniture, decor, kitchen and appliances.",
    popular: ["Sofas", "Lamps", "Kitchen Sets", "Curtains"],
  },
  {
    name: "Books",
    Icon: FiBook,
    count: "3,100+",
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-100 dark:border-green-800",
    description: "Textbooks, novels, comics and more.",
    popular: ["Textbooks", "Fiction", "Self-Help", "Comics"],
  },
  {
    name: "Sports",
    Icon: FiActivity,
    count: "2,900+",
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-100 dark:border-yellow-800",
    description: "Fitness gear, outdoor equipment and sportswear.",
    popular: ["Gym Equipment", "Bicycles", "Cricket Gear", "Yoga Mats"],
  },
  {
    name: "Cameras",
    Icon: FiCamera,
    count: "1,800+",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-100 dark:border-purple-800",
    description: "DSLRs, mirrorless, lenses and accessories.",
    popular: ["DSLRs", "Mirrorless", "Lenses", "Tripods"],
  },
  {
    name: "Computers",
    Icon: FiMonitor,
    count: "4,300+",
    color: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-800",
    description: "Desktops, monitors, components and peripherals.",
    popular: ["Desktops", "Monitors", "GPUs", "Keyboards"],
  },
  {
    name: "Vehicles",
    Icon: FiTruck,
    count: "950+",
    color: "from-teal-500 to-cyan-600",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-100 dark:border-teal-800",
    description: "Cars, bikes, spare parts and accessories.",
    popular: ["Cars", "Motorcycles", "Bicycles", "Spare Parts"],
  },
];

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const filtered = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 to-fuchsia-600 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Browse by Category
          </h1>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
            Find exactly what you&apos;re looking for across hundreds of
            categories with thousands of listings.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories…"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-colors text-sm backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-x-10 gap-y-2">
          {[
            { label: "Total Categories", value: "8" },
            { label: "Total Listings", value: "39,250+" },
            { label: "Verified Sellers", value: "12,000+" },
            { label: "New Today", value: "340+" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <span className="font-extrabold text-violet-600 dark:text-violet-400 text-lg">
                {value}
              </span>
              <span className="text-gray-400 text-sm ml-2">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 dark:text-gray-500 text-lg">
              No category found for &quot;{search}&quot;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {filtered.map(({ name, Icon, count, color, bg, text, border, description, popular }, i) => (
              <Reveal key={name} delay={i * 60}>
                <Link href={`/products?category=${encodeURIComponent(name)}`}>
                  <div className={`group relative rounded-2xl border ${border} bg-white dark:bg-slate-800 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
                    {/* Gradient accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl`} />

                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={26} className={text} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {name}
                          </h2>
                          <span className={`text-xs font-bold ${text} bg-current/10 px-2 py-0.5 rounded-full bg-opacity-10`}>
                            {count}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {description}
                        </p>

                        {/* Popular tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {popular.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <FiArrowRight
                        size={18}
                        className="text-gray-300 dark:text-slate-600 group-hover:text-violet-500 dark:group-hover:text-violet-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1"
                      />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <Reveal delay={200}>
          <div className="mt-16 text-center bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Can&apos;t find what you&apos;re looking for?
              </h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Browse all listings and use our advanced filters to find
                exactly what you need.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-6 py-3 rounded-xl hover:bg-violet-50 transition-colors text-sm shadow-lg"
              >
                Browse All Listings <FiArrowRight size={15} />
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
