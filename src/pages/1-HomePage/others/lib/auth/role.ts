import { supabase } from "@/shared/supabase/client";

export type UserRole = "engineer" | "client" | "enterprise" | "admin";

export const ROLE_BASE: Record<UserRole, string> = {
  engineer: "/engineer",
  client: "/free",
  enterprise: "/enterprise",
  admin: "/admin",
};

export interface SupabaseUserLike {
  id: string;
  email?: string | null;
  app_metadata?: { role?: UserRole };
}

export const resolveRole = async (user: SupabaseUserLike | null): Promise<UserRole | null> => {
  if (!user) return null;
  const metaRole = user.app_metadata?.role as UserRole | undefined;
  if (metaRole) return metaRole;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    if (error) return null;
    return (data?.role as UserRole) ?? null;
  } catch {
    return null;
  }
};


