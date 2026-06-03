export type Product = {
  id: string;
  slug: string;
  name: string;
  brand_id: string | null;
  category_id: string | null;
  short_desc_lv: string | null;
  full_desc_lv: string | null;
  industries: string[];
  ip_class: string | null;
  accuracy: string | null;
  battery_h: string | null;
  weight_kg: string | null;
  is_popular: boolean;
  is_available_sale: boolean;
  is_available_rent: boolean;
  sort_order: number;
  brands?: { name: string; slug: string } | null;
  categories?: { name_lv: string; slug: string } | null;
};

export type Category = {
  id: string;
  slug: string;
  name_lv: string;
  description_lv: string | null;
};

export type Brand = { id: string; slug: string; name: string; blurb_lv: string | null; logo_url: string | null; sort_order: number };

export type Review = {
  id: string;
  author_name: string;
  author_role_lv: string | null;
  company: string | null;
  quote_lv: string;
  industry: string | null;
};

export type BlogPost = {
  id: string;
  slug: string;
  title_lv: string;
  tag_lv: string | null;
  excerpt_lv: string | null;
  cover_url: string | null;
  body_lv: string | null;
  published_at: string;
};
