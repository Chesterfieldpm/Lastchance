import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://<your-vercel-domain>";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/property-management-kitchener-waterloo", "/areas/kitchener", "/areas/waterloo", "/areas/cambridge", "/areas/guelph"];
  const now = new Date();
  return routes.map((p) => ({
    url: `${SITE}${p || "/"}`,
    lastModified: now,
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
