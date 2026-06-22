"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiStar,
  FiHeart,
  FiShoppingBag,
  FiArrowLeft,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiShield,
  FiPackage,
  FiTruck,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { getProduct, getProducts } from "@/lib/api/products";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/context/CartContext";

const RELATED_COUNT = 4;

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();

  const { data: session } = useSession();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedp, setRelated] = useState([]);
  const [slide, setSlide] = useState(0);
  const [wishlistDocId, setWishlistDocId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    getProduct(id).then((data) => setProduct(data));
    getProducts().then((data) => setRelated(data));
  }, []);

  useEffect(() => {
    if (!session?.user || !id) return;
    getWishlist(session.user.email).then((items) => {
      if (!Array.isArray(items)) return;
      const match = items.find((item) => item.productId === id);
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
      const result = await addToWishlist({
        productId: id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        seller: product.sellerInfo?.name,
      }, session.user.email);
      setWishlistDocId(result._id);
    }
    setWishlistLoading(false);
  };

  const related = relatedp
    .filter((p) => p._id !== id && p.category === product?.category)
    .slice(0, RELATED_COUNT);

  const images = product?.images || [];

  const prevSlide = () =>
    setSlide((i) => (i - 1 + images.length) % images.length);
  const nextSlide = () => setSlide((i) => (i + 1) % images.length);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: qty });
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <FiPackage
            size={48}
            className="text-gray-300 dark:text-slate-600 mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product not found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
            This listing may have been removed.
          </p>
          <Link
            href="/products"
            className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
          >
            Browse listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-violet-600 transition-colors"
          >
            Browse
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-violet-600 transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
            {product.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Image slider */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-lg">
              <img
                src={images[slide]}
                alt={product.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 shadow flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  >
                    <FiChevronLeft
                      size={18}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 shadow flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  >
                    <FiChevronRight
                      size={18}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlide(i)}
                        className={`rounded-full transition-all ${i === slide ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      i === slide
                        ? "border-violet-600 shadow-md shadow-violet-600/25"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-1">
                  {product.category}
                </p>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {product.title}
                </h1>
              </div>
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading || !session?.user}
                className={`p-2.5 rounded-xl border transition-colors flex-shrink-0 disabled:opacity-50 ${
                  wishlistDocId
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500"
                    : "border-gray-200 dark:border-slate-600 text-gray-400 hover:text-red-500 hover:border-red-200"
                }`}
                title={session?.user ? (wishlistDocId ? "Remove from wishlist" : "Add to wishlist") : "Sign in to save"}
              >
                <FiHeart size={18} fill={wishlistDocId ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Rating + saves */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FiStar
                    key={i}
                    size={14}
                    fill={
                      i <= Math.round(product.sellerRating) ? "#f59e0b" : "none"
                    }
                    className="text-amber-400"
                  />
                ))}
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  {product.sellerRating}
                </span>
              </div>
              <span className="text-gray-300 dark:text-slate-600">·</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.saves} saves
              </span>
              <span className="text-gray-300 dark:text-slate-600">·</span>
              <span
                className={`text-sm font-medium ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-5">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                ${product.price.toLocaleString()}
              </span>
              <span
                className={`mb-1 text-sm font-semibold px-2.5 py-1 rounded-full ${
                  product.condition === "Like New"
                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                    : product.condition === "Good"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                {product.condition}
              </span>
            </div>

            {/* Description */}
            <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-4 mb-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Qty + buy */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0 border border-gray-200 dark:border-slate-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-bold text-lg"
                >
                  −
                </button>
                <span className="px-4 py-2.5 font-semibold text-gray-900 dark:text-white min-w-[40px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-bold text-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors shadow-lg shadow-violet-600/25"
              >
                <FiShoppingBag size={18} />
                {addedMsg ? "Added!" : "Add to Cart"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { icon: FiShield, label: "Buyer Protection" },
                { icon: FiTruck, label: "Fast Shipping" },
                { icon: FiPackage, label: "Secure Packaging" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 p-2.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-center"
                >
                  <Icon
                    size={16}
                    className="text-violet-600 dark:text-violet-400"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Seller card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={product.sellerInfo?.image}
                  alt={product.sellerInfo?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {product.sellerInfo?.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-0.5">
                      <FiStar
                        size={11}
                        className="text-amber-400"
                        fill="currentColor"
                      />{" "}
                      {product.sellerInfo?.rating}
                    </span>
                    <span>·</span>
                    <span>{product.sellerInfo?.sales} sales</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <FiMapPin size={10} /> {product.sellerInfo?.location}
                    </span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 border border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 rounded-xl text-sm font-medium hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                View Seller Profile
              </button>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">
              More in {product.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p._id}
                  href={`/products/${p._id}`}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-violet-600/10 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-700">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-base font-extrabold text-gray-900 dark:text-white mt-1.5">
                      ${p.price.toLocaleString()}
                    </p>
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
