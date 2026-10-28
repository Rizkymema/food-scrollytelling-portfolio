"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import { EASE_OUT } from "@/lib/motion";
import { LineReveal, Reveal } from "./ui/Reveal";

const services = [
  {
    title: "Food Photography",
    text: "Hero shots, menu sets, and delivery-app imagery that make the order button feel inevitable.",
    tags: ["Menu", "Delivery apps", "Print"],
    image: "/images/work-wagyu.jpg",
  },
  {
    title: "Food Styling",
    text: "Plating, props, and surfaces chosen for your dish, styled hand in hand with your kitchen.",
    tags: ["Plating", "Props", "Set design"],
    image: "/images/about-wagyu-table.jpg",
  },
  {
    title: "Culinary Film",
    text: "Slow-motion pours, plating reveals, and timelapses for reels, launches, and websites.",
    tags: ["Reels", "Launch films", "Web sequences"],
    image: "/images/services-explosion.jpg",
  },
  {
    title: "Brand Campaigns",
    text: "Art direction for openings, seasonal menus, and product launches, from moodboard to final grade.",
    tags: ["Art direction", "Seasonal", "Launch"],
    image: "/images/work-lava-cake.jpg",
  },
];

export function Services() {
  const [active, setActive] = useState<number | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });

  const onMove = (e: React.MouseEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  return (
    <section
      id="services"
      className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40"
      onMouseMove={onMove}
      onMouseLeave={() => setActive(null)}
    >
      <div className="mb-16 flex flex-col justify-between gap-8 md:mb-20 md:flex-row md:items-end">
        <div>
          <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-muted">(Services)</p>
          <LineReveal
            className="font-display text-[12vw] font-bold uppercase leading-[0.88] tracking-[-0.05em] md:text-[6.5vw]"
            lines={["What I", <span key="b" className="text-outline">serve.</span>]}
          />
        </div>
        <Reveal className="max-w-sm">
          <p className="text-ivory/70">Pick one course or book the full tasting menu. Every package includes retouching and colour grading.</p>
        </Reveal>
      </div>

      <ul className="border-t border-white/10">
        {services.map((s, i) => (
          <li key={s.title} onMouseEnter={() => setActive(i)}>
            <Reveal y={30}>
              <div className="group grid cursor-default gap-4 border-b border-white/10 py-8 transition-colors duration-500 hover:bg-white/[0.02] md:grid-cols-[80px_1.3fr_1fr] md:items-center md:py-10">
                <span className="text-xs text-muted tabular-nums">0{i + 1}</span>
                <h3 className="font-display text-4xl font-bold uppercase tracking-[-0.04em] transition-all duration-500 group-hover:translate-x-3 group-hover:text-amber md:text-6xl">
                  {s.title}
                </h3>
                <div>
                  <p className="text-sm leading-relaxed text-ivory/65 md:text-base">{s.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-ivory/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      {/* Gambar melayang yang mengikuti kursor saat baris di-hover (desktop) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-64 w-52 md:block"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      >
        <AnimatePresence mode="popLayout">
          {active !== null && (
            <motion.div
              key={active}
              className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 6 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              <Image src={services[active].image} alt="" fill sizes="220px" className="object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
