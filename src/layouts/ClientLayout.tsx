import { Outlet } from "react-router-dom";
import { RoleGuard } from "@/lib/auth/guards";
import { AppLayout } from "@/components/layout/AppLayout";

export default function ClientLayout() {
  return (
    <RoleGuard allow={["client"]}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RoleGuard>
  );
}


