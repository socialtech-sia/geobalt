
-- Remove overly broad public SELECT policy
DROP POLICY IF EXISTS "Settings public read" ON public.settings;

-- Allow staff (admin/editor) to read all settings columns
CREATE POLICY "Settings staff read"
ON public.settings
FOR SELECT
TO authenticated
USING (public.is_staff(auth.uid()));

-- Revoke direct table SELECT from anon/authenticated (service_role keeps full access)
REVOKE SELECT ON public.settings FROM anon;

-- Security definer function returning ONLY safe, public columns
CREATE OR REPLACE FUNCTION public.get_public_settings()
RETURNS TABLE (
  contact_phone text,
  contact_email text,
  contact_address_lv text,
  working_hours_lv text,
  promo_enabled boolean,
  promo_image_url text,
  promo_title_lv text,
  promo_text_lv text,
  promo_cta_url text,
  show_blog boolean,
  show_reviews boolean,
  show_rent boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
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
    show_rent
  FROM public.settings
  WHERE id = 1
$$;

GRANT EXECUTE ON FUNCTION public.get_public_settings() TO anon, authenticated;
