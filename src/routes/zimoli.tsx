import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Brand } from "@/lib/types";

export const Route = createFileRoute("/zimoli")({
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
          <div key={b.id} className="bg-card border border-line rounded-2xl p-7 hover:border-accent transition-colors">
            <div className="font-display font-black text-3xl text-ink tracking-tight">{b.name}</div>
            <p className="text-muted text-sm mt-3">{b.blurb_lv}</p>
            <Link to="/katalogs/$category" params={{ category: "gnss" }} className="inline-flex items-center gap-2 text-accent font-semibold mt-5 text-sm">
              Skatīt katalogā <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
