import { createFileRoute } from "@tanstack/react-router";
import { STORES } from "@/data/stores";
import { SITE_URL } from "@/lib/seo";

const CATEGORIES = [
  "grocery",
  "supermarket",
  "pharmacy",
  "bakery",
  "fashion",
  "electronics",
  "restaurants",
  "beauty",
  "cafe",
  "flowers",
];

const BLOG_SLUGS = [
  "launch-your-store",
  "merchant-tips",
  "promo-ideas",
  "qr-code-power",
];

type Entry = {
  path: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
};

const DEFAULT_LASTMOD = "2026-08-25";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function entries(): Entry[] {
  return [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/how-it-works", changefreq: "monthly", priority: "0.9" },
    { path: "/marketplace", changefreq: "daily", priority: "0.9" },
    ...CATEGORIES.map((c) => ({
      path: `/marketplace/${c}`,
      changefreq: "weekly",
      priority: "0.7",
    })),
    ...STORES.map((s) => ({
      path: `/store/${s.slug}`,
      changefreq: "weekly",
      priority: "0.6",
    })),
    { path: "/blog", changefreq: "weekly", priority: "0.7" },
    ...BLOG_SLUGS.map((s) => ({
      path: `/blog/${s}`,
      changefreq: "monthly",
      priority: "0.5",
    })),
    { path: "/vendor/apply", changefreq: "monthly", priority: "0.8" },
    { path: "/contact", changefreq: "monthly", priority: "0.6" },
    { path: "/legal/privacy", changefreq: "yearly", priority: "0.3" },
    { path: "/legal/terms", changefreq: "yearly", priority: "0.3" },
    { path: "/legal/refund", changefreq: "yearly", priority: "0.3" },
  ];
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = entries()
          .map((e) => {
            const loc = escapeXml(`${SITE_URL}${e.path}`);
            const lastmod = escapeXml(e.lastmod ?? DEFAULT_LASTMOD);
            return [
              "  <url>",
              `    <loc>${loc}</loc>`,
              `    <lastmod>${lastmod}</lastmod>`,
              `    <changefreq>${e.changefreq}</changefreq>`,
              `    <priority>${e.priority}</priority>`,
              "  </url>",
            ].join("\n");
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
