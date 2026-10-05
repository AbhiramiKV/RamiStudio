import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#F9F8F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

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
  metadataBase: new URL("https://ramistudio.luxury"),
  title: {
    default: "Rami Studio — Modern Luxury Silk Sarees & Textile Architecture",
    template: "%s | Rami Studio",
  },
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
    "Silk Mark Certified",
  ],
  openGraph: {
    title: "Rami Studio — Modern Luxury Silk Sarees & Textile Architecture",
    description:
      "Handcrafted ceremonial handloom silk sarees woven on traditional pit-looms with real silver electro-lacquered zari.",
    url: "https://ramistudio.luxury",
    siteName: "Rami Studio Luxury Atelier",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rami Studio — Haute Handloom Maison",
    description:
      "Single-batch pure silk drops from Kanchipuram, Varanasi, Chanderi, and Bhagalpur.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
};

import { LenisProvider } from "@/components/motion/LenisProvider";
import { MagneticCursor } from "@/components/motion/MagneticCursor";
import { CinematicSareeLanding } from "@/components/landing/CinematicSareeLanding";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rami Studio",
    url: "https://ramistudio.luxury",
    logo: "https://ramistudio.luxury/icon.svg",
    description: "Haute handloom maison preserving living textile architecture, pure Mulberry silk, and real silver zari.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "42 Weavers Colony, Pillayar Palayam",
      addressLocality: "Kanchipuram",
      addressRegion: "Tamil Nadu",
      postalCode: "631501",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-98401-23456",
      contactType: "customer service",
      availableLanguage: ["English", "Tamil", "Hindi"],
    },
    sameAs: [
      "https://instagram.com/ramistudio.luxury",
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
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
