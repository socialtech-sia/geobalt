import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { lv } from "@/lib/i18n";
import type { BlogPost } from "@/lib/types";

export const Route = createFileRoute("/blogs/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} | geobalt.lv blogs` }],
  }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      return (data as BlogPost) ?? null;
    },
  });

  if (isLoading) return <div className="max-w-3xl mx-auto px-6 py-20 text-muted">Ielādē…</div>;
  if (!post) throw notFound();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <nav className="text-xs font-mono-spec text-muted mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-accent">{lv.breadcrumbs.home}</Link>
        <span>/</span>
        <Link to="/blogs" className="hover:text-accent">Blogs</Link>
        <span>/</span>
        <span className="text-ink truncate max-w-[200px]">{post.title_lv}</span>
      </nav>

      <span className="pill bg-paper-2 text-ink text-xs mb-4">{post.tag_lv}</span>
      <h1 className="text-3xl md:text-5xl mt-3 leading-tight">{post.title_lv}</h1>
      <p className="text-muted mt-4 text-lg leading-relaxed">{post.excerpt_lv}</p>

      <div className="flex items-center gap-4 mt-6 text-sm text-muted font-mono-spec">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(post.published_at).toLocaleDateString("lv-LV")}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          5 min lasīšana
        </span>
      </div>

      <div className="aspect-[16/9] bg-paper-2 border border-line rounded-2xl overflow-hidden my-10">
        {post.cover_url ? (
          <img src={post.cover_url} alt={post.title_lv} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ink/5">
            <span className="text-ink/20 font-display text-6xl">GEO</span>
          </div>
        )}
      </div>

      <div className="prose prose-lg max-w-none text-ink leading-relaxed">
        <ReactMarkdown
          components={{
            h2: ({ children }) => <h2 className="text-2xl font-display font-bold mt-10 mb-4 text-ink">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-display font-bold mt-8 mb-3 text-ink">{children}</h3>,
            p: ({ children }) => <p className="mb-4 leading-relaxed text-muted">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-muted">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-muted">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
            hr: () => <hr className="border-line my-8" />,
          }}
        >
          {post.body_lv ?? ""}
        </ReactMarkdown>
      </div>

      <div className="mt-16 pt-8 border-t border-line">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
        >
          <ArrowLeft size={16} />
          Atpakaļ uz blogu
        </Link>
      </div>
    </article>
  );
}
