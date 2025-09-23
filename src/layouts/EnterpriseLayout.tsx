import { Outlet } from "react-router-dom";
import { RoleGuard } from "@/lib/auth/guards";
import { AppLayout } from "@/components/layout/AppLayout";

export default function EnterpriseLayout() {
  return (
    <RoleGuard allow={["enterprise"]}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RoleGuard>
  );
}


