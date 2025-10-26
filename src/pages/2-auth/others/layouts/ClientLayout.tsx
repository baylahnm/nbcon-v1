import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { RoleGuard } from "../../../1-HomePage/others/lib/auth/guards";
import { AppLayout } from "../../../1-HomePage/others/components/layout/AppLayout";
import { useAiStoreHydration } from "@/shared/hooks/useAiStoreHydration";

export default function ClientLayout() {
  // Phase 1: Hydrate AI store from Supabase on mount
  useAiStoreHydration();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log("🔍 ClientLayout mounted:", window.location.pathname);
    }
  }, []);
  
  return (
    <RoleGuard allow={["client"]}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RoleGuard>
  );
}


