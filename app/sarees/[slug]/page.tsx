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
    title: `${saree.title} | Pure Handloom Silk | Rami Studio`,
    description: saree.description,
    openGraph: {
      title: `${saree.title} — Rami Studio`,
      description: saree.description,
      images: [
        {
          url: saree.images.hero,
          width: 1200,
          height: 1600,
          alt: saree.title,
        },
      ],
      type: "website",
      url: `https://ramistudio.luxury/sarees/${saree.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: saree.title,
      description: saree.description,
      images: [saree.images.hero],
    },
    alternates: {
      canonical: `https://ramistudio.luxury/sarees/${saree.slug}`,
    },
  };
}

export default async function SareePage({ params }: PageProps) {
  const { slug } = await params;
  const saree = SAREE_COLLECTION.find((s) => s.slug === slug);

  if (!saree) {
    notFound();
  }

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: saree.title,
    image: [saree.images.hero, saree.images.drape, saree.images.macro],
    description: saree.description,
    sku: saree.id,
    mpn: saree.certification.craftClusterRegNo,
    brand: {
      "@type": "Brand",
      name: "Rami Studio",
    },
    review: saree.reviews.map((rev) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: rev.rating.toString(),
        bestRating: "5",
      },
      author: {
        "@type": "Person",
        name: rev.author,
      },
      reviewBody: rev.reviewText,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: saree.reviews.length.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      url: `https://ramistudio.luxury/sarees/${saree.slug}`,
      priceCurrency: "USD",
      price: saree.priceUSD.toString(),
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Rami Studio",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Maison",
        item: "https://ramistudio.luxury",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Archive",
        item: "https://ramistudio.luxury/sarees",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: saree.title,
        item: `https://ramistudio.luxury/sarees/${saree.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <ProductDetailClient saree={saree} />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
