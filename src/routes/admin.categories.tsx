import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SortableList, persistOrder } from "@/components/admin/SortableList";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { slugify } from "@/lib/admin/utils";

export const Route = createFileRoute("/admin/categories")({ component: CategoriesPage });

type Cat = { id: string; slug: string; name_lv: string; description_lv: string | null; icon: string | null; sort_order: number };

function CategoriesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Cat> | null>(null);

  const { data: cats = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("sort_order");
      return (data ?? []) as Cat[];
    },
  });

  const { data: counts = {} } = useQuery({
    queryKey: ["admin", "category-counts"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("category_id");
      const map: Record<string, number> = {};
      (data ?? []).forEach((p: any) => { if (p.category_id) map[p.category_id] = (map[p.category_id] ?? 0) + 1; });
      return map;
    },
  });

  const reorder = async (next: Cat[]) => {
    qc.setQueryData(["admin", "categories"], next);
    await persistOrder("categories", next.map((c) => c.id), supabase);
    toast.success("Порядок сохранён");
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  const remove = async (cat: Cat) => {
    const { error } = await supabase.from("categories").delete().eq("id", cat.id);
    if (error) return toast.error("Ошибка: " + error.message);
    toast.success("Категория удалена");
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Категории</h1>
        <button onClick={() => setEditing({ name_lv: "", slug: "", description_lv: "", icon: "", sort_order: cats.length })} className="rounded-md bg-accent text-white text-sm font-medium px-3 py-2 hover:bg-accent-d flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Новая категория
        </button>
      </div>

      <div className="rounded-xl bg-card border border-line overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_1fr_80px_60px_120px] gap-2 px-3 py-2 bg-paper-2 text-xs font-mono uppercase text-muted">
          <span></span><span>Название</span><span>Slug</span><span>Продукты</span><span>Поряд.</span><span>Действия</span>
        </div>
        <SortableList
          items={cats}
          onReorder={reorder}
          renderItem={(cat, handle) => (
            <div className="grid grid-cols-[40px_1fr_1fr_80px_60px_120px] gap-2 px-3 py-2.5 border-t border-line items-center text-sm bg-card">
              <div className="flex items-center justify-center">{handle}</div>
              <div className="font-medium text-ink truncate">{cat.name_lv}</div>
              <div className="font-mono text-xs text-muted truncate">{cat.slug}</div>
              <div className="font-mono text-xs">{counts[cat.id] ?? 0}</div>
              <div className="font-mono text-xs">{cat.sort_order}</div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(cat)} className="p-1.5 text-muted hover:text-ink"><Pencil className="h-4 w-4" /></button>
                <ConfirmDelete
                  trigger={<button className="p-1.5 text-muted hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
                  disabled={(counts[cat.id] ?? 0) > 0}
                  disabledReason={`В категории ${counts[cat.id]} продуктов. Переназначьте их перед удалением.`}
                  onConfirm={() => remove(cat)}
                />
              </div>
            </div>
          )}
        />
        {cats.length === 0 && <div className="p-8 text-center text-muted text-sm">Пусто</div>}
      </div>

      {editing && <Editor initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function Editor({ initial, onClose }: { initial: Partial<Cat>; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<Cat>>(initial);
  const [slugTouched, setSlugTouched] = useState(!!initial.id);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!slugTouched && form.name_lv) {
      setForm((f) => ({ ...f, slug: slugify(f.name_lv ?? "") }));
    }
  }, [form.name_lv, slugTouched]);

  const save = useMutation({
    mutationFn: async (data: Partial<Cat>) => {
      if (!data.name_lv || !data.slug) throw new Error("Заполните название и slug");
      const payload = {
        name_lv: data.name_lv,
        slug: data.slug,
        description_lv: data.description_lv ?? null,
        icon: data.icon ?? null,
        sort_order: data.sort_order ?? 0,
      };
      if (initial.id) {
        const { error } = await supabase.from("categories").update(payload).eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Сохранено");
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleClose = () => {
    if (dirty && !confirm("Есть несохранённые изменения. Закрыть?")) return;
    onClose();
  };

  const set = <K extends keyof Cat>(k: K, v: any) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="bg-card rounded-xl border border-line max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{initial.id ? "Редактировать категорию" : "Новая категория"}</h2>
          <button onClick={handleClose}><X className="h-5 w-5 text-muted" /></button>
        </div>
        <Field label="Название (LV)"><input className={inputCls} value={form.name_lv ?? ""} onChange={(e) => set("name_lv", e.target.value)} /></Field>
        <Field label="Slug"><input className={inputCls + " font-mono text-xs"} value={form.slug ?? ""} onChange={(e) => { set("slug", e.target.value); setSlugTouched(true); }} /></Field>
        <Field label="Описание (LV)"><textarea rows={3} className={inputCls} value={form.description_lv ?? ""} onChange={(e) => set("description_lv", e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Иконка (lucide)"><input className={inputCls + " font-mono text-xs"} placeholder="Crosshair" value={form.icon ?? ""} onChange={(e) => set("icon", e.target.value)} /></Field>
          <Field label="Порядок"><input type="number" className={inputCls} value={form.sort_order ?? 0} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} /></Field>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={handleClose} className="rounded-md border border-line px-3 py-2 text-sm">Отмена</button>
          <button onClick={() => save.mutate(form)} disabled={save.isPending} className="rounded-md bg-accent text-white px-3 py-2 text-sm font-medium disabled:opacity-50">{save.isPending ? "Сохранение…" : "Сохранить"}</button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-line bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1">{label}</label>{children}</div>;
}
