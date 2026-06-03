import { Link } from "@tanstack/react-router";
import { Crosshair, Shield, BatteryFull, Scale, Satellite, Tablet, Triangle, Flag, Cable, Calendar } from "lucide-react";
import { lv } from "@/lib/i18n";
import { useRequestModal } from "./request-modal-context";
import type { Product } from "@/lib/types";

function categoryIcon(slug?: string | null) {
  switch (slug) {
    case "gnss": return Satellite;
    case "lauka-datori": return Tablet;
    case "nivelieri-lazeri": return Triangle;
    case "markesana": return Flag;
    case "aksesuari": return Cable;
    case "noma": return Calendar;
    default: return Satellite;
  }
}

export function ProductCard({ product, imageUrl }: { product: Product; imageUrl?: string | null }) {
  const { openModal } = useRequestModal();
  const Icon = categoryIcon(product.categories?.slug);

  return (
    <Link
      to="/produkts/$slug"
      params={{ slug: product.slug }}
      className="product-card flex flex-col overflow-hidden group"
    >
      {/* image */}
      <div className="relative aspect-[4/3] bg-paper-2 flex items-center justify-center border-b border-line overflow-hidden">
        {product.brands?.name && (
          <span className="absolute top-3 left-3 pill bg-ink text-white text-[10px] z-10">{product.brands.name}</span>
        )}
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <Icon size={72} strokeWidth={1.2} className="text-ink/30 group-hover:text-accent transition-colors" />
        )}
      </div>


      <div className="p-4 flex-1 flex flex-col">
        <div className="kicker mb-1">{product.categories?.name_lv ?? ""}</div>
        <h3 className="font-display font-extrabold text-lg leading-tight text-ink mb-3">{product.name}</h3>

        <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
          <SpecChip Icon={Crosshair} label={lv.spec.accuracy} value={product.accuracy} />
          <SpecChip Icon={Shield} label={lv.spec.ip} value={product.ip_class} />
          <SpecChip Icon={BatteryFull} label={lv.spec.battery} value={product.battery_h} />
          <SpecChip Icon={Scale} label={lv.spec.weight} value={product.weight_kg} />
        </div>

        <button
          className="btn-ghost w-full justify-center text-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal({ id: product.id, name: product.name, slug: product.slug });
          }}
        >
          {lv.cta.request}
        </button>
      </div>
    </Link>
  );
}

function SpecChip({
  Icon, label, value,
}: { Icon: typeof Crosshair; label: string; value: string | null }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon size={14} className="text-accent shrink-0" />
      <div className="min-w-0">
        <div className="text-[10px] text-muted uppercase tracking-wider font-mono-spec leading-none">{label}</div>
        <div className="font-mono-spec text-ink truncate">{value ?? "—"}</div>
      </div>
    </div>
  );
}
