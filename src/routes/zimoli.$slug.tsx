import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { useProductImages } from "@/lib/useProductImages";
import { lv } from "@/lib/i18n";
import type { Brand, Product, Category } from "@/lib/types";

export const Route = createFileRoute("/zimoli/$slug")({
  head: ({ params }) => ({ meta: [{ title: `${params.slug} | Katalogs | geobalt.lv` }] }),
  component: BrandCatalogPage,
});

function BrandCatalogPage() {
  const { slug } = Route.useParams();

  const { data: brand } = useQuery({
    queryKey: ["brand", slug],
    queryFn: async () => {
      const { data } = await supabase.from("brands").select("*").eq("slug", slug).maybeSingle();
      return (data as Brand) ?? null;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("sort_order");
      return (data as Category[]) ?? [];
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

  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [avail, setAvail] = useState<string[]>([]);

  const usedCategories = useMemo(() => {
    const ids = new Set(products.map((p) => p.category_id).filter(Boolean) as string[]);
    return categories.filter((c) => ids.has(c.id));
  }, [products, categories]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categoryIds.length && !categoryIds.includes(p.category_id ?? "")) return false;
      if (industries.length && !p.industries.some((i) => industries.includes(i))) return false;
      if (avail.includes("sale") && !p.is_available_sale) return false;
      if (avail.includes("rent") && !p.is_available_rent) return false;
      return true;
    });
  }, [products, categoryIds, industries, avail]);

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

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

      <div className="grid lg:grid-cols-[260px_1fr] gap-10">
        <aside className="lg:sticky lg:top-24 self-start space-y-7">
          {usedCategories.length > 0 && (
            <FilterGroup title="Kategorija">
              {usedCategories.map((c) => (
                <Check key={c.id} label={c.name_lv} checked={categoryIds.includes(c.id)} onChange={() => toggle(categoryIds, c.id, setCategoryIds)} />
              ))}
            </FilterGroup>
          )}

          <FilterGroup title={lv.catalog.filterIndustry}>
            {[
              { v: "merniecība", l: "Mērniecība" },
              { v: "celabuve", l: "Ceļabūve" },
              { v: "mezsaimnieciba", l: "Mežsaimniecība" },
            ].map((o) => (
              <Check key={o.v} label={o.l} checked={industries.includes(o.v)} onChange={() => toggle(industries, o.v, setIndustries)} />
            ))}
          </FilterGroup>

          <FilterGroup title={lv.catalog.filterAvailability}>
            <Check label={lv.catalog.sale} checked={avail.includes("sale")} onChange={() => toggle(avail, "sale", setAvail)} />
            <Check label={lv.catalog.rent} checked={avail.includes("rent")} onChange={() => toggle(avail, "rent", setAvail)} />
          </FilterGroup>
        </aside>

        <div>
          <div className="text-sm text-muted font-mono-spec mb-6">
            {lv.catalog.found} <span className="text-ink font-semibold">{filtered.length}</span> {lv.catalog.products}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-card border border-dashed border-line rounded-2xl p-12 text-center text-muted">
              {products.length === 0 ? "Šobrīd nav produktu šim zīmolam" : lv.catalog.empty}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} imageUrl={imagesMap[p.id]} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-mono-spec text-xs uppercase tracking-widest text-muted mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-[var(--accent)]" />
      <span>{label}</span>
    </label>
  );
}
