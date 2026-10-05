import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, ArrowLeft, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "7-Day In-Home Inspection & Returns Protocol | Rami Studio",
  description:
    "Review Rami Studio's 7-day in-home heirloom inspection window, pre-paid return logistics, tamper seal guidelines, and custom tailoring return exceptions.",
  alternates: {
    canonical: "https://ramistudio.luxury/policies/returns",
  },
};

export default function ReturnsPolicyPage() {
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
          <RotateCcw className="w-4 h-4" />
          <span>Atelier Inspection Charter</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-text-primary font-light">
          7-Day In-Home Heirloom Inspection
        </h1>
        <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed">
          We understand that acquiring a ceremonial handloom is an intimate, generational decision. We invite you to inspect the silk under your natural home lighting for seven days.
        </p>
      </header>

      <div className="space-y-10 text-xs sm:text-sm text-text-secondary font-light leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            1. The 7-Day Inspection Window
          </h2>
          <p>
            You have seven full calendar days from the moment DHL confirms physical delivery to examine the weave, feel the weight of the pure mulberry silk, and drape the pallu over your shoulder in front of your mirror.
          </p>
          <p>
            If the undertones do not match your jewelry or skin tone, you may request a complimentary return or exchange with zero restocking fees.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            2. Tamper-Evident Security Seal Requirement
          </h2>
          <p>
            Every Rami Studio saree is fitted with a soft silk security ribbon attached to the corner selvedge with a numbered brass seal.
          </p>
          <div className="flex items-start gap-2.5 p-3 bg-canvas-base border border-surface-border text-text-primary font-mono text-xs">
            <AlertCircle className="w-4 h-4 text-accent-zari shrink-0 mt-0.5" />
            <span>
              <strong>Crucial Condition:</strong> You can drape and touch the entire saree with the seal intact. Once the security ribbon is cut or the brass seal is removed, the piece is deemed worn and is ineligible for return.
            </span>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            3. Custom Tailored Blouses &amp; Pre-Pleated Alterations
          </h2>
          <p>
            Sarees ordered with unstitched blouse lengths or complimentary standard fall &amp; pico remain 100% eligible for return.
          </p>
          <p>
            However, pieces customized with our <strong>Bespoke 8-Point Tailored Blouse</strong> or <strong>Permanent Pre-Pleated Stitching</strong> are personalized exclusively to your anatomical measurements and cannot be returned unless a manufacturing defect is verified by our master cutter.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            4. Pre-Paid Return Logistics
          </h2>
          <p>
            To initiate an inspection return, message our stylist concierge on WhatsApp at +91 98401 23456 or email <a href="mailto:returns@ramistudio.luxury" className="text-text-primary underline">returns@ramistudio.luxury</a>. We will dispatch a pre-paid DHL Express insured pickup label directly to your email within four business hours.
          </p>
        </section>
      </div>
    </div>
  );
}
