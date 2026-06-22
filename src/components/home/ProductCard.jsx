"use client";
import { Card, Chip } from "@heroui/react";
import { BsFillHeartFill, BsHeart, BsStarFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";

export function ProductCard({ item, saved, onToggleSave }) {
  return (
    <Card className="group rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-xl dark:hover:shadow-violet-900/20 transition-all cursor-pointer bg-white dark:bg-slate-800 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={() => onToggleSave(item.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
        >
          {saved ? (
            <BsFillHeartFill size={14} className="text-rose-500" />
          ) : (
            <BsHeart size={14} className="text-gray-400 hover:text-rose-500 transition-colors" />
          )}
        </button>
        <Chip
          color={item.conditionColor}
          variant="flat"
          className="absolute top-3 left-3 text-xs font-semibold"
        >
          {item.condition}
        </Chip>
      </div>

      <Card.Content className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 truncate">
          {item.title}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-extrabold text-violet-600">{item.price}</span>
          <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            {item.verified && <MdVerified className="text-blue-500" size={14} />}
            <span className="truncate max-w-[120px]">{item.seller}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BsStarFill className="text-amber-400" size={11} />
              {item.rating}
            </span>
            <span className="flex items-center gap-1">
              <BsHeart size={11} />
              {saved ? item.saves + 1 : item.saves}
            </span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
