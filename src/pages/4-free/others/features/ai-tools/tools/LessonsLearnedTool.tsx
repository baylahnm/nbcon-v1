import { FormEvent, useMemo, useState } from "react";
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
import {
  Lightbulb,
  Sparkles,
  ArrowLeft,
  Download,
  Filter,
  Quote,
  User,
  RefreshCw,
} from "lucide-react";

type LessonCategory = "planning" | "execution" | "quality" | "commercial" | "handover";

interface LessonLearned {
  id: string;
  title: string;
  category: LessonCategory;
  description: string;
  impact: "low" | "medium" | "high";
  recommendation: string;
  owner: string;
}

const INITIAL_LESSONS: LessonLearned[] = [
  {
    id: "1",
    title: "Design coordination workshops",
    category: "planning",
    description:
      "Weekly multi-discipline coordination sessions resolved 80% of clashes before construction, reducing rework.",
    impact: "high",
    recommendation: "Mandate early coordination workshops across disciplines during design development.",
    owner: "Design Manager",
  },
  {
    id: "2",
    title: "Digital QA workflows",
    category: "quality",
    description:
      "Migrating inspection requests to a digital workflow improved closure time by 35% and captured traceability.",
    impact: "medium",
    recommendation: "Adopt digital QA platforms on future projects to accelerate approvals and analytics.",
    owner: "QA/QC Lead",
  },
  {
    id: "3",
    title: "Contractor warranty alignment",
    category: "handover",
    description:
      "Warranty scopes were unclear for key equipment resulting in delayed FM onboarding during handover.",
    impact: "high",
    recommendation: "Include FM team in commissioning and ensure warranty obligations are confirmed pre-handover.",
    owner: "Facilities Manager",
  },
];

const generateLessonId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `lesson-${Math.random().toString(36).slice(2, 10)}`;
};

export default function LessonsLearnedTool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const { sendMessage } = useAiStore();

  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [activeCategory, setActiveCategory] = useState<LessonCategory | "all">("all");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(lessons[0]?.id ?? null);
  const [summary, setSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const filteredLessons = useMemo(() => {
    if (activeCategory === "all") return lessons;
    return lessons.filter((lesson) => lesson.category === activeCategory);
  }, [activeCategory, lessons]);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0] ?? null;

  const handleAddLesson = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const recommendation = (formData.get("recommendation") as string)?.trim();
    const owner = (formData.get("owner") as string)?.trim() || "Project Team";
    const category = (formData.get("category") as LessonCategory) || "execution";
    const impact = (formData.get("impact") as LessonLearned["impact"]) || "medium";

    if (!title || !description) return;

    const newLesson: LessonLearned = {
      id: generateLessonId(),
      title,
      category,
      description,
      impact,
      recommendation,
      owner,
    };

    setLessons((prev) => [newLesson, ...prev]);
    setActiveCategory("all");
    setSelectedLessonId(newLesson.id);
    event.currentTarget.reset();
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    const prompt = [
      "Create a lessons learned executive summary for a construction project.",
      projectId ? `Project ID: ${projectId}` : "",
      "Lessons captured:",
      ...lessons.map(
        (lesson) =>
          `- ${lesson.title} (${lesson.category}) | Impact: ${lesson.impact} | Recommendation: ${lesson.recommendation}`
      ),
      "Organize by category, highlight recurring themes, and provide recommendations for institutional knowledge capture.",
    ].join("\n");

    try {
      await sendMessage(prompt);
      setSummary(
        `Lessons Learned Summary\n\nKey Themes:\n${lessons
          .map((lesson) => `- [${lesson.category.toUpperCase()}] ${lesson.title} (${lesson.impact} impact)`)
          .join("\n")}\n\nTop Recommendations:\n${lessons
          .slice(0, 3)
          .map((lesson) => `- ${lesson.recommendation}`)
          .join("\n")}\n\nNext Steps:\n- Share insights with PMO knowledge base\n- Update playbooks for preconstruction and handover phases\n- Integrate improvements into upcoming bids and mobilization decks`
      );
    } catch (error) {
      console.error("AI summary generation failed", error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(ROUTES.AI_TOOLS.CLOSURE)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-primary-gradient h-9 w-9 rounded-xl flex items-center justify-center shadow-md">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">Lessons Learned Compiler</h1>
                <p className="text-xs text-muted-foreground">
                  Capture, categorize, and share project knowledge to accelerate continuous improvement.
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
              <Filter className="h-3.5 w-3.5 mr-1" />
              Export by Category
            </Button>
            <Button size="sm" className="h-8 text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-sm font-semibold">Add Lesson</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleAddLesson} className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground" htmlFor="title">
                    Lesson title
                  </Label>
                  <Input id="title" name="title" className="h-8 text-xs" placeholder="What happened?" required />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground" htmlFor="description">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="min-h-[120px] text-xs"
                    placeholder="Describe the situation, outcome, and context..."
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground" htmlFor="recommendation">
                    Recommendation
                  </Label>
                  <Textarea
                    id="recommendation"
                    name="recommendation"
                    className="min-h-[80px] text-xs"
                    placeholder="How should we replicate or avoid this in future projects?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground" htmlFor="category">
                      Category
                    </Label>
                    <select id="category" name="category" className="h-8 w-full rounded-md border border-border bg-background px-2">
                      <option value="planning">Planning</option>
                      <option value="execution">Execution</option>
                      <option value="quality">Quality</option>
                      <option value="commercial">Commercial</option>
                      <option value="handover">Handover</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground" htmlFor="impact">
                      Impact
                    </Label>
                    <select id="impact" name="impact" className="h-8 w-full rounded-md border border-border bg-background px-2">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-[11px] text-muted-foreground" htmlFor="owner">
                      Knowledge owner
                    </Label>
                    <Input id="owner" name="owner" className="h-8 text-xs" placeholder="Role or department" />
                  </div>
                </div>
                <Button type="submit" size="sm" className="w-full h-8 text-xs">
                  Add Lesson
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/50 xl:col-span-2">
            <CardHeader className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Captured Lessons</CardTitle>
                <div className="hidden sm:flex gap-1">
                  <Button
                    variant={activeCategory === "all" ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-[11px] px-2"
                    onClick={() => setActiveCategory("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={activeCategory === "planning" ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-[11px] px-2"
                    onClick={() => setActiveCategory("planning")}
                  >
                    Planning
                  </Button>
                  <Button
                    variant={activeCategory === "execution" ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-[11px] px-2"
                    onClick={() => setActiveCategory("execution")}
                  >
                    Execution
                  </Button>
                  <Button
                    variant={activeCategory === "quality" ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-[11px] px-2"
                    onClick={() => setActiveCategory("quality")}
                  >
                    Quality
                  </Button>
                  <Button
                    variant={activeCategory === "commercial" ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-[11px] px-2"
                    onClick={() => setActiveCategory("commercial")}
                  >
                    Commercial
                  </Button>
                  <Button
                    variant={activeCategory === "handover" ? "default" : "outline"}
                    size="sm"
                    className="h-8 text-[11px] px-2"
                    onClick={() => setActiveCategory("handover")}
                  >
                    Handover
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Tabs defaultValue="list" className="sm:hidden">
                <TabsList className="grid grid-cols-3 h-8 text-[11px]">
                  <TabsTrigger value="list">List</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="space-y-3">
                  {filteredLessons.map((lesson) => (
                    <button
                      type="button"
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`w-full text-left p-3 rounded-lg border ${
                        selectedLessonId === lesson.id ? "border-primary bg-primary/5" : "border-border/40 bg-background/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{lesson.title}</p>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {lesson.impact}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{lesson.description}</p>
                    </button>
                  ))}
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-4">
                <div className="hidden lg:flex flex-col gap-2">
                  {filteredLessons.map((lesson) => (
                    <button
                      type="button"
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`text-left p-3 rounded-lg border ${
                        selectedLessonId === lesson.id ? "border-primary bg-primary/5" : "border-border/40 bg-background/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{lesson.title}</p>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {lesson.category}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-3">{lesson.description}</p>
                    </button>
                  ))}
                </div>

                <Card className="border border-border/40 bg-background/80">
                  <CardContent className="p-4 space-y-3">
                    {selectedLesson ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold">{selectedLesson.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{selectedLesson.category}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {selectedLesson.impact} impact
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] text-muted-foreground">Description</Label>
                          <p className="text-xs leading-relaxed bg-muted/30 p-3 rounded-md border border-border/40">
                            {selectedLesson.description}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[11px] text-muted-foreground">Recommendation</Label>
                          <p className="text-xs leading-relaxed bg-muted/30 p-3 rounded-md border border-border/40">
                            {selectedLesson.recommendation || "Document recommendation to action this learning."}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          {selectedLesson.owner}
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">Select a lesson to view full details.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-sm font-semibold">Lessons Learned Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="p-3 rounded-md border border-primary/20 bg-primary/10 flex items-start gap-3">
              <Quote className="h-4 w-4 text-primary mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Summaries are perfect for steering committee packs, PMO knowledge libraries, and preconstruction playbooks.
              </p>
            </div>
            <Textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              className="min-h-[200px] text-xs"
              placeholder="Ask AI to generate a categorized summary with recommended next steps..."
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
                    Generate Summary with AI
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
