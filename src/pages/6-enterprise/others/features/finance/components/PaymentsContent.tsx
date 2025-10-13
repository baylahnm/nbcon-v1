import { useState, useEffect } from "react";
import { 
  CreditCard, 
  LayoutDashboard, 
  FileText, 
  Target, 
  Shield, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  BarChart3, 
  Settings,
  Crown
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../1-HomePage/others/components/ui/tabs";
import { usePaymentsStore } from "../store/usePaymentsStore";
import { PaymentsOverview } from "./PaymentsOverview";
import { PaymentsInvoices } from "./PaymentsInvoices";
import { PaymentsMilestone } from "./PaymentsMilestone";
import { PaymentsEscrow } from "./PaymentsEscrow";
import { PaymentsPayout } from "./PaymentsPayout";
import { PaymentsRefund } from "./PaymentsRefund";
import { PaymentsSettings } from "./PaymentsSettings";
import QuotationPage from "./quotations/QuotationPage";

export function PaymentsContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const { loadPayments } = usePaymentsStore();

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      description: "Dashboard and analytics"
    },
    {
      value: "invoices",
      label: "Invoices",
      icon: FileText,
      description: "Invoice management"
    },
    {
      value: "quotations",
      label: "Quotations",
      icon: FileText,
      description: "Quotation management"
    },
    {
      value: "milestone",
      label: "Milestone",
      icon: Target,
      description: "Milestone payments"
    },
    {
      value: "escrow",
      label: "Escrow",
      icon: Shield,
      description: "Escrow management"
    },
    {
      value: "payout",
      label: "Payout",
      icon: ArrowUpCircle,
      description: "Payout processing"
    },
    {
      value: "refund",
      label: "Refund",
      icon: ArrowDownCircle,
      description: "Refund management"
    },
    {
      value: "settings",
      label: "Settings",
      icon: Settings,
      description: "Payment settings"
    }
  ];

  return (
    <div className="flex-1 bg-background p-4">
      {/* Header */}
      <div className="bg-background p-0">
        <div className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Finance
            </h1>
            <p className="text-xs text-muted-foreground">Manage your payments and financial transactions</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-0 mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <PaymentsOverview />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <PaymentsInvoices />
          </TabsContent>

          <TabsContent value="quotations" className="space-y-6">
            <QuotationPage />
          </TabsContent>

          <TabsContent value="milestone" className="space-y-6">
            <PaymentsMilestone />
          </TabsContent>

          <TabsContent value="escrow" className="space-y-6">
            <PaymentsEscrow />
          </TabsContent>

          <TabsContent value="payout" className="space-y-6">
            <PaymentsPayout />
          </TabsContent>

          <TabsContent value="refund" className="space-y-6">
            <PaymentsRefund />
          </TabsContent>


          <TabsContent value="settings" className="space-y-6">
            <PaymentsSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

