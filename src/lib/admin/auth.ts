import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "admin" | "editor" | null;

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

export interface AuthState {
  loading: boolean;
  user: AdminUser | null;
  isStaff: boolean;
  isAdmin: boolean;
}

export function useAdminAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    user: null,
    isStaff: false,
    isAdmin: false,
  });

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      const { data: sess } = await supabase.auth.getSession();
      const user = sess.session?.user;
      if (!user) {
        if (!cancelled) setState({ loading: false, user: null, isStaff: false, isAdmin: false });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const roleList = (roles ?? []).map((r) => r.role);
      const isAdmin = roleList.includes("admin");
      const isEditor = roleList.includes("editor");
      const role: AdminRole = isAdmin ? "admin" : isEditor ? "editor" : null;
      if (!cancelled) {
        setState({
          loading: false,
          user: { id: user.id, email: user.email ?? "", role },
          isStaff: isAdmin || isEditor,
          isAdmin,
        });
      }
    };

    loadUser();
    const { data: sub } = supabase.auth.onAuthStateChange(() => loadUser());
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function signOut() {
  await supabase.auth.signOut();
}
