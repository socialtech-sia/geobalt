import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sikdatnes")({
  head: () => ({
    meta: [
      { title: "Sīkdatņu politika | geobalt.lv" },
      { name: "description", content: "geobalt.lv sīkdatņu politika — kādas sīkdatnes mēs izmantojam un kādas ir Tavas izvēles iespējas." },
      { property: "og:title", content: "Sīkdatņu politika | geobalt.lv" },
      { property: "og:description", content: "Sīkdatņu politika un piekrišanas pārvaldība." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "/sikdatnes" },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="kicker mb-3">Juridiska informācija</div>
      <h1 className="text-4xl md:text-5xl mb-6">Sīkdatņu politika</h1>
      <p className="text-lg text-muted leading-relaxed">
        Šī sīkdatņu politika izskaidro, kādas sīkdatnes (cookies) un līdzīgas tehnoloģijas tiek izmantotas tīmekļa vietnē geobalt.lv, kādam nolūkam, un kādas ir Tavas izvēles iespējas to pārvaldībā.
      </p>

      <Section title="Kas ir sīkdatnes?">
        <p>
          Sīkdatnes ir mazas teksta datnes, kuras interneta pārlūkprogramma saglabā Tavas ierīces atmiņā, apmeklējot tīmekļa vietnes. Tās palīdz vietnei atcerēties Tavas izvēles (valoda, reģions, pieteikšanās dati) un uzlabot lietošanas pieredzi. Dažas sīkdatnes ir nepieciešamas vietnes pamatfunkciju darbībai, bet citas tiek izmantotas analītikas vai mārketinga nolūkos.
        </p>
      </Section>

      <Section title="Kādas sīkdatnes mēs izmantojam">
        <div className="space-y-4 mt-3">
          <CookieCategory
            name="Nepieciešamās sīkdatnes"
            desc="Šīs sīkdatnes ir obligātas vietnes pamatfunkciju darbībai — navigācijai, drošībai un pieprasījumu apstrādei. Bez tām vietne nevar pilnvērtīgi funkcionēt."
            examples={["session_storage", "csrf_token", "consent_status"]}
            required
          />
          <CookieCategory
            name="Statistikas sīkdatnes"
            desc="Šīs sīkdatnes palīdz mums saprast, kā apmeklētāji mijiedarbojas ar vietni — kuras lapas ir populārākās, cik ilgi lietotāji uzturas vietnē. Dati tiek vākti anonīmi."
            examples={["_ga, _gid (Google Analytics)", "_gat (Google Analytics trottle)"]}
          />
          <CookieCategory
            name="Funkcionālās sīkdatnes"
            desc="Šīs sīkdatnes ļauj vietnei atcerēties Tavas izdarītās izvēles (piemēram, valodu vai reģionu), lai nodrošinātu personalizētāku un ērtāku pieredzi."
            examples={["language_preference", "region_setting"]}
          />
          <CookieCategory
            name="Mārketinga sīkdatnes"
            desc="Šīs sīkdatnes tiek izmantotas, lai rādītu Tev atbilstošas reklāmas un novērtētu reklāmas kampaņu efektivitāti. Pašlaik geobalt.lv šādas sīkdatnes neizmanto."
            examples={["Nav aktīvas"]}
          />
        </div>
      </Section>

      <Section title="Trešo pušu sīkdatnes">
        <p>
          Pašlaik geobalt.lv neizmanto trešo pušu mārketinga vai izsekojošās sīkdatnes. Analītikas datu vākšanai (ja tiks aktivizēta nākotnē) tiks izmantoti tikai GDPR-atbilstīgi pakalpojumu sniedzēji ar noslēgtiem datu apstrādes līgumiem.
        </p>
      </Section>

      <Section title="Kā pārvaldīt sīkdatnes?">
        <p>Tu vari jebkurā laikā:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Mainīt savu piekrišanu, izmantojot sīkdatņu pārvaldības paneli (bannera apakšā vietnē);</li>
          <li>Dzēst jau saglabātās sīkdatnes, izmantojot pārlūka iestatījumus;</li>
          <li>Iestatīt pārlūku tā, lai tas automātiski noraidītu visas sīkdatnes vai brīdinātu pirms to saglabāšanas.</li>
        </ul>
        <p className="mt-2">
          Lūdzu, ņem vērā, ka nepieciešamo sīkdatņu atspējošana var ietekmēt vietnes pamatfunkciju darbību.
        </p>
      </Section>

      <Section title="Sīkdatņu glabāšanas termiņi">
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Sesijas sīkdatnes — tiek dzēstas, aizverot pārlūkprogrammu;</li>
          <li>Persistent sīkdatnes — glabājas no 30 dienām līdz 2 gadiem (atkarībā no kategorijas);</li>
          <li>Piekrišanas preferences — 12 mēneši, pēc tam pieprasām atkārtotu piekrišanu.</li>
        </ul>
      </Section>

      <Section title="Kontaktinformācija">
        <p>Ja Tev ir jautājumi par sīkdatņu lietošanu, sazinies ar mums:</p>
        <p className="mt-1">E-pasts: info@geobalt.lv</p>
        <p>Tālrunis: +371 2000 0000</p>
      </Section>

      <p className="mt-10 text-sm text-muted font-mono-spec">Pēdējoreiz atjaunināts: 2026. gada 3. jūnijs.</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-display font-extrabold text-ink mb-2">{title}</h2>
      <div className="text-muted leading-relaxed">{children}</div>
    </div>
  );
}

function CookieCategory({
  name,
  desc,
  examples,
  required,
}: {
  name: string;
  desc: string;
  examples: string[];
  required?: boolean;
}) {
  return (
    <div className="bg-card border border-line rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-ink text-sm">{name}</h3>
        {required && (
          <span className="text-[10px] font-mono-spec uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded">
            Obligāta
          </span>
        )}
      </div>
      <p className="text-sm text-muted mt-1 leading-relaxed">{desc}</p>
      <div className="mt-2">
        <span className="text-[10px] font-mono-spec uppercase tracking-wider text-muted">Piemēri:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {examples.map((ex) => (
            <span key={ex} className="text-xs font-mono-spec bg-paper border border-line rounded px-2 py-0.5 text-muted">
              {ex}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
