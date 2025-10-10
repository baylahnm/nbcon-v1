import { useState } from "react";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card";
import { Button } from '@/pages/1-HomePage/others/components/ui/button";
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge";
import { Separator } from '@/pages/1-HomePage/others/components/ui/separator";

import { useAiStore } from "../store/useAiStore";
import { aiClient, type ServicePlan } from "../api/aiClient";
import type { ServiceMode } from "../services/config";

export function ServiceModeSelector() {
  const {
    availableServiceModes,
    serviceModes,
    activeServiceMode,
    activateServiceMode,
    setComposerText,
  } = useAiStore();

  const [isPlanning, setIsPlanning] = useState<ServiceMode | null>(null);
  const [plan, setPlan] = useState<ServicePlan | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);

  const handleActivate = (mode: ServiceMode) => {
    if (activeServiceMode !== mode) {
      activateServiceMode(mode);
    }
    setPlan(null);
    setPlanError(null);
  };

  const handlePlan = async (mode: ServiceMode) => {
    setIsPlanning(mode);
    setPlanError(null);
    try {
      const planResponse = await aiClient.planServiceWorkflow(mode);
      setPlan(planResponse);
      if (planResponse.prompt) {
        setComposerText(planResponse.prompt);
      }
    } catch (error) {
      console.error("Failed to fetch service plan", error);
      setPlanError(error instanceof Error ? error.message : "Unable to fetch service plan.");
    } finally {
      setIsPlanning(null);
    }
  };

  const handleInsertDeliverables = () => {
    if (!plan) return;
    const summary = [
      `# ${plan.title}`,
      "",
      plan.prompt,
      "",
      "## Expected Deliverables",
      ...plan.output.deliverables.map((item, index) => `${index + 1}. ${item}`),
    ].join("\n");
    setComposerText(summary);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>Kickstart a workflow with an AI-optimised service mode.</span>
      </div>

      <div className="space-y-3">
        {availableServiceModes.map((mode) => {
          const config = serviceModes[mode];
          const isActive = activeServiceMode === mode;
          return (
            <Card
              key={mode}
              className={`transition-shadow hover:shadow-lg border-border/80 ${
                isActive ? "border-primary shadow-primary/10" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base font-semibold">
                    {config.title}
                  </CardTitle>
                  <Badge
                    variant={isActive ? "default" : "outline"}
                    className="uppercase tracking-wide text-[10px]"
                  >
                    {mode}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {config.summary}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {config.tools.map((tool) => (
                    <Badge key={tool.id} variant="secondary" className="text-xs">
                      {tool.label}
                    </Badge>
                  ))}
                </div>

                <div className="rounded-md border border-dashed border-muted-foreground/20 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    Workflow Stages
                  </p>
                  <div className="grid gap-1 text-sm text-muted-foreground">
                    {config.workflow.map((stage, index) => (
                      <div key={stage.id} className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold text-primary">{index + 1}.</span>
                        <span>{stage.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    onClick={() => handleActivate(mode)}
                  >
                    Use Mode
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isPlanning === mode}
                    onClick={() => handlePlan(mode)}
                  >
                    {isPlanning === mode ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      "Preview Plan"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {planError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>{planError}</span>
        </div>
      )}

      {plan && (
        <Card className="border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{plan.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {plan.prompt}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wide">
                Deliverables
              </p>
              <Separator className="my-2" />
              <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-muted-foreground">
                {plan.output.deliverables.map((deliverable) => (
                  <li key={deliverable}>{deliverable}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={handleInsertDeliverables}>
                Insert Summary Into Composer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
