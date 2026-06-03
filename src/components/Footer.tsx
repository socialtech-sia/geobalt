import { Link } from "@tanstack/react-router";
import { CATEGORY_NAV, lv } from "@/lib/i18n";
import { useRequestModal } from "./request-modal-context";
import { Mail, MapPin, Phone, Clock, Linkedin, Facebook, Instagram } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function Footer() {
  const { openModal } = useRequestModal();
  const { data: settings } = useSiteSettings();
  const phone = settings?.contact_phone ?? lv.footer.phone;
  const email = settings?.contact_email ?? lv.footer.email;
  const address = settings?.contact_address_lv ?? lv.footer.address;
  const hours = settings?.working_hours_lv;
  const showBlog = settings?.show_blog ?? true;

  return (
    <footer className="relative topo-bg text-white mt-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl font-black flex items-baseline">
            <span>GEO</span><span className="text-accent">BALT</span>
            <span className="font-mono-spec text-xs text-white/70 ml-1">.lv</span>
          </div>
          <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">{lv.footer.about}</p>
          <div className="flex gap-2 mt-5">
            {[
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Instagram, label: "Instagram" },
            ].map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-display font-extrabold text-base mb-4">{lv.footer.catalog}</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {CATEGORY_NAV.map((c) => (
              <li key={c.slug}>
                <Link to="/katalogs/$category" params={{ category: c.slug }} className="hover:text-accent">{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-extrabold text-base mb-4">{lv.footer.company}</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/par-mums" className="hover:text-accent">{lv.nav.about}</Link></li>
            <li><Link to="/serviss" className="hover:text-accent">{lv.nav.service}</Link></li>
            <li><Link to="/zimoli" className="hover:text-accent">{lv.nav.brands}</Link></li>
            {showBlog && <li><Link to="/blogs" className="hover:text-accent">{lv.nav.blog}</Link></li>}
            <li><Link to="/kontakti" className="hover:text-accent">{lv.nav.contacts}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-extrabold text-base mb-4">{lv.footer.contacts}</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-accent" /> {address}</li>
            <li className="flex items-center gap-2"><Phone size={14} className="text-accent" /> <span className="font-mono-spec">{phone}</span></li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-accent" /> {email}</li>
            {hours && <li className="flex items-start gap-2"><Clock size={14} className="mt-0.5 text-accent" /> {hours}</li>}
          </ul>
          <button onClick={() => openModal()} className="btn-accent mt-5 text-sm">{lv.cta.contactUs}</button>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/70 font-mono-spec">
          <span>{lv.footer.copyright}</span>
          <div className="flex gap-4">
            <Link to="/privatuma-politika" className="hover:text-white">{lv.footer.privacy}</Link>
            <Link to="/sikdatnes" className="hover:text-white">{lv.footer.cookies}</Link>
            <Link to="/gdpr" className="hover:text-white">{lv.footer.gdpr}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
