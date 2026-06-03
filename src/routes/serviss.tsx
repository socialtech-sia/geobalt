import { createFileRoute } from "@tanstack/react-router";
import { Wrench, Calendar, ShieldCheck } from "lucide-react";
import { lv } from "@/lib/i18n";
import { useRequestModal } from "@/components/request-modal-context";

export const Route = createFileRoute("/serviss")({
  head: () => {
    const title = "Serviss un kalibrēšana | geobalt.lv";
    const description = "Tehniskais serviss, sertificēta kalibrēšana un aizvietošanas tehnika visam mūsu piegādātajam ģeodēzijas aprīkojumam.";
    const url = "https://geobalt.lv/serviss";
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
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { openModal } = useRequestModal();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="kicker mb-3">Serviss</div>
      <h1 className="text-4xl md:text-5xl mb-6">Serviss, kalibrēšana un atbalsts</h1>
      <p className="text-lg text-muted max-w-3xl">
        Mēs apkopjam, kalibrējam un labojam visu mūsu piegādāto aprīkojumu. Steidzamiem gadījumiem — iznomājama tehnika servisa laikā.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {[
          { I: Wrench, t: "Tehniskais serviss", d: "Diagnostika, remonts un programmatūras atjauninājumi visiem zīmoliem." },
          { I: ShieldCheck, t: "Kalibrēšana", d: "Sertificēta kalibrēšana ar protokolu — saskaņā ar ražotāja prasībām." },
          { I: Calendar, t: "Aizvietošanas tehnika", d: "Servisa laikā piedāvājam aizvietošanas aprīkojumu nomā." },
        ].map((x) => (
          <div key={x.t} className="bg-card border border-line rounded-2xl p-6">
            <x.I className="text-accent mb-4" size={28} />
            <h3 className="text-xl mb-2">{x.t}</h3>
            <p className="text-muted text-sm">{x.d}</p>
          </div>
        ))}
      </div>
      <button onClick={() => openModal()} className="btn-accent mt-12">{lv.cta.contactUs}</button>
    </div>
  );
}
