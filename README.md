# geobalt.lv

# LOVABLE — geobalt.lv (geodesy equipment catalog)

> **Goal:** Build a multi-page B2B catalog website for geodetic / surveying equipment.
> **No direct sales / no checkout.** Every product action is a **lead request** ("Pieprasīt cenu") — visitor leaves contact data, we email the request via Resend.
> **UI language:** Latvian (LV) only for now (i18n-ready structure).
> Build the **frontend in Lovable** (React + TypeScript + Tailwind + shadcn/ui). Connect to **Supabase** for data. The Resend email-sending lives in a Supabase Edge Function (spec at the end — can be implemented separately).

---

## 1. PROJECT BRIEF

geobalt.lv is a catalog of professional surveying instruments (GNSS receivers, field controllers, optical/laser levels, marking tools, accessories, rental). Audience: surveyors, road-construction and forestry professionals, engineering companies in the Baltics.

The site must feel **technical, precise and trustworthy** — like an engineering tool, not a generic e-shop. Conversion goal: get a qualified **lead request** for a product.

---

## 2. TECH & CONVENTIONS

- React + TypeScript + Vite (Lovable default), Tailwind CSS, shadcn/ui, lucide-react icons.
- React Router for pages.
- Supabase client for data (products, categories, brands, reviews, blog, leads).
- Forms: react-hook-form + zod validation.
- All content strings centralized so a future LV/RU/EN switch is trivial (single `lv` object now).
- Mobile-first, fully responsive.
- Clean SEO: per-page `<title>`, meta description, semantic headings, descriptive alt text.

---

## 3. DESIGN SYSTEM (use these exact tokens)

**Aesthetic direction:** technical-industrial with a "topographic survey map" character. Warm paper background, surveyor-orange accent, topo-green for industry blocks. Subtle topographic contour-line texture in dark sections (hero, footer, modal header).

### Colors (CSS variables / Tailwind theme)
```
--ink:        #0E1A22   /* dark slate — header, footer, dark blocks, headings */
--ink-soft:   #15252F
--paper:      #F5F1E8   /* page background (warm) */
--paper-2:    #EFE9DC   /* alt sections, brand strip */
--card:       #FBF8F1   /* cards */
--accent:     #E2570C   /* surveyor orange — CTAs, links, active states */
--accent-d:   #C2480A   /* hover */
--green:      #2C6E5E   /* industry / solutions */
--green-soft: #E4ECE6
--amber-soft: #F6EAD2   /* promo banner */
--text:       #23323A
--muted:      #5C6B72
--line:       #DAD2C2   /* borders on light */
```
Dark sections use `--ink` bg with light text (#EDE7D8 / muted #9AA7A8).

### Typography (Google Fonts)
- **Display / headings:** `Archivo` (weights 700–900, tight letter-spacing).
- **Body / UI:** `IBM Plex Sans` (400–700).
- **Technical values, spec labels, prices, phone:** `IBM Plex Mono` — use it for all spec numbers (8 mm, IP67, 16 h, 1.2 kg), kickers, breadcrumbs. This monospace = the "engineering" signature, use it deliberately.

### Shape & depth
- Radius: cards 16px, large cards/hero visual 18px, buttons 11px, pills 30px.
- Shadows: soft default `0 12px 30px -12px rgba(14,26,34,.18)`; hover lift `0 24px 60px -20px rgba(14,26,34,.35)`.
- Card hover: `translateY(-4px)` + shadow + border turns `--accent` (products) or `--green` (industry).

### Topographic texture
Add a subtle SVG contour-line background (orange lines, ~14% opacity) to: hero, footer, modal header. (Layered curved `<path>` lines, inline SVG data-URI or a reusable `<TopoBg/>` component.)

### Buttons
- `btn-accent` — orange fill, white text (primary CTA: "Pieprasīt cenu", "Skatīt produktu").
- `btn-ghost` — outline ink, fills on hover (secondary).
- `btn-light` — translucent white on dark backgrounds.

### Spec icons (lucide or inline SVG), always paired with mono value:
- **Precizitāte (mm)** → target / crosshair icon
- **Aizsardzība (IP)** → shield / droplet icon
- **Baterija (h)** → battery icon
- **Svars (kg)** → weight icon

---

## 4. DATA MODEL (Supabase)

```
categories
  id (uuid pk) · slug · name_lv · description_lv · icon · sort_order

brands
  id · slug · name · logo_url

products
  id · slug · name · brand_id (fk) · category_id (fk)
  short_desc_lv · full_desc_lv (markdown)
  industry (enum: mernieciba | celabuve | mezsaimnieciba)  -- can be array
  ip_class (text)            -- "IP67"
  accuracy (text)            -- "8 mm + 1 ppm"
  battery_h (text)           -- "16 h"
  weight_kg (text)           -- "1.2 kg"
  is_popular (bool) · is_available_sale (bool) · is_available_rent (bool)
  sort_order · created_at

product_images
  id · product_id (fk) · url · is_primary (bool) · sort_order

product_specs            -- full spec table for product page
  id · product_id (fk) · label_lv · value · sort_order

reviews
  id · author_name · author_role_lv · company · quote_lv · industry · sort_order

blog_posts
  id · slug · title_lv · tag_lv · excerpt_lv · cover_url · published_at

leads                    -- captured requests
  id · created_at
  product_id (fk, nullable)   -- null = general inquiry
  product_name (text snapshot)
  full_name · company · email · phone · message · gdpr_consent (bool)
  source_page (text) · status (default 'new')
```
RLS: `leads` — allow anon `insert` only (no select). All catalog tables — anon `select` (published only).

---

## 5. ROUTES / PAGES

```
/                      Home (sections 1–9)
/katalogs/:category    Catalog / category listing (grid + filters)
/produkts/:slug        Product detail
/par-mums              About (static)
/serviss               Service (static)
/zimoli                Brands (logo grid + short blurbs)
/kontakti              Contacts (info + form)
/blogs                 Blog list
/blogs/:slug           Blog article (template, placeholder)
```
Global: sticky **Header** + **Footer** on every page. A reusable **RequestModal** ("Pieprasīt cenu") mountable from anywhere with optional product context.

---

## 6. GLOBAL COMPONENTS

### Header (sticky, `--ink` background)
- Logo: `GEO` (light) + `BALT` (orange) + `.lv` (small mono, muted).
- Main nav (mono-ish, 13.5px): GNSS uztvērēji · Lauka datori · Nivelieri & lāzeri · Marķēšana · Aksesuāri · Noma → link to `/katalogs/:category`.
- Right: search field ("Meklēt…"), phone `+371 …` (orange mono), language pill `LV ▾`.
- Mobile: collapse nav into a hamburger drawer; hide search + phone label.

### Footer (`--ink`, topo texture)
4 columns: (1) logo + short about + social icons; (2) Katalogs links; (3) Uzņēmums: Par mums / Serviss / Zīmoli / Blogs / Kontakti; (4) Kontakti: address, phone (mono), email + a "Sazināties" button (opens RequestModal as general inquiry).
Bottom bar: `© 2026 geobalt.lv` · `Privātuma politika · Sīkdatnes · GDPR`.

### RequestModal — "Pieprasīt cenu"
- Dark header (topo texture): title "Pieprasīt cenu", sub "Atstāj kontaktus — sagatavosim personalizētu piedāvājumu 1 darba dienas laikā."
- If opened from a product: show a small product pill (mini image + name + "Pieprasījums par produktu").
- Fields: **Vārds*** , Uzņēmums, **E-pasts*** , **Tālrunis*** , Komentārs (textarea), GDPR checkbox* ("Piekrītu, ka mani dati tiek apstrādāti saskaņā ar privātuma politiku (GDPR).").
- Validation (zod): name required, valid email, phone required, gdpr must be true.
- On submit → insert into `leads` **and** call Edge Function `send-lead-email` (Resend). Show success state inside modal (green check, "Pieprasījums nosūtīts!").
- Close on overlay click / × / Esc.

---

## 7. HOMEPAGE — sections (in order)

**1. Header** — as above (sticky).

**2. Hero banner** — dark `--ink`, topo texture, split 2-col (text left, circular product-photo placeholder right). Auto-rotating carousel of **5 slides**, ~4s interval, with progress dots (active dot elongates, orange) + "slaids X no 5" counter. Each slide: small pill tag (industry/news), big product H1, sub-text, 3 mono spec chips. Buttons: `Skatīt produktu` (→ product), `Viss katalogs` (→ catalog). Pull slides from `products where is_popular order by sort_order limit 5`.

**3. Risinājumi pa nozarēm** — *most important block after hero.* 3 large cards (green-tinted on hover, lift, arrow "Skatīt risinājumus →"):
- **Mērniecībai** — "RTK GNSS ar IMU. Trase, apjomi un kvalitātes kontrole."
- **Ceļabūvai** — "GNSS un tahimetri infrastruktūras projektiem."
- **Mežsaimniecībai** — "GIS klases GNSS — robusts, ilga baterija."
Each → `/katalogs/...` filtered by industry.

**4. Populārākie produkti** — heading + "Viss katalogs →". Grid of **4** product cards. Card = photo placeholder (brand tag top-left), name, category line, 2×2 spec grid with icons (accuracy / IP / battery / weight, mono values), full-width "Pieprasīt cenu" ghost button (stops propagation; card itself → product page). Data: `products where is_popular limit 4`.

**5. Promo baneri** — `--amber-soft` banner, 3-col (image placeholder / text / button). Editable promo: e.g. "Pavasara akcija — SL900 komplekts". Button "Uzzināt vairāk". Empty/optional by default.

**6. Klientu atsauksmes** — heading + 2–3 review cards (carousel on mobile). Card: large quote mark, italic quote, avatar (initials in green circle), name (Archivo bold), role · company. Data from `reviews`.

**7. Zīmoli** — `--paper-2` strip, brand wordmarks in muted Archivo, hover → ink. (Satlab, Stonex, Juniper, Getac, Trig-A-Cap, Carlson.) Data from `brands`.

**8. Jaunumi / Blogs** — heading + "Visi raksti →" + 3 blog cards (cover placeholder, mono tag, title, "X min lasīšana · 2026"). SEO/authority. Data from `blog_posts limit 3`.

**9. Footer** — as above.

---

## 8. CATALOG PAGE `/katalogs/:category`

- Breadcrumb (mono): `Sākums / {category name}`.
- Category header: H1 + description paragraph.
- 2-col layout: **sticky filter sidebar** + product grid (3 cols desktop → 2 → 1).
- **Filters (sidebar, MVP — required):**
  - **Nozare:** Mērniecība / Ceļabūve / Mežsaimniecība (checkboxes, with counts)
  - **Zīmols:** Satlab / Stonex / Juniper / … (from brands)
  - **Aizsardzība (IP):** IP67 / IP68 / …
  - **Pieejamība:** Pārdošanā / Noma
  - Filters update the grid client-side (or via Supabase query). Show active count.
- Toolbar above grid: result count ("Atrasti N produkti") + sort select (Populārākie / Pēc precizitātes / Jaunākie).
- Product cards: same component as homepage section 4.
- Empty state if no matches.

---

## 9. PRODUCT DETAIL PAGE `/produkts/:slug`

- Breadcrumb: `Sākums / {category} / {product}`.
- **Top, 2-col:**
  - **Left — gallery:** large square main image (placeholder) + row of thumbnails (clickable, active = orange border). From `product_images`.
  - **Right — info:** brand·category line (orange mono), H1 name, lead paragraph, **spec card** (2×2) with 4 icon specs (accuracy / IP / battery / weight), then a **dark price box**: "Cena pēc pieprasījuma" + big **"Pieprasīt cenu"** button (opens RequestModal with this product).
- **Tabs:** `Apraksts` / `Specifikācijas` (full table from `product_specs`) / `Komplektā`.
- **Related products:** "Tev varētu noderēt" — 4 cards (same category, exclude current).
- Sticky mini-CTA bar on mobile (product name + "Pieprasīt cenu").

---

## 10. STATIC PAGES

- **/par-mums** — company story, values, why geobalt (placeholder copy), CTA to contact.
- **/serviss** — service & calibration offering (placeholder), CTA.
- **/zimoli** — brand grid with short blurb per brand + link to filtered catalog.
- **/kontakti** — address, phone, email, working hours, embedded map placeholder, + inline contact form (same fields as RequestModal, general inquiry).
- **/blogs** + **/blogs/:slug** — list + article template (cover, title, body markdown, related).

---

## 11. LEAD REQUEST FLOW (email via Resend)

**Frontend (Lovable):** on RequestModal / contact form submit:
1. `insert` row into `leads` (snapshot product_name, source_page).
2. Invoke Supabase Edge Function `send-lead-email`.
3. Success UI regardless of email latency (don't block on email; show success once insert ok).

**Edge Function `send-lead-email` (Supabase + Resend) — spec for backend:**
- Trigger: invoked from client with the lead payload (or DB webhook on `leads` insert).
- Sends an email via **Resend API** to the sales inbox (e.g. `pardosana@geobalt.lv`) with: product, name, company, email, phone, message, source page, timestamp.
- Set `from` to a verified geobalt.lv domain sender; `reply-to` = lead's email.
- Optional: send an auto-confirmation email to the lead ("Paldies, sazināsimies 1 d.l. laikā").
- Keep `RESEND_API_KEY` in Supabase secrets.

> Note: per our convention this Edge Function is a **backend** task — implement it via Claude Code (`CLAUDE_CODE_geobalt_send_lead_email.md`). Lovable should only call it and handle the response/UI.

---

## 12. RESPONSIVE / SEO / I18N

- Breakpoints: ≥980 desktop (3–4 col grids), 620–980 tablet (2 col), <620 mobile (1 col); hero stacks, visual hidden on small.
- All copy in a single `lv` strings object; structure ready for `ru`/`en` later (language pill non-functional placeholder for now, but wired to a `lang` state).
- SEO: unique title/description per page; product pages `Satlab SL900 — RTK GNSS uztvērējs | geobalt.lv`; semantic `

` once per page; image alt = product name; sitemap-friendly slugs.

---

## 13. PLACEHOLDER SEED DATA

Use these placeholder products (image = styled placeholder block with device-silhouette icon + brand tag):

| Name | Brand | Category | Industry | Accuracy | IP | Battery | Weight |
|---|---|---|---|---|---|---|---|
| Satlab SL900 | Satlab | GNSS | Mērniecība | 8 mm + 1 ppm | IP67 | 16 h | 1.2 kg |
| Satlab S950A | Satlab | GNSS | Mērniecība | 8 mm | IP67 | 16 h | 1.1 kg |
| Stonex S900A | Stonex | GNSS | Ceļabūve | 8 mm | IP68 | full day | 1.3 kg |
| Satlab SL7 | Satlab | GNSS | Mežsaimniecība | 10 mm | IP67 | 24 h | 0.9 kg |
| Stonex S599 | Stonex | GNSS | Mežsaimniecība | 12 mm | IP67 | 20 h | 1.0 kg |
| Carlson EYR | Carlson | GNSS | Mežsaimniecība | 10 mm | IP67 | 18 h | 1.0 kg |
| Juniper Archer 4 | Juniper | Lauka dators | — | — | IP68 | — | 0.7 kg |
| Getac UX10 | Getac | Lauka dators | — | — | IP66 | — | 1.4 kg |
| Titan TAL32 | Titan | Nivelieris | — | ±1.5 mm | IP54 | — | 1.6 kg |

Brands: Satlab, Stonex, Juniper, Getac, Trig-A-Cap, Carlson.
Reviews (2): Jānis Bērziņš — Galvenais inženieris, CBS Igate; Andris Kalnozols — Mežsaimnieks, SIA Mežvidi.
Blog (3): "Kā izvēlēties RTK GNSS uztvērēju?", "Satlab SL900 — pilns apskats", "IMU tehnoloģijas plusi mērniecībā".

---

## 14. BUILD ORDER & ACCEPTANCE

**Build order:**
1. Design tokens + Tailwind theme + fonts + `TopoBg` + Button variants.
2. Header + Footer + RequestModal (global shell).
3. Supabase schema + seed data + client hooks.
4. Homepage sections 1–9.
5. Catalog page + filters.
6. Product detail page + tabs + related.
7. Static pages + blog.
8. Lead insert + `send-lead-email` invocation + success states.
9. Responsive pass + SEO meta.

**Acceptance criteria:**
- Every product CTA opens RequestModal with correct product context; submit inserts a `leads` row and triggers the email function; success UI shown.
- Hero auto-rotates 5 slides with working dots.
- Catalog filters actually filter the grid and show counts.
- Product page shows 4 icon specs + full spec table + 3 tabs + related products.
- No checkout / no prices anywhere — only "Pieprasīt cenu" / "Cena pēc pieprasījuma".
- Fully responsive; matches the topographic design system (colors, Archivo + IBM Plex, mono specs, topo texture in dark blocks).
- All visible copy in Latvian.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://geobalt.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b642f94d-7871-4bb3-89ad-061ddd211e3c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
