import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  contact_phone: string | null;
  contact_email: string | null;
  contact_address_lv: string | null;
  working_hours_lv: string | null;
  promo_enabled: boolean;
  promo_image_url: string | null;
  promo_title_lv: string | null;
  promo_text_lv: string | null;
  promo_cta_url: string | null;
  show_blog: boolean;
  show_reviews: boolean;
  show_rent: boolean;
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await supabase.from("settings").select("*").eq("id", 1).single();
      return data as SiteSettings | null;
    },
    staleTime: 60_000,
  });
}
