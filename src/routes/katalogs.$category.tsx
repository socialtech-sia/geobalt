import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lv, CATEGORY_NAV } from "@/lib/i18n";
import { ProductCard } from "@/components/ProductCard";
import { useProductImages } from "@/lib/useProductImages";
import type { Product, Category, Brand } from "@/lib/types";

export const Route = createFileRoute("/katalogs/$category")({
  head: ({ params }) => ({
    meta: [
      { title: `${CATEGORY_NAV.find((c) => c.slug === params.category)?.label ?? "Katalogs"} | geobalt.lv` },
      { name: "description", content: "Profesionāls ģeodēzijas aprīkojums — pārdošana un noma." },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { category } = Route.useParams();
  const search = Route.useSearch() as { industry?: string };
  const initialIndustry = search.industry;

  const { data: cat } = useQuery({
    queryKey: ["category", category],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").eq("slug", category).maybeSingle();
      return (data as Category) ?? null;
    },
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await supabase.from("brands").select("*").order("sort_order");
      return (data as Brand[]) ?? [];
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["catalog", category],
    enabled: !!cat?.id || category === "noma",
    queryFn: async () => {
      let q = supabase.from("products").select("*, brands(name,slug), categories(name_lv,slug)");
      if (category === "noma") q = q.eq("is_available_rent", true);
      else if (cat?.id) q = q.eq("category_id", cat.id);
      const { data } = await q.eq("is_active", true).order("sort_order");
      return (data as Product[]) ?? [];
    },
  });
  const { data: imagesMap = {} } = useProductImages(products.map((p) => p.id));

  // filters
  const [industries, setIndustries] = useState<string[]>([]);
  const [brandIds, setBrandIds] = useState<string[]>([]);
  const [ip, setIp] = useState<string[]>([]);
  const [avail, setAvail] = useState<string[]>([]);
  const [sort, setSort] = useState<"popular" | "accuracy" | "new">("popular");

  const ipOptions = useMemo(() => Array.from(new Set(products.map((p) => p.ip_class).filter(Boolean))) as string[], [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (industries.length && !p.industries.some((i) => industries.includes(i))) return false;
      if (brandIds.length && !brandIds.includes(p.brand_id ?? "")) return false;
      if (ip.length && !ip.includes(p.ip_class ?? "")) return false;
      if (avail.includes("sale") && !p.is_available_sale) return false;
      if (avail.includes("rent") && !p.is_available_rent) return false;
      return true;
    });
    if (sort === "accuracy") list = [...list].sort((a, b) => (a.accuracy ?? "").localeCompare(b.accuracy ?? ""));
    return list;
  }, [products, industries, brandIds, ip, avail, sort]);

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const categoryLabel = cat?.name_lv ?? CATEGORY_NAV.find((c) => c.slug === category)?.label ?? category;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-xs font-mono-spec text-muted mb-6">
        <Link to="/" className="hover:text-accent">{lv.breadcrumbs.home}</Link> / <span className="text-ink">{categoryLabel}</span>
      </nav>

      <header className="mb-10 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">{categoryLabel}</h1>
        {cat?.description_lv && <p className="text-muted mt-4">{cat.description_lv}</p>}
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-10">
        <aside className="lg:sticky lg:top-24 self-start space-y-7">
          <FilterGroup title={lv.catalog.filterIndustry}>
            {[
              { v: "merniecība", l: "Mērniecība" },
              { v: "celabuve", l: "Ceļabūve" },
              { v: "mezsaimnieciba", l: "Mežsaimniecība" },
            ].map((o) => (
              <Check key={o.v} label={o.l} checked={industries.includes(o.v)} onChange={() => toggle(industries, o.v, setIndustries)} />
            ))}
          </FilterGroup>

          <FilterGroup title={lv.catalog.filterBrand}>
            {brands.map((b) => (
              <Check key={b.id} label={b.name} checked={brandIds.includes(b.id)} onChange={() => toggle(brandIds, b.id, setBrandIds)} />
            ))}
          </FilterGroup>

          {ipOptions.length > 0 && (
            <FilterGroup title={lv.catalog.filterIP}>
              {ipOptions.map((v) => (
                <Check key={v} label={v} checked={ip.includes(v)} onChange={() => toggle(ip, v, setIp)} />
              ))}
            </FilterGroup>
          )}

          <FilterGroup title={lv.catalog.filterAvailability}>
            <Check label={lv.catalog.sale} checked={avail.includes("sale")} onChange={() => toggle(avail, "sale", setAvail)} />
            <Check label={lv.catalog.rent} checked={avail.includes("rent")} onChange={() => toggle(avail, "rent", setAvail)} />
          </FilterGroup>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="text-sm text-muted font-mono-spec">
              {lv.catalog.found} <span className="text-ink font-semibold">{filtered.length}</span> {lv.catalog.products}
            </div>
            <select
              className="bg-card border border-line rounded-md px-3 py-2 text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="popular">{lv.catalog.sortPopular}</option>
              <option value="accuracy">{lv.catalog.sortAccuracy}</option>
              <option value="new">{lv.catalog.sortNewest}</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-card border border-dashed border-line rounded-2xl p-12 text-center text-muted">{lv.catalog.empty}</div>
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
