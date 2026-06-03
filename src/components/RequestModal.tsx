import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, CheckCircle2, Package } from "lucide-react";
import { useRequestModal } from "./request-modal-context";
import { TopoBg } from "./TopoBg";
import { lv } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  full_name: z.string().min(1, lv.modal.errors.name).max(120),
  company: z.string().max(160).optional(),
  email: z.string().email(lv.modal.errors.email).max(200),
  phone: z.string().min(4, lv.modal.errors.phone).max(40),
  message: z.string().max(2000).optional(),
  gdpr_consent: z.literal(true, { errorMap: () => ({ message: lv.modal.errors.gdpr }) }),
});

type FormVals = z.infer<typeof schema>;

export function RequestModal() {
  const { open, close, product } = useRequestModal();
  const [success, setSuccess] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const form = useForm<FormVals>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      // @ts-expect-error rhf default
      gdpr_consent: false,
    },
  });

  useEffect(() => {
    if (!open) {
      setSuccess(false);
      setSubmitErr(null);
      form.reset();
    }
  }, [open, form]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && close();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, close]);

  if (!open) return null;

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
        product_id: product?.id ?? null,
        product_name: product?.name ?? null,
        source_page: typeof window !== "undefined" ? window.location.pathname : null,
      });
      if (error) throw error;
      // Fire-and-forget edge fn (may not be deployed yet)
      supabase.functions.invoke("send-lead-email", {
        body: {
          ...vals,
          product_name: product?.name ?? null,
          source_page: typeof window !== "undefined" ? window.location.pathname : null,
        },
      }).catch(() => {});
      setSuccess(true);
    } catch (e) {
      console.error(e);
      setSubmitErr(lv.modal.errors.submit);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg bg-card rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative topo-bg text-white p-6">
          <TopoBg />
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            aria-label="Aizvērt"
          >
            <X size={22} />
          </button>
          <h2 className="text-2xl font-display font-extrabold text-white">{lv.modal.title}</h2>
          <p className="text-sm mt-2 text-white/70 max-w-md">{lv.modal.sub}</p>

          {product && (
            <div className="mt-4 flex items-center gap-3 bg-white/10 border border-white/15 rounded-xl px-3 py-2">
              <div className="w-9 h-9 rounded-md bg-accent/20 flex items-center justify-center text-accent">
                <Package size={18} />
              </div>
              <div className="text-sm">
                <div className="text-white/60 font-mono-spec text-[11px] uppercase tracking-widest">
                  {lv.modal.productLabel}
                </div>
                <div className="font-semibold text-white">{product.name}</div>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-soft text-green mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-ink mb-1">{lv.modal.success}</h3>
              <p className="text-muted text-sm">{lv.modal.successSub}</p>
              <button onClick={close} className="btn-ghost mt-6">Aizvērt</button>
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
                <textarea rows={3} className="input resize-none" {...form.register("message")} />
              </Field>

              <label className="flex items-start gap-2 text-sm text-muted cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 accent-[var(--accent)]"
                  {...form.register("gdpr_consent")}
                />
                <span>{lv.modal.fields.gdpr}</span>
              </label>
              {form.formState.errors.gdpr_consent && (
                <p className="text-xs text-destructive">{form.formState.errors.gdpr_consent.message as string}</p>
              )}

              {submitErr && <p className="text-sm text-destructive">{submitErr}</p>}

              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="btn-accent w-full justify-center mt-2"
              >
                {form.formState.isSubmitting ? "Sūta…" : lv.modal.submit}
              </button>
            </form>
          )}
        </div>
      </div>

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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-mono-spec uppercase tracking-wider text-muted mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
