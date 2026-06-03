import { useEffect, useState } from "react";
import { X, Cookie, Settings2, Shield } from "lucide-react";

const STORAGE_KEY = "geobalt_cookie_consent";

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: number;
};

const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  functional: false,
  marketing: false,
  timestamp: 0,
};

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConsentState;
        // Request again after 12 months
        const twelveMonths = 365 * 24 * 60 * 60 * 1000;
        if (Date.now() - parsed.timestamp > twelveMonths) {
          setVisible(true);
        }
      } else {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (partial: Partial<ConsentState>) => {
    const next: ConsentState = { ...consent, ...partial, timestamp: Date.now() };
    setConsent(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setVisible(false);
    setExpanded(false);
  };

  const acceptAll = () => save({ necessary: true, analytics: true, functional: true, marketing: true });
  const acceptSelected = () => save({});
  const acceptNecessary = () => save({ necessary: true, analytics: false, functional: false, marketing: false });

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] md:left-auto md:right-4 md:w-[28rem]">
      <div className="bg-card border border-line rounded-2xl shadow-2xl p-5">
        {/* Compact view */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Cookie size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-display font-extrabold text-ink">Sīkdatnes</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Mēs izmantojam sīkdatnes, lai nodrošinātu vietnes pamatfunkcijas un uzlabotu Tavu pieredzi. Uzzini vairāk mūs{""}
              <a href="/sikdatnes" className="text-accent hover:underline">Sīkdatņu politikā</a>.
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-muted hover:text-ink shrink-0"
            aria-label="Aizvērt"
          >
            <X size={16} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-nowrap gap-2 mt-4">
          <button onClick={acceptAll} className="btn-accent text-xs py-2 px-4">
            Piekrītu visām
          </button>
          <button onClick={() => setExpanded((v) => !v)} className="btn-ghost text-xs py-2 px-4">
            <Settings2 size={13} className="mr-1" />
            {expanded ? "Aizvērt iestatījumus" : "Pielāgot"}
          </button>
          <button onClick={acceptNecessary} className="btn-ghost text-xs py-2 px-4">
            <Shield size={13} className="mr-1" />
            Tikai nepieciešamās
          </button>
        </div>

        {/* Expanded settings */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-line space-y-3">
            <ConsentToggle
              label="Nepieciešamās"
              desc="Vietnes pamatfunkciju darbībai — navigācija, drošība, pieprasījumu apstrāde."
              checked={consent.necessary}
              disabled
            />
            <ConsentToggle
              label="Statistikas"
              desc="Anonīma statistika par vietnes lietošanu, lai mēs varētu to uzlabot."
              checked={consent.analytics}
              onChange={(v) => setConsent((c) => ({ ...c, analytics: v }))}
            />
            <ConsentToggle
              label="Funkcionālās"
              desc="Valodas preferences un citi iestatījumi personalizētai pieredzei."
              checked={consent.functional}
              onChange={(v) => setConsent((c) => ({ ...c, functional: v }))}
            />
            <ConsentToggle
              label="Mārketinga"
              desc="Reklāmu pielāgošana un mārketinga kampaņu mērīšana (pašlaik neaktīvi)."
              checked={consent.marketing}
              onChange={(v) => setConsent((c) => ({ ...c, marketing: v }))}
            />
            <button onClick={acceptSelected} className="btn-accent text-xs py-2 px-4 w-full justify-center mt-2">
              Saglabāt izvēli
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ConsentToggle({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 accent-[var(--accent)] disabled:opacity-40"
      />
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="text-xs text-muted">{desc}</div>
      </div>
    </div>
  );
}
