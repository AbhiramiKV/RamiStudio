"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SAREES_CATALOG } from "@/lib/catalogData";
import { useCartStore } from "@/lib/stores/cartStore";
import { Search, X, BookOpen, Scissors, ArrowRight, CornerDownLeft } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string;
  type: "saree" | "journal" | "service";
  title: string;
  subtitle: string;
  href: string;
  image?: string;
  badge?: string;
}

const MAISON_ARTICLES = [
  {
    slug: "anatomy-of-3-ply-mulberry-silk",
    title: "The Anatomy of 3-Ply Mulberry Silk: Gram-Weight & Century Durability",
    topic: "Textile Metrology",
  },
  {
    slug: "metallurgy-of-authentic-zari",
    title: "The Metallurgy of Authentic Zari: Discerning Real Silver from Mylar Plastic",
    topic: "Zari Metallurgy",
  },
  {
    slug: "korvai-interlocking-weft-extinction",
    title: "The Korvai Interlocking Weft: An Ancient Architectural Marvel in Jeopardy",
    topic: "Loom Heritage",
  },
  {
    slug: "generational-preservation-guide",
    title: "Generational Preservation: Acid-Free Cedar Storage & The 6-Month Refolding Ritual",
    topic: "Conservation Protocol",
  },
];

const MAISON_SERVICES = [
  {
    id: "bespoke-tailoring",
    title: "Bespoke Blouse Tailoring Suite",
    subtitle: "8-point couture cuts, boat-neck, potli buttons & mul-mul linings",
    href: "/sarees/alabaster-monolith",
    badge: "ATELIER SERVICE",
  },
  {
    id: "swatch-box",
    title: "Physical 4-Swatch Tactile Archive Box",
    subtitle: "$25 curated box, 100% credited toward your heirloom acquisition",
    href: "/swatches",
    badge: "TACTILE LAB",
  },
  {
    id: "pre-pleated",
    title: "Pre-Pleated Ready-to-Wear Drape Service",
    subtitle: "Mathematical 45-second slip-on drape with 3-stage tolerance hooks",
    href: "/sarees/gossamer-sage-mirage",
    badge: "INNOVATION",
  },
  {
    id: "silk-mark",
    title: "Central Silk Board & GI Certification Registry",
    subtitle: "QR code verified purity cards and chemical burn-test protocols",
    href: "/about",
    badge: "GOVERNMENT GI",
  },
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { formatPrice } = useCartStore();

  const handleClose = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) handleClose();
      }
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Search Sarees
  const filteredSarees: SearchResultItem[] = (
    normalizedQuery
      ? SAREES_CATALOG.filter(
          (s) =>
            s.title.toLowerCase().includes(normalizedQuery) ||
            s.culturalName.toLowerCase().includes(normalizedQuery) ||
            s.specs.originRegion.toLowerCase().includes(normalizedQuery) ||
            s.specs.loomType.toLowerCase().includes(normalizedQuery) ||
            s.specs.zariPurity.toLowerCase().includes(normalizedQuery) ||
            s.description.toLowerCase().includes(normalizedQuery) ||
            s.colorways.some((c) => c.name.toLowerCase().includes(normalizedQuery))
        )
      : SAREES_CATALOG
  ).map((s) => ({
    id: s.id,
    type: "saree",
    title: s.title,
    subtitle: `${s.specs.originRegion.split(",")[0]} · ${s.specs.loomType.split("(")[0].trim()} · ${formatPrice(s.priceUSD)}`,
    href: `/sarees/${s.slug}`,
    image: s.images.hero,
    badge: s.certification.craftClusterRegNo,
  }));

  // Search Articles
  const filteredArticles: SearchResultItem[] = MAISON_ARTICLES.filter(
    (a) =>
      !normalizedQuery ||
      a.title.toLowerCase().includes(normalizedQuery) ||
      a.topic.toLowerCase().includes(normalizedQuery)
  ).map((a) => ({
    id: a.slug,
    type: "journal",
    title: a.title,
    subtitle: `Journal · ${a.topic}`,
    href: `/journal/${a.slug}`,
    badge: "MONOGRAPH",
  }));

  // Search Services
  const filteredServices: SearchResultItem[] = MAISON_SERVICES.filter(
    (srv) =>
      !normalizedQuery ||
      srv.title.toLowerCase().includes(normalizedQuery) ||
      srv.subtitle.toLowerCase().includes(normalizedQuery)
  ).map((srv) => ({
    id: srv.id,
    type: "service",
    title: srv.title,
    subtitle: srv.subtitle,
    href: srv.href,
    badge: srv.badge,
  }));

  const combinedResults: SearchResultItem[] = [
    ...filteredSarees,
    ...filteredArticles,
    ...filteredServices,
  ];

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedResults.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev <= 0 ? Math.max(0, combinedResults.length - 1) : prev - 1
      );
    } else if (e.key === "Enter" && combinedResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(combinedResults[selectedIndex].href);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-primary/60 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-canvas-base border border-surface-border rounded-xs shadow-2xl z-10 flex flex-col overflow-hidden animate-slideDown"
        role="dialog"
        aria-modal="true"
        aria-label="Atelier Search"
      >
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-surface-border flex items-center gap-3 bg-canvas-elevated">
          <Search className="w-5 h-5 text-accent-zari shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search heirlooms, GI tags, zari purity, articles..."
            className="w-full bg-transparent text-sm sm:text-base text-text-primary placeholder:text-text-tertiary focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-text-tertiary hover:text-text-primary text-xs font-mono uppercase"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleClose}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors border border-surface-border rounded-xs"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-surface-border/40">
          {combinedResults.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-serif text-lg text-text-secondary">
                No archived heirlooms match &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-text-tertiary font-mono">
                Try searching for &quot;Kanchipuram&quot;, &quot;Zari&quot;, &quot;Sage&quot;, or &quot;Swatches&quot;.
              </p>
            </div>
          ) : (
            combinedResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 cursor-pointer rounded-xs transition-colors flex items-center justify-between gap-4 ${
                    isSelected ? "bg-canvas-elevated border-l-2 border-l-text-primary" : "hover:bg-canvas-elevated/50"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {item.image ? (
                      <div className="relative w-11 h-11 border border-surface-border shrink-0 rounded-xs overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : item.type === "journal" ? (
                      <div className="w-11 h-11 bg-accent-zari/10 border border-accent-zari/30 shrink-0 rounded-xs flex items-center justify-center text-accent-zari-hover">
                        <BookOpen className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 bg-canvas-muted border border-surface-border shrink-0 rounded-xs flex items-center justify-center text-text-secondary">
                        <Scissors className="w-4 h-4" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm text-text-primary truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 bg-accent-zari/10 text-accent-zari-hover border border-accent-zari/30 uppercase shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-text-secondary truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-text-tertiary shrink-0">
                    {isSelected && (
                      <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest text-text-secondary flex items-center gap-1">
                        <span>SELECT</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-canvas-elevated border-t border-surface-border flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 border border-surface-border bg-canvas-base rounded-xs">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 border border-surface-border bg-canvas-base rounded-xs">↵</kbd>
              <span>Open</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 border border-surface-border bg-canvas-base rounded-xs">ESC</kbd>
              <span>Close</span>
            </span>
          </div>

          <span>{combinedResults.length} ATELIER ENTRIES</span>
        </div>
      </div>
    </div>
  );
};
