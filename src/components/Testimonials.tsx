"use client";

import { LineReveal, Reveal } from "./ui/Reveal";

// Contoh testimoni; ganti dengan ulasan klien asli.
const testimonials = [
  {
    quote:
      "Our Wagyu set sold out the week the new photos went live. Guests literally show the waiter the picture.",
    name: "Daniel Hartono",
    role: "Owner, Kuro Steakhouse",
  },
  {
    quote:
      "He understood the steam, the broth, the mood of the bar at midnight. The images feel like our ramen tastes.",
    name: "Mei Tanaka",
    role: "Head Chef, Ramen Hinode",
  },
  {
    quote:
      "Calm on set, obsessive about light, and fast with delivery. Our menu finally looks as good as the food.",
    name: "Sinta Wirawan",
    role: "Marketing Lead, Warung Sentosa",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/[0.06] blur-[160px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-muted">(Kind words)</p>
        <LineReveal
          className="mb-16 font-display text-[12vw] font-bold uppercase leading-[0.88] tracking-[-0.05em] md:mb-24 md:text-[6.5vw]"
          lines={["Clean plates,", <span key="b" className="text-amber">happy chefs.</span>]}
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12}>
              <figure className="flex h-full flex-col justify-between gap-10 rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-7 backdrop-blur-sm transition-transform duration-700 hover:-translate-y-2 md:p-9">
                <div>
                  <div className="mb-6 flex gap-1 text-amber" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                        <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.8L10 1.5z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="font-display text-xl font-semibold leading-snug tracking-[-0.02em] md:text-2xl">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
                <figcaption className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-amber/15 font-display text-sm font-bold text-amber">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-xs text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
