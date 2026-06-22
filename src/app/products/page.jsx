"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiStar,
  FiHeart,
  FiFilter,
  FiX,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { getProducts } from "@/lib/api/products";
const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Sports",
  "Books",
  "Furniture",
  "Vehicles",
  "Toys",
  "Collectibles",
];
const CONDITIONS = ["All", "Like New", "Good", "Fair", "Used"];



const SORT_OPTIONS = [
  { label: "Newest", key: "newest" },
  { label: "Price: Low-High", key: "price_asc" },
  { label: "Price: High-Low", key: "price_desc" },
  { label: "Top Rated", key: "rating" },
  { label: "Most Saved", key: "saves" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [sortKey, setSortKey] = useState("newest");
  const [view, setView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    getProducts().then((data) => {
      console.log("type:", typeof data, Array.isArray(data));
      console.log("keys:", Object.keys(data));
      console.log("raw:", data);
      setProducts(Array.isArray(data) ? data : (data.products ?? []));
    });
  }, []);
  const filtered = useMemo(() => {
    let list = [...products];
    if (search)
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()),
      );
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (condition !== "All")
      list = list.filter((p) => p.condition === condition);
    if (sortKey === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sortKey === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sortKey === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sortKey === "saves") list.sort((a, b) => b.saves - a.saves);
    return list;
  }, [search, category, condition, sortKey, products]);
  console.log(filtered);
  const activeFilters = [
    category !== "All" && { label: category, clear: () => setCategory("All") },
    condition !== "All" && {
      label: condition,
      clear: () => setCondition("All"),
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero search */}
      <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Browse Listings
          </h1>
          <p className="text-white/70 mb-6">
            Thousands of quality pre-owned items, curated for you
          </p>
          <div className="relative">
            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for anything…"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-base focus:outline-none shadow-xl"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {/* Condition */}
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              {CONDITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {/* Sort */}
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>

            {/* Active filter chips */}
            {activeFilters.map((f) => (
              <button
                key={f.label}
                onClick={f.clear}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-medium hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
              >
                {f.label} <FiX size={11} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} results
            </span>
            <div className="flex bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`p-2 ${view === "grid" ? "bg-violet-600 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"} transition-colors`}
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 ${view === "list" ? "bg-violet-600 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"} transition-colors`}
              >
                <FiList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                category === c
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                  : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-violet-300 dark:hover:border-violet-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <FiSearch
              size={40}
              className="text-gray-300 dark:text-slate-600 mb-4"
            />
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
              No listings found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setCondition("All");
              }}
              className="mt-4 px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <Link
                key={p._id}
                href={`/products/${p._id}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-violet-600/10 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-700">
                  <img
                    src={p.images?.[0]}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.condition === "Like New"
                          ? "bg-green-500 text-white"
                          : p.condition === "Good"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-500 text-white"
                      }`}
                    >
                      {p.condition}
                    </span>
                  </div>
                  <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                    <FiHeart
                      size={14}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-0.5">
                    {p.category}
                  </p>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-extrabold text-gray-900 dark:text-white">
                      ${p.price.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                      <FiStar size={11} fill="currentColor" /> {p.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                    by {p.sellerInfo?.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <Link
                key={p._id}
                href={`/products/${p._id}`}
                className="flex gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 hover:shadow-lg hover:shadow-violet-600/10 hover:-translate-x-0.5 transition-all duration-200 group"
              >
                <div className="w-28 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
                  <img
                    src={p.images?.[0]}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                        {p.category}
                      </p>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mt-0.5">
                        {p.title}
                      </h3>
                    </div>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white whitespace-nowrap">
                      ${p.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.condition === "Like New"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                          : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {p.condition}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                      <FiStar size={11} fill="currentColor" /> {p.rating}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      by {p.sellerInfo?.name}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {p.saves} saves
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
