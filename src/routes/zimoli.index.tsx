import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Brand } from "@/lib/types";

export const Route = createFileRoute("/zimoli/")({
  head: () => ({ meta: [{ title: "Zīmoli | geobalt.lv" }] }),
  component: BrandsPage,
});

function BrandsPage() {
  const { data: brands = [] } = useQuery({
    queryKey: ["brands-page"],
    queryFn: async () => {
      const { data } = await supabase.from("brands").select("*").order("sort_order");
      return (data as Brand[]) ?? [];
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="kicker mb-3">Mūsu partneri</div>
      <h1 className="text-4xl md:text-5xl mb-10">Zīmoli</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((b) => (
          <Link
            key={b.id}
            to="/zimoli/$slug"
            params={{ slug: b.slug }}
            className="group bg-card border border-line rounded-2xl p-7 hover:border-accent transition-colors flex flex-col"
          >
            <div className="h-20 mb-4 flex items-center">
              {b.logo_url ? (
                <img src={b.logo_url} alt={b.name} className="max-h-20 max-w-[180px] object-contain" />
              ) : (
                <div className="font-display font-black text-3xl text-ink tracking-tight">{b.name}</div>
              )}
            </div>
            {b.logo_url && <div className="font-display font-bold text-lg text-ink">{b.name}</div>}
            {b.blurb_lv && <p className="text-muted text-sm mt-2 flex-1">{b.blurb_lv}</p>}
            <span className="inline-flex items-center gap-2 text-accent font-semibold mt-5 text-sm group-hover:gap-3 transition-all">
              Apskatīt produktus <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
      {brands.length === 0 && (
        <div className="bg-card border border-dashed border-line rounded-2xl p-12 text-center text-muted">
          Zīmoli vēl nav pievienoti
        </div>
      )}
    </div>
  );
}
