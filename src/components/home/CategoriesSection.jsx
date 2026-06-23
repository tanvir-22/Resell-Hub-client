"use client";
import {
  FiSmartphone, FiShoppingBag, FiHome, FiBook,
  FiActivity, FiCamera, FiMonitor, FiTruck, FiArrowRight,
} from "react-icons/fi";
import { Reveal } from "./Reveal";

const categories = [
  { name: "Electronics",   Icon: FiSmartphone,  count: "12,400+", color: "bg-blue-50 text-blue-600" },
  { name: "Fashion",       Icon: FiShoppingBag, count: "8,200+",  color: "bg-rose-50 text-rose-600" },
  { name: "Home & Living", Icon: FiHome,        count: "5,600+",  color: "bg-orange-50 text-orange-600" },
  { name: "Books",         Icon: FiBook,        count: "3,100+",  color: "bg-green-50 text-green-600" },
  { name: "Sports",        Icon: FiActivity,    count: "2,900+",  color: "bg-yellow-50 text-yellow-600" },
  { name: "Cameras",       Icon: FiCamera,      count: "1,800+",  color: "bg-purple-50 text-purple-600" },
  { name: "Computers",     Icon: FiMonitor,     count: "4,300+",  color: "bg-indigo-50 text-indigo-600" },
  { name: "Vehicles",      Icon: FiTruck,       count: "950+",    color: "bg-teal-50 text-teal-600" },
];

export function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Reveal className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Browse by Category
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          From electronics to fashion, find exactly what you&apos;re looking for across hundreds of
          categories.
        </p>
      </Reveal>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map(({ name, Icon, count, color }, i) => (
          <Reveal key={name} delay={i * 60}>
            <button className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-lg dark:hover:shadow-emerald-900/20 transition-all bg-white dark:bg-slate-800/60 text-left w-full hover:-translate-y-1">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{count} items</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal delay={200} className="text-center mt-8">
        <button className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:text-emerald-700 dark:hover:text-emerald-300 transition-all border border-emerald-200 dark:border-emerald-800 px-6 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:scale-105">
          View all categories <FiArrowRight size={16} />
        </button>
      </Reveal>
    </section>
  );
}
