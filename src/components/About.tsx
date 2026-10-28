"use client";

import Image from "next/image";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CLIP_CLOSED_BOTTOM, CLIP_OPEN, EASE_OUT } from "@/lib/motion";
import { site } from "@/lib/site";
import { Reveal, ScrollRevealText } from "./ui/Reveal";

const stats = [
  { value: 10, suffix: "+", label: "Years behind the lens" },
  { value: 120, suffix: "", label: "Restaurants & brands" },
  { value: 4800, suffix: "+", label: "Dishes photographed" },
];

export function About() {
  const imageWrap = useRef<HTMLDivElement>(null);
  const inView = useInView(imageWrap, { once: true, margin: "0px 0px -15% 0px" });
  const { scrollYProgress } = useScroll({ target: imageWrap, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-6, 0, 4]);

  return (
    <section id="about" className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="mb-14 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-muted">
        <span>(About)</span>
        <span>{site.location}</span>
      </div>

      <ScrollRevealText
        className="font-display text-[8.5vw] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[4.6vw]"
        text="I believe a great dish deserves a great portrait. I chase the warm glow on a seared crust, the curl of steam, the glossy arc of a sauce, and turn them into images that make people book a table."
      />

      <div className="mt-20 grid items-center gap-14 md:mt-28 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div className="[perspective:1200px]">
          <motion.div
            ref={imageWrap}
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"
            initial={{ clipPath: CLIP_CLOSED_BOTTOM }}
            animate={inView ? { clipPath: CLIP_OPEN } : undefined}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            style={{ rotateY: rotate }}
            data-cursor="Taste"
          >
            <motion.div className="absolute inset-[-12%]" style={{ y: imageY }}>
              <Image
                src="/images/about-wagyu-table.jpg"
                alt="Sliced Wagyu steak with rosemary and olive oil on a walnut table"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 text-[11px] uppercase tracking-[0.3em] text-ivory/80">
              Wagyu, walnut &amp; golden hour
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col gap-10">
          <Reveal>
            <p className="max-w-lg text-lg leading-relaxed text-ivory/80 md:text-xl">
              {site.description} From tasting-menu restaurants to street-food legends, every shoot starts
              in the kitchen: I learn the dish, then build the light around it.
            </p>
          </Reveal>
          <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1}>
                <Counter value={s.value} suffix={s.suffix} />
                <p className="mt-2 text-xs leading-snug text-muted md:text-sm">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold tracking-[-0.04em] text-ivory md:text-6xl">
      {display.toLocaleString("en-US")}
      <span className="text-amber">{suffix}</span>
    </span>
  );
}
