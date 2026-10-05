import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Atelier Terms of Sale & Service | Rami Studio",
  description:
    "Official terms of sale, handcrafted variation allowances, intellectual property rights, and bespoke commissioning conditions of Rami Studio LLC.",
  alternates: {
    canonical: "https://ramistudio.luxury/policies/terms",
  },
};

export default function TermsPolicyPage() {
  return (
    <div className="pt-32 pb-32 px-4 sm:px-6 md:px-12 max-w-[1000px] mx-auto space-y-12">
      <nav className="border-b border-surface-border pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-text-primary uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Atelier</span>
        </Link>
      </nav>

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-accent-zari uppercase">
          <FileText className="w-4 h-4" />
          <span>Legal Charter</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-text-primary font-light">
          Atelier Terms &amp; Conditions of Sale
        </h1>
        <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed">
          Please review the operating terms governing handloom textile commissions and acquisitions placed with Rami Studio LLC.
        </p>
      </header>

      <div className="space-y-8 text-xs sm:text-sm text-text-secondary font-light leading-relaxed">
        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            1. Nature of Handcrafted Pit-Loom Textiles
          </h2>
          <p>
            Every saree in our collection is woven entirely by human hand on non-mechanized wooden pit-looms. Subtle irregularities in weft thread tension, micro-slubs in wild silk filaments, and slight organic variations in botanical dye uptake are not defects—they are the indelible fingerprints of authentic human craft and legal proof of handloom origin under the Handloom (Reservation of Articles for Production) Act.
          </p>
        </section>

        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            2. Color Rendering &amp; Display Undertones
          </h2>
          <p>
            Shot-silk weaves (such as our Obsidian &amp; Crimson shot-silk) change hue dynamically depending on whether illumination arrives from warm candlelight, cool daylight, or flash photography. While our 3D WebGL renderer simulates multi-angle anisotropic refraction, exact screen color calibration may vary across hardware displays. For critical bridal color-matching, we strongly advise ordering our physical 4-swatch kit prior to committing to an heirloom.
          </p>
        </section>

        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            3. Intellectual Property &amp; Archival Motifs
          </h2>
          <p>
            All architectural drape shaders, weave simulation physics, editorial photography, and proprietary border vector charts displayed on ramistudio.luxury are the registered intellectual property of Rami Studio LLC. Unauthorized digital scraping or commercial reproduction is strictly prohibited.
          </p>
        </section>
      </div>
    </div>
  );
}
