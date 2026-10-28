"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { sequence, site, waLink } from "@/lib/site";
import { EASE_OUT } from "@/lib/motion";
import { useSequence } from "./providers/SequenceProvider";
import { Particles } from "./Particles";
import { MagneticButton } from "./ui/MagneticButton";

// Sequence selesai di 75% scroll; 25% sisanya dipakai section berikutnya untuk naik menutupi canvas.
const SEQUENCE_END = 0.75;

export function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrame = useRef(0);
  const { frames, progress, introDone } = useSequence();

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const seq = useTransform(scrollYProgress, [0, SEQUENCE_END], [0, 1], { clamp: true });
  const frameIndex = useTransform(seq, [0, 1], [0, sequence.frameCount - 1]);

  // Efek kedalaman: canvas mundur ke belakang saat section berikutnya menutupinya.
  const exitScale = useTransform(scrollYProgress, [SEQUENCE_END, 1], [1, 0.86]);
  const exitRotate = useTransform(scrollYProgress, [SEQUENCE_END, 1], [0, 14]);
  const exitOpacity = useTransform(scrollYProgress, [SEQUENCE_END, 1], [1, 0.25]);
  const enterScale = useTransform(seq, [0, 1], [1.12, 1]);

  // Parallax 3D mengikuti kursor.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(mouseY, [-1, 1], [4, -4]), { stiffness: 60, damping: 20 });
  const tiltY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), { stiffness: 60, damping: 20 });
  const rotateX = useTransform([tiltX, exitRotate], ([a, b]: number[]) => a + b);

  const draw = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      // Pakai frame terdekat yang sudah termuat bila frame tujuan belum siap.
      let img: HTMLImageElement | undefined;
      for (let offset = 0; offset < sequence.frameCount; offset++) {
        const candidate = frames.current[index - offset] ?? frames.current[index + offset];
        if (candidate?.complete && candidate.naturalWidth) {
          img = candidate;
          break;
        }
      }

      const cw = canvas.width;
      const ch = canvas.height;
      ctx.fillStyle = sequence.background;
      ctx.fillRect(0, 0, cw, ch);
      if (!img) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      // Logika object-fit: cover. Di layar portrait, zoom dibatasi supaya piring tidak terpotong;
      // sisa area menyatu karena tepi frame sewarna background.
      const cover = Math.max(cw / iw, ch / ih);
      const contain = Math.min(cw / iw, ch / ih);
      const scale = cw < ch ? Math.min(cover, contain * 2.1) : cover;
      const w = iw * scale;
      const h = ih * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    },
    [frames],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      draw(currentFrame.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  // Gambar ulang saat frame baru selesai dimuat (misalnya frame pertama).
  useEffect(() => {
    draw(currentFrame.current);
  }, [progress, draw]);

  useMotionValueEvent(frameIndex, "change", (v) => {
    const index = Math.round(v);
    if (index === currentFrame.current) return;
    currentFrame.current = index;
    requestAnimationFrame(() => draw(index));
  });

  const onMouseMove = (e: React.MouseEvent) => {
    mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
    mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  return (
    <section id="top" ref={containerRef} className="relative h-[500vh]" onMouseMove={onMouseMove}>
      <div className="sticky top-0 h-screen w-full overflow-hidden [perspective:1400px]">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: exitScale, rotateX, rotateY: tiltY, opacity: exitOpacity, transformOrigin: "50% 30%" }}
        >
          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ scale: enterScale }}
            aria-label="Plating sequence of a Wagyu steak dish"
            role="img"
          />
          <div className="vignette pointer-events-none absolute inset-0" />
        </motion.div>

        <Particles mouseX={mouseX} mouseY={mouseY} />

        <Overlays seq={seq} introDone={introDone} />

        <ScrollHint seq={seq} introDone={introDone} />
      </div>
    </section>
  );
}

function useBeat(seq: MotionValue<number>, range: [number, number, number, number], hold = false) {
  const opacity = useTransform(seq, range, [0, 1, 1, hold ? 1 : 0]);
  const y = useTransform(seq, range, [80, 0, 0, hold ? 0 : -80]);
  const blur = useTransform(seq, range, [12, 0, 0, hold ? 0 : 12]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.6 ? "auto" : "none"));
  return { opacity, y, filter, pointerEvents };
}

function Overlays({ seq, introDone }: { seq: MotionValue<number>; introDone: boolean }) {
  const intro = useBeat(seq, [-0.01, 0, 0.1, 0.16]);
  const beat2 = useBeat(seq, [0.22, 0.28, 0.38, 0.44]);
  const beat3 = useBeat(seq, [0.52, 0.58, 0.68, 0.74]);
  const beat4 = useBeat(seq, [0.82, 0.88, 1, 1.01], true);
  const [first, ...rest] = site.name.split(" ");

  return (
    <div className="pointer-events-none absolute inset-0 z-10 mx-auto max-w-[1600px] px-5 md:px-10">
      {/* Section 1 (5%): nama dan peran, tengah */}
      <motion.div
        className="absolute inset-x-5 top-1/2 -translate-y-1/2 text-center md:inset-x-10"
        style={intro}
      >
        <Scrim />
        <motion.p
          className="mb-5 text-[11px] uppercase tracking-[0.35em] text-amber md:text-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={introDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 0.3, ease: EASE_OUT }}
        >
          My name is
        </motion.p>
        <h1 className="font-display text-[12.5vw] font-bold uppercase leading-[0.85] tracking-[-0.05em] text-shadow-soft md:text-[10vw]">
          {[first, rest.join(" ")].map((word, i) => (
            <span key={word} className="block overflow-hidden pb-[0.05em]">
              <motion.span
                className={`block ${i === 1 ? "text-outline" : ""}`}
                initial={{ y: "110%", rotate: 4 }}
                animate={introDone ? { y: "0%", rotate: 0 } : undefined}
                transition={{ duration: 1.3, delay: 0.35 + i * 0.12, ease: EASE_OUT }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          className="mt-6 text-base text-ivory/80 md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={introDone ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 0.7, ease: EASE_OUT }}
        >
          {site.role}. I make food look the way it tastes.
        </motion.p>
      </motion.div>

      {/* Section 2 (30%): deskripsi, rata kiri */}
      <motion.div className="absolute left-5 top-1/2 max-w-xl -translate-y-1/2 md:left-10" style={beat2}>
        <Scrim />
        <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-amber">(01) The craft</p>
        <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-[-0.03em] text-shadow-soft md:text-7xl">
          Light, steam, and the second before the first bite.
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/75 md:text-base">
          Ten years of plating, lighting, and shooting for chefs who treat every dish like a signature.
          I direct the whole frame, from the first garnish to the final grade.
        </p>
      </motion.div>

      {/* Section 3 (60%): motto, rata kanan */}
      <motion.div
        className="absolute right-5 top-1/2 max-w-xl -translate-y-1/2 text-right md:right-10"
        style={beat3}
      >
        <Scrim />
        <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-amber">(02) The motto</p>
        <h2 className="font-display text-5xl font-bold uppercase leading-[0.9] tracking-[-0.04em] text-shadow-soft md:text-8xl">
          Plated <span className="text-outline">with</span>
          <br />
          intention.
        </h2>
        <p className="ml-auto mt-5 max-w-sm text-sm leading-relaxed text-ivory/75 md:text-base">
          Nothing lands on the plate, or in the frame, by accident.
        </p>
      </motion.div>

      {/* Section 4 (90%): slogan dan CTA */}
      <motion.div
        className="absolute inset-x-5 bottom-[12vh] flex flex-col items-center text-center md:inset-x-10"
        style={beat4}
      >
        <Scrim />
        <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-[-0.03em] text-shadow-soft md:text-7xl">
          Your menu deserves
          <br />
          <span className="italic text-amber">a standing ovation.</span>
        </h2>
        <p className="mt-5 max-w-md text-sm text-ivory/75 md:text-base">
          Let&apos;s turn your signature dishes into images people can almost taste.
        </p>
        <MagneticButton
          href={waLink(`Halo ${site.shortName}, saya ingin diskusi project foto makanan.`)}
          className="mt-8"
        >
          Book a shoot
        </MagneticButton>
      </motion.div>
    </div>
  );
}

// Bayangan lembut di belakang teks agar terbaca di atas frame yang terang.
function Scrim() {
  return (
    <div className="pointer-events-none absolute -inset-x-24 -inset-y-20 -z-10 bg-[radial-gradient(closest-side,rgba(0,0,0,0.6),transparent)]" />
  );
}

function ScrollHint({ seq, introDone }: { seq: MotionValue<number>; introDone: boolean }) {
  const opacity = useTransform(seq, [0, 0.06], [1, 0]);
  return (
    <motion.div
      className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      style={{ opacity }}
    >
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={introDone ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1, delay: 1, ease: EASE_OUT }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-ivory/60">Scroll to plate</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-line bg-amber" />
        </span>
      </motion.div>
    </motion.div>
  );
}
