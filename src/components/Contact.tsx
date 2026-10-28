"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { site, waLink } from "@/lib/site";
import { LineReveal, Reveal } from "./ui/Reveal";
import { MagneticButton } from "./ui/MagneticButton";

const icons = [
  { id: "camera", className: "left-[6%] top-[14%] h-16 w-16 md:h-24 md:w-24", depth: 1.2, rotate: -12 },
  { id: "hat", className: "right-[8%] top-[10%] h-14 w-14 md:h-20 md:w-20", depth: 0.8, rotate: 10 },
  { id: "flame", className: "left-[12%] bottom-[14%] h-12 w-12 md:h-16 md:w-16", depth: 1.6, rotate: 8 },
  { id: "leaf", className: "right-[14%] bottom-[18%] h-14 w-14 md:h-20 md:w-20", depth: 1, rotate: -16 },
  { id: "fork", className: "left-[44%] top-[4%] hidden h-12 w-12 md:block", depth: 0.6, rotate: 20 },
  { id: "spark", className: "right-[38%] bottom-[6%] hidden h-10 w-10 md:block", depth: 1.9, rotate: 0 },
];

export function Contact() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <section
      id="contact"
      className="group/contact relative overflow-hidden px-5 py-32 md:px-10 md:py-48"
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-amber/[0.12] to-transparent" />

      {icons.map((icon) => (
        <ParallaxIcon key={icon.id} {...icon} sx={sx} sy={sy} />
      ))}

      <div className="relative mx-auto flex max-w-[1600px] flex-col items-center text-center">
        <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-muted">(Contact — reservations open)</p>
        <LineReveal
          className="font-display text-[13vw] font-bold uppercase leading-[0.86] tracking-[-0.055em] md:text-[9vw]"
          lines={["Hungry for", <span key="b" className="text-outline">better</span>, <span key="c" className="text-amber">pictures?</span>]}
        />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-10 max-w-xl text-base leading-relaxed text-ivory/70 md:text-lg">
            Tell me about your dish, your opening, or your next menu. I usually reply on WhatsApp within the hour,
            even on service days.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-12 flex flex-col items-center gap-6 sm:flex-row">
          <MagneticButton href={waLink(`Halo ${site.shortName}, saya ingin booking sesi foto makanan.`)}>
            Chat on WhatsApp
          </MagneticButton>
          <a href={`mailto:${site.email}`} className="link-underline text-sm text-ivory/80" data-cursor="Mail">
            {site.email}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function ParallaxIcon({
  id,
  className,
  depth,
  rotate,
  sx,
  sy,
}: {
  id: string;
  className: string;
  depth: number;
  rotate: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const x = useTransform(sx, (v) => v * 50 * depth);
  const y = useTransform(sy, (v) => v * 40 * depth);
  const r = useTransform(sx, (v) => rotate + v * 18 * depth);

  return (
    <motion.div
      className={`pointer-events-none absolute text-amber/70 transition-[color,scale] duration-700 group-hover/contact:scale-125 group-hover/contact:text-amber ${className}`}
      style={{ x, y, rotate: r }}
      aria-hidden
    >
      <div className="h-full w-full animate-float" style={{ animationDelay: `${depth}s` }}>
        <Icon id={id} />
      </div>
    </motion.div>
  );
}

function Icon({ id }: { id: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "camera":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full" {...common}>
          <rect x="5" y="13" width="38" height="27" rx="5" />
          <path d="M17 13l3-5h8l3 5" />
          <circle cx="24" cy="26.5" r="8" />
          <circle cx="24" cy="26.5" r="3.5" />
          <circle cx="37" cy="19" r="1.2" fill="currentColor" />
        </svg>
      );
    case "hat":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full" {...common}>
          <path d="M14 30c-5 0-8-4-8-8 0-5 4-8 9-8 1-5 5-8 9-8s8 3 9 8c5 0 9 3 9 8 0 4-3 8-8 8" />
          <path d="M14 30v10h20V30" />
          <path d="M14 35h20" />
        </svg>
      );
    case "flame":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full" {...common}>
          <path d="M24 44c-8 0-13-5-13-12 0-8 7-11 8-20 5 3 7 8 6 12 2-1 4-4 4-7 5 4 8 9 8 15 0 7-5 12-13 12z" />
          <path d="M24 44c-3 0-5-2-5-5 0-4 3-5 4-9 3 2 6 5 6 9 0 3-2 5-5 5z" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full" {...common}>
          <path d="M8 40C8 20 20 8 42 6c-1 22-13 34-34 34z" />
          <path d="M8 40L30 18" />
        </svg>
      );
    case "fork":
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full" {...common}>
          <path d="M14 4v12a5 5 0 0010 0V4M19 4v40" />
          <path d="M34 44V4c-4 2-6 8-6 14 0 4 2 6 6 6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" className="h-full w-full" fill="currentColor">
          <path d="M24 2c1.5 12 10 20.5 22 22-12 1.5-20.5 10-22 22-1.5-12-10-20.5-22-22 12-1.5 20.5-10 22-22z" />
        </svg>
      );
  }
}
