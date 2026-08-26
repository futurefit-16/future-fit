import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const baseUrl = "https://wearfuturefit.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
        { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/studio`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/fit-finder`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/refund-policy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
        { url: `${baseUrl}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    ];

    const productPages: MetadataRoute.Sitemap = Object.keys(PRODUCTS).map((slug) => ({
        url: `${baseUrl}/product/${slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [...staticPages, ...productPages];
}
