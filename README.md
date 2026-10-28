# Food Scrollytelling Portfolio (Next.js)

Website portfolio fotografer makanan dengan animasi scroll yang memutar image sequence di canvas.
Dibangun dari tiga file konsep:

1. `STEP-1-GENERATE-GAMBAR-AI/01-makanan-food-image.md` → gambar di Google Flow (Nano Banana Pro)
2. `STEP-2-GENERATE-VIDEO-SEQUENCE/01-makanan-food-video.md` → video di Google Flow (Veo 3.1)
3. `STEP-3-BUILD-WEBSITE-NEXTJS/01-makanan-food-web.md` → website ini

Stack: Next.js 16, TypeScript, Tailwind CSS 4, Motion, Lenis, HTML5 Canvas.

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Mengganti nama, peran, dan WhatsApp

Semua ada di `src/lib/site.ts` (`name`, `role`, `whatsapp` format `628xxxxxxxxxx`, `email`, `instagram`).

## Aset dari Flow

Semua prompt dan peta file ada di `flow/bible.json`. Hasil Flow diunduh ke
`C:\Users\<user>\flow-mcp-out\web1_food\`. Untuk menyalinnya ke `public/` dan mengekstrak frame:

```bash
node scripts/prepare-assets.mjs
```

Skrip ini menggantikan langkah Ezgif: frame diambil 24 FPS, lebar maks 1600 px, JPEG ~115 KB per frame, ke
`public/sequence/frame_0001.jpg` dan seterusnya. Jumlah frame dan warna tepi frame pertama ditulis ke
`src/lib/sequence-manifest.json`, lalu dipakai sebagai warna background situs agar canvas menyatu.

`node scripts/prepare-assets.mjs --test` membuat frame sementara dari gambar diam bila video belum ada.

## Struktur

| File | Isi |
|---|---|
| `src/components/Preloader.tsx` | Preloader: counter, loading bar, nama dan peran reveal clip-path |
| `src/components/Navbar.tsx` | Navbar mengambang + menu fullscreen clip-path |
| `src/components/SequenceScroll.tsx` | Container 500vh, canvas sticky, overlay teks 5/30/60/90% |
| `src/components/providers/SequenceProvider.tsx` | Preload semua frame sebelum scroll diizinkan |
| `src/components/Particles.tsx` | Partikel bara dan rempah dengan kedalaman 3D |
| `src/components/Projects.tsx` | 4 studi kasus, tilt 3D dan glow mengikuti kursor |
| `src/components/About.tsx` | Teks reveal per huruf, gambar parallax, counter |
| `src/components/Process.tsx` | Video timelapse dalam bingkai 3D |
| `src/components/Services.tsx` | Daftar layanan dengan gambar melayang saat hover |
| `src/components/Contact.tsx` | CTA WhatsApp, ikon parallax |
| `src/components/Footer.tsx` | Teks raksasa selebar layar dengan reveal |
