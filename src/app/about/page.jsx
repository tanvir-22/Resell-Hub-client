import Link from "next/link";
import {
  FiShield, FiZap, FiUsers, FiStar,
  FiArrowRight, FiHeart, FiAward, FiGlobe,
} from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { Reveal } from "@/components/home/Reveal";

const stats = [
  { label: "Active Listings",   value: "500K+",  icon: FiZap    },
  { label: "Verified Sellers",  value: "120K+",  icon: FiAward  },
  { label: "Happy Buyers",      value: "350K+",  icon: FiHeart  },
  { label: "Cities Covered",    value: "60+",    icon: FiGlobe  },
];

const values = [
  {
    icon: FiShield,
    title: "Trust & Safety",
    desc: "Every listing is reviewed and every seller is verified before going live on the platform.",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    icon: FiUsers,
    title: "Community First",
    desc: "We build tools that empower both buyers and sellers to connect and transact with confidence.",
    color: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
  },
  {
    icon: FiZap,
    title: "Fast & Simple",
    desc: "List in under 2 minutes. Browse, buy, and pay in a few taps — no friction, ever.",
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
  {
    icon: FiStar,
    title: "Quality Listings",
    desc: "Our admin review ensures only accurate, honest product listings make it to buyers.",
    color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  },
];

const team = [
  { name: "Tanvir Ahmed",    role: "Founder & CEO",         initials: "TA", color: "from-violet-500 to-fuchsia-600" },
  { name: "Sara Rahman",     role: "Head of Product",       initials: "SR", color: "from-blue-500 to-cyan-600"      },
  { name: "Karim Hossain",  role: "Lead Engineer",         initials: "KH", color: "from-green-500 to-teal-600"    },
  { name: "Nadia Islam",     role: "Head of Operations",   initials: "NI", color: "from-rose-500 to-pink-600"     },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-fuchsia-600 py-20 px-4">
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal>
            <span className="inline-block text-xs font-bold bg-white/20 text-white/90 px-3 py-1 rounded-full uppercase tracking-widest mb-4">
              About ResellHub
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
              Bangladesh&apos;s Trusted
              <br />
              Second-Hand Marketplace
            </h1>
            <p className="text-white/75 text-lg max-w-xl mx-auto leading-relaxed">
              We&apos;re on a mission to make buying and selling preloved items
              safe, fast, and accessible for everyone across the country.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <Reveal key={label} delay={i * 80}>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <Icon size={20} className="text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* Mission */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-5 leading-tight">
                Giving Products a
                <span className="hero-gradient-text"> Second Life</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                ResellHub was born from a simple idea: great products
                shouldn&apos;t end up in landfills just because someone no
                longer needs them. Every day, thousands of usable items are
                discarded while others go searching for affordable alternatives.
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                We built a platform that connects sellers who want to pass on
                their goods with buyers looking for quality at fair prices —
                creating value on both ends and reducing waste along the way.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Founded",            value: "2024"       },
                { label: "Countries",          value: "1 (& growing)" },
                { label: "Avg. Listing Time",  value: "< 2 min"    },
                { label: "Avg. Seller Rating", value: "4.8 / 5 ★"  },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm"
                >
                  <p className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">
                    {value}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Values */}
        <section>
          <Reveal className="text-center mb-12">
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
              Our Core Values
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, color }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <Reveal className="text-center mb-12">
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
              The People
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
              Meet the Team
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg mx-auto">
              A small team with a big vision — building the most trusted
              second-hand marketplace in Bangladesh.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {team.map(({ name, role, initials, color }, i) => (
              <Reveal key={name} delay={i * 80}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-4 shadow-lg`}>
                    {initials}
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Reveal>
          <div className="text-center bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Ready to join ResellHub?
              </h3>
              <p className="text-white/70 mb-7 max-w-md mx-auto">
                Start buying and selling today — free to join, simple to use.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-6 py-3 rounded-xl hover:bg-violet-50 transition-colors text-sm shadow-lg"
                >
                  Get Started Free <FiArrowRight size={15} />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
                >
                  Browse Listings
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
