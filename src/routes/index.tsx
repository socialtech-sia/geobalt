import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, Crosshair, Shield, BatteryFull, Scale, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lv } from "@/lib/i18n";
import { TopoBg } from "@/components/TopoBg";
import { ProductCard } from "@/components/ProductCard";
import { useRequestModal } from "@/components/request-modal-context";
import type { Product, Review, BlogPost, Brand } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "geobalt.lv — Ģeodēzijas aprīkojums | GNSS, nivelieri, lauka datori" },
      { name: "description", content: "Profesionāli ģeodēzijas risinājumi mērniecībai, ceļabūvei un mežsaimniecībai Baltijā." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Industries />
      <Popular />
      <Promo />
      <Reviews />
      <Brands />
      <BlogPreview />
    </>
  );
}

/* ----------------------------- HERO ----------------------------- */

function Hero() {
  const { openModal } = useRequestModal();
  const { data: slides = [] } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, brands(name,slug), categories(name_lv,slug)")
        .eq("is_popular", true)
        .order("sort_order")
        .limit(5);
      return (data as Product[]) ?? [];
    },
  });

  const [i, setI] = useState(0);
  useEffect(() => {
    if (slides.length === 0) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[i];

  return (
    <section className="relative topo-bg text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="pill bg-accent/20 text-accent border border-accent/30 mb-5">
            {slide?.industries?.[0] ? lv.industry[slide.industries[0]] ?? "Jaunums" : "Jaunums"}
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-black text-white leading-[1.02] tracking-tight">
            {slide?.name ?? "Profesionāls ģeodēzijas aprīkojums"}
          </h1>
          <p className="mt-5 text-white/70 text-lg max-w-xl leading-relaxed">
            {slide?.short_desc_lv ?? "RTK GNSS, lauka datori, nivelieri un risinājumi mērniecības profesionāļiem."}
          </p>

          {slide && (
            <div className="flex flex-wrap gap-2 mt-6">
              {[slide.accuracy, slide.ip_class, slide.battery_h].filter(Boolean).map((v, idx) => (
                <span key={idx} className="pill bg-white/5 border border-white/10 text-white/80">{v}</span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-8">
            {slide ? (
              <Link to="/produkts/$slug" params={{ slug: slide.slug }} className="btn-accent">
                {lv.cta.viewProduct} <ArrowRight size={16} />
              </Link>
            ) : (
              <button onClick={() => openModal()} className="btn-accent">{lv.cta.contactUs}</button>
            )}
            <Link to="/katalogs/$category" params={{ category: "gnss" }} className="btn-light">{lv.cta.viewAll}</Link>
          </div>

          {slides.length > 1 && (
            <div className="flex items-center gap-4 mt-10">
              <div className="flex gap-2">
                {slides.map((_, k) => (
                  <button
                    key={k}
                    onClick={() => setI(k)}
                    className={`h-1.5 rounded-full transition-all ${k === i ? "w-10 bg-accent" : "w-2.5 bg-white/30"}`}
                    aria-label={`Slaids ${k + 1}`}
                  />
                ))}
              </div>
              <span className="font-mono-spec text-xs text-white/40">slaids {i + 1} no {slides.length}</span>
            </div>
          )}
        </div>

        <div className="hidden lg:flex justify-center">
          <div className="relative w-[420px] h-[420px] rounded-full bg-gradient-to-br from-accent/10 to-white/5 border border-white/10 flex items-center justify-center">
            <div className="w-72 h-72 rounded-full bg-paper/5 backdrop-blur border border-white/10 flex items-center justify-center">
              <Crosshair size={140} strokeWidth={1} className="text-accent" />
            </div>
            <span className="absolute top-6 right-6 pill bg-accent text-white">{slide?.brands?.name ?? "Satlab"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- INDUSTRIES --------------------------- */

function Industries() {
  const items = [
    { key: "merniecība", title: lv.home.industries.merniec.title, desc: lv.home.industries.merniec.desc },
    { key: "celabuve", title: lv.home.industries.celabuve.title, desc: lv.home.industries.celabuve.desc },
    { key: "mezsaimnieciba", title: lv.home.industries.mezs.title, desc: lv.home.industries.mezs.desc },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="max-w-2xl mb-12">
        <div className="kicker mb-3">Nozares</div>
        <h2 className="text-3xl md:text-5xl">{lv.home.industries.heading}</h2>
        <p className="text-muted mt-3">{lv.home.industries.sub}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <Link
            key={it.key}
            to="/katalogs/$category"
            params={{ category: "gnss" }}
            search={{ industry: it.key } as any}
            className="industry-card p-8 group"
          >
            <h3 className="text-2xl mb-3">{it.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{it.desc}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-accent font-semibold text-sm">
              {lv.cta.viewSolutions} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- POPULAR ----------------------------- */

function Popular() {
  const { data: products = [] } = useQuery({
    queryKey: ["popular"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, brands(name,slug), categories(name_lv,slug)")
        .eq("is_popular", true)
        .order("sort_order")
        .limit(4);
      return (data as Product[]) ?? [];
    },
  });

  return (
    <section className="bg-paper-2 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="kicker mb-3">Katalogs</div>
            <h2 className="text-3xl md:text-5xl">{lv.home.popular.heading}</h2>
          </div>
          <Link to="/katalogs/$category" params={{ category: "gnss" }} className="inline-flex items-center gap-2 text-accent font-semibold">
            {lv.cta.viewAll} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- PROMO ----------------------------- */

function Promo() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="rounded-2xl bg-amber-soft border border-line p-8 md:p-10 grid md:grid-cols-3 gap-6 items-center">
        <div className="aspect-video bg-ink/5 rounded-xl flex items-center justify-center">
          <Crosshair size={64} className="text-accent/60" strokeWidth={1.2} />
        </div>
        <div className="md:col-span-1">
          <div className="kicker mb-2">{lv.home.promo.kicker}</div>
          <h3 className="text-2xl md:text-3xl">{lv.home.promo.title}</h3>
          <p className="text-muted mt-3 text-sm">{lv.home.promo.desc}</p>
        </div>
        <div className="md:text-right">
          <Link to="/katalogs/$category" params={{ category: "gnss" }} className="btn-accent">
            {lv.cta.learnMore} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- REVIEWS ----------------------------- */

function Reviews() {
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").order("sort_order");
      return (data as Review[]) ?? [];
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="max-w-2xl mb-12">
        <div className="kicker mb-3">Atsauksmes</div>
        <h2 className="text-3xl md:text-5xl">{lv.home.reviews.heading}</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-card border border-line rounded-2xl p-8 relative">
            <Quote className="absolute top-6 right-6 text-accent/15" size={56} />
            <p className="italic text-lg leading-relaxed text-ink relative z-10">"{r.quote_lv}"</p>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-11 h-11 rounded-full bg-green text-white flex items-center justify-center font-display font-bold">
                {r.author_name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="font-display font-bold text-ink">{r.author_name}</div>
                <div className="text-xs text-muted font-mono-spec">{r.author_role_lv} · {r.company}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- BRANDS ----------------------------- */

function Brands() {
  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await supabase.from("brands").select("*").order("sort_order");
      return (data as Brand[]) ?? [];
    },
  });
  return (
    <section className="bg-paper-2 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="kicker text-center mb-8 block">{lv.home.brandsHeading}</div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {brands.map((b) => (
            <Link key={b.id} to="/zimoli" className="font-display font-extrabold text-2xl text-muted hover:text-ink transition-colors tracking-tight">
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- BLOG ----------------------------- */

function BlogPreview() {
  const { data: posts = [] } = useQuery({
    queryKey: ["blog-preview"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false }).limit(3);
      return (data as BlogPost[]) ?? [];
    },
  });
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <div className="kicker mb-3">Blogs</div>
          <h2 className="text-3xl md:text-5xl">{lv.home.blog.heading}</h2>
        </div>
        <Link to="/blogs" className="inline-flex items-center gap-2 text-accent font-semibold">
          {lv.cta.allArticles} <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <Link key={p.id} to="/blogs/$slug" params={{ slug: p.slug }} className="product-card overflow-hidden block">
            <div className="aspect-[4/3] bg-paper-2 flex items-center justify-center">
              <Shield size={64} strokeWidth={1.2} className="text-ink/20" />
            </div>
            <div className="p-5">
              <span className="pill bg-paper-2 text-ink mb-3">{p.tag_lv ?? "Raksts"}</span>
              <h3 className="text-lg leading-tight mt-2">{p.title_lv}</h3>
              <div className="text-xs font-mono-spec text-muted mt-4">3 min lasīšana · 2026</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
