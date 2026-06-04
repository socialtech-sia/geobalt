import { useEffect } from "react";
import { X, Phone, Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { useRequestModal } from "./request-modal-context";
import type { SiteSettings } from "@/lib/useSiteSettings";

type Props = {
  open: boolean;
  onClose: () => void;
  settings: SiteSettings;
};

export function PromoModal({ open, onClose, settings }: Props) {
  const { openModal } = useRequestModal();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const title = settings.promo_title_lv || "Akcija";
  const text = settings.promo_text_lv || "";
  const image = settings.promo_image_url;
  const phone = settings.contact_phone || "";
  const email = settings.contact_email || "";
  const waDigits = phone.replace(/[^\d]/g, "");
  const waUrl = waDigits ? `https://wa.me/${waDigits}` : "";
  const subject = encodeURIComponent(`Jautājums par akciju: ${title}`);
  const mailUrl = email ? `mailto:${email}?subject=${subject}` : "";

  // Split text into paragraphs / bullets by lines
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-card rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center"
          aria-label="Aizvērt"
        >
          <X size={20} />
        </button>

        {image && (
          <div className="w-full bg-ink/5">
            <img
              src={image}
              alt={title}
              className="w-full max-h-[420px] object-contain bg-black/5"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="kicker mb-2">Akcija</div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-ink mb-4">
            {title}
          </h2>

          {lines.length > 0 && (
            <div className="space-y-2 text-muted text-[15px] leading-relaxed mb-6">
              {lines.map((l, i) =>
                /^[-•*]\s?/.test(l) ? (
                  <div key={i} className="flex gap-2">
                    <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                    <span>{l.replace(/^[-•*]\s?/, "")}</span>
                  </div>
                ) : (
                  <p key={i}>{l}</p>
                ),
              )}
            </div>
          )}

          <div className="border-t border-line pt-5">
            <div className="text-xs font-mono-spec uppercase tracking-wider text-muted mb-3">
              Sazināties par akciju
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  onClose();
                  openModal({ name: title });
                }}
                className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-paper hover:border-accent hover:text-accent transition-colors py-3 px-2 text-sm font-semibold"
              >
                <Send size={18} />
                <span>Pieprasījums</span>
              </button>

              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-paper hover:border-accent hover:text-accent transition-colors py-3 px-2 text-sm font-semibold"
                >
                  <Phone size={18} />
                  <span>Zvanīt</span>
                </a>
              )}

              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-paper hover:border-accent hover:text-accent transition-colors py-3 px-2 text-sm font-semibold"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </a>
              )}

              {mailUrl && (
                <a
                  href={mailUrl}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-paper hover:border-accent hover:text-accent transition-colors py-3 px-2 text-sm font-semibold"
                >
                  <Mail size={18} />
                  <span>E-pasts</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
