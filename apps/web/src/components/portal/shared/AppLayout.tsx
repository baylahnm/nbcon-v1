import { ReactNode } from "react";
import { TierAwareAppSidebar } from "./TierAwareAppSidebar";

export function AppLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <TierAwareAppSidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
