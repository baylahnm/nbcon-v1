import { Outlet } from "react-router-dom";
import { RoleGuard } from "@/lib/auth/guards";
import { AppLayout } from "@/components/layout/AppLayout";

export default function AdminLayout() {
  return (
    <RoleGuard allow={["admin"]}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RoleGuard>
  );
}


