"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiSearch,
  FiStar,
  FiHeart,
  FiFilter,
  FiX,
  FiGrid,
  FiList,
  FiColumns,
  FiChevronLeft,
  FiChevronRight,
  FiTag,
} from "react-icons/fi";
import { useCompare } from "@/context/CompareContext";
import { Navbar } from "@/components/Navbar";
import toast from "react-hot-toast";
import { getProducts } from "@/lib/api/products";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { useSession } from "@/lib/auth-client";
import { SectionLoader } from "@/components/ui/PageLoader";

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

function ProductsPageInner() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    () => searchParams.get("category") || "All"
  );
  const [condition, setCondition] = useState("All");
  const [sortKey, setSortKey] = useState("newest");
  const [view, setView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistMap, setWishlistMap] = useState({});
  const [toggling, setToggling] = useState(new Set());
  const { addToCompare, isInCompare } = useCompare();
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  useEffect(() => {
    setLoadingProducts(true);
    getProducts().then((data) => {
      const all = Array.isArray(data) ? data : (data.products ?? []);
      setProducts(all.filter(p => !p.status || p.status === "approved"));
      setLoadingProducts(false);
    });
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    getWishlist(session.user.email).then((items) => {
      if (!Array.isArray(items)) return;
      const map = {};
      items.forEach((item) => { map[item.productId] = item._id; });
      setWishlistMap(map);
    });
  }, [session?.user]);

  const toggleWishlist = async (e, p) => {
    e.preventDefault();
    if (!session?.user) return;
    const productId = p._id;
    if (toggling.has(productId)) return;
    setToggling((prev) => new Set(prev).add(productId));

    if (wishlistMap[productId]) {
      const docId = wishlistMap[productId];
      setWishlistMap((prev) => { const n = { ...prev }; delete n[productId]; return n; });
      await removeFromWishlist(docId, session.user.email);
      toast("Removed from wishlist", { icon: "🤍", duration: 1500 });
    } else {
      const optimisticId = "pending-" + productId;
      setWishlistMap((prev) => ({ ...prev, [productId]: optimisticId }));
      const saved = await addToWishlist({
        productId,
        title: p.title,
        price: p.price,
        image: p.images?.[0],
        seller: p.sellerInfo?.name,
      }, session.user.email);
      setWishlistMap((prev) => ({ ...prev, [productId]: saved._id }));
      toast.success("Saved to wishlist", { duration: 1500 });
    }

    setToggling((prev) => { const n = new Set(prev); n.delete(productId); return n; });
  };

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

  // reset to page 1 whenever filters change
  useEffect(() => { setPage(1); }, [search, category, condition, sortKey]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
      <div className="relative overflow-hidden py-16 sm:py-20 px-4">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg-products.jpg')" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-teal-700/90 dark:from-slate-900/90 dark:via-emerald-950/85 dark:to-teal-950/90" />

        {/* Glow blobs — dark mode only */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-500/0 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-teal-500/0 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        {/* Top shimmer line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/25 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            <FiTag size={11} />
            {products.length > 0 ? `${products.length.toLocaleString()} listings available` : "Marketplace"}
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight leading-tight">
            Browse{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Listings
            </span>
          </h1>
          <p className="text-white/50 mb-8 text-base sm:text-lg max-w-xl mx-auto">
            Thousands of quality pre-owned items, curated for you
          </p>

          {/* Search bar */}
          <div className="relative shadow-2xl shadow-black/40">
            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for anything…"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
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

          {/* Quick category chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); }}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all backdrop-blur-sm ${
                  category === cat
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/10 border-white/15 text-white/65 hover:bg-white/20 hover:text-white hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {CONDITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>

            {activeFilters.map((f) => (
              <button
                key={f.label}
                onClick={f.clear}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
              >
                {f.label} <FiX size={11} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
            <div className="flex bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={`p-2 ${view === "grid" ? "bg-emerald-600 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"} transition-colors`}
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 ${view === "list" ? "bg-emerald-600 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"} transition-colors`}
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
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-emerald-300 dark:hover:border-emerald-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loadingProducts ? (
          <SectionLoader label="Loading listings…" />
        ) : filtered.length === 0 ? (
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
              className="mt-4 px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginated.map((p) => (
              <Link
                key={p._id}
                href={`/products/${p._id}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-emerald-600/10 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-700">
                  <img
                    src={p.images?.[0]}
                    alt={p.title}
                    className={`w-full h-full object-cover transition-transform duration-300 ${Number(p.stock) > 0 ? "group-hover:scale-105" : "grayscale-[30%]"}`}
                  />
                  {/* Out-of-stock overlay */}
                  {Number(p.stock) === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white/90 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
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
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => toggleWishlist(e, p)}
                      className={`w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center shadow ${toggling.has(p._id) ? "opacity-60" : ""}`}
                    >
                      <FiHeart
                        size={14}
                        fill={wishlistMap[p._id] ? "currentColor" : "none"}
                        className={wishlistMap[p._id] ? "text-rose-500" : "text-gray-600 dark:text-gray-300"}
                      />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); addToCompare(p); }}
                      title="Add to compare"
                      className={`w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center shadow ${isInCompare(p._id) ? "text-emerald-600" : "text-gray-600 dark:text-gray-300"}`}
                    >
                      <FiColumns size={13} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-0.5">
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
            {paginated.map((p) => (
              <Link
                key={p._id}
                href={`/products/${p._id}`}
                className="flex gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 hover:shadow-lg hover:shadow-emerald-600/10 hover:-translate-x-0.5 transition-all duration-200 group"
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
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {p.category}
                      </p>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mt-0.5">
                        {p.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xl font-extrabold text-gray-900 dark:text-white whitespace-nowrap">
                        ${p.price.toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => toggleWishlist(e, p)}
                        disabled={toggling.has(p._id)}
                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-600 flex items-center justify-center hover:border-rose-300 transition-colors disabled:opacity-50"
                      >
                        <FiHeart
                          size={14}
                          fill={wishlistMap[p._id] ? "currentColor" : "none"}
                          className={wishlistMap[p._id] ? "text-rose-500" : "text-gray-400"}
                        />
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); addToCompare(p); }}
                        title="Add to compare"
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                          isInCompare(p._id)
                            ? "border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-gray-200 dark:border-slate-600 text-gray-400 hover:border-emerald-300"
                        }`}
                      >
                        <FiColumns size={13} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.condition === "Like New"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                          : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {p.condition}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      Number(p.stock) > 0
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    }`}>
                      {Number(p.stock) > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                      <FiStar size={11} fill="currentColor" /> {p.rating}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      by {p.sellerInfo?.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loadingProducts && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
            {/* Prev */}
            <button
              onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-600 dark:hover:text-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft size={15} /> Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…");
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-gray-400 dark:text-slate-500 text-sm select-none">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`min-w-[38px] h-9 px-2 rounded-xl text-sm font-semibold transition-colors ${
                      page === n
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                        : "border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}

            {/* Next */}
            <button
              onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-600 dark:hover:text-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <FiChevronRight size={15} />
            </button>

            <span className="w-full text-center text-xs text-gray-400 dark:text-slate-500 mt-1">
              Page {page} of {totalPages} · {filtered.length} results
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<SectionLoader label="Loading listings…" />}>
      <ProductsPageInner />
    </Suspense>
  );
}
