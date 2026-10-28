import manifest from "./sequence-manifest.json";

// Ganti data di file ini untuk memakai template dengan nama, peran, dan nomor WhatsApp sendiri.
export const site = {
  name: "Raka Adiwangsa",
  shortName: "Raka",
  monogram: "RA",
  role: "Food Photographer",
  roleLong: "Food Photographer & Culinary Director",
  whatsapp: "6281234567890",
  email: "hello@rakaadiwangsa.com",
  location: "Jakarta, Indonesia",
  instagram: "https://www.instagram.com/",
  year: 2026,
  description:
    "I photograph and film food for restaurants, chefs, and food brands that want their plates to be remembered long after the last bite.",
};

export const waLink = (message?: string) =>
  `https://wa.me/${site.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

// Frame hasil ekstrak video Flow (24 fps) di /public/sequence/frame_0001.jpg dan seterusnya.
// Jumlah frame dan warna tepi ditulis otomatis oleh scripts/prepare-assets.mjs.
export const sequence = {
  frameCount: manifest.frameCount,
  background: manifest.background,
};

export const frameSrc = (index: number) =>
  `/sequence/frame_${String(index + 1).padStart(4, "0")}.jpg`;

export const navLinks = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];
