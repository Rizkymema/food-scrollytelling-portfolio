"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

// Kursor kustom: titik cepat + cincin lambat yang membesar dan menampilkan label di elemen interaktif.
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 250, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 250, damping: 28, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => {
      setEnabled(mq.matches);
      document.documentElement.classList.toggle("has-cursor", mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-cursor]");
      setHovering(Boolean(target));
      setLabel(target?.dataset.cursor ?? null);
    };
    const leave = () => setHidden(true);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = label ? 88 : hovering ? 56 : 36;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden>
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-amber"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hidden || label ? 0 : 1 }}
      />
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-ivory/60 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: hidden ? 0 : 1,
          backgroundColor: label ? "rgba(245,236,222,1)" : "rgba(245,236,222,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
