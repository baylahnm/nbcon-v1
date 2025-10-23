import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/1-HomePage/others/components/ui/card";
import { Button } from "@/pages/1-HomePage/others/components/ui/button";
import { Badge } from "@/pages/1-HomePage/others/components/ui/badge";
import { Input } from "@/pages/1-HomePage/others/components/ui/input";
import { Textarea } from "@/pages/1-HomePage/others/components/ui/textarea";
import { Label } from "@/pages/1-HomePage/others/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/pages/1-HomePage/others/components/ui/tabs";
import { Progress } from "@/pages/1-HomePage/others/components/ui/progress";
import { ROUTES } from "@/shared/constants/routes";
import { useAiStore } from "@/pages/4-free/others/features/ai/store/useAiStore";
import { FloatingAIButton } from "../components/FloatingAIButton";
import {
  BarChart3,
  Sparkles,
  ChevronLeft,
  Download,
  Clock8,
  DollarSign,
  Target,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

type Metric = {
  id: string;
  label: string;
  baseline: number;
  actual: number;
  unit: string;
};

type Milestone = {
  id: string;
  name: string;
  planned: string;
  actual: string;
  status: "completed" | "variance" | "pending";
  notes: string;
};

const INITIAL_METRICS: Metric[] = [
  { id: "cost", label: "Final Cost Variance", baseline: 0, actual: 2.8, unit: "%" },
  { id: "schedule", label: "Schedule Variance", baseline: 0, actual: -4.1, unit: "%" },
  { id: "safety", label: "Recordable Incidents", baseline: 0, actual: 1, unit: "case" },
  { id: "quality", label: "Defects at Handover", baseline: 0, actual: 6, unit: "items" },
];

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: "design",
    name: "Design Completion",
    planned: "2023-08-15",
    actual: "2023-09-02",
    status: "variance",
    notes: "Delayed due to façade redesign coordination.",
  },
  {
    id: "topping",
    name: "Structure Topping Out",
    planned: "2024-04-10",
    actual: "2024-04-12",
    status: "completed",
    notes: "Completed within float window.",
  },
  {
    id: "commissioning",
    name: "Commissioning Complete",
    planned: "2025-01-30",
    actual: "2025-02-05",
    status: "variance",
    notes: "Extra time for BMS integration testing.",
  },
  {
    id: "handover",
    name: "Client Handover",
    planned: "2025-03-18",
    actual: "2025-03-18",
    status: "completed",
    notes: "Handover achieved with conditional warranties pending.",
  },
];

export default function FinalReportTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { sendMessage } = useAiStore();

  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [benefitsRealised, setBenefitsRealised] = useState(
    "• Delivered 62,000 m² mixed-use development on schedule.\n• Achieved 18% energy efficiency improvement through optimized façade design.\n• Reduced commissioning defects by 35% using digital QA workflows.\n"
  );
  const [lessonsForward, setLessonsForward] = useState(
    "• Embed FM representatives earlier in commissioning to streamline handover.\n• Standardize digital QA/QC workflows across all projects.\n• Expand supplier framework to improve warranty onboarding speed.\n"
  );
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const schedulePerformance = useMemo(() => {
    const planned = milestones.length;
    const onTime = milestones.filter((milestone) => milestone.status === "completed").length;
    return planned === 0 ? 0 : Math.round((onTime / planned) * 100);
  }, [milestones]);

  const handleMetricUpdate = (id: string, actual: number) => {
    setMetrics((prev) => prev.map((metric) => (metric.id === id ? { ...metric, actual } : metric)));
  };

  const handleMilestoneUpdate = (id: string, updates: Partial<Milestone>) => {
    setMilestones((prev) => prev.map((milestone) => (milestone.id === id ? { ...milestone, ...updates } : milestone)));
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const prompt = [
      "Create an executive final completion report for a construction project.",
      projectId ? `Project ID: ${projectId}` : "",
      "Key metrics:",
      ...metrics.map((metric) => `- ${metric.label}: ${metric.actual}${metric.unit}`),
      "Milestones:",
      ...milestones.map((milestone) => `- ${milestone.name}: Planned ${milestone.planned}, Actual ${milestone.actual}`),
      "Benefits realised:",
      benefitsRealised,
      "Forward looking lessons:",
      lessonsForward,
      "Structure the summary with achievements, variances, and recommendations for future projects.",
    ].join("\n");

    try {
      await sendMessage(prompt);
      setExecutiveSummary(
        `Executive Completion Summary\n\nHighlights:\n${metrics
          .map((metric) => `- ${metric.label}: ${metric.actual}${metric.unit}`)
          .join("\n")}\n\nSchedule Performance: ${schedulePerformance}% of key milestones achieved on time.\n\nBenefits Realised:\n${benefitsRealised}\nForward Look:\n${lessonsForward}\n\nRecommendations:\n- Institutionalize early design coordination to reduce rework\n- Continue digital QA workflows across delivery portfolio\n- Embed FM onboarding earlier to protect warranty activation`
      );
    } catch (error) {
      console.error("AI executive summary failed", error);
    } finally {
      setIsGeneratingSummary(false);
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
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">Final Report Generator</h1>
                <p className="text-xs text-muted-foreground">
                  Compile closeout metrics, milestone variances, and forward-looking recommendations with AI support.
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
              <Download className="h-3.5 w-3.5 mr-1" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="border-border/50 xl:col-span-2">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.map((metric) => (
                  <div key={metric.id} className="p-4 rounded-lg border border-border/40 bg-background/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{metric.label}</p>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        Baseline {metric.baseline}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {metric.id === "cost" ? (
                          <DollarSign className="h-4 w-4 text-primary" />
                        ) : metric.id === "schedule" ? (
                          <Clock8 className="h-4 w-4 text-primary" />
                        ) : (
                          <Target className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Label className="text-[11px] text-muted-foreground">Actual</Label>
                        <Input
                          type="number"
                          value={metric.actual}
                          step="0.1"
                          onChange={(event) => handleMetricUpdate(metric.id, Number(event.target.value) || 0)}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {metric.actual >= metric.baseline ? "Variance against baseline recorded." : "Improvement delivered."}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Schedule Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{schedulePerformance}% on-time milestones</p>
                  <p className="text-xs text-muted-foreground">Tracked against contractual baseline</p>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {milestones.length} milestones
                </Badge>
              </div>
              <Progress value={schedulePerformance} className="h-2" />
              <div className="space-y-3 text-xs">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="p-3 rounded-lg border border-border/40 bg-background/60 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{milestone.name}</p>
                      <Badge
                        variant={milestone.status === "variance" ? "destructive" : "outline"}
                        className="text-[10px] uppercase"
                      >
                        {milestone.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Planned</Label>
                        <Input
                          type="date"
                          value={milestone.planned}
                          onChange={(event) =>
                            handleMilestoneUpdate(milestone.id, { planned: event.target.value })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Actual</Label>
                        <Input
                          type="date"
                          value={milestone.actual}
                          onChange={(event) =>
                            handleMilestoneUpdate(milestone.id, { actual: event.target.value })
                          }
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    <Textarea
                      value={milestone.notes}
                      onChange={(event) => handleMilestoneUpdate(milestone.id, { notes: event.target.value })}
                      className="min-h-[80px] text-xs"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-sm font-semibold">Strategic Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <Tabs defaultValue="benefits" className="w-full">
              <TabsList className="grid grid-cols-3 h-9 text-xs">
                <TabsTrigger value="benefits">Benefits Realised</TabsTrigger>
                <TabsTrigger value="lessons">Forward Lessons</TabsTrigger>
                <TabsTrigger value="summary">Executive Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="benefits" className="space-y-3">
                <Textarea
                  value={benefitsRealised}
                  onChange={(event) => setBenefitsRealised(event.target.value)}
                  className="min-h-[180px] text-xs font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Highlight KPI improvements, sustainability gains, stakeholder satisfaction, and contractual closeout results.
                </p>
              </TabsContent>
              <TabsContent value="lessons" className="space-y-3">
                <Textarea
                  value={lessonsForward}
                  onChange={(event) => setLessonsForward(event.target.value)}
                  className="min-h-[180px] text-xs font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Document opportunities to improve mobilization, procurement, digital workflows, and handover readiness.
                </p>
              </TabsContent>
              <TabsContent value="summary" className="space-y-3">
                <Textarea
                  value={executiveSummary}
                  onChange={(event) => setExecutiveSummary(event.target.value)}
                  className="min-h-[220px] text-xs"
                  placeholder="Ask AI to generate a polished executive summary..."
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
                    Export Section
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-muted/40">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Report Checklist</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Attach commissioning certificates and signed acceptance documents.</li>
                  <li>Ensure warranty register references align with warranty builder tool.</li>
                  <li>Upload final report to client portal and internal PMO knowledge base.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <FloatingAIButton />
    </div>
  );
}

