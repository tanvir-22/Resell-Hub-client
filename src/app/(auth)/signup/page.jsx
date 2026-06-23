"use client";

import "animate.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { signUp, signInWithGoogle } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FiMail, FiLock, FiArrowRight, FiCheck, FiUser, FiShoppingBag, FiCamera } from "react-icons/fi";
import { MdSell } from "react-icons/md";
import { uploadImage } from "@/lib/api/upload";
import { AuthPanelWrapper } from "@/components/auth/AuthPanelWrapper";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { FormInput } from "@/components/auth/FormInput";

const ROLES = [
  { value: "buyer",  Icon: FiShoppingBag, label: "Buyer",  desc: "Browse & purchase amazing deals near you" },
  { value: "seller", Icon: MdSell,        label: "Seller", desc: "List items & earn money from what you own" },
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
  const [showPw, setShowPw]               = useState(false);
  const [showCfm, setShowCfm]             = useState(false);
  const [agreeTerms, setAgreeTerms]       = useState(false);
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]                 = useState("");
  const [profileImg, setProfileImg]       = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [imgUploading, setImgUploading]   = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".lp-el", { opacity: 0, x: -36, duration: 0.9, stagger: 0.14, ease: "power3.out", delay: 0.1 });
      gsap.from(".form-el", { opacity: 0, y: 24, duration: 0.65, stagger: 0.07, ease: "power3.out", delay: 0.25 });
    });
    return () => ctx.revert();
  }, []);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signInWithGoogle("/");
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const selectRole = (role) => {
    setForm((f) => ({ ...f, role }));
    gsap.fromTo(`[data-role="${role}"]`, { scale: 0.95 }, { scale: 1, duration: 0.28, ease: "back.out(2)" });
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("Image must be smaller than 5MB."); return; }
    setProfileImg(URL.createObjectURL(file));
    setImgUploading(true);
    try {
      const url = await uploadImage(file);
      setProfileImgUrl(url);
    } catch {
      // upload failed — form still works without remote URL
    } finally {
      setImgUploading(false);
    }
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

  return (
    <div className="flex flex-1 bg-white dark:bg-slate-950">

      {/* ── LEFT DECORATIVE ── */}
      <AuthPanelWrapper>
        <div className="lp-el flex items-center gap-2 mb-12">
          <AuthLogo variant="dark" />
        </div>

        <h2 className="lp-el text-3xl xl:text-4xl font-extrabold text-white mb-4 leading-tight">
          Start buying &amp; selling in{" "}
          <span className="hero-gradient-text">minutes</span>
        </h2>
        <p className="lp-el text-gray-400 text-sm leading-relaxed mb-10">
          Free to join, free to list. Start earning from your unused items today.
        </p>

        <ul className="lp-el space-y-3.5 mb-10">
          {LEFT_FEATURES.map((feat) => (
            <li key={feat} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center flex-shrink-0">
                <FiCheck size={10} className="text-emerald-400" />
              </div>
              <span className="text-gray-300 text-sm">{feat}</span>
            </li>
          ))}
        </ul>

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

        <div className="lp-el mt-6 flex items-center gap-3">
          {["SJ", "MC", "PP"].map((init, i) => (
            <div
              key={init}
              className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{
                marginLeft: i > 0 ? "-10px" : "0",
                background: ["#7c3aed", "#3b82f6", "#ec4899"][i],
              }}
            >
              {init}
            </div>
          ))}
          <p className="text-gray-400 text-xs ml-1">Join 120K+ members</p>
        </div>
      </AuthPanelWrapper>

      {/* ── RIGHT FORM ── */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-10 overflow-y-auto animate__animated animate__fadeIn">
        <div className="w-full max-w-md py-8">

          <div className="form-el lg:hidden flex items-center gap-2 mb-8">
            <AuthLogo />
          </div>

          <div className="form-el mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              Join ResellHub and start today — it&apos;s free
            </p>
          </div>

          {/* Profile photo */}
          <div className="form-el flex flex-col items-center mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 self-start">
              Profile photo{" "}
              <span className="text-gray-400 dark:text-slate-500 font-normal">(optional)</span>
            </p>
            <div className="relative">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center overflow-hidden hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors bg-gray-50 dark:bg-slate-800 group"
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
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
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

          {/* Role selection */}
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
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 shadow-md shadow-emerald-100 dark:shadow-emerald-900/20"
                      : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-700"
                  }`}
                >
                  <div
                    className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                      form.role === value
                        ? "bg-emerald-600 scale-100 opacity-100"
                        : "bg-gray-200 dark:bg-slate-700 scale-75 opacity-0"
                    }`}
                  >
                    <FiCheck size={10} className="text-white" />
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      form.role === value
                        ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600"
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

          {error && (
            <div className="error-msg form-el mb-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3.5 text-red-600 dark:text-red-400 text-sm animate__animated animate__headShake">
              <span className="font-bold flex-shrink-0">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              wrapperClassName="form-el"
              label="Full name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={set("name")}
              placeholder="John Doe"
              leftIcon={FiUser}
            />

            <FormInput
              wrapperClassName="form-el"
              label="Email address"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              leftIcon={FiMail}
            />

            <FormInput
              wrapperClassName="form-el"
              label="Password"
              type={showPw ? "text" : "password"}
              required
              autoComplete="new-password"
              value={form.password}
              onChange={set("password")}
              placeholder="Min. 8 characters"
              leftIcon={FiLock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPw ? <BsEyeSlashFill size={17} /> : <BsEyeFill size={17} />}
                </button>
              }
            />

            <FormInput
              wrapperClassName="form-el"
              label="Confirm password"
              type={showCfm ? "text" : "password"}
              required
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              placeholder="Re-enter password"
              leftIcon={FiLock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowCfm((s) => !s)}
                  className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showCfm ? <BsEyeSlashFill size={17} /> : <BsEyeFill size={17} />}
                </button>
              }
            />

            <div className="form-el">
              <label
                className="flex items-start gap-3 cursor-pointer select-none"
                onClick={() => setAgreeTerms((t) => !t)}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    agreeTerms ? "bg-emerald-600 border-emerald-600" : "border-gray-300 dark:border-slate-600"
                  }`}
                >
                  {agreeTerms && <FiCheck size={10} className="text-white" />}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  I agree to ResellHub&apos;s{" "}
                  <Link href="#" className="text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium" onClick={(e) => e.stopPropagation()}>
                    Terms of Service
                  </Link>
                  {" "}&amp;{" "}
                  <Link href="#" className="text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium" onClick={(e) => e.stopPropagation()}>
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <div className="form-el pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shine-btn shadow-lg shadow-emerald-600/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><span>Create account</span><FiArrowRight size={18} /></>
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
            <span className="text-xs text-gray-400 dark:text-slate-500">or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all font-medium text-gray-700 dark:text-gray-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mb-5"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <FcGoogle size={20} />
            )}
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <div className="form-el text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 font-semibold transition-colors"
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
