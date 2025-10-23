import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/1-HomePage/others/components/ui/card";
import { Button } from "@/pages/1-HomePage/others/components/ui/button";
import { Badge } from "@/pages/1-HomePage/others/components/ui/badge";
import { Checkbox } from "@/pages/1-HomePage/others/components/ui/checkbox";
import { Textarea } from "@/pages/1-HomePage/others/components/ui/textarea";
import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/pages/1-HomePage/others/components/ui/tabs";
import { Progress } from "@/pages/1-HomePage/others/components/ui/progress";
import { ROUTES } from "@/shared/constants/routes";
import { useAiStore } from "@/pages/4-free/others/features/ai/store/useAiStore";
import {
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  Download,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

type ChecklistItem = {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  owner: string;
  notes: string;
};

const DEFAULT_ITEMS: ChecklistItem[] = [
  {
    id: "deliverables",
    label: "All deliverables accepted",
    description: "Confirm all contractual deliverables are signed off by the client.",
    completed: false,
    owner: "Project Manager",
    notes: "",
  },
  {
    id: "documentation",
    label: "Documentation compiled",
    description: "Compile contracts, approvals, change orders, RFIs, and inspection reports.",
    completed: false,
    owner: "Document Controller",
    notes: "",
  },
  {
    id: "financial",
    label: "Final financial reconciliation",
    description: "Verify all invoices, payments, claims, and retentions are settled.",
    completed: false,
    owner: "Commercial Lead",
    notes: "",
  },
  {
    id: "handover",
    label: "Operations handover completed",
    description: "Ensure FM/warranty team has received all required information.",
    completed: false,
    owner: "Handover Lead",
    notes: "",
  },
  {
    id: "lessons",
    label: "Lessons learned captured",
    description: "Collect insights from project team and stakeholders.",
    completed: false,
    owner: "Project Controls",
    notes: "",
  },
];

export default function CloseoutChecklistTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { sendMessage } = useAiStore();

  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [closeoutSummary, setCloseoutSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const completion = useMemo(() => {
    const total = items.length;
    const done = items.filter((item) => item.completed).length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  }, [items]);

  const handleToggleItem = (id: string, value: boolean) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: value } : item)));
  };

  const handleNotesChange = (id: string, value: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, notes: value } : item)));
  };

  const handleOwnerChange = (id: string, value: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, owner: value } : item)));
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const completedItems = items.filter((item) => item.completed).map((item) => `- ${item.label}`);
    const pendingItems = items.filter((item) => !item.completed).map((item) => `- ${item.label}`);

    const prompt = [
      "Generate a concise project closeout summary based on the checklist results.",
      projectId ? `Project ID: ${projectId}` : "",
      "Completed items:",
      completedItems.length ? completedItems.join("\n") : "- None completed yet",
      "Pending items:",
      pendingItems.length ? pendingItems.join("\n") : "- All items completed",
      "Include recommendations for addressing outstanding tasks and highlight critical approvals.",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await sendMessage(prompt);
      setCloseoutSummary(
        `Closeout Summary Draft\n\nCompletion: ${completion}%\n\nKey achievements:\n${
          completedItems.length ? completedItems.join("\n") : "- Still in progress"
        }\n\nOutstanding actions:\n${pendingItems.length ? pendingItems.join("\n") : "- None"}\n\nRecommendations:\n- Engage stakeholders for outstanding approvals\n- Archive final documentation in the project handover workspace\n- Prepare warranty onboarding session with FM team`
      );
    } catch (error) {
      console.error("Failed to request AI summary", error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        
        {/* Page Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(ROUTES.AI_TOOLS.CLOSURE)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="bg-primary-gradient h-10 w-10 flex items-center justify-center rounded-xl shadow-md">
                <ClipboardCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">Project Closeout Checklist</h1>
                <p className="text-xs text-muted-foreground">
                  Structured verification workflow to confirm every closure requirement is complete.
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
            <Button className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export Checklist
            </Button>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Completion Progress</CardTitle>
              <Badge variant="outline" className="text-xs capitalize">
                {completion >= 100 ? "ready" : completion >= 60 ? "in review" : "in progress"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span>{completion}% complete</span>
              <span>
                {items.filter((item) => item.completed).length}/{items.length} items done
              </span>
            </div>
            <Progress value={completion} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Closeout Checklist</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border border-border/40 bg-background/60 space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={(value) => handleToggleItem(item.id, Boolean(value))}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor={item.id} className="text-sm font-semibold">
                          {item.label}
                        </Label>
                        <Badge variant={item.completed ? "default" : "outline"} className="text-[10px] uppercase">
                          {item.completed ? "completed" : "pending"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[11px] text-muted-foreground">Responsible</Label>
                          <Input
                            value={item.owner}
                            onChange={(event) => handleOwnerChange(item.id, event.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] text-muted-foreground">Notes / Evidence</Label>
                          <Input
                            value={item.notes}
                            onChange={(event) => handleNotesChange(item.id, event.target.value)}
                            className="h-8 text-xs"
                            placeholder="Add link or reference..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Closeout Summary Builder</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid grid-cols-2 h-9 text-xs">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="issues">Issues & Risks</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="space-y-3">
                  <div className="p-3 rounded-md bg-primary/10 border border-primary/20 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Use AI to generate a professional closeout summary using checklist context, then refine as needed.
                    </p>
                  </div>
                  <Textarea
                    value={closeoutSummary}
                    onChange={(event) => setCloseoutSummary(event.target.value)}
                    placeholder="Summarize project completion status, key approvals, and outstanding actions..."
                    className="min-h-[220px] text-xs"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                    >
                      {isGeneratingSummary ? (
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
                </TabsContent>

                <TabsContent value="issues" className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Track closure blockers, risks, or warranty items that must be resolved prior to final acceptance.
                  </p>
                  <Textarea
                    className="min-h-[220px] text-xs"
                    placeholder="Document pending approvals, unresolved defects, or warranty escalations..."
                  />
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase">
                      Last reviewed: {new Date().toLocaleDateString()}
                    </Badge>
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <AlertCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Closeout Guidance</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Attach signed acceptance certificates and QA/QC reports for audit readiness.</li>
                  <li>Link lessons learned and warranty documentation for continuity with FM team.</li>
                  <li>Confirm all digital assets are stored in the project handover workspace.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

