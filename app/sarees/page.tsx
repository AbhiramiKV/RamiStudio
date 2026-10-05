import type { Metadata } from "next";
import { CollectionClient } from "@/components/collection/CollectionClient";

export const metadata: Metadata = {
  title: "Master Saree Collection | Haute Handloom Atelier | Rami Studio",
  description:
    "Explore the permanent archive of single-batch handloom silk sarees from Kanchipuram, Varanasi, Chanderi, and Bhagalpur. Hand-woven Mulberry silk with certified pure silver zari.",
  openGraph: {
    title: "Master Saree Collection | Rami Studio",
    description:
      "Handcrafted ceremonial sarees woven with double-warp 3-ply Mulberry silk and electro-lacquered pure silver zari.",
    type: "website",
    url: "https://ramistudio.luxury/sarees",
  },
  alternates: {
    canonical: "https://ramistudio.luxury/sarees",
  },
};

export default function SareesPage() {
  return <CollectionClient />;
}
