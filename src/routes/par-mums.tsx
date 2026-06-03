import { createFileRoute } from "@tanstack/react-router";
import { lv } from "@/lib/i18n";
import { useRequestModal } from "@/components/request-modal-context";

export const Route = createFileRoute("/par-mums")({
  head: () => ({ meta: [{ title: "Par mums | geobalt.lv" }] }),
  component: AboutPage,
});

function AboutPage() {
  const { openModal } = useRequestModal();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="kicker mb-3">Par mums</div>
      <h1 className="text-4xl md:text-5xl mb-6">Inženieriska precizitāte. Praktiska pieredze.</h1>
      <p className="text-lg text-muted leading-relaxed">
        geobalt.lv ir profesionāla ģeodēzijas aprīkojuma piegādātājs Baltijā. Mūsu komanda strādā ar mērniekiem, ceļabūves un mežsaimniecības uzņēmumiem kopš 2010. gada, palīdzot izvēlēties pareizo instrumentu katram uzdevumam.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {[
          { t: "15+ gadu", d: "Pieredze tirgū" },
          { t: "500+", d: "Apmierinātu klientu" },
          { t: "6 zīmoli", d: "Oficiāla pārstāvniecība" },
        ].map((x) => (
          <div key={x.t} className="bg-card border border-line rounded-2xl p-6">
            <div className="font-display font-black text-3xl text-accent">{x.t}</div>
            <div className="text-muted text-sm mt-1 font-mono-spec">{x.d}</div>
          </div>
        ))}
      </div>
      <button onClick={() => openModal()} className="btn-accent mt-12">{lv.cta.contactUs}</button>
    </div>
  );
}
