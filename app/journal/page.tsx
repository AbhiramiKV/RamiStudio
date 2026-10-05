import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { JOURNAL_ARTICLES } from "@/lib/journalData";
import { BookOpen, ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Atelier Journal & Textile Monographs | Rami Studio",
  description:
    "Scientific and cultural monographs on 3-ply Mulberry silk torsion, Korvai interlocking weft extinction, authentic zari metallurgy, and generational textile conservation.",
  openGraph: {
    title: "Atelier Journal & Textile Monographs | Rami Studio",
    description:
      "Deep-dive monographs exploring the living architecture of ceremonial Indian handloom silk.",
    url: "https://ramistudio.luxury/journal",
  },
  alternates: {
    canonical: "https://ramistudio.luxury/journal",
  },
};

export default function JournalPage() {
  const [featured, ...otherArticles] = JOURNAL_ARTICLES;

  return (
    <div className="pt-32 pb-32 px-4 sm:px-6 md:px-12 max-w-[1720px] mx-auto space-y-16">
      {/* Journal Header */}
      <section className="border-b border-surface-border pb-10 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-accent-zari-hover uppercase">
          <BookOpen className="w-3.5 h-3.5 text-accent-zari" />
          <span>The Atelier Gazette &amp; Textile Monographs</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-text-primary tracking-tight font-light">
              Living Architecture Monographs
            </h1>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-light">
              Field dispatches from our master pit-looms, scientific metrology analyses, and museum-grade conservation protocols curated for serious textile connoisseurs.
            </p>
          </div>
          <div className="text-xs font-mono text-text-tertiary uppercase tracking-widest">
            <span>Issue No. IV · 2026 Archive</span>
          </div>
        </div>
      </section>

      {/* Featured Lead Article */}
      {featured && (
        <section className="border border-surface-border bg-canvas-elevated rounded-xs overflow-hidden">
          <Link
            href={`/journal/${featured.slug}`}
            className="grid grid-cols-1 lg:grid-cols-12 group"
          >
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[500px] overflow-hidden bg-canvas-muted">
              <Image
                src={featured.heroImage}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-4 left-4 bg-canvas-base/90 backdrop-blur-md px-3 py-1 text-[10px] font-mono tracking-widest text-text-primary border border-surface-border uppercase">
                FEATURED MONOGRAPH
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono text-accent-zari-hover uppercase tracking-widest">
                  <span>{featured.category}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-text-tertiary">
                    <Clock className="w-3 h-3" />
                    <span>{featured.readTime}</span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-text-primary group-hover:text-accent-zari transition-colors font-light leading-snug">
                  {featured.title}
                </h2>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-text-tertiary uppercase block">
                    Author
                  </span>
                  <span className="font-serif text-sm text-text-primary">
                    {featured.author.name}
                  </span>
                </div>

                <span className="text-xs font-mono tracking-widest uppercase text-text-primary flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>READ MONOGRAPH</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Article Grid */}
      <section className="space-y-8">
        <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-text-tertiary">
          Archived Dispatches
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {otherArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group flex flex-col bg-canvas-base border border-surface-border rounded-xs overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-text-primary"
            >
              <div className="relative aspect-[16/10] w-full bg-canvas-elevated overflow-hidden">
                <Image
                  src={article.heroImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-canvas-base/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono tracking-widest text-text-primary border border-surface-border uppercase">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary uppercase">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl text-text-primary group-hover:text-accent-zari transition-colors leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-light line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-border/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-text-tertiary truncate">
                    By {article.author.name}
                  </span>
                  <span className="text-text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                    <span>READ</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
