import Link from "next/link";
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from "react-icons/fi";
import { BsTagFill } from "react-icons/bs";

const socialIcons = [FiTwitter, FiFacebook, FiInstagram, FiLinkedin];
const footerLinks = [
  { title: "Marketplace", links: ["Browse All", "New Listings", "Trending", "Near Me", "Deals"] },
  { title: "Selling",     links: ["Start Selling", "Seller Guide", "Pricing", "Promotions", "Analytics"] },
  { title: "Support",     links: ["Help Center", "Safety Tips", "Contact Us", "Report Issue", "Trust & Safety"] },
];

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <BsTagFill className="text-white" size={14} />
              </div>
              <span className="text-white font-bold text-xl">
                Resell<span className="text-emerald-400">Hub</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs mb-6">
              The trusted marketplace for buying and selling preloved items. Safe, fast, and always
              free to list.
            </p>
            <div className="flex gap-3">
              {socialIcons.map((Icon, i) => (
                <button
                  key={i}
                  aria-label="Social link"
                  className="w-9 h-9 bg-white/5 hover:bg-emerald-600/60 border border-white/10 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:border-emerald-500"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {footerLinks.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm hover:text-white hover:translate-x-1 transition-all inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2025 ResellHub, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <Link key={link} href="#" className="hover:text-white transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
