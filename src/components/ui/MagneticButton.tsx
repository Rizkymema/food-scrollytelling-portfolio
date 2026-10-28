"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "ghost";
};

// Tombol magnetik: menempel ke kursor, isi warna naik dari bawah saat hover.
export function MagneticButton({ href, children, className = "", variant = "solid" }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const external = href.startsWith("http");
  const base =
    variant === "solid"
      ? "bg-amber text-black"
      : "border border-white/20 text-ivory";

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      data-cursor="Go"
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] ${base} ${className}`}
    >
      <span
        className={`absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 ${
          variant === "solid" ? "bg-ivory" : "bg-amber"
        }`}
      />
      <span className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-black">
        {children}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="transition-transform duration-500 group-hover:-rotate-45"
          aria-hidden
        >
          <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
    </motion.a>
  );
}
