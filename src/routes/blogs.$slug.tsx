import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lv } from "@/lib/i18n";
import type { BlogPost } from "@/lib/types";

export const Route = createFileRoute("/blogs/$slug")({
  head: ({ params, loaderData }) => {
    const post = (loaderData ?? null) as BlogPost | null;
    return {
      meta: [
        { title: `${post?.title_lv ?? params.slug} | geobalt.lv blogs` },
        { name: "description", content: post?.excerpt_lv ?? "" },
      ],
    };
  },
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .eq("status", "published")
      .maybeSingle();
    return (data as BlogPost) ?? null;
  },
  component: BlogPostPage,
  errorComponent: ({ error }) => (
    <div className="max-w-3xl mx-auto px-6 py-20 text-red-600">
      Kļūda ielādējot rakstu: {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="max-w-3xl mx-auto px-6 py-20 text-muted">
      <h1 className="text-2xl font-bold mb-4">Raksts nav atrasts</h1>
      <Link to="/blogs" className="text-accent hover:underline">
        Atpakaļ uz blogu
      </Link>
    </div>
  ),
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = Route.useLoaderData();
  const [copied, setCopied] = useState(false);

  const { data: recentPosts = [] } = useQuery({
    queryKey: ["blog-recent", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug, title_lv, cover_url, tag_lv, excerpt_lv, published_at")
        .eq("status", "published")
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);
      return (data as BlogPost[]) ?? [];
    },
    enabled: !!post,
  });

  if (!post) throw notFound();

  const readTime = Math.max(3, Math.ceil((post.body_lv?.length ?? 0) / 1200));

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title_lv,
          text: post.excerpt_lv ?? "",
          url,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Breadcrumbs */}
      <nav className="text-xs font-mono-spec text-muted mb-8 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-accent transition-colors">{lv.breadcrumbs.home}</Link>
        <span className="text-line">/</span>
        <Link to="/blogs" className="hover:text-accent transition-colors">Blogs</Link>
        <span className="text-line">/</span>
        <span className="text-ink truncate max-w-[240px]">{post.title_lv}</span>
      </nav>

      {/* Tags & Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {post.tag_lv && (
          <span className="pill bg-accent/10 text-accent border border-accent/20 text-xs font-semibold">
            {post.tag_lv}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-display font-black leading-[1.05] tracking-tight text-ink">
        {post.title_lv}
      </h1>

      {/* Excerpt */}
      {post.excerpt_lv && (
        <p className="text-muted mt-5 text-lg md:text-xl leading-relaxed max-w-3xl">
          {post.excerpt_lv}
        </p>
      )}

      {/* Meta bar */}
      <div className="flex items-center justify-between mt-7 pb-8 border-b border-line">
        <div className="flex items-center gap-4 text-sm text-muted font-mono-spec">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(post.published_at).toLocaleDateString("lv-LV", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="w-1 h-1 rounded-full bg-line" />
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {readTime} min lasīšana
          </span>
        </div>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors"
          aria-label="Kopīgot"
        >
          {copied ? <Check size={15} className="text-green" /> : <Share2 size={15} />}
          {copied ? "Nokopēts!" : "Kopīgot"}
        </button>
      </div>

      {/* Cover */}
      {post.cover_url && (
        <div className="aspect-[16/9] bg-paper-2 border border-line rounded-2xl overflow-hidden my-10 shadow-sm">
          <img
            src={post.cover_url}
            alt={post.title_lv}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Body */}
      <div className="max-w-3xl mx-auto">
        <div className="prose prose-lg max-w-none text-ink leading-[1.75]">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-display font-black mt-14 mb-6 text-ink tracking-tight">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-display font-bold mt-12 mb-5 text-ink tracking-tight">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-display font-bold mt-10 mb-4 text-ink tracking-tight">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-display font-bold mt-8 mb-3 text-ink">{children}</h4>
              ),
              p: ({ children }) => (
                <p className="mb-5 leading-[1.75] text-muted">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-6 space-y-2.5 text-muted">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-6 space-y-2.5 text-muted">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="leading-[1.7] pl-1">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-ink">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-ink/80">{children}</em>
              ),
              hr: () => (
                <hr className="border-line my-10" />
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-accent bg-accent/[0.03] rounded-r-xl px-6 py-5 my-8 text-ink italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-accent underline underline-offset-3 hover:text-ink transition-colors"
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <figure className="my-8">
                  <img
                    src={src}
                    alt={alt ?? ""}
                    className="w-full rounded-xl border border-line shadow-sm"
                    loading="lazy"
                  />
                  {alt && <figcaption className="text-center text-xs text-muted mt-3 font-mono-spec">{alt}</figcaption>}
                </figure>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-paper-2 border border-line rounded px-1.5 py-0.5 text-sm font-mono-spec text-accent">
                    {children}
                  </code>
                ) : (
                  <pre className="bg-paper-2 border border-line rounded-xl p-5 overflow-x-auto my-6">
                    <code className="text-sm font-mono-spec text-ink">{children}</code>
                  </pre>
                );
              },
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="w-full text-sm border border-line rounded-xl overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-paper-2 font-display font-bold text-ink">{children}</thead>,
              tbody: ({ children }) => <tbody className="text-muted">{children}</tbody>,
              tr: ({ children }) => <tr className="border-b border-line last:border-0">{children}</tr>,
              th: ({ children }) => <th className="px-4 py-3 text-left">{children}</th>,
              td: ({ children }) => <td className="px-4 py-3">{children}</td>,
            }}
          >
            {post.body_lv ?? ""}
          </ReactMarkdown>
        </div>

        {/* Back + Tags footer */}
        <div className="mt-14 pt-8 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
          >
            <ArrowLeft size={16} />
            Atpakaļ uz blogu
          </Link>
          {post.tag_lv && (
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors"
            >
              <Tag size={14} />
              {post.tag_lv}
            </Link>
          )}
        </div>
      </div>

      {/* Recent articles */}
      {recentPosts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-line">
          <h2 className="text-2xl font-display font-bold mb-8">Pēdējie raksti</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recentPosts.map((p) => (
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
                  <h3 className="text-lg leading-tight mt-2 group-hover:text-accent transition-colors line-clamp-2">
                    {p.title_lv}
                  </h3>
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
        </section>
      )}

      {/* CTA */}
      <section className="mt-16">
        <div className="bg-paper-2 border border-line rounded-2xl p-8 md:p-10 text-center">
          <h3 className="text-2xl font-display font-bold">Vai meklējat ģeodēzijas aprīkojumu?</h3>
          <p className="text-muted mt-3 max-w-xl mx-auto">
            Apskatiet mūsu katalogu ar profesionāliem GNSS, nivelieriem un lauka datoriem.
          </p>
          <Link
            to="/katalogs/$category"
            params={{ category: "gnss" }}
            className="btn-accent inline-flex items-center gap-2 mt-6"
          >
            Apskatīt katalogu <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </article>
  );
}
