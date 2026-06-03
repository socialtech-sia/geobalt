
-- CATEGORIES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name_lv text NOT NULL,
  description_lv text,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);

-- BRANDS
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text,
  blurb_lv text,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.brands TO anon, authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands public read" ON public.brands FOR SELECT USING (true);

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  short_desc_lv text,
  full_desc_lv text,
  industries text[] NOT NULL DEFAULT '{}',
  ip_class text,
  accuracy text,
  battery_h text,
  weight_kg text,
  is_popular boolean NOT NULL DEFAULT false,
  is_available_sale boolean NOT NULL DEFAULT true,
  is_available_rent boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (true);

-- PRODUCT IMAGES
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_images public read" ON public.product_images FOR SELECT USING (true);

-- PRODUCT SPECS
CREATE TABLE public.product_specs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label_lv text NOT NULL,
  value text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.product_specs TO anon, authenticated;
GRANT ALL ON public.product_specs TO service_role;
ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_specs public read" ON public.product_specs FOR SELECT USING (true);

-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role_lv text,
  company text,
  quote_lv text NOT NULL,
  industry text,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON public.reviews FOR SELECT USING (true);

-- BLOG POSTS
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_lv text NOT NULL,
  tag_lv text,
  excerpt_lv text,
  cover_url text,
  body_lv text,
  published_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_posts public read" ON public.blog_posts FOR SELECT USING (true);

-- LEADS
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text,
  full_name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text NOT NULL,
  message text,
  gdpr_consent boolean NOT NULL DEFAULT false,
  source_page text,
  status text NOT NULL DEFAULT 'new'
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads public insert" ON public.leads FOR INSERT WITH CHECK (gdpr_consent = true);
