"use client";

import { useState } from "react";
import {
  FiMail, FiPhone, FiMapPin, FiSend,
  FiTwitter, FiFacebook, FiInstagram, FiLinkedin,
  FiCheckCircle,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { Reveal } from "@/components/home/Reveal";
import { Spinner } from "@heroui/react";

const contactInfo = [
  {
    icon: FiMail,
    label: "Email Us",
    value: "support@resellhub.com",
    sub: "We reply within 24 hours",
    color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: FiPhone,
    label: "Call Us",
    value: "+880 1700-000000",
    sub: "Sun–Thu, 9am–6pm",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    icon: FiMapPin,
    label: "Visit Us",
    value: "Dhaka, Bangladesh",
    sub: "Level 5, Tech Hub Tower",
    color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
  },
];

const socials = [
  { Icon: FiTwitter,   href: "#", label: "Twitter"   },
  { Icon: FiFacebook,  href: "#", label: "Facebook"  },
  { Icon: FiInstagram, href: "#", label: "Instagram" },
  { Icon: FiLinkedin,  href: "#", label: "LinkedIn"  },
];

const subjects = [
  "General Inquiry",
  "Seller Support",
  "Buyer Support",
  "Payment Issue",
  "Report a Problem",
  "Partnership",
  "Other",
];

const inputCls =
  "w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSending(true);
    // Simulate sending (no backend endpoint)
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-600 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <Reveal>
            <span className="inline-block text-xs font-bold bg-white/20 text-white/90 px-3 py-1 rounded-full uppercase tracking-widest mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-white/75 text-lg">
              Have a question, issue, or idea? Our team is happy to help.
            </p>
          </Reveal>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Left: info + socials */}
          <div className="lg:col-span-2 space-y-6">
            <Reveal>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">
                We&apos;d love to hear from you
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reach out through any of the channels below or fill in the
                form and we&apos;ll get back to you shortly.
              </p>
            </Reveal>

            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, sub, color }, i) => (
                <Reveal key={label} delay={i * 80}>
                  <div className="flex items-start gap-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {label}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">
                        {value}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {sub}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Socials */}
            <Reveal delay={200}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  {socials.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <Icon size={17} />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* FAQ teaser */}
            <Reveal delay={280}>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 p-5">
                <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm mb-1">
                  Common questions?
                </p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 leading-relaxed">
                  Before reaching out, check our Help Center — most questions
                  about payments, orders, and listings are answered there.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <Reveal delay={100}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 shadow-sm">

                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
                      <FiCheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                      Thanks for reaching out. We&apos;ll get back to you within
                      24 hours.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-1">
                        Send us a message
                      </h2>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Fill out the form and we&apos;ll respond within one
                        business day.
                      </p>
                    </div>

                    {/* Name + Email row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          value={form.name}
                          onChange={set("name")}
                          placeholder="Md. Rakib Hasan"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={set("email")}
                          placeholder="you@example.com"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                        Subject
                      </label>
                      <select
                        value={form.subject}
                        onChange={set("subject")}
                        className={inputCls}
                      >
                        <option value="">Select a topic…</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={form.message}
                        onChange={set("message")}
                        rows={5}
                        placeholder="Describe your issue or question in detail…"
                        className={`${inputCls} resize-none`}
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 dark:text-red-400">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="shine-btn w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                    >
                      {sending ? (
                        <>
                          <Spinner
                            size="sm"
                            classNames={{
                              circle1: "border-b-white",
                              circle2: "border-b-white/60",
                            }}
                          />
                          Sending…
                        </>
                      ) : (
                        <>
                          <FiSend size={15} /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
