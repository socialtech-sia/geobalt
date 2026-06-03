import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Search, Trash2, X, Send } from "lucide-react";

export const Route = createFileRoute("/admin/leads")({
  component: LeadsPage,
});

const STATUSES = [
  { value: "new", label: "Jauns" },
  { value: "in_progress", label: "Procesā" },
  { value: "won", label: "Iegūts" },
  { value: "lost", label: "Zaudēts" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-accent/10 text-accent border-accent/30",
    in_progress: "bg-amber-soft text-ink border-amber-soft",
    won: "bg-green-soft text-green border-green/30",
    lost: "bg-red-50 text-red-700 border-red-200",
  };
  const label = STATUSES.find((s) => s.value === status)?.label ?? status;
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${map[status] ?? ""}`}>{label}</span>;
}

function LeadsPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openLead, setOpenLead] = useState<string | null>(null);

  const { data: leads = [] } = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "leads"] });
      qc.invalidateQueries({ queryKey: ["admin", "new-lead-count"] });
    },
  });

  const removeLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "leads"] }),
  });

  const filtered = leads.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return [l.full_name, l.email, l.phone, l.company, l.product_name].some((v) => v?.toLowerCase().includes(q));
    }
    return true;
  });

  const exportCsv = () => {
    const header = ["Datums", "Vārds", "Uzņēmums", "Email", "Tālrunis", "Produkts", "Ziņojums", "Statuss", "Avots"];
    const rows = filtered.map((l) => [
      new Date(l.created_at).toLocaleString("lv"),
      l.full_name, l.company ?? "", l.email, l.phone, l.product_name ?? "",
      (l.message ?? "").replace(/[\n\r]/g, " "), l.status, l.source_page ?? "",
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const lead = openLead ? leads.find((l) => l.id === openLead) ?? null : null;

  return (
    <div className="space-y-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Pieprasījumi</h1>
        <button onClick={exportCsv} className="rounded-md bg-card border border-line text-sm text-ink px-3 py-2 flex items-center gap-1.5 hover:bg-paper">
          <Download className="h-4 w-4" /> Eksportēt CSV
        </button>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Meklēt pēc vārda, e-pasta, tālruņa…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-line bg-card pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border border-line bg-card px-3 py-2 text-sm">
          <option value="all">Visi statusi</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="rounded-xl bg-card border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-2 text-xs uppercase text-muted">
            <tr>
              <th className="text-left px-4 py-2">Datums</th>
              <th className="text-left px-4 py-2">Vārds</th>
              <th className="text-left px-4 py-2">Uzņēmums</th>
              <th className="text-left px-4 py-2">Kontakti</th>
              <th className="text-left px-4 py-2">Produkts</th>
              <th className="text-left px-4 py-2">Statuss</th>
              <th className="text-right px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className={`border-t border-line hover:bg-paper-2/50 cursor-pointer ${l.status === "new" ? "bg-accent/5" : ""}`} onClick={() => setOpenLead(l.id)}>
                <td className="px-4 py-3 font-mono text-xs text-muted">{new Date(l.created_at).toLocaleDateString("ru")}</td>
                <td className="px-4 py-3 text-ink font-medium">{l.full_name}</td>
                <td className="px-4 py-3 text-muted">{l.company ?? "—"}</td>
                <td className="px-4 py-3 text-xs text-muted">{l.email}<br/>{l.phone}</td>
                <td className="px-4 py-3 text-muted text-xs">{l.product_name ?? "Vispārīgs jautājums"}</td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <select value={l.status} onChange={(e) => updateStatus.mutate({ id: l.id, status: e.target.value })} className="text-xs border border-line bg-card rounded px-2 py-1">
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => { if (confirm("Dzēst pieprasījumu?")) removeLead.mutate(l.id); }} className="p-1.5 text-muted hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-muted text-sm">Nav pieprasījumu</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {lead && <LeadDrawer lead={lead} onClose={() => setOpenLead(null)} />}
    </div>
  );
}

function LeadDrawer({ lead, onClose }: { lead: any; onClose: () => void }) {
  const qc = useQueryClient();
  const [noteText, setNoteText] = useState("");

  const { data: notes = [] } = useQuery({
    queryKey: ["admin", "lead-notes", lead.id],
    queryFn: async () => {
      const { data } = await supabase.from("lead_notes").select("*").eq("lead_id", lead.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const addNote = useMutation({
    mutationFn: async (note: string) => {
      const { data: sess } = await supabase.auth.getSession();
      const { error } = await supabase.from("lead_notes").insert({
        lead_id: lead.id, note, author_id: sess.session?.user.id ?? null, author_name: sess.session?.user.email ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNoteText("");
      qc.invalidateQueries({ queryKey: ["admin", "lead-notes", lead.id] });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-ink/40" onClick={onClose} />
      <div className="w-full max-w-md bg-paper overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-line px-5 py-3 flex justify-between items-center">
          <h2 className="font-display font-bold text-ink">{lead.full_name}</h2>
          <button onClick={onClose} className="p-1 text-muted hover:text-ink"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <StatusBadge status={lead.status} />
          <Row k="Email"><a href={`mailto:${lead.email}?subject=${encodeURIComponent("Re: " + (lead.product_name ?? "pieprasījums"))}`} className="text-accent hover:underline">{lead.email}</a></Row>
          <Row k="Tālrunis"><a href={`tel:${lead.phone}`} className="text-accent hover:underline">{lead.phone}</a></Row>
          {lead.company && <Row k="Uzņēmums">{lead.company}</Row>}
          <Row k="Produkts">{lead.product_name ?? "Vispārīgs jautājums"}</Row>
          {lead.message && <Row k="Ziņojums"><div className="text-sm text-ink whitespace-pre-wrap">{lead.message}</div></Row>}
          <Row k="GDPR">{lead.gdpr_consent ? "Piekrišana saņemta" : "Nē"}</Row>
          <Row k="Avots"><span className="font-mono text-xs">{lead.source_page ?? "—"}</span></Row>
          <Row k="Datums">{new Date(lead.created_at).toLocaleString("lv")}</Row>

          <div className="pt-4 border-t border-line">
            <h3 className="font-display font-bold text-ink mb-3">Piezīmes</h3>
            <div className="space-y-2 mb-3">
              {notes.map((n: any) => (
                <div key={n.id} className="rounded-md bg-card border border-line p-3">
                  <div className="text-sm text-ink whitespace-pre-wrap">{n.note}</div>
                  <div className="text-xs text-muted mt-1 font-mono">
                    {n.author_name ?? "—"} · {new Date(n.created_at).toLocaleString("lv")}
                  </div>
                </div>
              ))}
              {notes.length === 0 && <p className="text-xs text-muted">Vēl nav piezīmju</p>}
            </div>
            <div className="flex gap-2">
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={2} placeholder="Pievienot piezīmi…"
                className="flex-1 rounded-md border border-line bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              <button onClick={() => noteText.trim() && addNote.mutate(noteText.trim())}
                className="rounded-md bg-accent text-white px-3 self-start py-2 hover:bg-accent-d">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted mb-0.5">{k}</div>
      <div className="text-sm text-ink">{children}</div>
    </div>
  );
}
