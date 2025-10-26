import { Outlet } from "react-router-dom";
import { RoleGuard } from "../../../1-HomePage/others/lib/auth/guards";
import { AppLayout } from "../../../1-HomePage/others/components/layout/AppLayout";
import { useAiStoreHydration } from "@/shared/hooks/useAiStoreHydration";

export default function AdminLayout() {
  // Phase 1: Hydrate AI store from Supabase on mount
  useAiStoreHydration();

  return (
    <RoleGuard allow={["admin"]}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RoleGuard>
  );
}


