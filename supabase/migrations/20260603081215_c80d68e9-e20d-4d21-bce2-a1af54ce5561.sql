-- 1) settings: restrict anon to non-sensitive columns only
REVOKE SELECT ON public.settings FROM anon;
GRANT SELECT (
  id,
  contact_phone,
  contact_email,
  contact_address_lv,
  working_hours_lv,
  promo_enabled,
  promo_image_url,
  promo_title_lv,
  promo_text_lv,
  promo_cta_url,
  show_blog,
  show_reviews,
  show_rent,
  updated_at
) ON public.settings TO anon;

-- authenticated keeps full access (admin UI relies on it; RLS still applies for writes)
GRANT SELECT ON public.settings TO authenticated;

-- 2) blog_posts: only published rows are publicly readable
DROP POLICY IF EXISTS "blog_posts public read" ON public.blog_posts;
CREATE POLICY "blog_posts public read"
ON public.blog_posts
FOR SELECT
TO public
USING (status = 'published');

-- 3) products: only active rows are publicly readable
DROP POLICY IF EXISTS "products public read" ON public.products;
CREATE POLICY "products public read"
ON public.products
FOR SELECT
TO public
USING (is_active = true);
