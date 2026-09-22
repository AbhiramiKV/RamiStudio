"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const EditorialJournal: React.FC = () => {
  const articles = [
    {
      id: "art-1",
      slug: "philosophy-of-the-fold",
      title: "The Grandmothers' Chest: Silks That Outlive Decades",
      subtitle:
        "The sacred continuity of the unstitched six yards—why a pure handloom saree is the only garment passed from mother to daughter without tailoring.",
      category: "HERITAGE ESSAY",
      readTime: "4 MIN READ",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
      linkedProductSlug: "alabaster-monolith",
    },
    {
      id: "art-2",
      slug: "korvai-pit-loom",
      title: "The Korvai Rhythm: Two Artisans, One Synchronized Breath",
      subtitle:
        "Inside Chinna Kanchipuram: How two master weavers toss shuttles simultaneously across the warp divide so border meets body without a single seam.",
      category: "WEAVER MONOGRAPH",
      readTime: "6 MIN READ",
      image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1200&auto=format&fit=crop",
      linkedProductSlug: "obsidian-veil-shot-silk",
    },
    {
      id: "art-3",
      slug: "matte-zari-restraint",
      title: "The Dignity of Matte Zari: Why Real Silver Whispers",
      subtitle:
        "Certified silver electroplated over pure silk thread and brushed with natural lacquer to absorb camera flash and glow under wedding chandeliers.",
      category: "METALLURGY & CRAFT",
      readTime: "3 MIN READ",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop",
      linkedProductSlug: "gossamer-sage-mirage",
    },
  ];

  return (
    <section
      id="journal"
      className="py-24 md:py-32 px-6 md:px-12 bg-canvas-base border-b border-surface-border"
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block mb-2">
              The Loom Monograph · Living Chronicles
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-text-primary">
              Artisan Lineage & Craft
            </h2>
          </div>

          <p className="text-xs text-text-secondary font-mono uppercase tracking-widest max-w-sm">
            Critical essays on Indian handloom sociology, weaving physics, and generational heirlooms.
          </p>
        </div>

        {/* Asymmetric 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {articles.map((art, index) => (
            <article
              key={art.id}
              className={`group flex flex-col justify-between space-y-6 ${
                index === 1 ? "md:-mt-6" : ""
              }`}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] w-full bg-canvas-elevated overflow-hidden border border-surface-border">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-silk-out group-hover:scale-105"
                />

                <div className="absolute top-4 left-4 bg-canvas-base/85 backdrop-blur-md px-2.5 py-1 border border-surface-border text-[9px] font-mono tracking-widest text-text-secondary uppercase">
                  {art.category}
                </div>

                <div className="absolute bottom-4 right-4 bg-canvas-base/85 backdrop-blur-md p-2 rounded-full border border-surface-border text-text-primary group-hover:bg-accent-zari transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Editorial Meta */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase">
                  {art.readTime}
                </div>

                <h3 className="font-serif text-2xl text-text-primary leading-snug group-hover:underline transition-all">
                  {art.title}
                </h3>

                <p className="text-xs text-text-secondary leading-relaxed font-light">
                  {art.subtitle}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/sarees/${art.linkedProductSlug}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-text-primary hover:text-accent-zari-hover uppercase transition-colors"
                  >
                    <span>Inspect Silhouette</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
