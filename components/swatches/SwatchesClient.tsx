"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/stores/cartStore";
import { SwatchBoxModal } from "@/components/trust/SwatchBoxModal";
import { Package, Check } from "lucide-react";

export const SwatchesClient: React.FC = () => {
  const { formatPrice } = useCartStore();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="pt-32 pb-32 px-4 sm:px-6 md:px-12 max-w-[1720px] mx-auto space-y-16">
      {/* Header */}
      <section className="border-b border-surface-border pb-12 space-y-4 max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-accent-zari-hover uppercase">
          <Package className="w-3.5 h-3.5 text-accent-zari" />
          <span>Physical Sensory Archive</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-text-primary tracking-tight font-light leading-tight">
          The 4-Weave Tactile Swatch Kit
        </h1>
        <p className="font-serif text-xl sm:text-2xl text-text-secondary font-light leading-relaxed">
          Screen resolutions cannot convey the cool, fluid slip of 3-ply Mulberry silk or the dry warmth of wild forest Tussar. Touch the exact loom cuttings before investing in an heirloom.
        </p>
      </section>

      {/* Main Feature Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Visual Box Container */}
        <div className="lg:col-span-6 relative aspect-square bg-canvas-elevated border border-surface-border rounded-xs overflow-hidden p-8 flex flex-col justify-between">
          <div className="relative w-full h-full">
            <Image
              src="/images/products/saree-4.jpg"
              alt="Physical Tactile Swatch Kit"
              fill
              className="object-cover rounded-xs"
              priority
            />
          </div>

          <div className="absolute bottom-6 left-6 right-6 bg-canvas-base/90 backdrop-blur-md p-4 border border-surface-border flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-text-primary font-medium block">
                Archival Cedar Presentation Folio
              </span>
              <span className="text-[10px] text-text-tertiary">
                Mounted on acid-free 400gsm cotton board
              </span>
            </div>
            <span className="text-accent-zari font-mono text-sm font-bold">
              {formatPrice(25)}
            </span>
          </div>
        </div>

        {/* Details & Inclusions */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-text-tertiary uppercase block">
              100% Purchase Credit Guarantee
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-text-primary font-light">
              Zero Risk Tactile Appraisal
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed font-light">
              Your {formatPrice(25)} investment is completely refunded. Every tactile kit arrives with a sealed wax voucher stamped with your unique serial code (or use coupon <strong>SWATCH25</strong>) which immediately deducts {formatPrice(25)} from your subsequent saree order.
            </p>
          </div>

          {/* Inclusions List */}
          <div className="space-y-4 pt-4 border-t border-surface-border">
            <span className="text-xs font-mono uppercase tracking-wider text-text-secondary block">
              What Is Included In The Folio:
            </span>

            {[
              {
                title: "4 Certified Handloom Silk Swatches (5\" × 5\")",
                desc: "Full cuttings of Kanchipuram 3-ply Mulberry, Varanasi Kadhwa Brocade, Chanderi Degummed Silk-Cotton, and Bhagalpur Wild Kosa Tussar.",
              },
              {
                title: "Precious Zari Metallurgy Testing Ribbon",
                desc: "A dedicated sample of our electro-lacquered 0.6% silver zari yarn for luster and scratch inspection.",
              },
              {
                title: "Pocket Jeweler's Thread Count Loupe",
                desc: "A 10X magnifying glass to count picks and inspect the warp torsion and korvai joints under natural daylight.",
              },
              {
                title: "Silk Mark Burn-Test Guide & Voucher",
                desc: "Laboratory fiber identification card and your embossed $25 heirloom credit code.",
              },
            ].map((inc, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <Check className="w-4 h-4 text-accent-zari shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-medium text-text-primary block">{inc.title}</span>
                  <span className="text-text-secondary font-light">{inc.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 bg-text-primary text-canvas-base text-xs font-mono uppercase tracking-widest hover:bg-accent-zari hover:text-text-primary transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Package className="w-4 h-4" />
              <span>Acquire Swatch Kit · {formatPrice(25)}</span>
            </button>

            <span className="text-[11px] font-mono text-text-tertiary">
              Dispatches worldwide via DHL in 24 hours.
            </span>
          </div>
        </div>
      </section>

      {/* Swatch Box Modal */}
      <SwatchBoxModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
