"use client";
import { useRef, useState, useEffect } from "react";

function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target == null) return;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setCount(Math.round(eased * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, active]);
  return count;
}

export function StatCounter({ value, suffix, label, isStatic, staticDisplay }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, 1800, active && !isStatic);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center px-4">
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white tabular-nums">
        {isStatic ? staticDisplay : count}
        {suffix}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}
