"use client";

import { motion, useInView } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { navLinks, site, waLink } from "@/lib/site";
import { EASE_OUT } from "@/lib/motion";

export function Footer() {
  const lenis = useLenis();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#070605] px-5 pt-16 md:px-10 md:pt-24">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-md font-display text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl">
            Making food look the way it tastes, one plate at a time.
          </p>
        </div>
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-muted">Menu</p>
          <ul className="space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => lenis?.scrollTo(l.href === "#top" ? 0 : l.href, { duration: 1.6 })}
                  className="link-underline"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-muted">Say hello</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={waLink()} target="_blank" rel="noreferrer" className="link-underline">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="link-underline">
                Email
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="link-underline">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-[1600px] flex-col justify-between gap-4 border-t border-white/10 py-6 text-xs text-muted sm:flex-row">
        <span>
          &copy; {site.year} {site.name}. All rights reserved.
        </span>
        <span>
          {site.roleLong} — {site.location}
        </span>
        <button onClick={() => lenis?.scrollTo(0, { duration: 2.2 })} className="link-underline text-left text-ivory/80 sm:text-right">
          Back to top ↑
        </button>
      </div>

      <FitText text={site.name.toUpperCase()} />
    </footer>
  );
}

// Teks raksasa selebar layar: ukuran font dihitung dari lebar kontainer, huruf naik satu per satu.
function FitText({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);
  const inView = useInView(wrapRef, { once: true, margin: "0px 0px -5% 0px" });

  useEffect(() => {
    const fit = () => {
      const wrap = wrapRef.current;
      const measure = measureRef.current;
      if (!wrap || !measure) return;
      const ratio = wrap.clientWidth / measure.scrollWidth;
      setFontSize(Math.floor(100 * ratio * 0.99));
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [text]);

  return (
    <div ref={wrapRef} className="relative -mb-[0.12em] w-full select-none" aria-label={text}>
      {/* Diukur dengan struktur huruf per huruf yang sama seperti tampilan agar lebarnya persis. */}
      <span
        ref={measureRef}
        className="invisible absolute flex whitespace-nowrap font-display font-bold leading-none tracking-[-0.06em]"
        style={{ fontSize: 100 }}
        aria-hidden
      >
        {text.split("").map((char, i) => (
          <span key={i} className="inline-block">
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
      <div
        className="flex overflow-hidden whitespace-nowrap font-display font-bold leading-[0.8] tracking-[-0.06em] text-ivory"
        style={{ fontSize: fontSize ?? "14vw" }}
        aria-hidden
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: "100%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: 1.2, delay: i * 0.04, ease: EASE_OUT }}
          >
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
