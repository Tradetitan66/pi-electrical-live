import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/business";

/**
 * robots.txt
 *
 * The placeholder domain is disallowed from indexing. That is deliberate: until
 * the real domain is set in data/business.ts, the site should not be inviting
 * search engines to index a URL that is not ours.
 *
 * Swap SITE_URL for the live domain and this file starts allowing crawling
 * with no other change.
 */
export default function robots(): MetadataRoute.Robots {
  const isPlaceholder = SITE_URL.includes(".example");

  return {
    rules: isPlaceholder
      ? [{ userAgent: "*", disallow: "/" }]
      : [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
