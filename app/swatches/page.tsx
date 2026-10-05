import type { Metadata } from "next";
import { SwatchesClient } from "@/components/swatches/SwatchesClient";

export const metadata: Metadata = {
  title: "Tactile Swatch Archive Box | Rami Studio",
  description:
    "Order our physical 4-swatch sensory archive kit with certified Kanchipuram, Banarasi, Chanderi, and Tussar silk cuttings. $25 deposit 100% credited toward your saree purchase.",
  openGraph: {
    title: "Tactile Swatch Archive Box | Rami Studio",
    description:
      "Physical silk cuttings with thread count loupe and silver zari sample. 100% credited against your saree order.",
    url: "https://ramistudio.luxury/swatches",
  },
  alternates: {
    canonical: "https://ramistudio.luxury/swatches",
  },
};

export default function SwatchesPage() {
  return <SwatchesClient />;
}
