import { AppLayout } from "@components/portal/shared/AppLayout";
import { UnifiedDashboard } from "@components/portal/shared/UnifiedDashboard";
import { StripeProvider } from "./providers/StripeProvider";

export default function App() {
  return (
    <StripeProvider>
      <AppLayout>
        <UnifiedDashboard role="client" pageTitle="Dashboard" />
      </AppLayout>
    </StripeProvider>
  );
}
