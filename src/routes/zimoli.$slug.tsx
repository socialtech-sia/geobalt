import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { useProductImages } from "@/lib/useProductImages";
import { lv } from "@/lib/i18n";
import type { Brand, Product } from "@/lib/types";

export const Route = createFileRoute("/zimoli/$slug")({
  head: ({ params }) => ({ meta: [{ title: `${params.slug} | Zīmoli | geobalt.lv` }] }),
  component: BrandPage,
});

function BrandPage() {
  const { slug } = Route.useParams();

  const { data: brand } = useQuery({
    queryKey: ["brand", slug],
    queryFn: async () => {
      const { data } = await supabase.from("brands").select("*").eq("slug", slug).maybeSingle();
      return (data as Brand) ?? null;
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["brand-products", brand?.id],
    enabled: !!brand?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, brands(name,slug), categories(name_lv,slug)")
        .eq("brand_id", brand!.id)
        .eq("is_active", true)
        .order("sort_order");
      return (data as Product[]) ?? [];
    },
  });
  const { data: imagesMap = {} } = useProductImages(products.map((p) => p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-xs font-mono-spec text-muted mb-6">
        <Link to="/" className="hover:text-accent">{lv.breadcrumbs.home}</Link> /{" "}
        <Link to="/zimoli" className="hover:text-accent">Zīmoli</Link> /{" "}
        <span className="text-ink">{brand?.name ?? slug}</span>
      </nav>

      <header className="mb-10 flex items-center gap-6 flex-wrap">
        {brand?.logo_url && (
          <div className="h-20 w-32 bg-card border border-line rounded-xl flex items-center justify-center p-3">
            <img src={brand.logo_url} alt={brand.name} className="h-full w-full object-contain" />
          </div>
        )}
        <div>
          <div className="kicker mb-2">Zīmols</div>
          <h1 className="text-4xl md:text-5xl">{brand?.name ?? slug}</h1>
          {brand?.blurb_lv && <p className="text-muted mt-3 max-w-2xl">{brand.blurb_lv}</p>}
        </div>
      </header>

      {products.length === 0 ? (
        <div className="bg-card border border-dashed border-line rounded-2xl p-12 text-center text-muted">
          Šobrīd nav produktu šim zīmolam
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} imageUrl={imagesMap[p.id]} />)}
        </div>
      )}
    </div>
  );
}
