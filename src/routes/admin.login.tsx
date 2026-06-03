import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminUser, useAdminAuth } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.loading && auth.isStaff) {
      navigate({ to: "/admin", replace: true });
    }
  }, [auth.loading, auth.isStaff, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Nepareizs e-pasts vai parole");
      return;
    }
    const adminUser = await getAdminUser();
    if (adminUser?.role === "admin" || adminUser?.role === "editor") {
      navigate({ to: "/admin", replace: true });
      return;
    }
    await supabase.auth.signOut();
    setError("Šim kontam nav piekļuves administrēšanas panelim");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-4">
      <div className="w-full max-w-sm rounded-xl bg-card p-8 shadow-lift">
        <h1 className="font-display text-2xl font-black text-ink">
          geobalt<span className="text-accent">.</span>admin
        </h1>
        <p className="mt-1 text-sm text-muted">Pieslēgšanās vadības panelim</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1">
              Parole
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-d disabled:opacity-50"
          >
            {loading ? "Pieslēdzas…" : "Pieslēgties"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-muted">
          Lai izveidotu kontu, sazinieties ar administratoru
        </p>
      </div>
    </div>
  );
}
