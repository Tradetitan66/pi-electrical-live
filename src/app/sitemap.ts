import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/business";

/**
 * Sitemap.
 *
 * Only the four real, indexable routes. The privacy and membership pages are
 * included because they carry genuine content; there is no thin utility
 * route padding.
 *
 * TODO: sitemap URLs derive from SITE_URL, which is still a placeholder. This
 * MUST be replaced before launch or the sitemap will advertise a domain that
 * does not belong to us. See CONTENT_TODO.md.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "monthly", priority: 1 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/projects-about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/maintenance-membership", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    lastModified: new Date(),
  }));
}
