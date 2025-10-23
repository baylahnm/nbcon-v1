import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { RoleGuard } from "../../../1-HomePage/others/lib/auth/guards";
import { AppLayout } from "../../../1-HomePage/others/components/layout/AppLayout";

export default function ClientLayout() {
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


