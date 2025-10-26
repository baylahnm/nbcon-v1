/**
 * Agent Workspace Component
 * Phase 2: Specialized AI Engineering Agents
 * 
 * Provides specialized interface for agent workflows with:
 * - Tool palette for discipline-specific tools
 * - Decision checkpoint handling
 * - Deliverable generation and review
 * - Real-time progress tracking
 */

import { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import {
  invokeAgent,
  startAgentSession,
  getSessionDeliverables,
  submitFeedback,
} from '@/shared/services/agentService';
import type {
  AIAgent,
  AgentSession,
  AgentDeliverable,
  ValidationResult,
} from '@/shared/types/ai-agents';

interface AgentWorkspaceProps {
  agent: AIAgent;
  projectId?: string;
  jobId?: string;
  onClose?: () => void;
}

export function AgentWorkspace({ agent, projectId, jobId, onClose }: AgentWorkspaceProps) {
  const [session, setSession] = useState<AgentSession | null>(null);
  const [currentStage, setCurrentStage] = useState<string>('initialization');
  const [deliverables, setDeliverables] = useState<AgentDeliverable[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  useEffect(() => {
    initializeSession();
  }, [agent.id]);

  const initializeSession = async () => {
    try {
      const sessionId = await startAgentSession(agent.id, 'consultation', {
        projectId,
        jobId,
      });
      
      setSession({
        id: sessionId,
        user_id: '',
        agent_id: agent.id,
        session_type: 'consultation',
        project_id: projectId,
        job_id: jobId,
        workflow_stage: agent.workflows[0] || 'initial',
        decision_points: [],
        deliverables: [],
        started_at: new Date().toISOString(),
        is_active: true,
        session_data: {},
      });
      
      console.log('[AgentWorkspace] Session started:', sessionId);
    } catch (error) {
      console.error('[AgentWorkspace] Failed to start session:', error);
    }
  };

  const handleToolInvoke = async (toolName: string, inputs: Record<string, any>) => {
    if (!session) return;
    
    setIsProcessing(true);
    
    try {
      const response = await invokeAgent(
        agent,
        session.id,
        {
          type: toolName,
          inputs,
          context: {
            project_id: projectId,
            job_id: jobId,
            workflow_stage: currentStage,
          },
        }
      );
      
      if (response.status === 'success' || response.status === 'requires_review') {
        // Update validation results
        setValidationResults(response.validation_results || []);
        
        // Move to next stage if applicable
        const nextStageIndex = agent.workflows.indexOf(currentStage) + 1;
        if (nextStageIndex < agent.workflows.length) {
          setCurrentStage(agent.workflows[nextStageIndex]);
        }
        
        // Load deliverables
        const delivs = await getSessionDeliverables(session.id);
        setDeliverables(delivs);
      }
    } catch (error) {
      console.error('[AgentWorkspace] Tool invocation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeedback = async (rating: 1 | 2 | 3 | 4 | 5, comment?: string) => {
    if (!session) return;
    
    try {
      await submitFeedback({
        sessionId: session.id,
        feedbackType: 'usability',
        rating,
        comment,
      });
      
      console.log('[AgentWorkspace] Feedback submitted');
    } catch (error) {
      console.error('[AgentWorkspace] Feedback error:', error);
    }
  };

  if (!session) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5 animate-spin" />
            <p className="text-sm">Initializing {agent.display_name}...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const passedValidations = validationResults.filter(v => v.passed).length;
  const totalValidations = validationResults.length;
  const validationPercent = totalValidations > 0 ? (passedValidations / totalValidations) * 100 : 100;

  return (
    <div className="space-y-4">
      {/* Agent Header */}
      <Card className="border-border/50">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`${agent.color_scheme} h-10 w-10 flex items-center justify-center rounded-xl shadow-md`}>
                {(() => {
                  const Icon = AGENT_ICONS[agent.icon_name] || Sparkles;
                  return <Icon className="h-5 w-5 text-white" />;
                })()}
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight">{agent.display_name}</h2>
                <p className="text-xs text-muted-foreground">
                  Stage: {currentStage.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-0">
                Active
              </Badge>
              {onClose && (
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Tool Palette */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="p-4 border-b border-border/40">
            <CardTitle className="text-base font-bold tracking-tight">
              Agent Tools & Workflows
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Tabs defaultValue="capabilities">
              <TabsList className="w-full grid grid-cols-3 gap-0">
                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>

              {/* Capabilities Tab */}
              <TabsContent value="capabilities" className="space-y-3 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {agent.capabilities.map((capability, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleToolInvoke(capability, {})}
                      disabled={isProcessing}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all text-left disabled:opacity-50"
                    >
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{capability.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground">Click to execute</p>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              {/* Workflows Tab */}
              <TabsContent value="workflows" className="space-y-3 mt-4">
                {agent.workflows.map((workflow, idx) => {
                  const isCurrentStage = workflow === currentStage;
                  const stageIndex = agent.workflows.indexOf(currentStage);
                  const isComplete = idx < stageIndex;
                  
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        isCurrentStage
                          ? 'border-primary bg-primary/5'
                          : isComplete
                          ? 'border-green-500/50 bg-green-500/5'
                          : 'border-border/50'
                      }`}
                    >
                      <div className="flex items-center justify-center h-8 w-8">
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : isCurrentStage ? (
                          <div className="h-5 w-5 rounded-full bg-primary animate-pulse" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-border" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{workflow.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground">
                          {isComplete ? 'Completed' : isCurrentStage ? 'In Progress' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              {/* Tools Tab */}
              <TabsContent value="tools" className="space-y-2 mt-4">
                {agent.tool_stack.map((tool, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded border border-border/50"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm flex-1">{tool.replace(/_/g, ' ')}</p>
                    <Badge variant="outline" className="text-[9px]">Available</Badge>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Right: Status & Validation */}
        <div className="space-y-4">
          {/* Validation Status */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-base font-bold tracking-tight">
                Quality Assurance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Validation Status</span>
                  <span className="font-medium">{passedValidations}/{totalValidations} Passed</span>
                </div>
                <Progress value={validationPercent} className="h-2" />
              </div>

              {validationResults.length > 0 && (
                <ScrollArea className="h-[150px]">
                  <div className="space-y-2">
                    {validationResults.map((result, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 p-2 rounded border ${
                          result.passed
                            ? 'border-green-500/30 bg-green-500/5'
                            : 'border-amber-500/30 bg-amber-500/5'
                        }`}
                      >
                        {result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium">{result.message}</p>
                          {result.suggested_fix && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Fix: {result.suggested_fix}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {validationResults.length === 0 && (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No validation checks run yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-base font-bold tracking-tight flex items-center justify-between">
                Deliverables
                <Badge variant="outline" className="text-xs">
                  {deliverables.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {deliverables.length > 0 ? (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {deliverables.map((deliv) => (
                      <div
                        key={deliv.id}
                        className="flex items-start gap-2 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-primary mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{deliv.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {deliv.deliverable_type.replace(/_/g, ' ')}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              className={`text-[9px] ${
                                deliv.validation_status === 'validated'
                                  ? 'bg-green-500/10 text-green-600 border-0'
                                  : deliv.validation_status === 'rejected'
                                  ? 'bg-red-500/10 text-red-600 border-0'
                                  : 'bg-amber-500/10 text-amber-600 border-0'
                              }`}
                            >
                              {deliv.validation_status}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No deliverables generated yet
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Use tools above to generate outputs
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Feedback */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/40">
              <CardTitle className="text-base font-bold tracking-tight">
                Quick Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                How is this agent performing?
              </p>
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleFeedback(5, 'Excellent performance')}
                >
                  <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                  Good
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => handleFeedback(2, 'Needs improvement')}
                >
                  <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
                  Poor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workflow Progress */}
      <Card className="border-border/50">
        <CardHeader className="p-4 border-b border-border/40">
          <CardTitle className="text-base font-bold tracking-tight">
            Workflow Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {agent.workflows.map((workflow, idx) => {
              const isCurrentStage = workflow === currentStage;
              const stageIndex = agent.workflows.indexOf(currentStage);
              const isComplete = idx < stageIndex;
              
              return (
                <div key={idx} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center h-8 px-3 rounded-lg text-xs font-medium transition-all ${
                      isCurrentStage
                        ? 'bg-primary text-primary-foreground'
                        : isComplete
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {workflow.replace(/_/g, ' ')}
                  </div>
                  {idx < agent.workflows.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 ${
                        isComplete ? 'bg-green-500' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

