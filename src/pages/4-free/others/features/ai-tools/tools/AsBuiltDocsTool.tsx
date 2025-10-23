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
  FileText,
  Layers,
  Download,
  Sparkles,
  ArrowLeft,
  Upload,
  PenSquare,
  RefreshCw,
} from "lucide-react";

type DisciplinePackage = {
  id: string;
  discipline: string;
  drawings: number;
  status: "pending" | "in-review" | "approved";
  reviewer: string;
  comments: string;
};

const INITIAL_PACKAGES: DisciplinePackage[] = [
  {
    id: "arch",
    discipline: "Architectural",
    drawings: 42,
    status: "in-review",
    reviewer: "Lead Architect",
    comments: "Awaiting mark-up resolution for Level 04 core walls.",
  },
  {
    id: "struct",
    discipline: "Structural",
    drawings: 31,
    status: "approved",
    reviewer: "Structural Lead",
    comments: "All revisions captured. IFC vs As-Built deviations logged.",
  },
  {
    id: "mefp",
    discipline: "MEP",
    drawings: 56,
    status: "pending",
    reviewer: "MEP Coordinator",
    comments: "Need verification for chilled water routing adjustments.",
  },
];

export default function AsBuiltDocsTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { sendMessage } = useAiStore();

  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [changeLog, setChangeLog] = useState(
    "01. Architectural RFI-219 updates façade louver spacing on elevations A1-A6.\n02. Structural NCR-17 introduces additional slab reinforcement at Grid C5.\n03. MEP CR-42 reroutes LV cable trays to accommodate ceiling coordination.\n"
  );
  const [executiveSummary, setExecutiveSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const approvalProgress = useMemo(() => {
    const total = packages.length;
    const approved = packages.filter((pkg) => pkg.status === "approved").length;
    return total === 0 ? 0 : Math.round((approved / total) * 100);
  }, [packages]);

  const handleStatusChange = (id: string, status: DisciplinePackage["status"]) => {
    setPackages((prev) => prev.map((pkg) => (pkg.id === id ? { ...pkg, status } : pkg)));
  };

  const handleCommentChange = (id: string, comments: string) => {
    setPackages((prev) => prev.map((pkg) => (pkg.id === id ? { ...pkg, comments } : pkg)));
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const prompt = [
      "Draft an executive summary for an as-built documentation package.",
      projectId ? `Project ID: ${projectId}` : "",
      "Discipline status:",
      ...packages.map((pkg) => `- ${pkg.discipline}: ${pkg.status} (${pkg.drawings} drawings)`),
      "Key change log items:",
      changeLog || "- No change log captured",
      "Highlight coordination actions, pending reviews, and recommended next steps for warranty handover.",
    ].join("\n");

    try {
      await sendMessage(prompt);
      setExecutiveSummary(
        `Executive Summary Draft\n\nApproval Progress: ${approvalProgress}% complete.\n\nHighlights:\n${packages
          .map((pkg) => `- ${pkg.discipline}: ${pkg.status.replace("-", " ")} (${pkg.drawings} drawings)`)
          .join("\n")}\n\nChange Log:\n${changeLog}\n\nNext Steps:\n- Resolve outstanding mark-ups and issue final PDFs\n- Coordinate digital archive delivery to client CDE\n- Schedule lessons learned session with design consultants`
      );
    } catch (error) {
      console.error("AI summary generation failed", error);
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
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">As-Built Documentation Generator</h1>
                <p className="text-xs text-muted-foreground">
                  Coordinate final drawing submissions and capture revision history with AI support.
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
            <Button variant="outline" className="h-8 text-xs">
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Upload Packages
            </Button>
            <Button className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export Binder
            </Button>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Approval Progress</CardTitle>
              <Badge variant="outline" className="text-[10px] uppercase">
                {approvalProgress}% complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <Progress value={approvalProgress} className="h-2" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="p-3 border border-border/40 rounded-lg bg-background/60">
                <p className="font-medium text-foreground mb-1">Pending Review</p>
                <p>{packages.filter((pkg) => pkg.status === "pending").length} discipline packages</p>
              </div>
              <div className="p-3 border border-border/40 rounded-lg bg-background/60">
                <p className="font-medium text-foreground mb-1">In Review</p>
                <p>{packages.filter((pkg) => pkg.status === "in-review").length} undergoing mark-up updates</p>
              </div>
              <div className="p-3 border border-border/40 rounded-lg bg-background/60">
                <p className="font-medium text-foreground mb-1">Approved</p>
                <p>{packages.filter((pkg) => pkg.status === "approved").length} ready for archive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2 border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Discipline Packages</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-4 rounded-lg border border-border/40 bg-background/60 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{pkg.discipline}</p>
                      <p className="text-xs text-muted-foreground">{pkg.drawings} drawings</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={pkg.status === "pending" ? "default" : "outline"}
                        className="h-7 text-[11px]"
                        onClick={() => handleStatusChange(pkg.id, "pending")}
                      >
                        Pending
                      </Button>
                      <Button
                        size="sm"
                        variant={pkg.status === "in-review" ? "default" : "outline"}
                        className="h-7 text-[11px]"
                        onClick={() => handleStatusChange(pkg.id, "in-review")}
                      >
                        In Review
                      </Button>
                      <Button
                        size="sm"
                        variant={pkg.status === "approved" ? "default" : "outline"}
                        className="h-7 text-[11px]"
                        onClick={() => handleStatusChange(pkg.id, "approved")}
                      >
                        Approved
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_200px] gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">Reviewer Comments</Label>
                      <Textarea
                        value={pkg.comments}
                        onChange={(event) => handleCommentChange(pkg.id, event.target.value)}
                        className="min-h-[110px] text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] text-muted-foreground">Reviewer</Label>
                      <Input value={pkg.reviewer} readOnly className="h-8 text-xs" />
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        <PenSquare className="h-3.5 w-3.5 mr-1" />
                        Request Update
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Tabs defaultValue="summary">
                <TabsList className="grid grid-cols-2 h-9 text-xs">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="changelog">Change Log</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="space-y-3">
                  <Textarea
                    value={executiveSummary}
                    onChange={(event) => setExecutiveSummary(event.target.value)}
                    placeholder="Summarize overall status, highlight major deviations, and confirm document handover steps..."
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
                <TabsContent value="changelog" className="space-y-3">
                  <Textarea
                    value={changeLog}
                    onChange={(event) => setChangeLog(event.target.value)}
                    className="min-h-[220px] text-xs font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Capture approved RFIs, NCR closures, and client directives reflected in the final drawings.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <FloatingAIButton />
    </div>
  );
}

