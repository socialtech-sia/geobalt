import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Map of product_id -> primary image url (falls back to first by sort_order). */
export function useProductImages(productIds: string[]) {
  const ids = [...new Set(productIds)].filter(Boolean).sort();
  return useQuery({
    queryKey: ["product-images-map", ids],
    enabled: ids.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("product_images")
        .select("product_id, url, is_primary, sort_order")
        .in("product_id", ids)
        .order("is_primary", { ascending: false })
        .order("sort_order", { ascending: true });
      const map: Record<string, string> = {};
      for (const row of data ?? []) {
        if (!map[row.product_id]) map[row.product_id] = row.url;
      }
      return map;
    },
    staleTime: 60_000,
  });
}
