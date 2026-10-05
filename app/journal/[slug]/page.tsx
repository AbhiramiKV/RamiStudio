import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { JOURNAL_ARTICLES } from "@/lib/journalData";
import { SAREES_CATALOG } from "@/lib/catalogData";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";

interface JournalSlugProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return JOURNAL_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: JournalSlugProps): Promise<Metadata> {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: `${article.title} | Rami Studio Journal`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage],
      type: "article",
      url: `https://ramistudio.luxury/journal/${article.slug}`,
    },
    alternates: {
      canonical: `https://ramistudio.luxury/journal/${article.slug}`,
    },
  };
}

export default async function JournalArticlePage({ params }: JournalSlugProps) {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Get related sarees
  const relatedSarees = SAREES_CATALOG.filter((s) =>
    article.relatedSareeSlugs.includes(s.slug)
  );

  return (
    <article className="pt-32 pb-32 px-4 sm:px-6 md:px-12 max-w-[1280px] mx-auto space-y-16">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center justify-between text-xs font-mono text-text-secondary uppercase border-b border-surface-border pb-4">
        <Link
          href="/journal"
          className="flex items-center gap-1.5 hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Monographs</span>
        </Link>
        <span className="text-accent-zari-hover">{article.category}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-6 max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 text-xs font-mono uppercase tracking-widest text-text-tertiary">
          <span>{article.date}</span>
          <span>·</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-accent-zari" />
            <span>{article.readTime}</span>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-text-primary font-light leading-[1.12]">
          {article.title}
        </h1>

        <p className="font-serif text-lg sm:text-xl text-text-secondary font-light max-w-2xl mx-auto leading-relaxed">
          {article.subtitle}
        </p>

        {/* Author Credit */}
        <div className="pt-4 flex items-center justify-center gap-4 text-xs font-mono">
          <div>
            <span className="text-text-primary font-medium block">
              {article.author.name}
            </span>
            <span className="text-text-tertiary block mt-0.5">
              {article.author.role}
            </span>
          </div>
        </div>
      </header>

      {/* Hero Visual */}
      <div className="relative aspect-[16/9] w-full max-w-5xl mx-auto bg-canvas-elevated border border-surface-border rounded-xs overflow-hidden">
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Body Content */}
      <div className="max-w-3xl mx-auto space-y-12 text-text-secondary font-light text-base sm:text-lg leading-relaxed">
        <p className="font-serif text-xl sm:text-2xl text-text-primary leading-relaxed italic border-l-2 border-accent-zari pl-6">
          &ldquo;{article.excerpt}&rdquo;
        </p>

        {article.content.map((sec, idx) => (
          <section key={idx} className="space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-text-primary font-light tracking-tight">
              {sec.heading}
            </h2>

            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="leading-relaxed">
                {p}
              </p>
            ))}

            {sec.callout && (
              <div className="p-6 bg-canvas-elevated border border-surface-border rounded-xs text-xs sm:text-sm font-mono text-text-primary space-y-1">
                <div className="flex items-center gap-1.5 text-accent-zari-hover uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-accent-zari" />
                  <span>Atelier Laboratory Finding</span>
                </div>
                <p className="leading-relaxed font-sans">{sec.callout}</p>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Related Sarees Section */}
      {relatedSarees.length > 0 && (
        <section className="border-t border-surface-border pt-16 space-y-8 max-w-5xl mx-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase block">
              Complementary Weaves
            </span>
            <h3 className="font-serif text-2xl text-text-primary">
              Heirlooms Exemplifying This Technique
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedSarees.map((saree) => (
              <Link
                key={saree.id}
                href={`/sarees/${saree.slug}`}
                className="group p-4 bg-canvas-elevated border border-surface-border rounded-xs flex gap-4 items-center hover:border-text-primary transition-colors"
              >
                <div className="relative w-20 h-24 bg-canvas-base border border-surface-border shrink-0 overflow-hidden rounded-xs">
                  <Image
                    src={saree.images.hero}
                    alt={saree.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-mono tracking-wider text-accent-zari-hover uppercase">
                    {saree.certification.craftClusterRegNo}
                  </span>
                  <h4 className="font-serif text-base text-text-primary truncate group-hover:text-accent-zari transition-colors">
                    {saree.title}
                  </h4>
                  <div className="text-xs font-mono text-text-secondary">
                    ${saree.priceUSD} · {saree.specs.weightGrams}g Silk
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
