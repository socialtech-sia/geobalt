import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Star, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/products/")({
  component: ProductsListPage,
});

function ProductsListPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "hidden">("all");

  const { data: products = [] } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select(`id, name, slug, sort_order, is_active, is_popular, accuracy, ip_class,
                 brands(name), categories(name_lv),
                 product_images(url, is_primary)`)
        .order("sort_order", { ascending: true });
      return data ?? [];
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("products").update({ is_active: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
  const togglePopular = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("products").update({ is_popular: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "products"] }),
  });

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus === "active" && !p.is_active) return false;
    if (filterStatus === "hidden" && p.is_active) return false;
    return true;
  });

  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Produkti</h1>
        <Link to="/admin/products/$id" params={{ id: "new" }} className="rounded-md bg-accent text-white text-sm font-medium px-3 py-2 flex items-center gap-1.5 hover:bg-accent-d">
          <Plus className="h-4 w-4" /> Pievienot produktu
        </Link>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Meklēt pēc nosaukuma…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-line bg-card pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "hidden")}
          className="rounded-md border border-line bg-card px-3 py-2 text-sm"
        >
          <option value="all">Visi statusi</option>
          <option value="active">Aktīvie</option>
          <option value="hidden">Slēptie</option>
        </select>
      </div>

      <div className="rounded-xl bg-card border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-2 text-xs uppercase text-muted">
            <tr>
              <th className="text-left px-4 py-2 w-16">Foto</th>
              <th className="text-left px-4 py-2">Nosaukums</th>
              <th className="text-left px-4 py-2">Zīmols</th>
              <th className="text-left px-4 py-2">Kategorija</th>
              <th className="text-left px-4 py-2 font-mono">Prec./IP</th>
              <th className="text-center px-4 py-2">Aktīvs</th>
              <th className="text-center px-4 py-2">Pop.</th>
              <th className="text-right px-4 py-2">Darbības</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p: any) => {
              const img = p.product_images?.find((i: any) => i.is_primary)?.url || p.product_images?.[0]?.url;
              return (
                <tr key={p.id} className={`border-t border-line ${!p.is_active ? "opacity-50" : ""}`}>
                  <td className="px-4 py-2">
                    {img ? (
                      <img src={img} alt="" className="h-10 w-10 object-cover rounded border border-line" />
                    ) : (
                      <div className="h-10 w-10 bg-paper-2 rounded border border-line" />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-medium text-ink">{p.name}</div>
                    <div className="text-xs text-muted font-mono">{p.slug}</div>
                  </td>
                  <td className="px-4 py-2 text-muted">{p.brands?.name ?? "—"}</td>
                  <td className="px-4 py-2 text-muted">{p.categories?.name_lv ?? "—"}</td>
                  <td className="px-4 py-2 font-mono text-xs text-muted">
                    {p.accuracy ?? "—"} / {p.ip_class ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggleActive.mutate({ id: p.id, value: !p.is_active })}
                      className="text-muted hover:text-ink"
                      title={p.is_active ? "Slēpt" : "Aktivizēt"}
                    >
                      {p.is_active ? <Eye className="h-4 w-4 text-green" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => togglePopular.mutate({ id: p.id, value: !p.is_popular })}
                      className="text-muted hover:text-ink"
                    >
                      <Star className={`h-4 w-4 ${p.is_popular ? "fill-accent text-accent" : ""}`} />
                    </button>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      to="/admin/products/$id"
                      params={{ id: p.id }}
                      className="inline-flex p-1.5 rounded hover:bg-paper-2 text-muted hover:text-ink"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Dzēst produktu "${p.name}"?`)) remove.mutate(p.id);
                      }}
                      className="inline-flex p-1.5 rounded hover:bg-red-50 text-muted hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-muted text-sm">Nav produktu</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
