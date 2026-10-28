"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { frameSrc, sequence } from "@/lib/site";

type SequenceContextValue = {
  frames: React.RefObject<HTMLImageElement[]>;
  progress: number;
  ready: boolean;
  introDone: boolean;
  setIntroDone: (done: boolean) => void;
};

const SequenceContext = createContext<SequenceContextValue | null>(null);

const BATCH_SIZE = 12;

function loadFrame(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    // Selesai (berhasil atau gagal) tetap dihitung supaya preloader tidak macet.
    img.onload = () => {
      img.decode().catch(() => undefined).finally(() => resolve(img));
    };
    img.onerror = () => resolve(img);
  });
}

export function SequenceProvider({ children }: { children: React.ReactNode }) {
  const frames = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const total = sequence.frameCount;

  // Di layar kecil cukup setiap frame ke-2: separuh unduhan dan memori, gerakan tetap halus.
  const [step, setStep] = useState(1);
  const needed = Math.ceil(total / step);

  // Preload semua frame di awal agar canvas tidak berkedip saat di-scroll.
  useEffect(() => {
    let cancelled = false;
    const frameStep = window.matchMedia("(max-width: 767px)").matches ? 2 : 1;
    const indices = Array.from({ length: Math.ceil(total / frameStep) }, (_, k) => k * frameStep);
    const images: HTMLImageElement[] = new Array(total);
    frames.current = images;

    (async () => {
      if (frameStep !== 1) setStep(frameStep);
      let done = 0;
      for (let start = 0; start < indices.length; start += BATCH_SIZE) {
        await Promise.all(
          indices.slice(start, start + BATCH_SIZE).map((i) =>
            loadFrame(frameSrc(i)).then((img) => {
              images[i] = img;
              done += 1;
              if (!cancelled) setLoaded(done);
            }),
          ),
        );
        if (cancelled) return;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [total]);

  const progress = Math.min(100, Math.round((loaded / needed) * 100));

  return (
    <SequenceContext.Provider
      value={{ frames, progress, ready: loaded >= needed, introDone, setIntroDone }}
    >
      {children}
    </SequenceContext.Provider>
  );
}

export function useSequence() {
  const ctx = useContext(SequenceContext);
  if (!ctx) throw new Error("useSequence must be used inside SequenceProvider");
  return ctx;
}
