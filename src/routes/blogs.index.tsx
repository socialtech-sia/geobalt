import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost } from "@/lib/types";

export const Route = createFileRoute("/blogs/")({
  head: () => ({ meta: [{ title: "Blogs | geobalt.lv" }] }),
  component: BlogsPage,
});

function BlogsPage() {
  const { data: posts = [] } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false });
      return (data as BlogPost[]) ?? [];
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="kicker mb-3">Blogs</div>
      <h1 className="text-4xl md:text-5xl mb-4">Jaunumi un ceļveži</h1>
      <p className="text-muted max-w-2xl mb-10">
        Profesionāli raksti par ģeodēzijas tehnoloģijām, iekārtu apskatiem un praktiskiem padomiem mērniekiem.
      </p>

      {posts.length > 0 && (
        <Link
          to="/blogs/$slug"
          params={{ slug: posts[0].slug }}
          className="group block mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center bg-paper-2 border border-line rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
            <div className="aspect-[16/10] bg-ink/5 overflow-hidden">
              {posts[0].cover_url ? (
                <img
                  src={posts[0].cover_url}
                  alt={posts[0].title_lv}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-ink/5">
                  <span className="text-ink/20 font-display text-4xl">GEO</span>
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 md:pl-0">
              <span className="pill bg-paper border border-line text-ink text-xs mb-4">
                {posts[0].tag_lv ?? "Raksts"}
              </span>
              <h2 className="text-2xl md:text-3xl mt-3 group-hover:text-accent transition-colors">
                {posts[0].title_lv}
              </h2>
              <p className="text-muted mt-3 leading-relaxed">{posts[0].excerpt_lv}</p>
              <div className="flex items-center gap-4 mt-6 text-xs text-muted font-mono-spec">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(posts[0].published_at).toLocaleDateString("lv-LV")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  5 min lasīšana
                </span>
              </div>
              <div className="inline-flex items-center gap-2 text-accent font-semibold text-sm mt-6">
                Lasīt vairāk <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(1).map((p) => (
          <Link
            key={p.id}
            to="/blogs/$slug"
            params={{ slug: p.slug }}
            className="group product-card overflow-hidden block bg-paper border border-line rounded-2xl hover:border-accent/30 transition-colors"
          >
            <div className="aspect-[16/10] bg-ink/5 overflow-hidden">
              {p.cover_url ? (
                <img
                  src={p.cover_url}
                  alt={p.title_lv}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-ink/5">
                  <span className="text-ink/20 font-display text-4xl">GEO</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <span className="pill bg-paper-2 text-ink text-xs mb-3">
                {p.tag_lv ?? "Raksts"}
              </span>
              <h3 className="text-lg leading-tight mt-2 group-hover:text-accent transition-colors">
                {p.title_lv}
              </h3>
              <p className="text-muted text-sm mt-2 line-clamp-2">{p.excerpt_lv}</p>
              <div className="flex items-center gap-3 mt-4 text-xs text-muted font-mono-spec">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {new Date(p.published_at).toLocaleDateString("lv-LV")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
