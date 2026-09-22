"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogoWordmark } from "@/components/branding/LogoWordmark";
import { LogoSeal } from "@/components/branding/LogoSeal";
import { CarePreservationModal } from "@/components/trust/CarePreservationModal";
import { ArrowRight, Check, Award, ShieldCheck, Phone, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [careModalOpen, setCareModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <>
      <footer className="bg-canvas-elevated border-t border-surface-border text-text-primary pt-24 pb-16">
        <div className="max-w-[1720px] mx-auto px-6 md:px-12">
          {/* Top Tier: Brand Manifesto & Newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-16 border-b border-surface-border/70">
            <div className="lg:col-span-6 space-y-6">
              <LogoWordmark size="md" />
              <p className="font-serif text-xl md:text-2xl text-text-secondary leading-relaxed max-w-lg font-light">
                &ldquo;We preserve the ceremonial handloom saree as living architecture—honoring pure silk tension, master-loom geometry, and real silver zari.&rdquo;
              </p>
              
              {/* Trust Badge Grid */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] font-mono tracking-wider text-text-secondary">
                <div className="flex items-center gap-1.5 bg-canvas-base border border-surface-border px-3 py-1.5">
                  <Award className="w-3.5 h-3.5 text-accent-zari" />
                  <span>SILK MARK NO: SM/TN/2026/04918</span>
                </div>
                <div className="flex items-center gap-1.5 bg-canvas-base border border-surface-border px-3 py-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent-zari" />
                  <span>GI TAG CERTIFIED: #85 & #175</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4 text-[11px] font-mono tracking-widest text-text-tertiary uppercase">
                <span>Weaver Guilds: Kanchipuram</span>
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
                  Seasonal Loom Invitations & Archival Notes
                </h3>
                <p className="text-sm text-text-secondary max-w-md mb-6 leading-relaxed">
                  Receive private invitations to single-batch loom drops, master weaver
                  monographs, and textile preservation dispatches.
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

          {/* Middle Tier: Atelier Presence & Guarantees */}
          <div className="py-12 border-b border-surface-border/70 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono uppercase tracking-widest text-text-primary text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-accent-zari" />
                <span>Weaving Flagship Atelier</span>
              </div>
              <p className="text-text-secondary leading-relaxed font-light">
                42 Weavers Colony, Pillayar Palayam<br />
                Kanchipuram, Tamil Nadu 631501, India<br />
                <span className="text-[10px] font-mono text-text-tertiary">Direct Pit-Loom Studio & Dye House</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono uppercase tracking-widest text-text-primary text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-accent-zari" />
                <span>International Client Suite</span>
              </div>
              <p className="text-text-secondary leading-relaxed font-light">
                450 Lexington Avenue, 18th Floor<br />
                New York, NY 10017, United States<br />
                <span className="text-[10px] font-mono text-text-tertiary">By Private Draping Appointment Only</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono uppercase tracking-widest text-text-primary text-[11px]">
                <Phone className="w-3.5 h-3.5 text-accent-zari" />
                <span>Concierge & Stylist Line</span>
              </div>
              <p className="text-text-secondary leading-relaxed font-light">
                WhatsApp: +91 98401 23456 (24/7 Draping Support)<br />
                Concierge Desk: concierge@ramistudio.luxury<br />
                <span className="text-[10px] font-mono text-text-tertiary">DDP Insured Global Express via DHL</span>
              </p>
            </div>
          </div>

          {/* Bottom Tier: Links & Copyright */}
          <div className="pt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-[11px] font-mono tracking-widest text-text-secondary uppercase">
            <div className="flex flex-wrap gap-8 items-center">
              <Link href="/#curated-drop" className="hover:text-text-primary transition-colors">
                Heirlooms
              </Link>
              <Link href="/#fabric-lab" className="hover:text-text-primary transition-colors">
                Weave Guide
              </Link>
              <Link href="/#journal" className="hover:text-text-primary transition-colors">
                Loom Monograph
              </Link>
              <button
                onClick={() => setCareModalOpen(true)}
                className="hover:text-text-primary transition-colors uppercase cursor-pointer"
              >
                Care & Preservation
              </button>
              <a
                href="https://wa.me/919840123456?text=Hello%20Rami%20Studio%20Concierge,%20I%20would%20like%20to%20consult%20a%20handloom%20stylist."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-primary transition-colors"
              >
                Stylist Concierge
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-text-tertiary text-[10px]">
              <span>© 2026 RAMI STUDIO LLC</span>
              <span className="hidden sm:inline">·</span>
              <span>MINISTRY OF TEXTILES CENTRAL SILK BOARD AFFILIATED</span>
              <span className="hidden sm:inline">·</span>
              <span>ALL RIGHTS RESERVED</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Care & Preservation Modal */}
      <CarePreservationModal
        isOpen={careModalOpen}
        onClose={() => setCareModalOpen(false)}
      />
    </>
  );
};
