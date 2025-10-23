import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/1-HomePage/others/components/ui/card";
import { Button } from "@/pages/1-HomePage/others/components/ui/button";
import { Badge } from "@/pages/1-HomePage/others/components/ui/badge";
import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { Textarea } from "@/pages/1-HomePage/others/components/ui/textarea";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/pages/1-HomePage/others/components/ui/tabs";
import { ROUTES } from "@/shared/constants/routes";
import { useAiStore } from "@/pages/4-free/others/features/ai/store/useAiStore";
import { FloatingAIButton } from "../components/FloatingAIButton";
import { Shield, Sparkles, ChevronLeft, Download, Phone, Mail, Clock, RefreshCw, Upload } from "lucide-react";

type WarrantyItem = {
  id: string;
  system: string;
  supplier: string;
  coverage: number; // months
  expiry: string;
  contact: string;
  phone?: string;
  email?: string;
  notes: string;
  riskLevel: "low" | "medium" | "high";
};

const INITIAL_ITEMS: WarrantyItem[] = [
  {
    id: "hvac",
    system: "Chilled Water Plants",
    supplier: "GulfTech HVAC",
    coverage: 24,
    expiry: "2027-02-14",
    contact: "Ali Hassan",
    phone: "+966 55 123 4567",
    email: "ali.hassan@gulftech.com",
    notes: "Quarterly maintenance required; includes compressor replacement coverage.",
    riskLevel: "medium",
  },
  {
    id: "elevators",
    system: "Passenger Elevators",
    supplier: "SkyLift Systems",
    coverage: 36,
    expiry: "2028-05-01",
    contact: "Noura Al-Qahtani",
    email: "noura@skylift.com",
    notes: "Response SLA 4 hours. Maintain logbook in building control room.",
    riskLevel: "low",
  },
  {
    id: "fa",
    system: "Fire Alarm & Suppression",
    supplier: "Safeguard",
    coverage: 18,
    expiry: "2026-10-09",
    contact: "Support Desk",
    phone: "+966 9200 1111",
    notes: "Requires monthly testing schedule handed to FM.",
    riskLevel: "high",
  },
];

export default function WarrantyDocsTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { sendMessage } = useAiStore();

  const [items, setItems] = useState(INITIAL_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(items[0]?.id ?? null);
  const [aiSummary, setAiSummary] = useState("");
  const [escalationPlan, setEscalationPlan] = useState(
    "1. Site team logs issue in FM ticketing system.\n2. Notify warranty contact within 2 hours, attach evidence.\n3. Escalate to client representative if SLA exceeds 24 hours.\n4. Track to closure with signatures."
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const coverageStats = useMemo(() => {
    const total = items.length;
    const highRisk = items.filter((item) => item.riskLevel === "high").length;
    const expiringSoon = items.filter((item) => {
      const expiry = new Date(item.expiry).getTime();
      const threshold = Date.now() + 1000 * 60 * 60 * 24 * 180; // 6 months
      return expiry < threshold;
    }).length;
    return { total, highRisk, expiringSoon };
  }, [items]);

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  const handleItemUpdate = (id: string, updates: Partial<WarrantyItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const prompt = [
      "Create a consolidated warranty coverage summary for building systems.",
      projectId ? `Project ID: ${projectId}` : "",
      "Warranty packages:",
      ...items.map(
        (item) =>
          `- ${item.system}: ${item.coverage} months coverage, expiry ${item.expiry}, risk ${item.riskLevel}, supplier ${item.supplier}`
      ),
      "Highlight high-risk systems, upcoming expiries, and recommended FM actions.",
      "Provide a structured summary with bullet points.",
    ].join("\n");

    try {
      await sendMessage(prompt);
      setAiSummary(
        `Warranty Coverage Overview\n\nHigh-Risk Systems:\n${items
          .filter((item) => item.riskLevel === "high")
          .map((item) => `- ${item.system} (expiry ${item.expiry})`)
          .join("\n") || "- None"}\n\nUpcoming Expiries (6 months):\n${items
          .filter((item) => {
            const expiry = new Date(item.expiry).getTime();
            return expiry < Date.now() + 1000 * 60 * 60 * 24 * 180;
          })
          .map((item) => `- ${item.system} on ${item.expiry}`)
          .join("\n") || "- None"}\n\nRecommended Actions:\n- Share escalation plan with FM helpdesk\n- Schedule supplier onboarding workshops\n- Validate spare parts inventory with contractors`
      );
    } catch (error) {
      console.error("Failed to generate AI summary", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => navigate(ROUTES.AI_TOOLS.CLOSURE)}>
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Back to Closure Hub
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-primary-gradient h-9 w-9 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">Warranty Documentation Builder</h1>
                <p className="text-xs text-muted-foreground">
                  Centralize warranty coverage, escalation paths, and supplier contacts for seamless handover.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {projectId && (
              <Badge variant="outline" className="text-xs">
                Project #{projectId}
              </Badge>
            )}
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Upload className="h-3.5 w-3.5 mr-1" />
              Import Schedule
            </Button>
            <Button size="sm" className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export Package
            </Button>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Coverage Snapshot</CardTitle>
              <Badge variant="outline" className="text-[10px] uppercase">
                {coverageStats.total} warranty items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="p-3 rounded-lg border border-border/40 bg-background/60">
              <p className="text-sm font-semibold text-foreground">High Risk</p>
              <p className="mt-1">{coverageStats.highRisk} systems flagged for close monitoring</p>
            </div>
            <div className="p-3 rounded-lg border border-border/40 bg-background/60">
              <p className="text-sm font-semibold text-foreground">Expiring Soon</p>
              <p className="mt-1">{coverageStats.expiringSoon} warranties within next 6 months</p>
            </div>
            <div className="p-3 rounded-lg border border-border/40 bg-background/60">
              <p className="text-sm font-semibold text-foreground">Coverage Range</p>
              <p className="mt-1">
                {Math.min(...items.map((item) => item.coverage))}-{Math.max(...items.map((item) => item.coverage))} months
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Warranty Register</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    selectedItemId === item.id ? "border-primary bg-primary/5" : "border-border/40 bg-background/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{item.system}</p>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {item.riskLevel}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {item.coverage} months • Expires {item.expiry}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Supplier: {item.supplier}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 xl:col-span-2">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Warranty Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {selectedItem ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{selectedItem.system}</p>
                      <p className="text-xs text-muted-foreground">{selectedItem.supplier}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      Coverage {selectedItem.coverage} months
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Expiry Date</Label>
                      <Input
                        type="date"
                        value={selectedItem.expiry}
                        onChange={(event) => handleItemUpdate(selectedItem.id, { expiry: event.target.value })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Coverage (months)</Label>
                      <Input
                        type="number"
                        value={selectedItem.coverage}
                        onChange={(event) =>
                          handleItemUpdate(selectedItem.id, { coverage: Number(event.target.value) || 0 })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Warranty Contact</Label>
                      <Input
                        value={selectedItem.contact}
                        onChange={(event) => handleItemUpdate(selectedItem.id, { contact: event.target.value })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Risk Level</Label>
                      <select
                        value={selectedItem.riskLevel}
                        onChange={(event) =>
                          handleItemUpdate(selectedItem.id, { riskLevel: event.target.value as WarrantyItem["riskLevel"] })
                        }
                        className="h-8 w-full rounded-md border border-border bg-background px-2"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <Input
                        value={selectedItem.phone ?? ""}
                        onChange={(event) => handleItemUpdate(selectedItem.id, { phone: event.target.value })}
                        placeholder="+966 5x xxx xxxx"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <Input
                        value={selectedItem.email ?? ""}
                        onChange={(event) => handleItemUpdate(selectedItem.id, { email: event.target.value })}
                        placeholder="support@supplier.com"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Notes / Coverage Summary</Label>
                    <Textarea
                      value={selectedItem.notes}
                      onChange={(event) => handleItemUpdate(selectedItem.id, { notes: event.target.value })}
                      className="min-h-[140px] text-xs"
                    />
                  </div>
                  <Tabs defaultValue="escalation" className="w-full">
                    <TabsList className="grid grid-cols-2 h-8 text-[11px]">
                      <TabsTrigger value="escalation">Escalation Plan</TabsTrigger>
                      <TabsTrigger value="attachments">Attachments</TabsTrigger>
                    </TabsList>
                    <TabsContent value="escalation" className="space-y-2">
                      <Textarea
                        value={escalationPlan}
                        onChange={(event) => setEscalationPlan(event.target.value)}
                        className="min-h-[140px] text-xs font-mono"
                      />
                      <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        Ensure SLA response times align to FM contract obligations.
                      </p>
                    </TabsContent>
                    <TabsContent value="attachments" className="space-y-2 text-xs text-muted-foreground">
                      <p>Attach commissioning reports, certificates, and PO references for this warranty package.</p>
                      <Button size="sm" variant="outline" className="h-8 text-xs w-fit">
                        Add Attachment
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Select a warranty package to edit coverage information.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-sm font-semibold">AI Coverage Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <Textarea
              value={aiSummary}
              onChange={(event) => setAiSummary(event.target.value)}
              className="min-h-[200px] text-xs"
              placeholder="Ask AI to generate a coverage overview and recommended FM actions..."
            />
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-8 text-xs" onClick={handleGenerateSummary} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Generate with AI
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1" />
                Export Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <FloatingAIButton />
    </div>
  );
}

