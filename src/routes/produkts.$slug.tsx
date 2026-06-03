import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Crosshair, Shield, BatteryFull, Scale, Satellite } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lv } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import { useRequestModal } from "@/components/request-modal-context";
import { useProductImages } from "@/lib/useProductImages";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/produkts/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} | geobalt.lv` },
      { name: "description", content: "Profesionāls ģeodēzijas aprīkojums — pieprasi cenu un specifikācijas." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { openModal } = useRequestModal();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, brands(name,slug), categories(name_lv,slug)")
        .eq("slug", slug).eq("is_active", true)
        .maybeSingle();
      return (data as Product) ?? null;
    },
  });

  const { data: specs = [] } = useQuery({
    queryKey: ["product-specs", product?.id],
    enabled: !!product?.id,
    queryFn: async () => {
      const { data } = await supabase.from("product_specs").select("*").eq("product_id", product!.id).order("sort_order");
      return data ?? [];
    },
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related", product?.id, product?.category_id],
    enabled: !!product?.category_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, brands(name,slug), categories(name_lv,slug)")
        .eq("category_id", product!.category_id!).eq("is_active", true)
        .neq("id", product!.id)
        .limit(4);
      return (data as Product[]) ?? [];
    },
  });

  const { data: gallery = [] } = useQuery({
    queryKey: ["product-gallery", product?.id],
    enabled: !!product?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("product_images")
        .select("url, is_primary, sort_order")
        .eq("product_id", product!.id)
        .order("is_primary", { ascending: false })
        .order("sort_order", { ascending: true });
      return (data ?? []) as { url: string; is_primary: boolean; sort_order: number }[];
    },
  });

  const { data: relatedImages = {} } = useProductImages(related.map((p) => p.id));

  const [tab, setTab] = useState<"desc" | "specs" | "set">("desc");
  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) return <div className="max-w-7xl mx-auto px-6 py-20 text-muted">Ielādē…</div>;
  if (!product) throw notFound();


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-32 lg:pb-10">
      <nav className="text-xs font-mono-spec text-muted mb-6">
        <Link to="/" className="hover:text-accent">{lv.breadcrumbs.home}</Link>
        {" / "}
        {product.categories && (
          <>
            <Link to="/katalogs/$category" params={{ category: product.categories.slug }} className="hover:text-accent">
              {product.categories.name_lv}
            </Link>{" / "}
          </>
        )}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-card border border-line rounded-2xl flex items-center justify-center overflow-hidden">
            {gallery.length > 0 ? (
              <img src={gallery[activeImg]?.url ?? gallery[0].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Satellite size={180} strokeWidth={0.8} className="text-ink/25" />
            )}
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {gallery.slice(0, 8).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square bg-card border rounded-lg overflow-hidden ${i === activeImg ? "border-accent" : "border-line"}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>


        {/* Info */}
        <div>
          <div className="kicker mb-3">
            {product.brands?.name} · {product.categories?.name_lv}
          </div>
          <h1 className="text-4xl md:text-5xl">{product.name}</h1>
          <p className="text-muted text-lg mt-4 leading-relaxed">{product.short_desc_lv}</p>

          <div className="grid grid-cols-2 gap-3 mt-7 bg-card border border-line rounded-2xl p-5">
            <SpecBig Icon={Crosshair} label={lv.spec.accuracy} value={product.accuracy} />
            <SpecBig Icon={Shield} label={lv.spec.ip} value={product.ip_class} />
            <SpecBig Icon={BatteryFull} label={lv.spec.battery} value={product.battery_h} />
            <SpecBig Icon={Scale} label={lv.spec.weight} value={product.weight_kg} />
          </div>

          <div className="mt-7 topo-bg rounded-2xl p-6 text-white">
            <div className="kicker text-accent">{lv.product.priceOnRequest}</div>
            <div className="mt-1 font-display font-black text-3xl text-white">—</div>
            <button onClick={() => openModal({ id: product.id, name: product.name, slug: product.slug })} className="btn-accent mt-5 w-full justify-center text-base">
              {lv.cta.request}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex border-b border-line">
          {[
            { k: "desc", l: lv.product.tabs.desc },
            { k: "specs", l: lv.product.tabs.specs },
            { k: "set", l: lv.product.tabs.set },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as any)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${tab === t.k ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink"}`}
            >
              {t.l}
            </button>
          ))}
        </div>
        <div className="py-8">
          {tab === "desc" && (
            <div className="max-w-3xl text-text leading-relaxed whitespace-pre-wrap">{product.full_desc_lv ?? product.short_desc_lv}</div>
          )}
          {tab === "specs" && (
            <div className="max-w-3xl">
              {specs.length === 0 ? (
                <p className="text-muted">Detalizētas specifikācijas pieejamas pēc pieprasījuma.</p>
              ) : (
                <table className="w-full">
                  <tbody>
                    {specs.map((s: any) => (
                      <tr key={s.id} className="border-b border-line">
                        <td className="py-3 text-muted text-sm">{s.label_lv}</td>
                        <td className="py-3 text-ink font-mono-spec text-right">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {tab === "set" && (
            <div className="max-w-2xl text-muted">{lv.product.setNote}</div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl mb-6">{lv.product.related}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} imageUrl={relatedImages[p.id]} />)}
          </div>
        </div>
      )}

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-line p-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono-spec uppercase text-muted">{product.categories?.name_lv}</div>
          <div className="font-display font-bold text-sm truncate">{product.name}</div>
        </div>
        <button onClick={() => openModal({ id: product.id, name: product.name, slug: product.slug })} className="btn-accent text-sm">
          {lv.cta.request}
        </button>
      </div>
    </div>
  );
}

function SpecBig({ Icon, label, value }: { Icon: typeof Crosshair; label: string; value: string | null }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider font-mono-spec text-muted">{label}</div>
        <div className="font-mono-spec text-ink font-semibold">{value ?? "—"}</div>
      </div>
    </div>
  );
}
