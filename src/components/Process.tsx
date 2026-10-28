"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { LineReveal, Reveal } from "./ui/Reveal";

const steps = [
  { no: "01", title: "Taste", text: "I eat the dish first. Texture, temperature, and story decide the light." },
  { no: "02", title: "Style", text: "Plating direction with your chef, down to the last micro-herb." },
  { no: "03", title: "Shoot", text: "Stills and motion in one session, lit for both." },
  { no: "04", title: "Serve", text: "Graded files for menus, delivery apps, print, and social." },
];

// Video timelapse dari Flow (Step 2, Prompt Video 2) dalam bingkai yang miring 3D lalu tegak saat di-scroll.
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.78, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [80, 28]);
  const borderRadius = useTransform(radius, (r) => `${r}px`);

  return (
    <section className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-2 md:items-end">
        <div>
          <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-muted">(Process)</p>
          <LineReveal
            className="font-display text-[12vw] font-bold uppercase leading-[0.88] tracking-[-0.05em] md:text-[6.5vw]"
            lines={["From raw", <span key="b" className="text-amber">to ritual.</span>]}
          />
        </div>
        <Reveal>
          <p className="max-w-md text-ivory/70 md:ml-auto">
            Every frame is planned like a service: mise en place, heat, timing, and one perfect pass.
          </p>
        </Reveal>
      </div>

      <div ref={ref} className="[perspective:1600px]">
        <motion.div
          className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 shadow-[0_60px_120px_-40px_rgba(240,150,70,0.35)]"
          style={{ rotateX, scale, borderRadius, transformOrigin: "50% 100%" }}
          data-cursor="Play"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/video/process-timelapse.mp4"
            poster="/images/process-raw.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          <div className="absolute bottom-5 left-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-ivory/80 md:bottom-8 md:left-8">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Timelapse — Wagyu, raw to plated
          </div>
        </motion.div>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 md:mt-24 md:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.no} delay={i * 0.08}>
            <div className="border-t border-white/15 pt-6">
              <span className="text-xs text-amber tabular-nums">{s.no}</span>
              <h3 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em]">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/60">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
