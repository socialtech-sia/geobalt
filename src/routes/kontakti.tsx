import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { lv } from "@/lib/i18n";
import { useRequestModal } from "@/components/request-modal-context";

export const Route = createFileRoute("/kontakti")({
  head: () => ({ meta: [{ title: "Kontakti | geobalt.lv" }] }),
  component: ContactsPage,
});

function ContactsPage() {
  const { openModal } = useRequestModal();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="kicker mb-3">Kontakti</div>
      <h1 className="text-4xl md:text-5xl mb-10">Sazinies ar mums</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-5">
          <Row Icon={MapPin} label="Adrese" value={lv.footer.address} />
          <Row Icon={Phone} label="Tālrunis" value={lv.footer.phone} mono />
          <Row Icon={Mail} label="E-pasts" value={lv.footer.email} />
          <Row Icon={Clock} label="Darba laiks" value="P-Pk 9:00 – 18:00" />
          <div className="aspect-video bg-paper-2 border border-line rounded-2xl flex items-center justify-center text-muted">
            <MapPin size={48} className="opacity-30" />
          </div>
        </div>
        <div className="bg-card border border-line rounded-2xl p-8">
          <h2 className="text-2xl mb-4">Uzraksti mums</h2>
          <p className="text-muted mb-6 text-sm">Atstāj kontaktinformāciju — atbildēsim 1 darba dienas laikā.</p>
          <button onClick={() => openModal()} className="btn-accent w-full justify-center">Atvērt kontaktformu</button>
        </div>
      </div>
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
