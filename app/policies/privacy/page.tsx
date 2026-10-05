import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & Connoisseur Data Protection | Rami Studio",
  description:
    "Rami Studio's privacy charter: strict GDPR and CCPA compliance, zero sale of private measurements, and end-to-end encrypted transactions.",
  alternates: {
    canonical: "https://ramistudio.luxury/policies/privacy",
  },
};

export default function PrivacyPolicyPage() {
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
          <Lock className="w-4 h-4" />
          <span>Atelier Privacy Charter</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-text-primary font-light">
          Connoisseur Privacy &amp; Data Security
        </h1>
        <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed">
          We treat our patrons&apos; personal details and tailoring metrology with the same discretion that Swiss private banks treat wealth management. We never trade, license, or sell customer records.
        </p>
      </header>

      <div className="space-y-8 text-xs sm:text-sm text-text-secondary font-light leading-relaxed">
        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            1. Anatomical Measurements Confidentiality
          </h2>
          <p>
            Bespoke tailoring measurements submitted through our 8-point metrology modal are encrypted and accessible exclusively by our master cutter and head pattern-maker. They are retained strictly to facilitate future bespoke orders upon your request and are never shared with advertising networks.
          </p>
        </section>

        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            2. Payment Vault &amp; Card Security
          </h2>
          <p>
            Rami Studio does not store raw credit card numbers or CVV codes on our servers. All financial transactions are tokenized via PCI-DSS Level 1 compliant gateway processors (Stripe &amp; Razorpay) utilizing 256-bit TLS encryption with 3D Secure biometric verification.
          </p>
        </section>

        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            3. Right to Erasure (GDPR &amp; CCPA)
          </h2>
          <p>
            Under European GDPR and California CCPA regulations, you hold the unconditioned right to inspect, export, or permanently delete your atelier profile, order history, and measurement logs. To exercise this right, write directly to our privacy officer at <a href="mailto:privacy@ramistudio.luxury" className="text-text-primary underline">privacy@ramistudio.luxury</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
