
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';
ALTER TABLE public.blog_posts ADD CONSTRAINT blog_posts_status_chk CHECK (status IN ('draft','published'));
UPDATE public.blog_posts SET status = 'published' WHERE published_at <= now();
