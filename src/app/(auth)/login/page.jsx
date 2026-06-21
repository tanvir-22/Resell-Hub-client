"use client";

import "animate.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { signIn } from "@/lib/auth-client";
import { BsTagFill, BsStarFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FiMail, FiLock, FiArrowRight, FiCheck } from "react-icons/fi";
import { MdVerified } from "react-icons/md";

/* ── shared input class ── */
const inputCls =
  "w-full py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const leftRef  = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* left panel slide in */
      gsap.from(".lp-el", {
        opacity: 0, x: -36,
        duration: 0.9, stagger: 0.14,
        ease: "power3.out", delay: 0.1,
      });
      /* right form cascade */
      gsap.from(".form-el", {
        opacity: 0, y: 26,
        duration: 0.65, stagger: 0.09,
        ease: "power3.out", delay: 0.25,
      });
    });
    return () => ctx.revert();
  }, []);

  const shakeError = () =>
    gsap.from(".error-msg", { x: -7, duration: 0.08, repeat: 5, yoyo: true, ease: "none" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: err } = await signIn.email({ email, password });

    if (err) {
      setError(err.message || "Invalid email or password.");
      setLoading(false);
      shakeError();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-1 bg-white dark:bg-slate-950">

      {/* ────────────────── LEFT DECORATIVE ────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 relative overflow-hidden flex-col justify-center p-12 xl:p-16">

        {/* blobs */}
        <div className="animate-blob absolute -top-24 -right-24 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="animate-blob animation-delay-2s absolute bottom-0 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="animate-blob animation-delay-4s absolute top-1/2 right-1/4 w-48 h-48 bg-fuchsia-600/15 rounded-full blur-2xl pointer-events-none" />

        <div ref={leftRef} className="relative z-10 max-w-sm">

          {/* logo */}
          <div className="lp-el flex items-center gap-2 mb-12">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <BsTagFill className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold text-white">
              Resell<span className="text-violet-400">Hub</span>
            </span>
          </div>

          {/* heading */}
          <h2 className="lp-el text-3xl xl:text-4xl font-extrabold text-white mb-4 leading-tight">
            Your trusted marketplace for{" "}
            <span className="hero-gradient-text">preloved items</span>
          </h2>
          <p className="lp-el text-gray-400 text-sm leading-relaxed mb-10">
            Join 120,000+ buyers and sellers discovering amazing deals every single day.
          </p>

          {/* stats */}
          <div className="lp-el grid grid-cols-2 gap-4 mb-10">
            {[
              { value: "500K+", label: "Active Listings" },
              { value: "4.9★",  label: "Avg. Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-gray-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* testimonial */}
          <div className="lp-el animate-float bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                SJ
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-white text-sm font-semibold">Sarah Johnson</p>
                  <MdVerified className="text-blue-400" size={14} />
                </div>
                <p className="text-gray-400 text-xs">Regular Seller · 200+ sales</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              &ldquo;Made over $5,000 reselling on ResellHub. Payouts are fast and the process is seamless!&rdquo;
            </p>
            <div className="flex mt-3 gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <BsStarFill key={i} className="text-amber-400" size={11} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────── RIGHT FORM ────────────────── */}
      <div
        ref={rightRef}
        className="flex-1 flex items-center justify-center p-6 sm:p-10 animate__animated animate__fadeIn"
      >
        <div className="w-full max-w-md">

          {/* mobile logo */}
          <div className="form-el lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <BsTagFill className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Resell<span className="text-violet-600">Hub</span>
            </span>
          </div>

          {/* heading */}
          <div className="form-el mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Sign in to your ResellHub account
            </p>
          </div>

          {/* error */}
          {error && (
            <div className="error-msg form-el mb-5 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3.5 text-red-600 dark:text-red-400 text-sm animate__animated animate__headShake">
              <span className="flex-shrink-0 font-bold">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* email */}
            <div className="form-el">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <FiMail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                />
                <input
                  type="email" required autoComplete="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${inputCls} pl-10 pr-4`}
                />
              </div>
            </div>

            {/* password */}
            <div className="form-el">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                />
                <input
                  type={showPw ? "text" : "password"} required autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pl-10 pr-11`}
                />
                <button
                  type="button" onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPw ? <BsEyeSlashFill size={17} /> : <BsEyeFill size={17} />}
                </button>
              </div>
            </div>

            {/* remember + forgot */}
            <div className="form-el flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setRemember((r) => !r)}>
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    remember ? "bg-violet-600 border-violet-600" : "border-gray-300 dark:border-slate-600"
                  }`}
                >
                  {remember && <FiCheck size={10} className="text-white" />}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link
                href="#"
                className="text-sm text-violet-600 hover:text-violet-700 dark:hover:text-violet-400 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* submit */}
            <div className="form-el pt-1">
              <button
                type="submit" disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shine-btn shadow-lg shadow-violet-600/20"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Sign in</span><FiArrowRight size={18} /></>
                }
              </button>
            </div>
          </form>

          {/* divider */}
          <div className="form-el flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
            <span className="text-xs text-gray-400 dark:text-slate-500">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
          </div>

          {/* sign up link */}
          <div className="form-el text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-violet-600 hover:text-violet-700 dark:hover:text-violet-400 font-semibold transition-colors"
              >
                Sign up free
              </Link>
            </p>
          </div>

          {/* footer */}
          <div className="form-el mt-8 text-center">
            <p className="text-xs text-gray-400 dark:text-slate-500">
              By signing in you agree to our{" "}
              <Link href="#" className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</Link>
              {" "}&amp;{" "}
              <Link href="#" className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
