"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import { navLinks, site, waLink } from "@/lib/site";
import { CLIP_CLOSED_BOTTOM, CLIP_CLOSED_TOP, CLIP_OPEN, EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { useSequence } from "./providers/SequenceProvider";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const { introDone } = useSequence();

  useEffect(() => {
    if (!lenis || !introDone) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis, introDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    // Tunggu menu tertutup sebelum menggulir.
    setTimeout(() => {
      lenis?.start();
      lenis?.scrollTo(href === "#top" ? 0 : href, { duration: 1.6 });
    }, 500);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[60] px-4 pt-4 md:px-8 md:pt-6"
        initial={{ y: -80, opacity: 0 }}
        animate={introDone ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 0.4, ease: EASE_OUT }}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between rounded-full border border-white/10 bg-black/30 py-2 pl-3 pr-2 backdrop-blur-xl">
          <button
            onClick={() => go("#top")}
            className="group flex items-center gap-3"
            aria-label="Back to top"
            data-cursor="Top"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ivory font-display text-sm font-bold text-black transition-transform duration-500 group-hover:rotate-[360deg]">
              {site.monogram}
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">
              {site.name}
              <span className="ml-2 text-muted">/ {site.role}</span>
            </span>
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="group flex items-center gap-3 rounded-full bg-white/5 py-2 pl-5 pr-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-white/10"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative h-4 overflow-hidden">
              <motion.span
                className="block"
                animate={{ y: open ? "-100%" : "0%" }}
                transition={{ duration: 0.5, ease: EASE_IN_OUT }}
              >
                Menu
              </motion.span>
              <motion.span
                className="absolute left-0 top-full block"
                animate={{ y: open ? "-100%" : "0%" }}
                transition={{ duration: 0.5, ease: EASE_IN_OUT }}
              >
                Close
              </motion.span>
            </span>
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-amber text-black">
              <motion.span
                className="absolute h-[1.5px] w-4 bg-black"
                animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
                transition={{ duration: 0.4, ease: EASE_IN_OUT }}
              />
              <motion.span
                className="absolute h-[1.5px] w-4 bg-black"
                animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
                transition={{ duration: 0.4, ease: EASE_IN_OUT }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[55] flex flex-col bg-[#0c0a08] px-5 pb-8 pt-28 md:px-10 md:pt-32"
            initial={{ clipPath: CLIP_CLOSED_TOP }}
            animate={{ clipPath: CLIP_OPEN }}
            exit={{ clipPath: CLIP_CLOSED_BOTTOM }}
            transition={{ duration: 0.9, ease: EASE_IN_OUT }}
            data-lenis-prevent
          >
            <div className="pointer-events-none absolute -right-40 top-1/3 h-[40rem] w-[40rem] rounded-full bg-amber/10 blur-[140px]" />

            <div className="relative grid flex-1 gap-10 md:grid-cols-[1.6fr_1fr]">
              <ul className="flex flex-col justify-center">
                {navLinks.map((link, i) => (
                  <li key={link.href} className="overflow-hidden border-b border-white/10">
                    <motion.button
                      onClick={() => go(link.href)}
                      className="group flex w-full items-baseline gap-5 py-2 text-left md:py-3"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, delay: 0.25 + i * 0.06, ease: EASE_OUT }}
                    >
                      <span className="text-xs text-muted tabular-nums">0{i + 1}</span>
                      <span className="font-display text-[12vw] font-bold uppercase leading-[0.95] tracking-[-0.04em] transition-all duration-500 group-hover:translate-x-4 group-hover:text-amber md:text-[6.5vw]">
                        {link.label}
                      </span>
                    </motion.button>
                  </li>
                ))}
              </ul>

              <motion.div
                className="flex flex-col justify-end gap-8 text-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT }}
              >
                <p className="max-w-sm text-base leading-relaxed text-ivory/80">{site.description}</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-muted">WhatsApp</p>
                    <a href={waLink()} target="_blank" rel="noreferrer" className="link-underline">
                      +{site.whatsapp}
                    </a>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-muted">Email</p>
                    <a href={`mailto:${site.email}`} className="link-underline break-all">
                      {site.email}
                    </a>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-muted">Studio</p>
                    <p>{site.location}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-muted">Social</p>
                    <a href={site.instagram} target="_blank" rel="noreferrer" className="link-underline">
                      Instagram
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
