import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost } from "@/lib/types";

export const Route = createFileRoute("/blogs")({
  head: () => ({ meta: [{ title: "Blogs | geobalt.lv" }] }),
  component: BlogsPage,
});

function BlogsPage() {
  const { data: posts = [] } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
      return (data as BlogPost[]) ?? [];
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="kicker mb-3">Blogs</div>
      <h1 className="text-4xl md:text-5xl mb-10">Jaunumi un ceļveži</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <Link key={p.id} to="/blogs/$slug" params={{ slug: p.slug }} className="product-card overflow-hidden block">
            <div className="aspect-[4/3] bg-paper-2 flex items-center justify-center">
              <Shield size={64} strokeWidth={1.2} className="text-ink/20" />
            </div>
            <div className="p-5">
              <span className="pill bg-paper-2 text-ink mb-3">{p.tag_lv ?? "Raksts"}</span>
              <h3 className="text-lg leading-tight mt-2">{p.title_lv}</h3>
              <p className="text-muted text-sm mt-2 line-clamp-2">{p.excerpt_lv}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
