import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { lv } from "@/lib/i18n";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/kontakti")({
  head: () => {
    const title = "Kontakti | geobalt.lv";
    const description = "Sazinies ar geobalt.lv — adrese, tālrunis, e-pasts un darba laiks. Atbildam vienas darba dienas laikā.";
    const url = "https://geobalt.lv/kontakti";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "geobalt.lv",
            url: "https://geobalt.lv",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Rīga",
              addressCountry: "LV",
            },
            telephone: "+371 20 000 000",
            email: "info@geobalt.lv",
            openingHours: "Mo-Fr 09:00-18:00",
          }),
        },
      ],
    };
  },
  component: ContactsPage,
});

const schema = z.object({
  full_name: z.string().min(1, lv.modal.errors.name).max(120),
  company: z.string().max(160).optional(),
  email: z.string().email(lv.modal.errors.email).max(200),
  phone: z.string().min(4, lv.modal.errors.phone).max(40),
  message: z.string().max(2000).optional(),
  gdpr_consent: z.literal(true, { errorMap: () => ({ message: lv.modal.errors.gdpr }) }),
});
type FormVals = z.infer<typeof schema>;

function ContactsPage() {
  const { data: s } = useSiteSettings();
  const address = s?.contact_address_lv ?? "Rīga, Latvija";
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="kicker mb-3">Kontakti</div>
      <h1 className="text-4xl md:text-5xl mb-10">Sazinies ar mums</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-5">
          <Row Icon={MapPin} label="Adrese" value={address} />
          <Row Icon={Phone} label="Tālrunis" value={s?.contact_phone ?? lv.footer.phone} mono />
          <Row Icon={Mail} label="E-pasts" value={s?.contact_email ?? lv.footer.email} />
          <Row Icon={Clock} label="Darba laiks" value={s?.working_hours_lv ?? "P-Pk 9:00 – 18:00"} />
          <div className="aspect-video rounded-2xl overflow-hidden border border-line bg-paper-2">
            <iframe
              title="Karte"
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}

function ContactForm() {
  const [success, setSuccess] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      full_name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      gdpr_consent: false as unknown as true,
    },
  });

  const onSubmit = async (vals: FormVals) => {
    setSubmitErr(null);
    try {
      const { error } = await supabase.from("leads").insert({
        full_name: vals.full_name,
        company: vals.company || null,
        email: vals.email,
        phone: vals.phone,
        message: vals.message || null,
        gdpr_consent: vals.gdpr_consent,
        source_page: typeof window !== "undefined" ? window.location.pathname : null,
      });
      if (error) throw error;
      supabase.functions.invoke("send-lead-email", {
        body: { ...vals, source_page: typeof window !== "undefined" ? window.location.pathname : null },
      }).catch(() => {});
      setSuccess(true);
      form.reset();
    } catch (e) {
      console.error(e);
      setSubmitErr(lv.modal.errors.submit);
    }
  };

  return (
    <div className="bg-card border border-line rounded-2xl p-8">
      <h2 className="text-2xl mb-2">Uzraksti mums</h2>
      <p className="text-muted mb-6 text-sm">Atstāj kontaktinformāciju — atbildēsim 1 darba dienas laikā.</p>

      {success ? (
        <div className="py-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-soft text-green mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-extrabold text-ink mb-1">{lv.modal.success}</h3>
          <p className="text-muted text-sm">{lv.modal.successSub}</p>
          <button onClick={() => setSuccess(false)} className="btn-ghost mt-6">Sūtīt vēl vienu</button>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <Field label={`${lv.modal.fields.name} *`} error={form.formState.errors.full_name?.message}>
            <input className="input" {...form.register("full_name")} />
          </Field>
          <Field label={lv.modal.fields.company}>
            <input className="input" {...form.register("company")} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label={`${lv.modal.fields.email} *`} error={form.formState.errors.email?.message}>
              <input type="email" className="input" {...form.register("email")} />
            </Field>
            <Field label={`${lv.modal.fields.phone} *`} error={form.formState.errors.phone?.message}>
              <input className="input font-mono-spec" {...form.register("phone")} />
            </Field>
          </div>
          <Field label={lv.modal.fields.message}>
            <textarea rows={4} className="input resize-none" {...form.register("message")} />
          </Field>

          <label className="flex items-start gap-2 text-sm text-muted cursor-pointer">
            <input type="checkbox" className="mt-1 accent-[var(--accent)]" {...form.register("gdpr_consent")} />
            <span>{lv.modal.fields.gdpr}</span>
          </label>
          {form.formState.errors.gdpr_consent && (
            <p className="text-xs text-destructive">{form.formState.errors.gdpr_consent.message as string}</p>
          )}

          {submitErr && <p className="text-sm text-destructive">{submitErr}</p>}

          <button type="submit" disabled={form.formState.isSubmitting} className="btn-accent w-full justify-center mt-2">
            {form.formState.isSubmitting ? "Sūta…" : lv.modal.submit}
          </button>
        </form>
      )}

      <style>{`
        .input {
          width: 100%;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 0.6rem 0.8rem;
          font-size: 0.92rem;
          color: var(--text);
          outline: none;
          transition: border-color .15s ease;
        }
        .input:focus { border-color: var(--accent); }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono-spec uppercase tracking-wider text-muted mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

function Row({ Icon, label, value, mono }: { Icon: typeof Phone; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center"><Icon size={18} /></div>
      <div>
        <div className="text-[10px] uppercase tracking-wider font-mono-spec text-muted">{label}</div>
        <div className={`text-ink ${mono ? "font-mono-spec" : ""}`}>{value}</div>
      </div>
    </div>
  );
}
