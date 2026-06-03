
CREATE POLICY "Public read site buckets" ON storage.objects FOR SELECT
  USING (bucket_id IN ('product-images', 'brand-logos', 'blog-covers'));

CREATE POLICY "Staff write site buckets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('product-images', 'brand-logos', 'blog-covers') AND public.is_staff(auth.uid()));

CREATE POLICY "Staff update site buckets" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id IN ('product-images', 'brand-logos', 'blog-covers') AND public.is_staff(auth.uid()));

CREATE POLICY "Staff delete site buckets" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id IN ('product-images', 'brand-logos', 'blog-covers') AND public.is_staff(auth.uid()));
