"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "@/lib/site";
import { LineReveal, Reveal } from "./ui/Reveal";
import { MagneticButton } from "./ui/MagneticButton";

const projects = [
  {
    title: "Wagyu Nocturne",
    client: "Kuro Steakhouse",
    category: "Campaign · Menu",
    year: "2026",
    image: "/images/work-wagyu.jpg",
    alt: "Seared Wagyu steak with herb butter and steam in warm side light",
    summary: "A moody hero campaign for a dry-aged steak program, lit with a single warm side light.",
  },
  {
    title: "Midnight Broth",
    client: "Ramen Hinode",
    category: "Editorial · Social",
    year: "2026",
    image: "/images/work-ramen.jpg",
    alt: "Ramen bowl with chashu pork and soft-boiled egg in rising steam",
    summary: "Steam-forward stills and loops for a late-night ramen bar's opening month.",
  },
  {
    title: "Omakase in Amber",
    client: "Sora Sushi Bar",
    category: "Brand · Print",
    year: "2025",
    image: "/images/work-sushi.jpg",
    alt: "Sushi platter with salmon and tuna sashimi on dark slate",
    summary: "Backlit fish, slate, and silence: a print menu that reads like a gallery catalogue.",
  },
  {
    title: "Nasi Goreng Royale",
    client: "Warung Sentosa",
    category: "Campaign · Film",
    year: "2025",
    image: "/images/work-nasi-goreng.jpg",
    alt: "Indonesian nasi goreng with fried egg, prawns and prawn crackers",
    summary: "Turning a beloved street classic into a premium delivery hero for a national launch.",
  },
];

export function Projects() {
  return (
    <section id="work" className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
        <div>
          <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-muted">(Selected work — 04)</p>
          <LineReveal
            className="font-display text-[13vw] font-bold uppercase leading-[0.88] tracking-[-0.05em] md:text-[7.5vw]"
            lines={["Plates that", <span key="b" className="text-outline">sold out.</span>]}
          />
        </div>
        <Reveal className="max-w-sm">
          <p className="text-ivory/70">
            A few recent case studies. Each one started with a single dish and ended with a full table.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.12} className={i % 2 === 1 ? "md:mt-24" : ""}>
            <ProjectCard project={p} index={i} />
          </Reveal>
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <MagneticButton href={site.instagram} variant="ghost">
          See all work
        </MagneticButton>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 18 });
  // Glow gradasi hangat yang mengikuti posisi kursor di kartu.
  const background = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(240,168,92,0.28), transparent 55%)`,
  );

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div className="[perspective:1400px]">
      <motion.a
        ref={ref}
        href={site.instagram}
        target="_blank"
        rel="noreferrer"
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        data-cursor="View"
        className="group relative block overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b0908] p-3 md:p-4"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background }}
        />
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem]">
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes="(min-width: 768px) 46vw, 100vw"
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] backdrop-blur-md">
            {project.category}
          </span>
          <span className="absolute right-4 top-4 font-display text-sm text-ivory/80 tabular-nums">
            0{index + 1}
          </span>
        </div>

        <div
          className="relative z-20 flex flex-col gap-4 px-2 pb-2 pt-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
          style={{ transform: "translateZ(40px)" }}
        >
          <div>
            <h3 className="font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">{project.title}</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ivory/60">{project.summary}</p>
          </div>
          <div className="shrink-0 text-xs uppercase tracking-[0.2em] text-muted sm:text-right">
            <p className="text-ivory/80">{project.client}</p>
            <p className="mt-1">{project.year}</p>
          </div>
        </div>
      </motion.a>
    </div>
  );
}
