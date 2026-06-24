"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { getSellerProducts } from "@/lib/api/products";
import { getSellerReviews } from "@/lib/api/reviews";
import {
  FiArrowLeft, FiMapPin, FiPackage, FiStar, FiMessageSquare,
  FiCalendar, FiShoppingBag, FiUser,
} from "react-icons/fi";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { MdVerified } from "react-icons/md";

/* ── star display ───────────────────────────────── */
function StarDisplay({ rating, size = 13 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const full = rating >= i;
        const half = !full && rating >= i - 0.5;
        const Icon = full ? BsStarFill : half ? BsStarHalf : BsStar;
        return (
          <Icon
            key={i}
            size={size}
            className={full || half ? "text-amber-400" : "text-gray-200 dark:text-slate-600"}
          />
        );
      })}
    </span>
  );
}

/* ── product mini-card ──────────────────────────── */
function ProductCard({ product }) {
  const inStock = product.stock == null || product.stock > 0;
  return (
    <Link
      href={`/products/${product._id}`}
      className="group block bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg hover:shadow-emerald-50 dark:hover:shadow-emerald-900/20 transition-all"
    >
      <div className="relative overflow-hidden h-44 bg-gray-100 dark:bg-slate-700">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${!inStock ? "grayscale-[30%]" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiShoppingBag size={32} className="text-gray-300 dark:text-slate-600" />
          </div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-black/60 px-2.5 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        <span className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 text-xs font-semibold px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
          {product.condition}
        </span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1">{product.title}</p>
        <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">${product.price}</p>
      </div>
    </Link>
  );
}

/* ── review card ────────────────────────────────── */
function ReviewCard({ review }) {
  const initials = review.reviewerInfo?.name
    ? review.reviewerInfo.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
      <div className="flex items-start gap-3 mb-3">
        {review.reviewerInfo?.image ? (
          <img src={review.reviewerInfo.image} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {review.reviewerInfo?.name || "Anonymous"}
            </p>
            <StarDisplay rating={review.rating} size={11} />
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
          </p>
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
      )}
      {review.productTitle && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">on: {review.productTitle}</p>
      )}
    </div>
  );
}

/* ── page ───────────────────────────────────────── */
export default function SellerProfilePage() {
  const { id } = useParams();
  const router  = useRouter();

  const [products, setProducts] = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [seller,   setSeller]   = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const decoded = decodeURIComponent(id);
        const isEmail = decoded.includes("@");
        const prods   = isEmail
          ? await getSellerProducts("", decoded)   // query by email
          : await getSellerProducts(decoded);       // query by userId
        const list  = Array.isArray(prods) ? prods : [];
        setProducts(list);

        // derive seller info from first product
        const sellerEmail = list[0]?.sellerInfo?.email || list[0]?.user?.email || "";
        if (list.length > 0) {
          const s = list[0].sellerInfo || list[0].user || {};
          setSeller({
            name:     s.name     || "Seller",
            image:    s.image    || null,
            email:    sellerEmail,
            phone:    s.phone    || "",
            location: s.location || "",
            rating:   s.rating   ?? null,
            sales:    s.sales    ?? null,
            joinedAt: list.reduce((earliest, p) =>
              p.createdAt && (!earliest || p.createdAt < earliest) ? p.createdAt : earliest
            , null),
          });
        }

        // single API call for all seller reviews
        if (sellerEmail) {
          const rv = await getSellerReviews(sellerEmail).catch(() => []);
          setReviews(Array.isArray(rv) ? rv : []);
        }
      } catch (e) {
        // leave empty
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  /* derived stats */
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : seller?.rating ?? null;

  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating) === star).length,
  }));

  /* skeleton */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
          <div className="h-48 rounded-3xl bg-gray-200 dark:bg-slate-800" />
          <div className="h-8 w-48 rounded-xl bg-gray-200 dark:bg-slate-800" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-200 dark:bg-slate-800" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!seller && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <FiUser size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Seller not found</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">This seller profile does not exist or has no listings.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            <FiArrowLeft size={15} /> Go back
          </button>
        </div>
      </div>
    );
  }

  const initials = seller?.name
    ? seller.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "S";

  const joinedLabel = seller?.joinedAt
    ? new Date(seller.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
        >
          <FiArrowLeft size={15} /> Back
        </button>

        {/* ── Hero / seller info ────────────────────────── */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700">
          {/* Banner */}
          <div className="h-32 sm:h-44 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative rounded-t-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar floated up — z-10 so it sits above the banner edge */}
            <div className="relative z-10 -mt-12 sm:-mt-14 mb-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white dark:border-slate-800 overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0 flex items-center justify-center shadow-lg">
                {seller.image
                  ? <img src={seller.image} alt={seller.name} className="w-full h-full object-cover" />
                  : <span className="text-white font-extrabold text-2xl sm:text-3xl">{initials}</span>}
              </div>
            </div>

            {/* Name + meta */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{seller.name}</h1>
                  <MdVerified className="text-blue-500 flex-shrink-0" size={20} />
                </div>

                {avgRating !== null && (
                  <div className="flex items-center gap-2 mb-2">
                    <StarDisplay rating={avgRating} size={14} />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {avgRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-slate-500">
                      ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {seller.location && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <FiMapPin size={13} className="text-emerald-400" />
                      {seller.location}
                    </span>
                  )}
                  {joinedLabel && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar size={13} className="text-emerald-400" />
                      Member since {joinedLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats row ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: FiPackage,
              label: "Total Listings",
              value: products.length,
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-50 dark:bg-emerald-900/20",
            },
            {
              icon: BsStarFill,
              label: "Avg Rating",
              value: avgRating !== null ? avgRating.toFixed(1) : "—",
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-900/20",
            },
            {
              icon: FiMessageSquare,
              label: "Reviews",
              value: reviews.length,
              color: "text-purple-600 dark:text-purple-400",
              bg: "bg-purple-50 dark:bg-purple-900/20",
            },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 sm:p-5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Listings ──────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <FiPackage size={18} className="text-emerald-500" />
              Listings
              <span className="text-sm font-normal text-gray-400 dark:text-slate-500">({products.length})</span>
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 py-16 text-center">
              <FiShoppingBag size={36} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">No active listings</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>

        {/* ── Reviews ───────────────────────────────────── */}
        {reviews.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
              <FiStar size={18} className="text-amber-400" />
              Ratings &amp; Reviews
            </h2>

            {/* Rating summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 mb-5 flex flex-col sm:flex-row gap-6">
              {/* Big number */}
              <div className="flex flex-col items-center justify-center min-w-[120px] sm:border-r border-gray-100 dark:border-slate-700 sm:pr-6">
                <p className="text-5xl font-extrabold text-gray-900 dark:text-white">
                  {avgRating !== null ? avgRating.toFixed(1) : "—"}
                </p>
                {avgRating !== null && (
                  <>
                    <StarDisplay rating={avgRating} size={18} />
                    <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">{reviews.length} reviews</p>
                  </>
                )}
              </div>

              {/* Bar breakdown */}
              <div className="flex-1 space-y-2">
                {ratingBreakdown.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-3 text-right">{star}</span>
                    <BsStarFill size={11} className="text-amber-400 flex-shrink-0" />
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 dark:text-slate-500 w-5 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.slice(0, 12).map((r, i) => <ReviewCard key={r._id || i} review={r} />)}
            </div>
          </div>
        )}

        {/* Empty reviews */}
        {!loading && reviews.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 py-12 text-center">
            <FiMessageSquare size={32} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No reviews yet for this seller</p>
          </div>
        )}
      </div>
    </div>
  );
}
