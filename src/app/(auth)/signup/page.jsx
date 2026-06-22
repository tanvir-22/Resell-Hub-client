"use client";

import "animate.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { signUp } from "@/lib/auth-client";
import { BsTagFill, BsStarFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FiMail, FiLock, FiArrowRight, FiCheck, FiUser, FiShoppingBag, FiCamera } from "react-icons/fi";
import { uploadImage } from "@/lib/api/upload";
import { MdSell } from "react-icons/md";

const inputCls =
  "w-full py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm";

const ROLES = [
  {
    value: "buyer",
    Icon: FiShoppingBag,
    label: "Buyer",
    desc: "Browse & purchase amazing deals near you",
  },
  {
    value: "seller",
    Icon: MdSell,
    label: "Seller",
    desc: "List items & earn money from what you own",
  },
];

const LEFT_FEATURES = [
  "Free to list your items, always",
  "Secure buyer & seller protection",
  "Verified community of trusted users",
  "Fast payouts, zero hidden fees",
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", role: "buyer",
  });
  const [showPw, setShowPw]           = useState(false);
  const [showCfm, setShowCfm]         = useState(false);
  const [agreeTerms, setAgreeTerms]   = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [profileImg, setProfileImg]   = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [imgUploading, setImgUploading]   = useState(false);

  const leftRef     = useRef(null);
  const rightRef    = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".lp-el", {
        opacity: 0, x: -36,
        duration: 0.9, stagger: 0.14,
        ease: "power3.out", delay: 0.1,
      });
      gsap.from(".form-el", {
        opacity: 0, y: 24,
        duration: 0.65, stagger: 0.07,
        ease: "power3.out", delay: 0.25,
      });
    });
    return () => ctx.revert();
  }, []);

  const selectRole = (role) => {
    setForm((f) => ({ ...f, role }));
    gsap.fromTo(
      `[data-role="${role}"]`,
      { scale: 0.95 },
      { scale: 1, duration: 0.28, ease: "back.out(2)" },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      gsap.from(".error-msg", { x: -7, duration: 0.08, repeat: 5, yoyo: true });
      return;
    }
    if (!agreeTerms) {
      setError("Please accept the terms to continue.");
      gsap.from(".error-msg", { x: -7, duration: 0.08, repeat: 5, yoyo: true });
      return;
    }
    setLoading(true);
    setError("");

    const { error: err } = await signUp.email({
      email: form.email,
      password: form.password,
      name: form.name,
      role: form.role,
      ...(profileImgUrl ? { image: profileImgUrl } : {}),
    });

    if (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
      gsap.from(".error-msg", { x: -7, duration: 0.08, repeat: 5, yoyo: true });
    } else {
      router.push("/");
    }
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    setProfileImg(URL.createObjectURL(file));
    setImgUploading(true);
    try {
      const url = await uploadImage(file);
      setProfileImgUrl(url);
    } catch {
      // upload failed — form still works, just no remote URL
    } finally {
      setImgUploading(false);
    }
  };

  return (
    <div className="flex flex-1 bg-white dark:bg-slate-950">

      {/* ────────────────── LEFT DECORATIVE ────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 relative overflow-hidden flex-col justify-center p-12 xl:p-16">

        <div className="animate-blob absolute -top-24 -right-24 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="animate-blob animation-delay-2s absolute bottom-0 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="animate-blob animation-delay-4s absolute top-1/3 right-1/4 w-48 h-48 bg-fuchsia-600/15 rounded-full blur-2xl pointer-events-none" />

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
            Start buying &amp; selling in{" "}
            <span className="hero-gradient-text">minutes</span>
          </h2>
          <p className="lp-el text-gray-400 text-sm leading-relaxed mb-10">
            Free to join, free to list. Start earning from your unused items today.
          </p>

          {/* features */}
          <ul className="lp-el space-y-3.5 mb-10">
            {LEFT_FEATURES.map((feat) => (
              <li key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center flex-shrink-0">
                  <FiCheck size={10} className="text-violet-400" />
                </div>
                <span className="text-gray-300 text-sm">{feat}</span>
              </li>
            ))}
          </ul>

          {/* floating stats */}
          <div className="lp-el animate-float grid grid-cols-2 gap-3">
            {[
              { value: "120K+", label: "Active Sellers" },
              { value: "$2M+",  label: "Items Sold" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-gray-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* small testimonial row */}
          <div className="lp-el mt-6 flex items-center gap-3">
            {["SJ", "MC", "PP"].map((init, i) => (
              <div
                key={init}
                className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{
                  marginLeft: i > 0 ? "-10px" : "0",
                  background: ["#7c3aed","#3b82f6","#ec4899"][i],
                }}
              >
                {init}
              </div>
            ))}
            <p className="text-gray-400 text-xs ml-1">Join 120K+ members</p>
          </div>
        </div>
      </div>

      {/* ────────────────── RIGHT FORM ────────────────── */}
      <div
        ref={rightRef}
        className="flex-1 flex items-start justify-center p-6 sm:p-10 overflow-y-auto animate__animated animate__fadeIn"
      >
        <div className="w-full max-w-md py-8">

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
          <div className="form-el mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Join ResellHub and start today — it&apos;s free
            </p>
          </div>

          {/* ── PROFILE PICTURE ── */}
          <div className="form-el flex flex-col items-center mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 self-start">
              Profile photo <span className="text-gray-400 dark:text-slate-500 font-normal">(optional)</span>
            </p>
            <div className="relative">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden hover:border-violet-500 dark:hover:border-violet-500 transition-colors bg-gray-50 dark:bg-slate-800 group"
              >
                {profileImg ? (
                  <img src={profileImg} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400 dark:text-slate-500">
                    <FiCamera size={22} />
                    <span className="text-xs">Upload</span>
                  </div>
                )}
                {imgUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                {profileImg && !imgUploading && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center rounded-full transition-all">
                    <FiCamera size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
              </button>

              {profileImg && !imgUploading && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  <FiCheck size={11} className="text-white" />
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          {/* ── ROLE SELECTION ── */}
          <div className="form-el mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              I want to join as a
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(({ value, Icon, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  data-role={value}
                  onClick={() => selectRole(value)}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                    form.role === value
                      ? "border-violet-600 bg-violet-50 dark:bg-violet-950/40 shadow-md shadow-violet-100 dark:shadow-violet-900/20"
                      : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-violet-300 dark:hover:border-violet-700"
                  }`}
                >
                  {/* checkmark */}
                  <div
                    className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      form.role === value
                        ? "bg-violet-600 scale-100 opacity-100"
                        : "bg-gray-200 dark:bg-slate-700 scale-75 opacity-0"
                    }`}
                  >
                    <FiCheck size={10} className="text-white" />
                  </div>

                  {/* icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      form.role === value
                        ? "bg-violet-100 dark:bg-violet-900/50 text-violet-600"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* error */}
          {error && (
            <div className="error-msg form-el mb-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3.5 text-red-600 dark:text-red-400 text-sm animate__animated animate__headShake">
              <span className="font-bold flex-shrink-0">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* name */}
            <div className="form-el">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <FiUser size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  type="text" required autoComplete="name"
                  value={form.name} onChange={set("name")}
                  placeholder="John Doe"
                  className={`${inputCls} pl-10 pr-4`}
                />
              </div>
            </div>

            {/* email */}
            <div className="form-el">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <FiMail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  type="email" required autoComplete="email"
                  value={form.email} onChange={set("email")}
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
                <FiLock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  type={showPw ? "text" : "password"} required autoComplete="new-password"
                  value={form.password} onChange={set("password")}
                  placeholder="Min. 8 characters"
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

            {/* confirm password */}
            <div className="form-el">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <FiLock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  type={showCfm ? "text" : "password"} required autoComplete="new-password"
                  value={form.confirmPassword} onChange={set("confirmPassword")}
                  placeholder="Re-enter password"
                  className={`${inputCls} pl-10 pr-11`}
                />
                <button
                  type="button" onClick={() => setShowCfm((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showCfm ? <BsEyeSlashFill size={17} /> : <BsEyeFill size={17} />}
                </button>
              </div>
            </div>

            {/* terms */}
            <div className="form-el">
              <label
                className="flex items-start gap-3 cursor-pointer select-none"
                onClick={() => setAgreeTerms((t) => !t)}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    agreeTerms ? "bg-violet-600 border-violet-600" : "border-gray-300 dark:border-slate-600"
                  }`}
                >
                  {agreeTerms && <FiCheck size={10} className="text-white" />}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  I agree to ResellHub&apos;s{" "}
                  <Link href="#" className="text-violet-600 hover:text-violet-700 dark:hover:text-violet-400 font-medium" onClick={(e) => e.stopPropagation()}>
                    Terms of Service
                  </Link>
                  {" "}&amp;{" "}
                  <Link href="#" className="text-violet-600 hover:text-violet-700 dark:hover:text-violet-400 font-medium" onClick={(e) => e.stopPropagation()}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* submit */}
            <div className="form-el pt-1">
              <button
                type="submit" disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shine-btn shadow-lg shadow-violet-600/20"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Create account</span><FiArrowRight size={18} /></>
                }
              </button>
            </div>
          </form>

          {/* sign in link */}
          <div className="form-el mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-violet-600 hover:text-violet-700 dark:hover:text-violet-400 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
