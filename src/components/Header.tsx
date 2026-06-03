import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search, Phone } from "lucide-react";
import { CATEGORY_NAV, lv } from "@/lib/i18n";

export function Header() {
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink text-white border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="font-display text-2xl font-black tracking-tight flex items-baseline gap-0">
            <span className="text-white">GEO</span>
            <span className="text-accent">BALT</span>
            <span className="font-mono-spec text-xs text-white/40 ml-1">.lv</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {CATEGORY_NAV.map((c) => (
              <div key={c.slug} className="relative group">
                <Link
                  to="/katalogs/$category"
                  params={{ category: c.slug }}
                  className="px-3 py-2 text-[13.5px] text-white/80 hover:text-accent transition-colors font-medium flex items-center gap-1"
                  activeProps={{ className: "text-accent" }}
                >
                  {c.label}
                  {c.subs && <span className="text-[9px] opacity-60">▾</span>}
                </Link>
                {c.subs && (
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity absolute left-0 top-full pt-2 z-50 min-w-[240px]">
                    <div className="bg-ink border border-white/10 rounded-md shadow-2xl py-2">
                      {c.subs.map((s) => (
                        <Link
                          key={s.slug}
                          to="/katalogs/$category"
                          params={{ category: c.slug }}
                          search={{ sub: s.slug }}
                          className="block px-4 py-2 text-white/85 hover:bg-white/5 hover:text-accent"
                        >
                          <div className="text-sm font-medium">{s.label}</div>
                          {s.hint && (
                            <div className="font-mono-spec text-[11px] text-white/40 mt-0.5">{s.hint}</div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                placeholder={lv.nav.search}
                className="bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-sm text-white placeholder:text-white/40 w-44 focus:outline-none focus:border-accent"
              />
            </div>
            <a href={`tel:${lv.footer.phone.replace(/\s/g, "")}`} className="hidden xl:flex items-center gap-2 text-accent font-mono-spec text-sm">
              <Phone size={14} />
              {lv.footer.phone}
            </a>
            <span className="pill bg-white/5 text-white/70 border border-white/10">LV ▾</span>
          </div>

          <button
            className="lg:hidden text-white"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label="Menu"
          >
            {openMobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {openMobile && (
          <div className="lg:hidden pb-4 space-y-1 border-t border-white/5 pt-3">
            {CATEGORY_NAV.map((c) => (
              <div key={c.slug}>
                <Link
                  to="/katalogs/$category"
                  params={{ category: c.slug }}
                  onClick={() => setOpenMobile(false)}
                  className="block px-3 py-2 text-white/80 hover:text-accent font-medium"
                >
                  {c.label}
                </Link>
                {c.subs && (
                  <div className="pl-5 border-l border-white/10 ml-3 mb-1">
                    {c.subs.map((s) => (
                      <Link
                        key={s.slug}
                        to="/katalogs/$category"
                        params={{ category: c.slug }}
                        search={{ sub: s.slug }}
                        onClick={() => setOpenMobile(false)}
                        className="block px-3 py-1.5 text-white/60 hover:text-accent text-sm"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2 space-y-1">
              <Link to="/par-mums" onClick={() => setOpenMobile(false)} className="block px-3 py-2 text-white/70 text-sm">{lv.nav.about}</Link>
              <Link to="/serviss" onClick={() => setOpenMobile(false)} className="block px-3 py-2 text-white/70 text-sm">{lv.nav.service}</Link>
              <Link to="/zimoli" onClick={() => setOpenMobile(false)} className="block px-3 py-2 text-white/70 text-sm">{lv.nav.brands}</Link>
              <Link to="/kontakti" onClick={() => setOpenMobile(false)} className="block px-3 py-2 text-white/70 text-sm">{lv.nav.contacts}</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
