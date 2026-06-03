import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  MessageSquare,
  FileText,
  Inbox,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAdminAuth, signOut } from "@/lib/admin/auth";
import { supabase } from "@/integrations/supabase/client";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}

const NAV: NavItem[] = [
  { label: "Vadības panelis", to: "/admin", icon: LayoutDashboard },
  { label: "Produkti", to: "/admin/products", icon: Package },
  { label: "Kategorijas", to: "/admin/categories", icon: FolderTree },
  { label: "Zīmoli", to: "/admin/brands", icon: Tag },
  { label: "Atsauksmes", to: "/admin/reviews", icon: MessageSquare },
  { label: "Blogs", to: "/admin/blog", icon: FileText },
  { label: "Pieprasījumi", to: "/admin/leads", icon: Inbox },
  { label: "Iestatījumi", to: "/admin/settings", icon: SettingsIcon, adminOnly: true },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.user) {
      navigate({ to: "/admin/login", replace: true });
    } else if (!auth.isStaff) {
      navigate({ to: "/", replace: true });
    }
  }, [auth.loading, auth.user, auth.isStaff, navigate]);

  const { data: newLeadCount = 0 } = useQuery({
    queryKey: ["admin", "new-lead-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");
      return count ?? 0;
    },
    refetchInterval: 30_000,
    enabled: auth.isStaff,
  });

  if (auth.loading || !auth.isStaff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-muted text-sm">Ielādē…</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-paper-2">
      <aside className="w-60 shrink-0 bg-ink text-white flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Link to="/admin" className="font-display font-black text-xl tracking-tight">
            geobalt<span className="text-accent">.</span>admin
          </Link>
        </div>
        <nav className="flex-1 py-3">
          {NAV.filter((n) => !n.adminOnly || auth.isAdmin).map((item) => {
            const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-accent text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.to === "/admin/leads" && newLeadCount > 0 && (
                  <span className="ml-auto rounded-full bg-accent text-white text-xs font-mono px-2 py-0.5">
                    {newLeadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 text-xs text-white/60">
          <div className="truncate">{auth.user?.email}</div>
          <div className="font-mono uppercase mt-0.5">{auth.user?.role}</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b border-line flex items-center justify-end gap-3 px-6">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted hover:text-ink flex items-center gap-1.5"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Atvērt vietni
          </a>
          <button
            onClick={handleLogout}
            className="text-sm text-muted hover:text-ink flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" /> Iziet
          </button>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
