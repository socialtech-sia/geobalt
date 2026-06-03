import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { uploadFile } from "@/lib/admin/upload";
import { slugify } from "@/lib/admin/utils";

export const Route = createFileRoute("/admin/blog")({ component: BlogPage });

type Post = {
  id: string;
  slug: string;
  title_lv: string;
  tag_lv: string | null;
  excerpt_lv: string | null;
  cover_url: string | null;
  body_lv: string | null;
  published_at: string;
  status: string;
};

function BlogPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Post> | null>(null);

  const { data: posts = [] } = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
      return (data ?? []) as Post[];
    },
  });

  const remove = async (p: Post) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Raksts dzēsts");
    qc.invalidateQueries({ queryKey: ["admin", "blog"] });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Blogs</h1>
        <button onClick={() => setEditing({ title_lv: "", slug: "", status: "draft", published_at: new Date().toISOString().slice(0, 16) })} className="rounded-md bg-accent text-white text-sm font-medium px-3 py-2 hover:bg-accent-d flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Jauns raksts
        </button>
      </div>

      <div className="rounded-xl bg-card border border-line overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_120px_120px_140px_120px] gap-2 px-3 py-2 bg-paper-2 text-xs font-mono uppercase text-muted">
          <span>Vāks</span><span>Virsraksts</span><span>Tags</span><span>Statuss</span><span>Datums</span><span>Darbības</span>
        </div>
        {posts.map((p) => (
          <div key={p.id} className="grid grid-cols-[80px_1fr_120px_120px_140px_120px] gap-2 px-3 py-2.5 border-t border-line items-center text-sm">
            <div className="h-12 w-16 rounded bg-paper-2 flex items-center justify-center overflow-hidden">
              {p.cover_url ? <img src={p.cover_url} className="h-full w-full object-cover" /> : <FileText className="h-4 w-4 text-muted" />}
            </div>
            <div className="font-medium text-ink truncate">{p.title_lv}</div>
            <div className="text-muted text-xs truncate">{p.tag_lv ?? "—"}</div>
            <div>
              <span className={`pill text-xs ${p.status === "published" ? "bg-green/15 text-green" : "bg-paper-2 text-muted"}`}>
                {p.status === "published" ? "Publ." : "Melnraksts"}
              </span>
            </div>
            <div className="font-mono text-xs text-muted">{new Date(p.published_at).toLocaleString("ru-RU")}</div>
            <div className="flex gap-1">
              <button onClick={() => setEditing(p)} className="p-1.5 text-muted hover:text-ink"><Pencil className="h-4 w-4" /></button>
              <ConfirmDelete trigger={<button className="p-1.5 text-muted hover:text-red-600"><Trash2 className="h-4 w-4" /></button>} onConfirm={async () => { await remove(p); }} />
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="p-8 text-center text-muted text-sm">Tukšs</div>}
      </div>

      {editing && <PostEditor initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function PostEditor({ initial, onClose }: { initial: Partial<Post>; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<Post>>(initial);
  const [slugTouched, setSlugTouched] = useState(!!initial.id);
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (!slugTouched && form.title_lv) setForm((f) => ({ ...f, slug: slugify(f.title_lv ?? "") }));
  }, [form.title_lv, slugTouched]);

  const save = useMutation({
    mutationFn: async (data: Partial<Post>) => {
      if (!data.title_lv || !data.slug) throw new Error("Aizpildiet virsrakstu un slug");
      const payload = {
        title_lv: data.title_lv,
        slug: data.slug,
        tag_lv: data.tag_lv ?? null,
        excerpt_lv: data.excerpt_lv ?? null,
        cover_url: data.cover_url || null,
        body_lv: data.body_lv ?? null,
        published_at: data.published_at ? new Date(data.published_at).toISOString() : new Date().toISOString(),
        status: data.status ?? "draft",
      };
      if (initial.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saglabāts");
      qc.invalidateQueries({ queryKey: ["admin", "blog"] });
      onClose();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile("blog-covers", file);
      setForm((f) => ({ ...f, cover_url: url })); setDirty(true);
    } catch (e: any) { toast.error(e.message); }
    finally { setUploading(false); }
  };

  const handleClose = () => {
    if (dirty && !confirm("Ir nesaglabātas izmaiņas. Aizvērt?")) return;
    onClose();
  };

  const set = <K extends keyof Post>(k: K, v: any) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto" onClick={handleClose}>
      <div className="bg-card rounded-xl border border-line max-w-4xl w-full p-6 space-y-4 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{initial.id ? "Rediģēt rakstu" : "Jauns raksts"}</h2>
          <button onClick={handleClose}><X className="h-5 w-5 text-muted" /></button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Virsraksts (LV)"><input className={inputCls} value={form.title_lv ?? ""} onChange={(e) => set("title_lv", e.target.value)} /></Field>
          <Field label="Slug"><input className={inputCls + " font-mono text-xs"} value={form.slug ?? ""} onChange={(e) => { set("slug", e.target.value); setSlugTouched(true); }} /></Field>
          <Field label="Tags (LV)"><input className={inputCls} value={form.tag_lv ?? ""} onChange={(e) => set("tag_lv", e.target.value)} /></Field>
          <Field label="Publicēšanas datums"><input type="datetime-local" className={inputCls} value={form.published_at?.slice(0, 16) ?? ""} onChange={(e) => set("published_at", e.target.value)} /></Field>
          <Field label="Anonss (LV)" ><textarea rows={2} className={inputCls} value={form.excerpt_lv ?? ""} onChange={(e) => set("excerpt_lv", e.target.value)} /></Field>
          <Field label="Statuss">
            <select className={inputCls} value={form.status ?? "draft"} onChange={(e) => set("status", e.target.value)}>
              <option value="draft">Melnraksts</option>
              <option value="published">Publicēts</option>
            </select>
          </Field>
        </div>

        <Field label="Vāks">
          {form.cover_url ? (
            <div className="flex items-center gap-3 mb-2">
              <img src={form.cover_url} alt="" className="h-24 w-40 object-cover bg-paper-2 rounded border border-line" />
              <button onClick={() => set("cover_url", "")} className="text-xs text-red-600 hover:underline">Dzēst</button>
            </div>
          ) : null}
          <label className="inline-flex items-center gap-2 rounded-md bg-card border border-line px-3 py-2 text-sm cursor-pointer hover:bg-paper">
            <Upload className="h-4 w-4" /> {uploading ? "Ielādē…" : form.cover_url ? "Aizstāt" : "Augšupielādēt"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
          </label>
        </Field>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-xs font-medium text-muted uppercase tracking-wide">Saturs (markdown)</label>
            <div className="ml-auto flex rounded-md border border-line overflow-hidden text-xs">
              <button onClick={() => setTab("edit")} className={`px-3 py-1 ${tab === "edit" ? "bg-accent text-white" : "bg-card"}`}>Redaktors</button>
              <button onClick={() => setTab("preview")} className={`px-3 py-1 ${tab === "preview" ? "bg-accent text-white" : "bg-card"}`}>Priekšskatījums</button>
            </div>
          </div>
          {tab === "edit" ? (
            <textarea rows={12} className={inputCls + " font-mono text-xs"} value={form.body_lv ?? ""} onChange={(e) => set("body_lv", e.target.value)} />
          ) : (
            <div className="rounded-md border border-line bg-paper-2 p-4 prose prose-sm max-w-none min-h-[280px]">
              <ReactMarkdown>{form.body_lv ?? "_Tukšs_"}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={handleClose} className="rounded-md border border-line px-3 py-2 text-sm">Atcelt</button>
          <button onClick={() => save.mutate(form)} disabled={save.isPending} className="rounded-md bg-accent text-white px-3 py-2 text-sm font-medium disabled:opacity-50">{save.isPending ? "Saglabā…" : "Saglabāt"}</button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-line bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1">{label}</label>{children}</div>;
}
