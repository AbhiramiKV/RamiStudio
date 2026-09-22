"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogoWordmark } from "@/components/branding/LogoWordmark";
import { LogoSeal } from "@/components/branding/LogoSeal";
import { ArrowRight, Check } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-canvas-elevated border-t border-surface-border text-text-primary pt-24 pb-16">
      <div className="max-w-[1720px] mx-auto px-6 md:px-12">
        {/* Top Tier: Brand Manifesto & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b border-surface-border/70">
          <div className="lg:col-span-6 space-y-6">
            <LogoWordmark size="md" />
            <p className="font-serif text-xl md:text-2xl text-text-secondary leading-relaxed max-w-lg font-light">
              "We strip the ceremonial saree of unnecessary ornament to isolate
              the elemental dignity of pure silk tension, light, and gravity."
            </p>
            <div className="pt-4 flex items-center gap-6 text-[11px] font-mono tracking-widest text-text-tertiary uppercase">
              <span>Origin: Kanchipuram</span>
              <span>·</span>
              <span>Varanasi</span>
              <span>·</span>
              <span>Arani</span>
              <span>·</span>
              <span>Bhagalpur</span>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-text-tertiary block mb-3">
                The Loom Registry
              </span>
              <h3 className="font-serif text-2xl text-text-primary mb-3">
                Seasonal Drop Invitations & Archival Notes
              </h3>
              <p className="text-sm text-text-secondary max-w-md mb-6 leading-relaxed">
                Receive private access to single-batch edition releases, weaver
                monographs, and textile architectural studies.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-3 py-3 px-4 bg-canvas-base border border-accent-zari/40 text-text-primary text-xs font-mono">
                  <Check className="w-4 h-4 text-accent-zari" />
                  <span>YOUR INVITATION IS RECORDED IN THE ARCHIVE.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter connoisseur email"
                    className="flex-1 bg-canvas-base border border-surface-border px-4 py-3 text-xs tracking-wider placeholder:text-text-tertiary focus:outline-none focus:border-text-primary transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-text-primary text-canvas-base px-6 py-3 text-xs font-mono tracking-[0.2em] uppercase hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center gap-2"
                    data-cursor="SUBSCRIBE"
                  >
                    <span>JOIN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            <div className="pt-8">
              <LogoSeal size={72} className="text-text-tertiary opacity-75" />
            </div>
          </div>
        </div>

        {/* Bottom Tier: Links & Copyright */}
        <div className="pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-[11px] font-mono tracking-widest text-text-secondary uppercase">
          <div className="flex flex-wrap gap-8">
            <Link href="/#curated-drop" className="hover:text-text-primary transition-colors">
              Collection (01)
            </Link>
            <Link href="/#fabric-lab" className="hover:text-text-primary transition-colors">
              Tactile Fabric Lab
            </Link>
            <Link href="/#journal" className="hover:text-text-primary transition-colors">
              Loom Monograph
            </Link>
            <a href="#" className="hover:text-text-primary transition-colors">
              Care & Preservation
            </a>
            <a href="#" className="hover:text-text-primary transition-colors">
              Client Concierge
            </a>
          </div>

          <div className="flex items-center gap-4 text-text-tertiary">
            <span>© 2026 RAMI STUDIO LLC</span>
            <span>·</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
