"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// Marquee tanpa ujung yang makin cepat dan berbalik arah mengikuti kecepatan scroll.
function MarqueeRow({ items, baseVelocity, outline }: { items: string[]; baseVelocity: number; outline?: boolean }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-2000, 2000], [-6, 6]);
  const direction = useRef(1);

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex shrink-0" style={{ x, skewX: skew }}>
        {Array.from({ length: 4 }).map((_, copy) => (
          <span key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
            {items.map((item) => (
              <span key={item} className="flex items-center">
                <span
                  className={`font-display text-[13vw] font-bold uppercase leading-none tracking-[-0.04em] md:text-[8vw] ${
                    outline ? "text-outline" : "text-ivory"
                  }`}
                >
                  {item}
                </span>
                <Star />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 40 40" className="mx-[3vw] h-[6vw] w-[6vw] shrink-0 animate-spin-slow text-amber md:h-[4vw] md:w-[4vw]" aria-hidden>
      <path
        d="M20 0c1.2 10.6 9.4 18.8 20 20-10.6 1.2-18.8 9.4-20 20-1.2-10.6-9.4-18.8-20-20C10.6 18.8 18.8 10.6 20 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 py-10 md:py-14" aria-label="Disciplines">
      <MarqueeRow items={["Food Photography", "Culinary Film", "Food Styling"]} baseVelocity={-2.2} />
      <MarqueeRow items={["Menu Campaigns", "Plating Direction", "Editorial"]} baseVelocity={2.2} outline />
    </section>
  );
}
