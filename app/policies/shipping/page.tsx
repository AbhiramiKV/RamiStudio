import type { Metadata } from "next";
import Link from "next/link";
import { Truck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Worldwide Insured Shipping & DDP Protocol | Rami Studio",
  description:
    "Learn about Rami Studio's white-glove insured global delivery via DHL Express DDP, complimentary worldwide shipping, and custom-tailored dispatch schedules.",
  alternates: {
    canonical: "https://ramistudio.luxury/policies/shipping",
  },
};

export default function ShippingPolicyPage() {
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
          <Truck className="w-4 h-4" />
          <span>Global Logistics Protocol</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-text-primary font-light">
          White-Glove Insured Shipping
        </h1>
        <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed">
          Every heirloom saree leaves our Kanchipuram atelier wrapped in unbleached mul-mul cotton cloth inside an acid-free cedarwood preservation chest, accompanied by insurance covering 100% of declared value.
        </p>
      </header>

      <div className="space-y-10 text-xs sm:text-sm text-text-secondary font-light leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            1. Complimentary DDP Delivery (Delivered Duty Paid)
          </h2>
          <p>
            We ship to over 80 countries including the United States, United Kingdom, Canada, Singapore, Australia, UAE, and the European Union with all customs duties and import VAT fully prepaid by Rami Studio. You will never be asked to pay unexpected tariffs at your doorstep.
          </p>
          <ul className="list-disc list-inside space-y-1 pt-2 font-mono text-xs text-text-tertiary">
            <li>Domestic India: Complimentary Overnight Air via Blue Dart Apex.</li>
            <li>United States &amp; Canada: 3–5 Business Days via DHL Express Worldwide.</li>
            <li>UK &amp; European Union: 3–5 Business Days via DHL Express.</li>
            <li>Singapore, UAE &amp; Asia-Pacific: 2–4 Business Days.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            2. Tailoring &amp; Finishing Dispatch Timelines
          </h2>
          <p>
            Because each order may include complimentary hand-stitched fall/pico or bespoke blouse couture, dispatch schedules depend on the level of craftsmanship selected:
          </p>
          <ul className="list-disc list-inside space-y-1 pt-2 font-mono text-xs text-text-tertiary">
            <li>Unaltered Loom Cut: Dispatched within 24 hours.</li>
            <li>Complimentary Fall &amp; Pico finishing: 2 business days.</li>
            <li>Pre-Pleated Ready-to-Wear Service: 3 business days.</li>
            <li>Bespoke Custom-Tailored Blouse: 5–7 business days before express flight.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 p-6 bg-canvas-elevated border border-surface-border rounded-xs">
          <h2 className="font-serif text-xl text-text-primary font-normal">
            3. Signature Required &amp; Tamper-Evident Wax Seals
          </h2>
          <p>
            For your security, all parcels require a physical signature upon delivery. Every cedarwood chest is secured with our serialized, tamper-evident brass wax seal. If the outer shipping seal appears broken upon courier arrival, please decline receipt and notify our concierge immediately at <a href="mailto:concierge@ramistudio.luxury" className="text-text-primary underline">concierge@ramistudio.luxury</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
