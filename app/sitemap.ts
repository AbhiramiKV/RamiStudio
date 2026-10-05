import { MetadataRoute } from "next";
import { SAREE_COLLECTION } from "@/lib/catalogData";
import { JOURNAL_ARTICLES } from "@/lib/journalData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ramistudio.luxury";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sarees`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/swatches`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/policies/shipping`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/returns`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/policies/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const sareeRoutes: MetadataRoute.Sitemap = SAREE_COLLECTION.map((saree) => ({
    url: `${baseUrl}/sarees/${saree.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const journalRoutes: MetadataRoute.Sitemap = JOURNAL_ARTICLES.map((article) => ({
    url: `${baseUrl}/journal/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...sareeRoutes, ...journalRoutes];
}
