export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

// Bentuk clip-path polygon yang dipakai bersama oleh preloader, menu, dan teks reveal.
export const CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
export const CLIP_CLOSED_TOP = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
export const CLIP_CLOSED_BOTTOM = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
