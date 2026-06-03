import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, CheckCircle2, Inbox, TrendingUp, Plus, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

function KpiCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Package }) {
  return (
    <div className="rounded-xl bg-card border border-line p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
        <Icon className="h-4 w-4 text-muted" />
      </div>
      <div className="mt-2 font-mono text-3xl font-bold text-ink tabular-nums">{value}</div>
    </div>
  );
}

function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
      const [totalProducts, activeProducts, newLeads, weekLeads, recentLeads] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
        supabase.from("leads").select("id, created_at, full_name, email, product_name, status").order("created_at", { ascending: false }).limit(5),
      ]);
      return {
        totalProducts: totalProducts.count ?? 0,
        activeProducts: activeProducts.count ?? 0,
        newLeads: newLeads.count ?? 0,
        weekLeads: weekLeads.count ?? 0,
        recentLeads: recentLeads.data ?? [],
      };
    },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Vadības panelis</h1>
        <div className="flex gap-2">
          <Link to="/admin/products/new" className="rounded-md bg-accent text-white text-sm font-medium px-3 py-2 flex items-center gap-1.5 hover:bg-accent-d">
            <Plus className="h-4 w-4" /> Produkts
          </Link>
          <Link to="/admin/leads" className="rounded-md bg-card border border-line text-sm text-ink px-3 py-2 flex items-center gap-1.5 hover:bg-paper">
            Pieprasījumi <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Kopā produktu" value={data?.totalProducts ?? "—"} icon={Package} />
        <KpiCard label="Aktīvo" value={data?.activeProducts ?? "—"} icon={CheckCircle2} />
        <KpiCard label="Jaunu pieprasījumu" value={data?.newLeads ?? "—"} icon={Inbox} />
        <KpiCard label="Pieprasījumi 7 dienās" value={data?.weekLeads ?? "—"} icon={TrendingUp} />
      </div>

      <div className="rounded-xl bg-card border border-line overflow-hidden">
        <div className="px-5 py-3 border-b border-line flex items-center justify-between">
          <h2 className="font-display font-bold text-ink">Pēdējie pieprasījumi</h2>
          <Link to="/admin/leads" className="text-xs text-accent hover:underline">Visi →</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-paper-2 text-xs uppercase text-muted">
            <tr>
              <th className="text-left px-5 py-2">Datums</th>
              <th className="text-left px-5 py-2">Vārds</th>
              <th className="text-left px-5 py-2">Produkts</th>
              <th className="text-left px-5 py-2">Statuss</th>
            </tr>
          </thead>
          <tbody>
            {(data?.recentLeads ?? []).map((l) => (
              <tr key={l.id} className="border-t border-line hover:bg-paper-2/50">
                <td className="px-5 py-3 font-mono text-xs text-muted">
                  {new Date(l.created_at).toLocaleDateString("ru")}
                </td>
                <td className="px-5 py-3 text-ink">{l.full_name}</td>
                <td className="px-5 py-3 text-muted">{l.product_name ?? "Vispārīgs jautājums"}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={l.status} />
                </td>
              </tr>
            ))}
            {(!data?.recentLeads || data.recentLeads.length === 0) && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-muted text-sm">Vēl nav pieprasījumu</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    new: { label: "Jauns", cls: "bg-accent/10 text-accent border-accent/30" },
    in_progress: { label: "Procesā", cls: "bg-amber-soft text-ink border-amber-soft" },
    won: { label: "Iegūts", cls: "bg-green-soft text-green border-green/30" },
    lost: { label: "Zaudēts", cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const s = map[status] ?? map.new;
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${s.cls}`}>{s.label}</span>
  );
}
