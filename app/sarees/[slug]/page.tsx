import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SAREE_COLLECTION } from "@/lib/catalogData";
import { ProductDetailClient } from "@/components/pdp/ProductDetailClient";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return SAREE_COLLECTION.map((saree) => ({
    slug: saree.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const saree = SAREE_COLLECTION.find((s) => s.slug === slug);
  if (!saree) return {};

  return {
    title: `${saree.title} — Rami Studio`,
    description: saree.description,
  };
}

export default async function SareePage({ params }: PageProps) {
  const { slug } = await params;
  const saree = SAREE_COLLECTION.find((s) => s.slug === slug);

  if (!saree) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <ProductDetailClient saree={saree} />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
