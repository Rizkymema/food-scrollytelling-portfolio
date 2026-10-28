"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { useSequence } from "./providers/SequenceProvider";
import { site } from "@/lib/site";
import { CLIP_CLOSED_BOTTOM, CLIP_CLOSED_TOP, CLIP_OPEN, EASE_IN_OUT, EASE_OUT } from "@/lib/motion";

const MIN_DURATION = 2200;

export function Preloader() {
  const { progress, ready, setIntroDone } = useSequence();
  const lenis = useLenis();
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [visible, setVisible] = useState(true);

  const count = useMotionValue(0);
  const counter = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(count, [0, 100], [0, 1]);

  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), MIN_DURATION);
    return () => clearTimeout(t);
  }, []);

  // Angka mengejar progres unduhan frame yang sebenarnya.
  useEffect(() => {
    if (ready && minTimePassed) return;
    const target = Math.min(progress, 99);
    const controls = animate(count, target, { duration: 0.8, ease: "easeOut" });
    return () => controls.stop();
  }, [progress, ready, minTimePassed, count]);

  useEffect(() => {
    if (!(ready && minTimePassed)) return;
    let timer: ReturnType<typeof setTimeout>;
    const controls = animate(count, 100, {
      duration: 0.6,
      ease: "easeOut",
      onComplete: () => {
        timer = setTimeout(() => {
          setVisible(false);
          setIntroDone(true);
        }, 350);
      },
    });
    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, [ready, minTimePassed, count, setIntroDone]);

  // Kunci scroll selama preloader tampil.
  useEffect(() => {
    if (!lenis) return;
    if (visible) {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [lenis, visible]);

  const words = site.name.split(" ");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#0c0a08] px-5 py-6 text-ivory md:px-10 md:py-8"
          initial={{ clipPath: CLIP_OPEN }}
          exit={{ clipPath: CLIP_CLOSED_TOP, transition: { duration: 1.1, ease: EASE_IN_OUT } }}
        >
          <div className="flex items-start justify-between text-[11px] uppercase tracking-[0.25em] text-muted">
            <span>(Portfolio &copy;2026)</span>
            <span className="text-right">Warming up the kitchen</span>
          </div>

          <div className="flex flex-col items-start gap-3">
            <h1 className="font-display text-[12.5vw] font-bold uppercase leading-[0.85] tracking-[-0.04em] md:text-[9vw]">
              {words.map((word, i) => (
                <motion.span
                  key={word}
                  className="block"
                  initial={{ clipPath: CLIP_CLOSED_BOTTOM, y: "40%" }}
                  animate={{ clipPath: CLIP_OPEN, y: "0%" }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: EASE_OUT }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-amber md:text-base"
              initial={{ clipPath: CLIP_CLOSED_BOTTOM, y: 12 }}
              animate={{ clipPath: CLIP_OPEN, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: EASE_OUT }}
            >
              <span className="h-px w-10 bg-amber" />
              {site.roleLong}
            </motion.p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <span className="max-w-[16rem] text-xs leading-relaxed text-muted">
                Preheating <span className="text-ivory">every frame</span> so the plate is ready
                when you scroll.
              </span>
              <span className="font-display text-[22vw] font-bold leading-[0.8] tracking-[-0.05em] tabular-nums md:text-[11vw]">
                <motion.span>{counter}</motion.span>
                <span className="text-amber">%</span>
              </span>
            </div>
            <div className="h-[2px] w-full overflow-hidden bg-white/10">
              <motion.div className="h-full origin-left bg-amber" style={{ scaleX: bar }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
