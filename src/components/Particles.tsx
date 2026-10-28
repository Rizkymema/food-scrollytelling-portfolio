"use client";

import type { MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; z: number; r: number; speed: number; drift: number; phase: number; warm: boolean };

const COUNT = 90;

// Debu rempah dan bara hangat yang melayang dengan kedalaman (z) berbeda untuk kesan 3D.
export function Particles({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const make = (anywhere: boolean): Particle => {
      const z = Math.random();
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 20,
        z,
        r: 0.4 + z * 2.2,
        speed: 0.08 + z * 0.45,
        drift: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        warm: Math.random() > 0.35,
      };
    };
    const particles = Array.from({ length: COUNT }, () => make(true));

    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseX.get();
      const my = mouseY.get();
      for (const p of particles) {
        if (!reduced) {
          p.y -= p.speed;
          p.x += p.drift + Math.sin(t + p.phase) * 0.15;
        }
        if (p.y < -20 || p.x < -40 || p.x > w + 40) Object.assign(p, make(false));
        const px = p.x - mx * 40 * p.z;
        const py = p.y - my * 30 * p.z;
        const flicker = 0.55 + Math.sin(t * 3 + p.phase) * 0.45;
        const alpha = (0.15 + p.z * 0.6) * flicker;
        ctx.beginPath();
        ctx.fillStyle = p.warm ? `rgba(240, 168, 92, ${alpha})` : `rgba(245, 236, 222, ${alpha * 0.7})`;
        ctx.shadowColor = p.warm ? "rgba(240, 150, 70, 0.8)" : "transparent";
        ctx.shadowBlur = p.warm ? 8 * p.z : 0;
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mouseX, mouseY]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[5] h-full w-full mix-blend-screen" />;
}
