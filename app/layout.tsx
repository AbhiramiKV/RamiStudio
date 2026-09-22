import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-editorial",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Rami Studio — Modern Luxury Silk Sarees & Textile Architecture",
  description:
    "Featherweight soft silks, gossamer organza blends, and antique matte zari. Understated modern luxury handloom rooted in quiet Indian heritage.",
  keywords: [
    "Rami Studio",
    "Luxury Silk Sarees",
    "Modern Handloom",
    "Kanchipuram Silk",
    "Banarasi Organza",
    "Matte Zari",
    "Textile Architecture",
  ],
};

import { LenisProvider } from "@/components/motion/LenisProvider";
import { MagneticCursor } from "@/components/motion/MagneticCursor";
import { CinematicSareeLanding } from "@/components/landing/CinematicSareeLanding";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas-base text-text-primary font-sans">
        <LenisProvider>
          <MagneticCursor />
          <CinematicSareeLanding />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
