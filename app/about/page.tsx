import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Award, ShieldCheck, HeartHandshake, Sparkles, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Maison Heritage & Guild Manifesto | Rami Studio",
  description:
    "Learn about Rami Studio's slow luxury philosophy, direct 70% master weaver wage realization, and generational handloom silk preservation across Kanchipuram, Varanasi, and Bhagalpur.",
  openGraph: {
    title: "Maison Heritage & Guild Manifesto | Rami Studio",
    description:
      "Preserving the ceremonial handloom saree as living architecture. Central Silk Board certified, zero polyester compromise.",
    url: "https://ramistudio.luxury/about",
  },
  alternates: {
    canonical: "https://ramistudio.luxury/about",
  },
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-32 px-4 sm:px-6 md:px-12 max-w-[1720px] mx-auto space-y-20">
      {/* Manifesto Hero */}
      <section className="border-b border-surface-border pb-16 space-y-6 max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.3em] text-accent-zari-hover uppercase">
          <Sparkles className="w-3.5 h-3.5 text-accent-zari" />
          <span>The Atelier Manifesto</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-text-primary tracking-tight font-light leading-[1.08]">
          We treat the handloom saree as monumental architecture.
        </h1>
        <p className="font-serif text-xl sm:text-2xl text-text-secondary font-light leading-relaxed">
          In a world dominated by mill-synthetics, rapid digital prints, and plastic metallic yarn, Rami Studio exists to anchor the eternal craft of ceremonial hand-weaving.
        </p>
      </section>

      {/* Core Tenets Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-canvas-elevated border border-surface-border rounded-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-accent-zari/15 border border-accent-zari/30 flex items-center justify-center text-accent-zari">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase block">
            Pillar 01
          </span>
          <h3 className="font-serif text-2xl text-text-primary">
            70% Direct Wage Realization
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light">
            We bypass middlemen, wholesale distributors, and multi-tier trader markups. Seventy percent of the production budget flows directly to the weaver household, establishing financial generational dignity.
          </p>
        </div>

        <div className="p-8 bg-canvas-elevated border border-surface-border rounded-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-accent-zari/15 border border-accent-zari/30 flex items-center justify-center text-accent-zari">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase block">
            Pillar 02
          </span>
          <h3 className="font-serif text-2xl text-text-primary">
            Zero Synthetic Compromise
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light">
            Every millimeter of warp and weft is tested for pure Mulberry or wild Tussar protein fiber. Certified by the Central Silk Board under Silk Mark No. SM/TN/2026/04918. Never polyester. Never viscose.
          </p>
        </div>

        <div className="p-8 bg-canvas-elevated border border-surface-border rounded-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-accent-zari/15 border border-accent-zari/30 flex items-center justify-center text-accent-zari">
            <Award className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase block">
            Pillar 03
          </span>
          <h3 className="font-serif text-2xl text-text-primary">
            Authentic Silver Metallurgy
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light">
            Our zari features genuine silver foil electro-lacquered with pure 24K gold over a natural silk core yarn. The result is a subdued, antique moonlit luster that patinas with beauty over fifty years instead of flaking.
          </p>
        </div>
      </section>

      {/* Weaver Guild Map & Heritage Regions */}
      <section className="border-t border-b border-surface-border py-16 space-y-12">
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-accent-zari-hover uppercase block">
            Geographical Lineage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-text-primary font-light">
            Four Master Guild Centers
          </h2>
          <p className="text-sm text-text-secondary max-w-2xl font-light leading-relaxed">
            India&apos;s weaving traditions are geographically protected under international Geographical Indication (GI) legislation. Each region possesses inimitable microclimate conditions, water minerality for dyeing, and centuries of guild knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              region: "Kanchipuram, Tamil Nadu",
              gi: "IND-GI-TN-0088",
              craft: "Korvai Interlocking Pit-Loom",
              desc: "Famous for heavy 3-ply twisted silk, contrast borders joined by three-shuttle lock weaving, and temple spire gopuram motifs.",
            },
            {
              region: "Varanasi, Uttar Pradesh",
              gi: "IND-GI-UP-0099",
              craft: "Kadhwa Hand-Jaala Brocade",
              desc: "Intricate floral jaal where each motif is individually engraved without loose floats on the reverse side.",
            },
            {
              region: "Chanderi, Madhya Pradesh",
              gi: "IND-GI-TN-0112",
              craft: "Gossamer Degummed Silk-Cotton",
              desc: "Sheer, translucent airiness engineered using un-degummed raw silk warp and fine Egyptian cotton weft.",
            },
            {
              region: "Bhagalpur, Bihar",
              gi: "IND-GI-BH-0021",
              craft: "Wild Forest Reeled Kosa Tussar",
              desc: "Textured, thermal-regulating wild silk reeled from oak-tussar cocoons with organic slub texture.",
            },
          ].map((item) => (
            <div key={item.region} className="p-6 bg-canvas-base border border-surface-border rounded-xs space-y-3">
              <div className="flex items-center gap-1.5 text-accent-zari text-xs font-mono">
                <MapPin className="w-3.5 h-3.5" />
                <span>{item.gi}</span>
              </div>
              <h4 className="font-serif text-lg text-text-primary">{item.region}</h4>
              <div className="text-[11px] font-mono text-text-tertiary uppercase">{item.craft}</div>
              <p className="text-xs text-text-secondary leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Artisan Portraiture & Voice */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative aspect-[4/5] bg-canvas-elevated border border-surface-border rounded-xs overflow-hidden">
          <Image
            src="/images/products/saree-3.jpg"
            alt="Master Weaver at Pit Loom"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-canvas-base/90 backdrop-blur-md p-4 border border-surface-border">
            <span className="text-[10px] font-mono tracking-wider text-text-tertiary uppercase block">
              Third-Generation Master Weaver
            </span>
            <div className="font-serif text-base text-text-primary">
              K. Sundaramurthy, Pillayar Palayam Loom Guild
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block">
            Voices From The Loom
          </span>
          <blockquote className="font-serif text-2xl sm:text-3xl text-text-primary font-light leading-relaxed italic">
            &ldquo;A powerloom throws 300 picks a minute with steel fingers that crush the thread. A pit-loom takes two breaths for every single pick. The silk remembers that human patience for one hundred years.&rdquo;
          </blockquote>
          <p className="text-sm text-text-secondary leading-relaxed font-light max-w-xl">
            At Rami Studio, our weavers work in open-courtyard atelier houses with natural cross-ventilation, earning pension-contributing living wages. When you acquire a saree here, your name is entered beside the artisan who spent twenty-four days preparing your piece.
          </p>

          <div className="pt-4 flex items-center gap-4">
            <Link
              href="/sarees"
              className="px-8 py-3 bg-text-primary text-canvas-base text-xs font-mono uppercase tracking-widest hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-2"
            >
              <span>Explore The Current Drop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/swatches"
              className="px-6 py-3 border border-surface-border text-xs font-mono uppercase tracking-widest hover:border-text-primary transition-colors"
            >
              Order Tactile Kit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
