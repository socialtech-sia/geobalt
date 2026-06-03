import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gdpr")({
  head: () => ({
    meta: [
      { title: "GDPR informācija | geobalt.lv" },
      { name: "description", content: "GDPR — vispārīgā datu aizsardzības regula. Jūsu tiesības un pienākumi saskaņā ar ES datu aizsardzības normatīviem." },
      { property: "og:title", content: "GDPR informācija | geobalt.lv" },
      { property: "og:description", content: "GDPR datu aizsardzības informācija." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "/gdpr" },
    ],
  }),
  component: GDPRPage,
});

function GDPRPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="kicker mb-3">Juridiska informācija</div>
      <h1 className="text-4xl md:text-5xl mb-6">GDPR — Datu aizsardzība</h1>
      <p className="text-lg text-muted leading-relaxed">
        Šajā sadaļā sniegtas atbildes uz biežāk uzdotajiem jautājumiem par Vispārīgo datu aizsardzības regulu (GDPR) un to, kā mēs to ievērojam geobalt.lv darbībā.
      </p>

      <Section title="Kas ir GDPR?">
        <p>
          Vispārīgā datu aizsardzības regula (Regula (ES) 2016/679) ir Eiropas Savienības normatīvais akts, kas nosaka vienotus noteikumus fizisku personu datu aizsardzībai un apstrādei. Tā stājās spēkā 2018. gada 25. maijā un tiek piemērota visās ES dalībvalstīs, tostarp Latvijā.
        </p>
      </Section>

      <Section title="Tavas pamattiesības saskaņā ar GDPR">
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          {[
            { title: "Tiesības piekļūt", desc: "Tu vari lūgt informāciju par to, kādi Tavi dati tiek apstrādāti un kādiem nolūkiem." },
            { title: "Tiesības labot", desc: "Ja Tavi dati ir neprecīzi vai nepilnīgi, Tu vari pieprasīt to labošanu." },
            { title: "Tiesības dzēst", desc: "Tiesības pieprasīt savu datu dzēšanu (\u201etikt aizmirstam\u201c), ja nav citu juridisku pamatu to glabāšanai." },
            { title: "Tiesības ierobežot", desc: "Tu vari pieprasīt ierobežot datu apstrādi noteiktos apstākļos." },
            { title: "Tiesības pārnest", desc: "Tiesības saņemt savus datus strukturētā, parastā un mašīnlasāmā formātā." },
            { title: "Tiesības iebilst", desc: "Tu vari iebilst pret datu apstrādi, kas balstīta uz likumīgām interesēm vai tiešā mārketinga nolūkiem." },
          ].map((card) => (
            <div key={card.title} className="bg-card border border-line rounded-xl p-5">
              <h3 className="font-display font-bold text-ink text-sm">{card.title}</h3>
              <p className="text-sm text-muted mt-1 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Kā mēs aizsargājam Tavas datus">
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Datu pārraide tiek šifrēta, izmantojot SSL/TLS protokolu (HTTPS);</li>
          <li>Piekļuve datiem ir ierobežota un piešķirta tikai pilnvarotiem darbiniekiem;</li>
          <li>Tiek izmantotas tehniskas un organizatoriskas drošības pasākumi pret neatļautu piekļuvi, datu zudumu vai bojājumu;</li>
          <li>Datu apstrādes līgumi ar pakalpojumu sniedzējiem (datu apstrādātājiem) ir saskaņoti ar GDPR prasībām;</li>
          <li>Regulāri veicam drošības novērtējumus un sistēmu atjaunināšanu.</li>
        </ul>
      </Section>

      <Section title="Datu apstrādes reģistrs">
        <p>
          SIA „geobalt” uztur iekšējo datu apstrādes reģistru, kurā fiksēti datu apstrādes veidi, mērķi, tiesiskie pamati, datu kategorijas, saņēmēji un glabāšanas termiņi. Šis reģistrs ir pieejams pārbaudēm Datu valsts inspekcijai.
        </p>
      </Section>

      <Section title="Sūdzību iesniegšana">
        <p>
          Ja uzskati, ka Tavu personisko datu apstrāde neatbilst GDPR prasībām, Tev ir tiesības iesniegt sūdzību Latvijas Republikas <a href="https://www.dvi.gov.lv" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Datu valsts inspekcijā</a> — Elijas ielā 17, Rīga, LV-1050, vai elektroniski, izmantojot DVI e-pakalpojumu sistēmu.
        </p>
      </Section>

      <Section title="Kontakti datu aizsardzības jautājumos">
        <p>Datu aizsardzības speciālists: SIA „geobalt" juridiskā nodaļa.</p>
        <p>E-pasts: info@geobalt.lv</p>
        <p>Tālrunis: +371 2000 0000</p>
        <p>Darba laiks: P-Pk 9:00 – 18:00</p>
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
