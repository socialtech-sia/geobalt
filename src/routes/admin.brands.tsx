import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SortableList, persistOrder } from "@/components/admin/SortableList";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { uploadFile } from "@/lib/admin/upload";
import { slugify } from "@/lib/admin/utils";

export const Route = createFileRoute("/admin/brands")({ component: BrandsPage });

type Brand = { id: string; slug: string; name: string; logo_url: string | null; blurb_lv: string | null; sort_order: number };

function BrandsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Brand> | null>(null);

  const { data: brands = [] } = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: async () => {
      const { data } = await supabase.from("brands").select("*").order("sort_order");
      return (data ?? []) as Brand[];
    },
  });

  const reorder = async (next: Brand[]) => {
    qc.setQueryData(["admin", "brands"], next);
    await persistOrder("brands", next.map((b) => b.id), supabase);
    toast.success("Порядок сохранён");
    qc.invalidateQueries({ queryKey: ["admin", "brands"] });
  };

  const remove = async (b: Brand) => {
    const { error } = await supabase.from("brands").delete().eq("id", b.id);
    if (error) return toast.error("Ошибка: " + error.message);
    toast.success("Бренд удалён");
    qc.invalidateQueries({ queryKey: ["admin", "brands"] });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Бренды</h1>
        <button onClick={() => setEditing({ name: "", slug: "", logo_url: "", blurb_lv: "", sort_order: brands.length })} className="rounded-md bg-accent text-white text-sm font-medium px-3 py-2 hover:bg-accent-d flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Новый бренд
        </button>
      </div>

      <div className="rounded-xl bg-card border border-line overflow-hidden">
        <div className="grid grid-cols-[40px_60px_1fr_1fr_60px_120px] gap-2 px-3 py-2 bg-paper-2 text-xs font-mono uppercase text-muted">
          <span></span><span>Лого</span><span>Название</span><span>Slug</span><span>Поряд.</span><span>Действия</span>
        </div>
        <SortableList
          items={brands}
          onReorder={reorder}
          renderItem={(b, handle) => (
            <div className="grid grid-cols-[40px_60px_1fr_1fr_60px_120px] gap-2 px-3 py-2.5 border-t border-line items-center text-sm bg-card">
              <div className="flex items-center justify-center">{handle}</div>
              <div className="h-10 w-12 rounded bg-paper-2 flex items-center justify-center overflow-hidden">
                {b.logo_url ? <img src={b.logo_url} className="h-full w-full object-contain" /> : <ImageIcon className="h-4 w-4 text-muted" />}
              </div>
              <div className="font-medium text-ink truncate">{b.name}</div>
              <div className="font-mono text-xs text-muted truncate">{b.slug}</div>
              <div className="font-mono text-xs">{b.sort_order}</div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(b)} className="p-1.5 text-muted hover:text-ink"><Pencil className="h-4 w-4" /></button>
                <ConfirmDelete
                  trigger={<button className="p-1.5 text-muted hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
                  onConfirm={async () => { await remove(b); }}
                />
              </div>
            </div>
          )}
        />
        {brands.length === 0 && <div className="p-8 text-center text-muted text-sm">Пусто</div>}
      </div>

      {editing && <BrandEditor initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function BrandEditor({ initial, onClose }: { initial: Partial<Brand>; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<Brand>>(initial);
  const [slugTouched, setSlugTouched] = useState(!!initial.id);
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!slugTouched && form.name) setForm((f) => ({ ...f, slug: slugify(f.name ?? "") }));
  }, [form.name, slugTouched]);

  const save = useMutation({
    mutationFn: async (data: Partial<Brand>) => {
      if (!data.name || !data.slug) throw new Error("Заполните название и slug");
      const payload = {
        name: data.name,
        slug: data.slug,
        logo_url: data.logo_url || null,
        blurb_lv: data.blurb_lv ?? null,
        sort_order: data.sort_order ?? 0,
      };
      if (initial.id) {
        const { error } = await supabase.from("brands").update(payload).eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("brands").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Сохранено");
      qc.invalidateQueries({ queryKey: ["admin", "brands"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile("brand-logos", file);
      setForm((f) => ({ ...f, logo_url: url })); setDirty(true);
    } catch (e: any) { toast.error(e.message); }
    finally { setUploading(false); }
  };

  const handleClose = () => {
    if (dirty && !confirm("Есть несохранённые изменения. Закрыть?")) return;
    onClose();
  };

  const set = <K extends keyof Brand>(k: K, v: any) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="bg-card rounded-xl border border-line max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{initial.id ? "Редактировать бренд" : "Новый бренд"}</h2>
          <button onClick={handleClose}><X className="h-5 w-5 text-muted" /></button>
        </div>
        <Field label="Название"><input className={inputCls} value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Slug"><input className={inputCls + " font-mono text-xs"} value={form.slug ?? ""} onChange={(e) => { set("slug", e.target.value); setSlugTouched(true); }} /></Field>
        <Field label="Описание (LV)"><textarea rows={2} className={inputCls} value={form.blurb_lv ?? ""} onChange={(e) => set("blurb_lv", e.target.value)} /></Field>
        <Field label="Логотип">
          {form.logo_url ? (
            <div className="flex items-center gap-3 mb-2">
              <img src={form.logo_url} alt="" className="h-16 w-24 object-contain bg-paper-2 rounded border border-line" />
              <button onClick={() => set("logo_url", "")} className="text-xs text-red-600 hover:underline">Удалить</button>
            </div>
          ) : null}
          <label className="inline-flex items-center gap-2 rounded-md bg-card border border-line px-3 py-2 text-sm cursor-pointer hover:bg-paper">
            <Upload className="h-4 w-4" /> {uploading ? "Загрузка…" : form.logo_url ? "Заменить" : "Загрузить"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          </label>
        </Field>
        <Field label="Порядок"><input type="number" className={inputCls} value={form.sort_order ?? 0} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} /></Field>
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
