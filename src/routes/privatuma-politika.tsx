import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privatuma-politika")({
  head: () => ({
    meta: [
      { title: "Privātuma politika | geobalt.lv" },
      { name: "description", content: "geobalt.lv privātuma politika — kā mēs vācam, izmantojam un aizsargājam Tavu personisko informāciju." },
      { property: "og:title", content: "Privātuma politika | geobalt.lv" },
      { property: "og:description", content: "geobalt.lv privātuma politika." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "/privatuma-politika" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="kicker mb-3">Juridiska informācija</div>
      <h1 className="text-4xl md:text-5xl mb-6">Privātuma politika</h1>
      <p className="text-lg text-muted leading-relaxed">
        Šī privātuma politika apraksta, kā SIA „geobalt” (reģ. Nr. 40101010101, juridiskā adrese: Brīvības iela 100, Rīga, LV-1011) vāc, apstrādā un aizsargā lietotāju personiskos datus, izmantojot mūsu tīmekļa vietni geobalt.lv un saistītās pakalpojumu sniegšanas procesā.
      </p>

      <Section num="1" title="Datu pārzinis un kontaktinformācija">
        <p>Datu pārzinis: SIA „geobalt”.</p>
        <p>Reģistrācijas numurs: 40101010101.</p>
        <p>Juridiskā adrese: Brīvības iela 100, Rīga, LV-1011.</p>
        <p>E-pasts: info@geobalt.lv.</p>
        <p>Tālrunis: +371 2000 0000.</p>
      </Section>

      <Section num="2" title="Kādus datus mēs vācam">
        <p>Mēs varam vākt šādu kategoriju datus:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Vārds, uzvārds, uzņēmuma nosaukums;</li>
          <li>Kontaktinformācija (e-pasta adrese, tālruņa numurs);</li>
          <li>Produkta interese (kura produkta lapu apmeklēji vai kādu aprīkojumu pieprasīji);</li>
          <li>Tehniskie dati (IP adrese, pārlūka veids, ierīces tips, apmeklējuma laiks un datums);</li>
          <li>Saziņas vēsture un pieprasījumi par piedāvājumiem.</li>
        </ul>
      </Section>

      <Section num="3" title="Datu vākšanas mērķi un tiesiskais pamats">
        <p>Personiskie dati tiek apstrādāti šādos nolūkos:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Lai sagatavotu un nosūtītu personalizētu piedāvājumu par pieprasīto produktu (piekrišana — GDPR 6. panta 1. punkta a) apakšpunkts);</li>
          <li>Lai sazinātos ar Tevi saistībā ar pieprasījumu vai pasūtījumu (līguma izpilde — GDPR 6. panta 1. punkta b) apakšpunkts);</li>
          <li>Lai nodrošinātu tīmekļa vietnes funkcionalitāti un drošību (legitīmas intereses — GDPR 6. panta 1. punkta f) apakšpunkts);</li>
          <li>Lai izpildītu ar mums saistītās juridiskās saistības (juridisks pienākums — GDPR 6. panta 1. punkta c) apakšpunkts).</li>
        </ul>
      </Section>

      <Section num="4" title="Sīkdatnes (cookies)">
        <p>Mūsu vietne izmanto sīkdatnes, lai nodrošinātu pareizu funkcionalitāti un uzlabotu lietotāja pieredzi. Vairāk informācijas par sīkdatņu lietošanu skatāms <Link to="/sikdatnes" className="text-accent hover:underline">Sīkdatņu politikā</Link>.</p>
      </Section>

      <Section num="5" title="Datu glabāšanas periods">
        <p>Personiskie dati tiek glabāti tik ilgi, cik tas nepieciešams atbilstoši datu apstrādes mērķim:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Piedāvājumu pieprasījumu dati — līdz 2 gadiem pēc pēdējās saziņas;</li>
          <li>Saziņas vēsture — līdz 3 gadiem;</li>
          <li>Tehniskie dati (IP, pārlūka dati) — līdz 12 mēnešiem.</li>
        </ul>
      </Section>

      <Section num="6" title="Tavu tiesību aizsardzība">
        <p>Saskaņā ar GDPR Tev ir šādas tiesības:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Tiesības piekļūt saviem datiem (datu kopijas saņemšana);</li>
          <li>Tiesības labot neprecīzus vai nepilnīgus datus;</li>
          <li>Tiesības dzēst datus ("tiesības tikt aizmirstam");</li>
          <li>Tiesības ierobežot datu apstrādi;</li>
          <li>Tiesības iebilst pret datu apstrādi;</li>
          <li>Tiesības uz datu pārnesamību;</li>
          <li>Tiesības atsaukt piekrišanu datu apstrādei jebkurā laikā.</li>
        </ul>
        <p className="mt-2">Tiesību īstenošanai sazinies ar mums, rakstot uz info@geobalt.lv. Ja uzskati, ka Tavu datu apstrāde pārkāpj normatīvos aktus, Tev ir tiesības iesniegt sūdzību <a href="https://www.dvi.gov.lv" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Datu valsts inspekcijā</a>.</p>
      </Section>

      <Section num="7" title="Datu pārsūtīšana trešajām pusēm">
        <p>Mēs nepārdodam un nenododam Tavu personisko informāciju trešajām pusēm mārketinga nolūkos. Dati var tikt nodoti:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>IT pakalpojumu sniedzējiem (hostings, e-pasta serviss), kas darbojas kā datu apstrādātāji saskaņā ar līgumu;</li>
          <li>Juridiskiem un grāmatvedības pakalpojumu sniedzējiem atbilstoši normatīvajiem aktiem;</li>
          <li>Valsts iestādēm, ja tas nepieciešams saskaņā ar likumu.</li>
        </ul>
      </Section>

      <Section num="8" title="Izmaiņas privātuma politikā">
        <p>Mēs paturam tiesības atjaunināt šo privātuma politiku. Jebkuras izmaiņas stāsies spēkā tīmekļa vietnes publicēšanas brīdī. Ieteicams regulāri pārskatīt šo lapu, lai iepazītos ar aktuālo informāciju.</p>
      </Section>

      <p className="mt-10 text-sm text-muted font-mono-spec">Pēdējoreiz atjaunināts: 2026. gada 3. jūnijs.</p>
    </div>
  );
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-display font-extrabold text-ink mb-2">{num}. {title}</h2>
      <div className="text-muted leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
