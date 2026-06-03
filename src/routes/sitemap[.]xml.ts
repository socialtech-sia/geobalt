import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://geobalt.lv";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/par-mums", changefreq: "monthly", priority: "0.6" },
          { path: "/serviss", changefreq: "monthly", priority: "0.7" },
          { path: "/kontakti", changefreq: "monthly", priority: "0.7" },
          { path: "/zimoli", changefreq: "monthly", priority: "0.6" },
          { path: "/blogs", changefreq: "weekly", priority: "0.7" },
          { path: "/katalogs/gnss", changefreq: "weekly", priority: "0.8" },
          { path: "/katalogs/lauka-datori", changefreq: "weekly", priority: "0.8" },
          { path: "/katalogs/nivelieri-lazeri", changefreq: "weekly", priority: "0.8" },
          { path: "/katalogs/markesana", changefreq: "weekly", priority: "0.8" },
          { path: "/katalogs/aksesuari", changefreq: "weekly", priority: "0.8" },
          { path: "/katalogs/noma", changefreq: "weekly", priority: "0.8" },
          { path: "/privatuma-politika", changefreq: "yearly", priority: "0.2" },
          { path: "/sikdatnes", changefreq: "yearly", priority: "0.2" },
          { path: "/gdpr", changefreq: "yearly", priority: "0.2" },
        ];

        const [{ data: products }, { data: brands }, { data: posts }] = await Promise.all([
          supabase.from("products").select("slug, updated_at").eq("is_active", true),
          supabase.from("brands").select("slug"),
          supabase.from("blog_posts").select("slug, published_at").eq("status", "published"),
        ]);

        const dynamicEntries: SitemapEntry[] = [
          ...(products ?? []).map((p) => ({
            path: `/produkts/${p.slug}`,
            lastmod: p.updated_at?.slice(0, 10),
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...(brands ?? []).map((b) => ({
            path: `/zimoli/${b.slug}`,
            changefreq: "monthly" as const,
            priority: "0.5",
          })),
          ...(posts ?? []).map((b) => ({
            path: `/blogs/${b.slug}`,
            lastmod: b.published_at?.slice(0, 10),
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];

        const entries = [...staticEntries, ...dynamicEntries];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
