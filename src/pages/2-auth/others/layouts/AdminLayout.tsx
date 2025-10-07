import { Outlet } from "react-router-dom";
import { RoleGuard } from "../../../1-HomePage/others/lib/auth/guards";
import { AppLayout } from "../../../1-HomePage/others/components/layout/AppLayout";

export default function AdminLayout() {
  return (
    <RoleGuard allow={["admin"]}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RoleGuard>
  );
}


