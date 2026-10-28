"use client";

import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { CLIP_CLOSED_BOTTOM, CLIP_OPEN, EASE_OUT } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

// Fade + naik + blur saat elemen masuk viewport.
export function Reveal({ children, className, delay = 0, y = 50 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

// Judul per baris yang muncul dari balik clip-path, seperti di preloader.
export function LineReveal({
  lines,
  className,
  lineClassName = "",
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className={`block ${lineClassName}`}
          initial={{ clipPath: CLIP_CLOSED_BOTTOM, y: "35%" }}
          animate={inView ? { clipPath: CLIP_OPEN, y: "0%" } : undefined}
          transition={{ duration: 1.2, delay: delay + i * 0.1, ease: EASE_OUT }}
        >
          {line}
        </motion.span>
      ))}
    </div>
  );
}

// Teks yang hurufnya menyala satu per satu dari opacity rendah mengikuti scroll (split type).
export function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  const totalChars = text.replace(/ /g, "").length;
  // Posisi huruf pertama tiap kata dalam keseluruhan teks.
  const wordStarts = words.map((_, wi) => words.slice(0, wi).join("").length);

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {word.split("").map((char, ci) => {
            const start = (wordStarts[wi] + ci) / totalChars;
            return <Char key={ci} char={char} progress={scrollYProgress} range={[start, start + 1 / totalChars]} />;
          })}
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </p>
  );
}

function Char({ char, progress, range }: { char: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}
