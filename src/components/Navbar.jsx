"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BsTagFill } from "react-icons/bs";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";

const navLinks = ["Browse", "Sell", "How it works", "Pricing"];

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
    setIsDark(dark);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 transition-all hover:scale-105"
    >
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
        }`}
      >
        <FiSun size={16} className="text-amber-400" />
      </span>
      <span
        className={`absolute transition-all duration-300 ${
          isDark ? "opacity-0 -rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
        }`}
      >
        <FiMoon size={16} />
      </span>
    </button>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <BsTagFill className="text-white" size={14} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Resell<span className="text-violet-600">Hub</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l}
                href="#"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                {l}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-4 py-2 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg transition-colors shine-btn"
            >
              Sign up free
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-1 animate-fade-in-up">
          {navLinks.map((l) => (
            <Link
              key={l}
              href="#"
              className="block text-gray-700 dark:text-gray-300 font-medium py-2.5 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              {l}
            </Link>
          ))}
          <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-slate-800 mt-3">
            <Link
              href="/login"
              className="flex-1 text-sm font-medium border border-gray-300 dark:border-slate-700 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-center text-gray-700 dark:text-gray-300"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-sm font-semibold bg-violet-600 text-white py-2.5 rounded-lg hover:bg-violet-700 transition-colors text-center"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
