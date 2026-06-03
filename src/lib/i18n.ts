export const lv = {
  brand: { name: "geobalt", tld: ".lv" },
  nav: {
    catalog: "Katalogs",
    gnss: "GNSS uztvērēji",
    controllers: "Lauka datori",
    levels: "Nivelieri & lāzeri",
    marking: "Marķēšana",
    accessories: "Aksesuāri",
    rent: "Noma",
    about: "Par mums",
    service: "Serviss",
    brands: "Zīmoli",
    contacts: "Kontakti",
    blog: "Blogs",
    search: "Meklēt…",
  },
  cta: {
    request: "Pieprasīt cenu",
    viewProduct: "Skatīt produktu",
    viewAll: "Viss katalogs",
    viewSolutions: "Skatīt risinājumus",
    learnMore: "Uzzināt vairāk",
    contactUs: "Sazināties",
    allArticles: "Visi raksti",
  },
  modal: {
    title: "Pieprasīt cenu",
    sub: "Atstāj kontaktus — sagatavosim personalizētu piedāvājumu 1 darba dienas laikā.",
    productLabel: "Pieprasījums par produktu",
    fields: {
      name: "Vārds",
      company: "Uzņēmums",
      email: "E-pasts",
      phone: "Tālrunis",
      message: "Komentārs",
      gdpr: "Piekrītu, ka mani dati tiek apstrādāti saskaņā ar privātuma politiku (GDPR).",
    },
    submit: "Nosūtīt pieprasījumu",
    success: "Pieprasījums nosūtīts!",
    successSub: "Sazināsimies ar Tevi 1 darba dienas laikā.",
    errors: {
      name: "Lūdzu, norādi vārdu",
      email: "Nepareiza e-pasta adrese",
      phone: "Lūdzu, norādi tālruni",
      gdpr: "Nepieciešama piekrišana",
      submit: "Neizdevās nosūtīt. Mēģini vēlreiz.",
    },
  },
  home: {
    industries: {
      heading: "Risinājumi pa nozarēm",
      sub: "Izvēlies savu nozari — parādīsim piemērotāko aprīkojumu.",
      merniec: {
        title: "Mērniecībai",
        desc: "RTK GNSS ar IMU. Trase, apjomi un kvalitātes kontrole.",
      },
      celabuve: {
        title: "Ceļabūvai",
        desc: "GNSS un tahimetri infrastruktūras projektiem.",
      },
      mezs: {
        title: "Mežsaimniecībai",
        desc: "GIS klases GNSS — robusts, ilga baterija.",
      },
    },
    popular: { heading: "Populārākie produkti" },
    reviews: { heading: "Klientu atsauksmes" },
    brandsHeading: "Mūsu zīmoli",
    blog: { heading: "Jaunumi" },
    promo: {
      kicker: "Akcija",
      title: "Pavasara akcija — SL900 komplekts",
      desc: "Pilns RTK komplekts ar Archer 4 kontrolieri par īpašu cenu.",
    },
  },
  catalog: {
    found: "Atrasti",
    products: "produkti",
    sortBy: "Kārtot pēc",
    sortPopular: "Populārākie",
    sortAccuracy: "Pēc precizitātes",
    sortNewest: "Jaunākie",
    filterIndustry: "Nozare",
    filterBrand: "Zīmols",
    filterIP: "Aizsardzība (IP)",
    filterAvailability: "Pieejamība",
    sale: "Pārdošanā",
    rent: "Noma",
    empty: "Pēc šiem filtriem nekas neatbilst.",
  },
  product: {
    priceOnRequest: "Cena pēc pieprasījuma",
    tabs: { desc: "Apraksts", specs: "Specifikācijas", set: "Komplektā" },
    related: "Tev varētu noderēt",
    setNote: "Standarta komplektā: uztvērējs, lādētājs, transportēšanas soma, lietošanas pamācība.",
  },
  spec: {
    accuracy: "Precizitāte",
    ip: "Aizsardzība",
    battery: "Baterija",
    weight: "Svars",
  },
  industry: {
    merniecība: "Mērniecība",
    celabuve: "Ceļabūve",
    mezsaimnieciba: "Mežsaimniecība",
  } as Record<string, string>,
  footer: {
    about: "Profesionāla ģeodēzijas aprīkojuma piegādātājs Baltijā kopš 2010. gada.",
    catalog: "Katalogs",
    company: "Uzņēmums",
    contacts: "Kontakti",
    address: "Brīvības iela 100, Rīga, LV-1011",
    phone: "+371 2000 0000",
    email: "info@geobalt.lv",
    sales: "pardosana@geobalt.lv",
    privacy: "Privātuma politika",
    cookies: "Sīkdatnes",
    gdpr: "GDPR",
    copyright: "© 2026 geobalt.lv",
  },
  breadcrumbs: { home: "Sākums" },
};

export type CategoryNavItem = {
  slug: string;
  label: string;
  subs?: { slug: string; label: string; hint?: string }[];
};

export const CATEGORY_NAV: CategoryNavItem[] = [
  {
    slug: "gnss",
    label: "GNSS uztvērēji",
    subs: [
      { slug: "mernieciba", label: "Mērniecībai", hint: "SL900, S950A" },
      { slug: "celabuve", label: "Ceļabūvei", hint: "SL900, S900A" },
      { slug: "mezsaimnieciba", label: "Mežsaimniecībai", hint: "SL7, EYR, S599" },
    ],
  },
  { slug: "lauka-datori", label: "Lauka datori" },
  {
    slug: "nivelieri-lazeri",
    label: "Nivelieri & lāzeri",
    subs: [
      { slug: "optiskie", label: "Optiskie", hint: "Titan TAL32, manuālie" },
      { slug: "lazeru", label: "Lāzeru", hint: "Rotācijas, līniju, punkta" },
    ],
  },
  { slug: "markesana", label: "Marķēšana" },
  { slug: "aksesuari", label: "Aksesuāri" },
  { slug: "noma", label: "Noma" },
];
