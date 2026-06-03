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

export async function getAdminUser(): Promise<AdminUser | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData.user;
  if (userError || !user) return null;

  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  if (rolesError) {
    console.error("Admin role check failed", rolesError);
    return { id: user.id, email: user.email ?? "", role: null };
  }

  const roleList = (roles ?? []).map((r) => r.role);
  const isAdmin = roleList.includes("admin");
  const isEditor = roleList.includes("editor");
  const role: AdminRole = isAdmin ? "admin" : isEditor ? "editor" : null;
  return { id: user.id, email: user.email ?? "", role };
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
      const user = await getAdminUser();
      if (!user) {
        if (!cancelled) setState({ loading: false, user: null, isStaff: false, isAdmin: false });
        return;
      }
      if (!cancelled) {
        setState({
          loading: false,
          user,
          isStaff: user.role === "admin" || user.role === "editor",
          isAdmin: user.role === "admin",
        });
      }
    };

    loadUser();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => void loadUser(), 0);
    });
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
