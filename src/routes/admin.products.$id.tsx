import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/admin/upload";
import { ArrowLeft, Plus, Trash2, Upload, Star, X } from "lucide-react";

export const Route = createFileRoute("/admin/products/$id")({
  component: ProductEditorPage,
});

const INDUSTRIES = ["Topogrāfija", "Būvniecība", "Mašīnvadība", "Mērniecība", "Inženierija"];

interface SpecRow { id?: string; label_lv: string; value: string; sort_order: number; }
interface ImgRow { id?: string; url: string; is_primary: boolean; sort_order: number; }

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ProductEditorPage() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    name: "", slug: "", brand_id: "", category_id: "",
    industries: [] as string[], short_desc_lv: "", full_desc_lv: "",
    accuracy: "", ip_class: "", battery_h: "", weight_kg: "",
    is_active: true, is_popular: false, is_available_sale: true, is_available_rent: false,
    sort_order: 0,
  });
  const [specs, setSpecs] = useState<SpecRow[]>([]);
  const [images, setImages] = useState<ImgRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: refs } = useQuery({
    queryKey: ["admin", "product-refs"],
    queryFn: async () => {
      const [b, c] = await Promise.all([
        supabase.from("brands").select("id, name").order("name"),
        supabase.from("categories").select("id, name_lv").order("name_lv"),
      ]);
      return { brands: b.data ?? [], categories: c.data ?? [] };
    },
  });

  const { data: loaded } = useQuery({
    queryKey: ["admin", "product", id],
    queryFn: async () => {
      if (isNew) return null;
      const [p, s, i] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).single(),
        supabase.from("product_specs").select("*").eq("product_id", id).order("sort_order"),
        supabase.from("product_images").select("*").eq("product_id", id).order("sort_order"),
      ]);
      return { product: p.data, specs: s.data ?? [], images: i.data ?? [] };
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (loaded?.product) {
      const p = loaded.product;
      setForm({
        name: p.name, slug: p.slug, brand_id: p.brand_id ?? "", category_id: p.category_id ?? "",
        industries: p.industries ?? [], short_desc_lv: p.short_desc_lv ?? "", full_desc_lv: p.full_desc_lv ?? "",
        accuracy: p.accuracy ?? "", ip_class: p.ip_class ?? "", battery_h: p.battery_h ?? "", weight_kg: p.weight_kg ?? "",
        is_active: p.is_active, is_popular: p.is_popular, is_available_sale: p.is_available_sale,
        is_available_rent: p.is_available_rent, sort_order: p.sort_order,
      });
      setSpecs(loaded.specs.map((s: any) => ({ id: s.id, label_lv: s.label_lv, value: s.value, sort_order: s.sort_order })));
      setImages(loaded.images.map((i: any) => ({ id: i.id, url: i.url, is_primary: i.is_primary, sort_order: i.sort_order })));
    }
  }, [loaded]);

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: f.slug && !isNew ? f.slug : slugify(name) }));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploads = await Promise.all(Array.from(files).map((f) => uploadFile("product-images", f)));
      setImages((imgs) => [
        ...imgs,
        ...uploads.map((url, i) => ({ url, is_primary: imgs.length === 0 && i === 0, sort_order: imgs.length + i })),
      ]);
    } catch (e: any) {
      setError("Ielādes kļūda: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const setPrimary = (idx: number) => setImages((imgs) => imgs.map((i, k) => ({ ...i, is_primary: k === idx })));
  const removeImage = (idx: number) => setImages((imgs) => imgs.filter((_, k) => k !== idx));

  const save = async (closeAfter = false) => {
    setError(null);
    if (!form.name || !form.slug) { setError("Nosaukums un slug ir obligāti"); return; }
    setSaving(true);
    try {
      let productId = id;
      const payload = { ...form, brand_id: form.brand_id || null, category_id: form.category_id || null };
      if (isNew) {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        productId = data.id;
      } else {
        const { error } = await supabase.from("products").update(payload).eq("id", id);
        if (error) throw error;
      }
      // replace specs
      await supabase.from("product_specs").delete().eq("product_id", productId);
      if (specs.length > 0) {
        const { error } = await supabase.from("product_specs").insert(
          specs.map((s, idx) => ({ product_id: productId, label_lv: s.label_lv, value: s.value, sort_order: idx }))
        );
        if (error) throw error;
      }
      // replace images
      await supabase.from("product_images").delete().eq("product_id", productId);
      if (images.length > 0) {
        const { error } = await supabase.from("product_images").insert(
          images.map((i, idx) => ({ product_id: productId, url: i.url, is_primary: i.is_primary, sort_order: idx }))
        );
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      if (closeAfter) navigate({ to: "/admin/products" });
      else if (isNew) navigate({ to: "/admin/products/$id", params: { id: productId! }, replace: true });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/products" className="text-muted hover:text-ink"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-2xl font-bold text-ink">
            {isNew ? "Jauns produkts" : form.name || "Rediģēšana"}
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => save(false)} disabled={saving} className="rounded-md bg-card border border-line text-sm text-ink px-3 py-2 hover:bg-paper disabled:opacity-50">
            {saving ? "Saglabā…" : "Saglabāt"}
          </button>
          <button onClick={() => save(true)} disabled={saving} className="rounded-md bg-accent text-white text-sm font-medium px-3 py-2 hover:bg-accent-d disabled:opacity-50">
            Saglabāt un aizvērt
          </button>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>}

      <Section title="Pamata">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nosaukums*"><input className={inputCls} value={form.name} onChange={(e) => handleNameChange(e.target.value)} /></Field>
          <Field label="Slug*"><input className={inputCls + " font-mono"} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} /></Field>
          <Field label="Zīmols">
            <select className={inputCls} value={form.brand_id} onChange={(e) => setForm((f) => ({ ...f, brand_id: e.target.value }))}>
              <option value="">—</option>
              {refs?.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
          <Field label="Kategorija">
            <select className={inputCls} value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}>
              <option value="">—</option>
              {refs?.categories.map((c) => <option key={c.id} value={c.id}>{c.name_lv}</option>)}
            </select>
          </Field>
          <Field label="Nozares (Industries)" className="col-span-2">
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => {
                const sel = form.industries.includes(ind);
                return (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setForm((f) => ({
                      ...f,
                      industries: sel ? f.industries.filter((i) => i !== ind) : [...f.industries, ind],
                    }))}
                    className={`px-3 py-1 rounded-full text-xs border ${sel ? "bg-accent text-white border-accent" : "bg-card border-line text-muted"}`}
                  >{ind}</button>
                );
              })}
            </div>
          </Field>
          <Field label="Īss apraksts (LV)" className="col-span-2">
            <textarea className={inputCls} rows={2} value={form.short_desc_lv} onChange={(e) => setForm((f) => ({ ...f, short_desc_lv: e.target.value }))} />
          </Field>
          <Field label="Pilns apraksts (LV, markdown)" className="col-span-2">
            <textarea className={inputCls + " font-mono text-xs"} rows={6} value={form.full_desc_lv} onChange={(e) => setForm((f) => ({ ...f, full_desc_lv: e.target.value }))} />
          </Field>
        </div>
      </Section>

      <Section title="Ikonu raksturlielumi (4 kartītes)">
        <div className="grid grid-cols-4 gap-4">
          <Field label="Precizitāte"><input className={inputCls + " font-mono"} value={form.accuracy} onChange={(e) => setForm((f) => ({ ...f, accuracy: e.target.value }))} placeholder="8 mm + 1 ppm" /></Field>
          <Field label="IP klase"><input className={inputCls + " font-mono"} value={form.ip_class} onChange={(e) => setForm((f) => ({ ...f, ip_class: e.target.value }))} placeholder="IP68" /></Field>
          <Field label="Baterija (h)"><input className={inputCls + " font-mono"} value={form.battery_h} onChange={(e) => setForm((f) => ({ ...f, battery_h: e.target.value }))} placeholder="22 h" /></Field>
          <Field label="Svars (kg)"><input className={inputCls + " font-mono"} value={form.weight_kg} onChange={(e) => setForm((f) => ({ ...f, weight_kg: e.target.value }))} placeholder="1.2 kg" /></Field>
        </div>
      </Section>

      <Section title="Pilna raksturlielumu tabula">
        <div className="space-y-2">
          {specs.map((s, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input className={inputCls + " flex-1"} placeholder="Parametrs (LV)" value={s.label_lv}
                onChange={(e) => setSpecs((arr) => arr.map((x, i) => i === idx ? { ...x, label_lv: e.target.value } : x))} />
              <input className={inputCls + " flex-1 font-mono"} placeholder="Vērtība" value={s.value}
                onChange={(e) => setSpecs((arr) => arr.map((x, i) => i === idx ? { ...x, value: e.target.value } : x))} />
              <button onClick={() => setSpecs((arr) => arr.filter((_, i) => i !== idx))} className="p-2 text-muted hover:text-red-600"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <button onClick={() => setSpecs((arr) => [...arr, { label_lv: "", value: "", sort_order: arr.length }])}
            className="text-sm text-accent hover:underline flex items-center gap-1"><Plus className="h-4 w-4" /> Pievienot</button>
        </div>
      </Section>

      <Section title="Fotogrāfijas">
        <label className="block">
          <div className="border-2 border-dashed border-line rounded-lg p-6 text-center hover:bg-paper-2 cursor-pointer">
            <Upload className="h-6 w-6 mx-auto text-muted mb-2" />
            <span className="text-sm text-muted">{uploading ? "Ielādē…" : "Spied vai velc foto"}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </div>
        </label>
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={img.url} alt="" className="w-full h-32 object-cover rounded border border-line" />
                {img.is_primary && (
                  <span className="absolute top-1 left-1 bg-accent text-white text-xs px-1.5 py-0.5 rounded">Galvenais</span>
                )}
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => setPrimary(idx)} className="bg-white/90 p-1 rounded hover:bg-white" title="Iestatīt kā galveno">
                    <Star className={`h-3.5 w-3.5 ${img.is_primary ? "fill-accent text-accent" : ""}`} />
                  </button>
                  <button onClick={() => removeImage(idx)} className="bg-white/90 p-1 rounded hover:bg-red-50 text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Karodziņi">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Toggle label="Aktīvs (rādīt vietnē)" value={form.is_active} onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
          <Toggle label="Populārs (sākumlapā)" value={form.is_popular} onChange={(v) => setForm((f) => ({ ...f, is_popular: v }))} />
          <Toggle label="Pieejams pārdošanai" value={form.is_available_sale} onChange={(v) => setForm((f) => ({ ...f, is_available_sale: v }))} />
          <Toggle label="Pieejams nomai" value={form.is_available_rent} onChange={(v) => setForm((f) => ({ ...f, is_available_rent: v }))} />
        </div>
        <Field label="Šķirošanas secība" className="mt-3 max-w-xs">
          <input type="number" className={inputCls + " font-mono"} value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
        </Field>
      </Section>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-line bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-card border border-line p-5">
      <h2 className="font-display font-bold text-ink mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer rounded-md border border-line bg-paper-2 px-3 py-2 text-sm">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="accent-accent" />
      <span className="text-ink">{label}</span>
    </label>
  );
}
