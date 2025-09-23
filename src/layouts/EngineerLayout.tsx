import { Outlet } from "react-router-dom";
import { RoleGuard } from "@/lib/auth/guards";
import { AppLayout } from "@/components/layout/AppLayout";

export default function EngineerLayout() {
  return (
    <RoleGuard allow={["engineer"]}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RoleGuard>
  );
}


