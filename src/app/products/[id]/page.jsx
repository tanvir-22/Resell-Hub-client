"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiStar, FiHeart, FiShoppingBag, FiArrowLeft, FiShare2,
  FiChevronLeft, FiChevronRight, FiMapPin, FiShield,
  FiPackage, FiTruck, FiMessageSquare, FiUser, FiSend,
  FiTag,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { Chip } from "@heroui/react";
import { Navbar } from "@/components/Navbar";
import { getProduct, getProducts } from "@/lib/api/products";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { getReviews, createReview } from "@/lib/api/reviews";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";

const RELATED_COUNT = 4;

/* ── helpers ─────────────────────────────────────── */
function StarDisplay({ rating, size = 13 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const full = rating >= i;
        const half = !full && rating >= i - 0.5;
        const Icon = full ? BsStarFill : half ? BsStarHalf : BsStar;
        return (
          <Icon
            key={i} size={size}
            className={full || half ? "text-amber-400" : "text-gray-200 dark:text-slate-600"}
          />
        );
      })}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  return (
    <span className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i} type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <BsStarFill
            size={24}
            className={(hover || value) >= i ? "text-amber-400" : "text-gray-200 dark:text-slate-600"}
          />
        </button>
      ))}
      {(hover || value) > 0 && (
        <span className="ml-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          {labels[hover || value]}
        </span>
      )}
    </span>
  );
}

function ReviewCard({ review }) {
  const initials = review.reviewerInfo?.name
    ? review.reviewerInfo.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 dark:border-slate-700/60 last:border-0">
      <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
        {review.reviewerInfo?.image
          ? <img src={review.reviewerInfo.image} alt="" className="w-full h-full object-cover" />
          : <span className="text-white text-xs font-bold">{initials}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {review.reviewerInfo?.name || "Anonymous"}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{date}</span>
        </div>
        <StarDisplay rating={review.rating} size={11} />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
      </div>
    </div>
  );
}

function ReviewsSection({ productId, session }) {
  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [rating, setRating]         = useState(0);
  const [comment, setComment]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]               = useState(null);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  useEffect(() => {
    getReviews(productId)
      .then((d) => setReviews(Array.isArray(d) ? d : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating)         { setMsg({ type: "error", text: "Please select a star rating." }); return; }
    if (!comment.trim()) { setMsg({ type: "error", text: "Please write a comment." });      return; }
    setSubmitting(true); setMsg(null);

    const { ok, data } = await createReview({
      reviewerInfo: {
        userId: session.user.id,
        name:   session.user.name || session.user.email,
        image:  session.user.image || null,
      },
      productId,
      rating,
      comment,
    });

    if (!ok) {
      setMsg({ type: "error", text: data.message || "Failed to submit." });
      toast.error(data.message || "Failed to submit review");
      setSubmitting(false);
      return;
    }
    setReviews((p) => [data, ...p]);
    setRating(0); setComment("");
    setMsg({ type: "success", text: "Review submitted — thank you!" });
    toast.success("Review submitted — thank you!");
    setSubmitting(false);
  };

  return (
    <section>
      {/* section header */}
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <FiMessageSquare size={18} className="text-emerald-500" /> Reviews
        </h2>
        {avg && (
          <div className="flex items-center gap-1.5">
            <StarDisplay rating={parseFloat(avg)} />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{avg}</span>
            <span className="text-xs text-gray-400">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* write form */}
      {!session?.user ? (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 mb-5">
          <FiUser size={18} className="text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Sign in</Link>
            {" "}to leave a review.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-5 mb-5 border border-gray-100 dark:border-slate-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Write a review</p>
          {msg && (
            <p className={`text-sm mb-4 p-3 rounded-xl ${msg.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"}`}>
              {msg.text}
            </p>
          )}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Comment</label>
            <textarea
              value={comment} onChange={(e) => setComment(e.target.value)}
              rows={3} maxLength={500}
              placeholder="Share your experience…"
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
            />
            <p className="text-xs text-right text-gray-400 mt-1">{comment.length}/500</p>
          </div>
          <button
            type="submit" disabled={submitting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/20"
          >
            {submitting
              ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Submitting…</>
              : <><FiSend size={14} /> Submit Review</>}
          </button>
        </form>
      )}

      {/* list */}
      {loading ? (
        <div className="flex items-center gap-3 py-8 justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
          <span className="text-sm text-gray-400">Loading reviews…</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10">
          <FiMessageSquare size={28} className="mx-auto text-gray-200 dark:text-slate-600 mb-2" />
          <p className="text-sm text-gray-400 dark:text-gray-500">No reviews yet. Be the first!</p>
        </div>
      ) : (
        reviews.map((r) => <ReviewCard key={r._id} review={r} />)
      )}
    </section>
  );
}

/* ── Main page ───────────────────────────────────── */
export default function ProductDetail() {
  const { id } = useParams();

  const { data: session }   = useSession();
  const { addToCart }       = useCart();
  const [product, setProduct]   = useState(null);
  const [relatedp, setRelated]  = useState([]);
  const [slide, setSlide]       = useState(0);
  const [wishlistDocId, setWishlistDocId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [qty, setQty]       = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    getProduct(id).then(data => setProduct(data || null));
    getProducts().then(data => setRelated(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (!session?.user || !id) return;
    getWishlist(session.user.email).then((items) => {
      if (!Array.isArray(items)) return;
      const match = items.find((i) => i.productId === id);
      setWishlistDocId(match?._id ?? null);
    });
  }, [session?.user, id]);

  const toggleWishlist = async () => {
    if (!session?.user || !product || wishlistLoading) return;
    setWishlistLoading(true);
    if (wishlistDocId) {
      setWishlistDocId(null);
      await removeFromWishlist(wishlistDocId, session.user.email);
    } else {
      const result = await addToWishlist(
        { productId: id, title: product.title, price: product.price, image: product.images?.[0], seller: product.sellerInfo?.name },
        session.user.email
      );
      setWishlistDocId(result._id);
    }
    setWishlistLoading(false);
  };

  /* ─── loading / not found ─── */
  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 text-center px-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-6">
            <FiPackage size={32} className="text-gray-300 dark:text-slate-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Product not found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">This listing may have been removed.</p>
          <Link href="/products" className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/25">
            Browse listings
          </Link>
        </div>
      </div>
    );
  }

  /* ─── product is guaranteed non-null below this line ─── */
  const handleAddToCart = () => {
    if (!(Number(product.stock) > 0)) {
      toast.error("This item is out of stock");
      return;
    }
    addToCart({ ...product, quantity: qty });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  const images  = Array.isArray(product.images) ? product.images : [];
  const related = Array.isArray(relatedp)
    ? relatedp.filter((p) => p && p._id !== id && p.category === product.category).slice(0, RELATED_COUNT)
    : [];

  const conditionStyle = {
    "Like New":    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "Good":        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    "Used":        "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300",
    "Refurbished": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Top bar: back + breadcrumb ── */}
        <div className="flex items-center gap-3 mb-7">
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
          >
            <FiArrowLeft size={16} /> Back
          </Link>
          <span className="text-gray-300 dark:text-slate-600">/</span>
          <Link href={`/products?category=${product.category}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors">
            {product.category}
          </Link>
          <span className="text-gray-300 dark:text-slate-600">/</span>
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{product.title}</span>
        </div>

        {/* ══ ROW 1: Gallery  +  Buy card ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 mb-8">

          {/* Gallery */}
          <div>
            {/* Main image + side thumbnails (desktop) */}
            <div className="flex gap-3">
              {/* Vertical thumbnail strip — desktop only */}
              {images.length > 1 && (
                <div className="hidden sm:flex flex-col gap-2.5 w-[68px] flex-shrink-0">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSlide(i)}
                      className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        i === slide
                          ? "border-emerald-600 shadow-md shadow-emerald-500/30"
                          : "border-gray-200 dark:border-slate-700 opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700">
                <img
                  src={images[slide]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />

                {/* Condition badge over image */}
                <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${conditionStyle[product.condition] ?? "bg-gray-100 text-gray-600"}`}>
                  {product.condition}
                </span>

                {/* Arrow navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSlide((s) => (s - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition"
                    >
                      <FiChevronLeft size={18} className="text-gray-700 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => setSlide((s) => (s + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition"
                    >
                      <FiChevronRight size={18} className="text-gray-700 dark:text-gray-300" />
                    </button>
                    {/* Dot indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i} onClick={() => setSlide(i)}
                          className={`rounded-full transition-all ${i === slide ? "w-5 h-2 bg-emerald-600" : "w-2 h-2 bg-white/60"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Horizontal thumbnails — mobile only */}
            {images.length > 1 && (
              <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i} onClick={() => setSlide(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === slide ? "border-emerald-600" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Buy card (sticky) ── */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 space-y-5">

              {/* Category */}
              <div className="flex items-center gap-2">
                <FiTag size={13} className="text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-snug">
                {product.title}
              </h1>

              {/* Price + stock */}
              <div className="flex items-center justify-between">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  ${product.price.toLocaleString()}
                </span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  product.stock > 0
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
                }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              <hr className="border-gray-100 dark:border-slate-700" />

              {/* Qty stepper */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Quantity</label>
                <div className="flex items-center gap-0 w-fit border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 font-bold text-lg transition-colors"
                  >−</button>
                  <span className="px-5 py-2.5 font-semibold text-gray-900 dark:text-white min-w-[48px] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 font-bold text-lg transition-colors"
                  >+</button>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!(Number(product.stock) > 0)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/30 text-sm active:scale-[0.98]"
                >
                  <FiShoppingBag size={18} />
                  {addedMsg ? "Added to Cart!" : "Add to Cart"}
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading || !session?.user}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                      wishlistDocId
                        ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-500"
                        : "border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:border-red-300 hover:text-red-500"
                    } disabled:opacity-40`}
                    title={session?.user ? undefined : "Sign in to save"}
                  >
                    <FiHeart size={16} fill={wishlistDocId ? "currentColor" : "none"} />
                    {wishlistDocId ? "Saved" : "Wishlist"}
                  </button>
                  <button
                    onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 dark:border-slate-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-gray-300 transition-all"
                  >
                    <FiShare2 size={15} /> Share
                  </button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-slate-700" />

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: FiShield, label: "Buyer Protection" },
                  { icon: FiTruck,  label: "Fast Shipping" },
                  { icon: FiPackage, label: "Safe Packaging" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 dark:bg-slate-900/60 rounded-xl">
                    <Icon size={15} className="text-emerald-500" />
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ ROW 2: Description + Reviews  |  Seller card ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 mb-12">

          {/* Left: Description + Reviews */}
          <div className="space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-6">
              <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-4">About this item</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-7">{product.description}</p>

              {/* Detail pills */}
              <div className="flex flex-wrap gap-2 mt-5">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${conditionStyle[product.condition] ?? "bg-gray-100 text-gray-600"}`}>
                  {product.condition}
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                  {product.category}
                </span>
                {product.stock > 0 && (
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                    {product.stock} available
                  </span>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-6">
              <ReviewsSection productId={id} session={session} />
            </div>
          </div>

          {/* Right: Seller card (sticky) */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-6">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">Sold by</p>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0 flex items-center justify-center">
                  {product.sellerInfo?.image
                    ? <img src={product.sellerInfo.image} alt="" className="w-full h-full object-cover" />
                    : <span className="text-white font-bold text-lg">
                        {product.sellerInfo?.name?.[0]?.toUpperCase() ?? "S"}
                      </span>}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-gray-900 dark:text-white">{product.sellerInfo?.name}</p>
                    <MdVerified className="text-blue-500" size={15} />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <BsStarFill size={11} className="text-amber-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {product.sellerInfo?.rating ?? "—"} · {product.sellerInfo?.sales ?? 0} sales
                    </span>
                  </div>
                </div>
              </div>

              {product.sellerInfo?.location && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-5">
                  <FiMapPin size={13} className="text-emerald-400 flex-shrink-0" />
                  {product.sellerInfo.location}
                </div>
              )}

              <button className="w-full py-2.5 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                View Seller Profile
              </button>

              {/* Shipping info */}
              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-slate-700 space-y-3">
                {[
                  { icon: FiTruck,   text: "Ships within 2–3 business days" },
                  { icon: FiShield, text: "ResellHub Buyer Protection" },
                  { icon: FiPackage, text: "Secure, tracked delivery" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
                    <Icon size={14} className="text-emerald-400 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ ROW 3: Related products ══ */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                More in {product.category}
              </h2>
              <Link
                href={`/products?category=${product.category}`}
                className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p._id}
                  href={`/products/${p._id}`}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-emerald-600/10 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50 dark:bg-slate-700">
                    <img
                      src={p?.images?.[0]} alt={p?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1">{p?.title}</h3>
                    <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">${p?.price?.toLocaleString?.() ?? p?.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
