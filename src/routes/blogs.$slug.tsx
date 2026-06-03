import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lv } from "@/lib/i18n";
import type { BlogPost } from "@/lib/types";

export const Route = createFileRoute("/blogs/$slug")({
  head: ({ params }) => ({ meta: [{ title: `${params.slug} | geobalt.lv blogs` }] }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
      return (data as BlogPost) ?? null;
    },
  });

  if (isLoading) return <div className="max-w-3xl mx-auto px-6 py-20 text-muted">Ielādē…</div>;
  if (!post) throw notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="text-xs font-mono-spec text-muted mb-6">
        <Link to="/" className="hover:text-accent">{lv.breadcrumbs.home}</Link> /{" "}
        <Link to="/blogs" className="hover:text-accent">Blogs</Link> / <span className="text-ink">{post.title_lv}</span>
      </nav>
      <span className="pill bg-paper-2 text-ink mb-4">{post.tag_lv}</span>
      <h1 className="text-4xl md:text-5xl mt-3">{post.title_lv}</h1>
      <p className="text-muted mt-4 text-lg">{post.excerpt_lv}</p>
      <div className="aspect-[16/9] bg-paper-2 border border-line rounded-2xl flex items-center justify-center my-10">
        <Shield size={80} strokeWidth={1} className="text-ink/20" />
      </div>
      <div className="prose-content text-text leading-relaxed whitespace-pre-wrap">{post.body_lv}</div>
    </article>
  );
}
