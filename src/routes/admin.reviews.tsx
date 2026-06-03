import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SortableList, persistOrder } from "@/components/admin/SortableList";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";

export const Route = createFileRoute("/admin/reviews")({ component: ReviewsPage });

type Review = {
  id: string;
  author_name: string;
  author_role_lv: string | null;
  company: string | null;
  quote_lv: string;
  industry: string | null;
  is_active: boolean;
  sort_order: number;
};

function ReviewsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Review> | null>(null);

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").order("sort_order");
      return (data ?? []) as Review[];
    },
  });

  const reorder = async (next: Review[]) => {
    qc.setQueryData(["admin", "reviews"], next);
    await persistOrder("reviews", next.map((r) => r.id), supabase);
    toast.success("Порядок сохранён");
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
  };

  const toggleActive = async (r: Review) => {
    await supabase.from("reviews").update({ is_active: !r.is_active }).eq("id", r.id);
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
  };

  const remove = async (r: Review) => {
    const { error } = await supabase.from("reviews").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Отзыв удалён");
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Отзывы</h1>
        <button onClick={() => setEditing({ author_name: "", quote_lv: "", is_active: true, sort_order: reviews.length })} className="rounded-md bg-accent text-white text-sm font-medium px-3 py-2 hover:bg-accent-d flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Новый отзыв
        </button>
      </div>

      <div className="rounded-xl bg-card border border-line overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_1fr_1fr_80px_60px_120px] gap-2 px-3 py-2 bg-paper-2 text-xs font-mono uppercase text-muted">
          <span></span><span>Автор</span><span>Компания</span><span>Нозаре</span><span>Актив.</span><span>Поряд.</span><span>Действия</span>
        </div>
        <SortableList
          items={reviews}
          onReorder={reorder}
          renderItem={(r, handle) => (
            <div className="grid grid-cols-[40px_1fr_1fr_1fr_80px_60px_120px] gap-2 px-3 py-2.5 border-t border-line items-center text-sm bg-card">
              <div className="flex items-center justify-center">{handle}</div>
              <div className="font-medium text-ink truncate">{r.author_name}</div>
              <div className="text-muted truncate">{r.company ?? "—"}</div>
              <div className="text-muted truncate text-xs">{r.industry ?? "—"}</div>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={r.is_active} onChange={() => toggleActive(r)} className="accent-accent" />
                </label>
              </div>
              <div className="font-mono text-xs">{r.sort_order}</div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(r)} className="p-1.5 text-muted hover:text-ink"><Pencil className="h-4 w-4" /></button>
                <ConfirmDelete trigger={<button className="p-1.5 text-muted hover:text-red-600"><Trash2 className="h-4 w-4" /></button>} onConfirm={async () => { await remove(r); }} />
              </div>
            </div>
          )}
        />
        {reviews.length === 0 && <div className="p-8 text-center text-muted text-sm">Пусто</div>}
      </div>

      {editing && <ReviewEditor initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ReviewEditor({ initial, onClose }: { initial: Partial<Review>; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<Review>>(initial);
  const [dirty, setDirty] = useState(false);

  const save = useMutation({
    mutationFn: async (data: Partial<Review>) => {
      if (!data.author_name || !data.quote_lv) throw new Error("Заполните автора и цитату");
      const payload = {
        author_name: data.author_name,
        author_role_lv: data.author_role_lv ?? null,
        company: data.company ?? null,
        quote_lv: data.quote_lv,
        industry: data.industry ?? null,
        is_active: data.is_active ?? true,
        sort_order: data.sort_order ?? 0,
      };
      if (initial.id) {
        const { error } = await supabase.from("reviews").update(payload).eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("reviews").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Сохранено");
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleClose = () => {
    if (dirty && !confirm("Есть несохранённые изменения. Закрыть?")) return;
    onClose();
  };

  const set = <K extends keyof Review>(k: K, v: any) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="bg-card rounded-xl border border-line max-w-4xl w-full p-6 grid md:grid-cols-2 gap-6" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">{initial.id ? "Редактировать отзыв" : "Новый отзыв"}</h2>
            <button onClick={handleClose}><X className="h-5 w-5 text-muted" /></button>
          </div>
          <Field label="Автор"><input className={inputCls} value={form.author_name ?? ""} onChange={(e) => set("author_name", e.target.value)} /></Field>
          <Field label="Роль (LV)"><input className={inputCls} value={form.author_role_lv ?? ""} onChange={(e) => set("author_role_lv", e.target.value)} /></Field>
          <Field label="Компания"><input className={inputCls} value={form.company ?? ""} onChange={(e) => set("company", e.target.value)} /></Field>
          <Field label="Нозаре"><input className={inputCls} value={form.industry ?? ""} onChange={(e) => set("industry", e.target.value)} /></Field>
          <Field label="Цитата (LV)"><textarea rows={5} className={inputCls} value={form.quote_lv ?? ""} onChange={(e) => set("quote_lv", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm border border-line rounded-md px-3 py-2">
              <input type="checkbox" checked={form.is_active ?? true} onChange={(e) => set("is_active", e.target.checked)} className="accent-accent" /> Активен
            </label>
            <Field label="Порядок"><input type="number" className={inputCls} value={form.sort_order ?? 0} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} /></Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={handleClose} className="rounded-md border border-line px-3 py-2 text-sm">Отмена</button>
            <button onClick={() => save.mutate(form)} disabled={save.isPending} className="rounded-md bg-accent text-white px-3 py-2 text-sm font-medium disabled:opacity-50">{save.isPending ? "Сохранение…" : "Сохранить"}</button>
          </div>
        </div>

        <div>
          <div className="text-xs font-mono uppercase text-muted mb-2">Превью на сайте</div>
          <div className="bg-card border border-line rounded-2xl p-6 relative">
            <Quote className="absolute top-4 right-4 text-accent/15" size={48} />
            <p className="italic text-base leading-relaxed text-ink relative z-10">"{form.quote_lv || "Цитата отзыва…"}"</p>
            <div className="flex items-center gap-3 mt-5">
              <div className="w-10 h-10 rounded-full bg-green text-white flex items-center justify-center font-display font-bold text-sm">
                {(form.author_name ?? "?").split(" ").map((s) => s[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="font-display font-bold text-ink text-sm">{form.author_name || "Автор"}</div>
                <div className="text-xs text-muted font-mono">{form.author_role_lv || "—"} · {form.company || "—"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-line bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1">{label}</label>{children}</div>;
}
