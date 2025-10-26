import { Outlet } from "react-router-dom";
import { RoleGuard } from "../../../1-HomePage/others/lib/auth/guards";
import { AppLayout } from "../../../1-HomePage/others/components/layout/AppLayout";
import { useAiStoreHydration } from "@/shared/hooks/useAiStoreHydration";

export default function EngineerLayout() {
  // Phase 1: Hydrate AI store from Supabase on mount
  useAiStoreHydration();

  return (
    <RoleGuard allow={["engineer"]}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RoleGuard>
  );
}


