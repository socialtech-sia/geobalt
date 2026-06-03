import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/admin/upload";
import { X, Plus, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

interface SettingsForm {
  notification_emails: string[];
  send_lead_autoreply: boolean;
  contact_phone: string;
  contact_email: string;
  contact_address_lv: string;
  working_hours_lv: string;
  promo_enabled: boolean;
  promo_image_url: string;
  promo_title_lv: string;
  promo_text_lv: string;
  promo_cta_url: string;
  show_blog: boolean;
  show_reviews: boolean;
  show_rent: boolean;
}

function SettingsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<SettingsForm | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        notification_emails: data.notification_emails ?? [],
        send_lead_autoreply: data.send_lead_autoreply ?? false,
        contact_phone: data.contact_phone ?? "",
        contact_email: data.contact_email ?? "",
        contact_address_lv: data.contact_address_lv ?? "",
        working_hours_lv: data.working_hours_lv ?? "",
        promo_enabled: data.promo_enabled ?? false,
        promo_image_url: data.promo_image_url ?? "",
        promo_title_lv: data.promo_title_lv ?? "",
        promo_text_lv: data.promo_text_lv ?? "",
        promo_cta_url: data.promo_cta_url ?? "",
        show_blog: data.show_blog ?? true,
        show_reviews: data.show_reviews ?? true,
        show_rent: data.show_rent ?? true,
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async (payload: SettingsForm) => {
      const { error } = await supabase.from("settings").update(payload).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      setStatus("Saglabāts");
      setTimeout(() => setStatus(null), 2000);
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (e: any) => setStatus("Kļūda: " + e.message),
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile("blog-covers", file, "promo");
      setForm((f) => f && { ...f, promo_image_url: url });
    } finally {
      setUploading(false);
    }
  };

  const addEmail = () => {
    if (!newEmail.trim() || !form) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail)) {
      alert("Nepareizs e-pasts");
      return;
    }
    setForm({ ...form, notification_emails: [...form.notification_emails, newEmail.trim()] });
    setNewEmail("");
  };

  if (!form) return <div className="text-muted text-sm">Ielādē…</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Iestatījumi</h1>
        <div className="flex items-center gap-3">
          {status && <span className="text-sm text-green">{status}</span>}
          <button onClick={() => save.mutate(form)} disabled={save.isPending} className="rounded-md bg-accent text-white text-sm font-medium px-3 py-2 hover:bg-accent-d disabled:opacity-50">
            {save.isPending ? "Saglabā…" : "Saglabāt"}
          </button>
        </div>
      </div>

      <Section title="Pieprasījumu e-pasta saņēmēji" desc="Kam sūtīt paziņojumus par jaunajiem pieprasījumiem. Edge funkcija lasa šo sarakstu.">
        <div className="flex flex-wrap gap-2 mb-3">
          {form.notification_emails.map((e, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 border border-line px-3 py-1 text-sm">
              {e}
              <button onClick={() => setForm({ ...form, notification_emails: form.notification_emails.filter((_, k) => k !== i) })} className="text-muted hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {form.notification_emails.length === 0 && <span className="text-muted text-sm">Tukšs</span>}
        </div>
        <div className="flex gap-2">
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())} placeholder="manager@geobalt.lv" className={inputCls + " flex-1"} />
          <button onClick={addEmail} className="rounded-md bg-card border border-line px-3 py-2 text-sm hover:bg-paper flex items-center gap-1"><Plus className="h-4 w-4" />Pievienot</button>
        </div>
        <Toggle className="mt-4" label="Sūtīt auto-atbildi klientam" value={form.send_lead_autoreply} onChange={(v) => setForm({ ...form, send_lead_autoreply: v })} />
      </Section>

      <Section title="Vietnes kontakti" desc="Tiek attēloti galvenē, kājenē un kontaktu lapā.">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tālrunis"><input className={inputCls} value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} /></Field>
          <Field label="Email"><input className={inputCls} value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></Field>
          <Field label="Adrese (LV)" className="col-span-2"><input className={inputCls} value={form.contact_address_lv} onChange={(e) => setForm({ ...form, contact_address_lv: e.target.value })} /></Field>
          <Field label="Darba laiks (LV)" className="col-span-2"><input className={inputCls} value={form.working_hours_lv} onChange={(e) => setForm({ ...form, working_hours_lv: e.target.value })} /></Field>
        </div>
      </Section>

      <Section title="Promo baneris sākumlapā">
        <Toggle label="Ieslēgt baneri" value={form.promo_enabled} onChange={(v) => setForm({ ...form, promo_enabled: v })} />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <Field label="Virsraksts (LV)"><input className={inputCls} value={form.promo_title_lv} onChange={(e) => setForm({ ...form, promo_title_lv: e.target.value })} /></Field>
          <Field label="CTA URL"><input className={inputCls + " font-mono text-xs"} value={form.promo_cta_url} onChange={(e) => setForm({ ...form, promo_cta_url: e.target.value })} /></Field>
          <Field label="Teksts (LV)" className="col-span-2"><textarea rows={2} className={inputCls} value={form.promo_text_lv} onChange={(e) => setForm({ ...form, promo_text_lv: e.target.value })} /></Field>
          <Field label="Attēls" className="col-span-2">
            {form.promo_image_url && <img src={form.promo_image_url} alt="" className="h-32 rounded border border-line mb-2 object-cover" />}
            <label className="inline-flex items-center gap-2 rounded-md bg-card border border-line px-3 py-2 text-sm cursor-pointer hover:bg-paper">
              <Upload className="h-4 w-4" /> {uploading ? "Ielādē…" : "Augšupielādēt"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            </label>
          </Field>
        </div>
      </Section>

      <Section title="Sadaļu redzamība vietnē">
        <div className="grid grid-cols-3 gap-3">
          <Toggle label="Rādīt blogu" value={form.show_blog} onChange={(v) => setForm({ ...form, show_blog: v })} />
          <Toggle label="Rādīt atsauksmes" value={form.show_reviews} onChange={(v) => setForm({ ...form, show_reviews: v })} />
          <Toggle label="Rādīt nomu" value={form.show_rent} onChange={(v) => setForm({ ...form, show_rent: v })} />
        </div>
      </Section>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-line bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent";

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-card border border-line p-5">
      <h2 className="font-display font-bold text-ink">{title}</h2>
      {desc && <p className="text-xs text-muted mt-0.5 mb-4">{desc}</p>}
      {!desc && <div className="mb-4" />}
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

function Toggle({ label, value, onChange, className = "" }: { label: string; value: boolean; onChange: (v: boolean) => void; className?: string }) {
  return (
    <label className={"flex items-center gap-2 cursor-pointer rounded-md border border-line bg-paper-2 px-3 py-2 text-sm " + className}>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="accent-accent" />
      <span className="text-ink">{label}</span>
    </label>
  );
}
