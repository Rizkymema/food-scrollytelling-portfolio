import type { Metadata, Viewport } from "next";
import { Manrope, Syne } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { sequence, site } from "@/lib/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SequenceProvider } from "@/components/providers/SequenceProvider";
import { Cursor } from "@/components/Cursor";

const syne = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${site.name} — ${site.roleLong}`,
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.roleLong}`,
    description: site.description,
    images: ["/images/seq-end.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: sequence.background,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${manrope.variable}`}
      style={{ "--bg": sequence.background } as React.CSSProperties}
    >
      <body className="bg-bg text-ivory antialiased">
        <SmoothScroll>
          <SequenceProvider>
            <Cursor />
            {children}
          </SequenceProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
