/**
 * Unified Tool Access Panel
 * 
 * Comprehensive UI exposing all AI tools, agents, active sessions,
 * workflow context, and intelligent recommendations following strict
 * nbcon design system rules.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import {
  Rocket,
  Sparkles,
  Clock,
  TrendingUp,
  Lock,
  ChevronRight,
  Grid3x3,
  History,
  AlertCircle,
  Play,
  DollarSign,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// Orchestration imports
import {
  AI_TOOL_REGISTRY,
  getTool,
  getToolsByCategory,
  canAccessTool,
  type AITool,
  type ToolCategory,
  type EngineeringDiscipline,
} from '@/shared/ai/orchestration/toolRegistry';
import { useSessionStore, useSessionSummary, type ToolInteraction } from '@/shared/ai/orchestration/sessionStore';
import { generateSuggestions, type ToolSuggestion } from '@/shared/ai/orchestration/suggestionEngine';
import { WorkflowBreadcrumb } from './WorkflowBreadcrumb';
import { ToolSuggestionBadges } from './ToolSuggestionBadges';
import type { UserRole } from '@/shared/types/auth';

interface UnifiedToolAccessPanelProps {
  userRole: UserRole;
  userDisciplines?: EngineeringDiscipline[];
  projectPhase?: string;
  onToolSelect?: (toolId: string) => void;
  compact?: boolean;
}

export function UnifiedToolAccessPanel({
  userRole,
  userDisciplines = [],
  projectPhase,
  onToolSelect,
  compact = false,
}: UnifiedToolAccessPanelProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'agents' | 'history' | 'recommended'>('recommended');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const session = useSessionStore((state) => state.activeSession);
  const summary = useSessionSummary();
  const navigate = useNavigate();

  // Generate recommendations
  const [recommendations, setRecommendations] = useState<ToolSuggestion[]>([]);

  useEffect(() => {
    const suggestions = generateSuggestions(
      {
        currentToolId: session?.activeTool || undefined,
        projectPhase: projectPhase as any,
        userRole,
        recentToolIds: session?.toolChain || [],
        session: session || undefined,
      },
      6
    );
    setRecommendations(suggestions);
  }, [session, projectPhase, userRole]);

  const handleToolClick = (toolId: string) => {
    const tool = getTool(toolId);
    if (!tool) return;

    // Check access
    const hasAccess = canAccessTool(tool, userRole, userDisciplines, projectPhase as any);
    if (!hasAccess) {
      alert(`Access denied: ${tool.displayName} requires specific permissions or disciplines.`);
      return;
    }

    if (onToolSelect) {
      onToolSelect(toolId);
    } else {
      navigate(tool.endpoint);
    }
  };

  const categories: Array<{ id: ToolCategory | 'all'; label: string; icon: LucideIcon }> = [
    { id: 'all', label: 'All Tools', icon: Grid3x3 },
    { id: 'planning', label: 'Planning', icon: Rocket },
    { id: 'budgeting', label: 'Budgeting', icon: DollarSign },
    { id: 'execution', label: 'Execution', icon: Play },
    { id: 'quality', label: 'Quality', icon: Zap },
    { id: 'agent', label: 'Agents', icon: Sparkles },
  ];

  const filteredTools = selectedCategory === 'all'
    ? Object.values(AI_TOOL_REGISTRY).filter((tool) => canAccessTool(tool, userRole, userDisciplines, projectPhase as any))
    : getToolsByCategory(selectedCategory).filter((tool) => canAccessTool(tool, userRole, userDisciplines, projectPhase as any));

  if (compact) {
    return <CompactToolPanel userRole={userRole} userDisciplines={userDisciplines} projectPhase={projectPhase} onToolSelect={onToolSelect} />;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="bg-primary-gradient h-10 w-10 rounded-xl shadow-md flex items-center justify-center">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">AI Tool Hub</h1>
            <p className="text-xs text-muted-foreground">
              46 tools • 9 specialized agents • Intelligent orchestration
            </p>
          </div>
        </div>
        {summary.hasSession && (
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Session Active
          </Badge>
        )}
      </div>

      {/* Active Workflow Breadcrumb */}
      {summary.hasSession && <WorkflowBreadcrumb />}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-10">
          <TabsTrigger value="recommended" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Recommended
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs">
            <Grid3x3 className="h-3 w-3 mr-1" />
            All Tools
          </TabsTrigger>
          <TabsTrigger value="agents" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <History className="h-3 w-3 mr-1" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Tab: Recommended */}
        <TabsContent value="recommended" className="space-y-4">
          {recommendations.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {recommendations.map((suggestion) => (
                  <ToolRecommendationCard
                    key={suggestion.tool.id}
                    suggestion={suggestion}
                    onClick={() => handleToolClick(suggestion.tool.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No recommendations yet"
              description="Start using tools to get personalized suggestions"
              action={<Button size="sm" onClick={() => setActiveTab('all')}>Browse All Tools</Button>}
            />
          )}
        </TabsContent>

        {/* Tab: All Tools */}
        <TabsContent value="all" className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs whitespace-nowrap"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Tools Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                userRole={userRole}
                userDisciplines={userDisciplines}
                projectPhase={projectPhase}
                onClick={() => handleToolClick(tool.id)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Tab: Agents */}
        <TabsContent value="agents" className="space-y-4">
          <AgentGrid
            userRole={userRole}
            userDisciplines={userDisciplines}
            onAgentSelect={handleToolClick}
          />
        </TabsContent>

        {/* Tab: History */}
        <TabsContent value="history" className="space-y-4">
          <SessionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Tool Card Component
 */
function ToolCard({
  tool,
  userRole,
  userDisciplines,
  projectPhase,
  onClick,
}: {
  tool: AITool;
  userRole: UserRole;
  userDisciplines?: EngineeringDiscipline[];
  projectPhase?: string;
  onClick: () => void;
}) {
  const iconModule = require('lucide-react') as Record<string, LucideIcon>;
  const Icon = iconModule[tool.icon] || Rocket;
  const hasAccess = canAccessTool(tool, userRole, userDisciplines, projectPhase as any);
  const isAgent = tool.category === 'agent';

  return (
    <Card
      className={`group cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${
        !hasAccess ? 'opacity-60' : ''
      }`}
      onClick={hasAccess ? onClick : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon Container */}
          <div className={`${isAgent ? 'bg-primary-gradient' : 'bg-primary/10'} p-2 rounded-xl ring-1 ring-primary/20 shadow-md flex-shrink-0 ${hasAccess ? 'group-hover:scale-110' : ''} transition-transform`}>
            <Icon className={`h-4 w-4 ${isAgent ? 'text-white' : 'text-primary'}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-tight">{tool.displayName}</h3>
              {!hasAccess && <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 pt-1">
              {tool.capabilities.slice(0, 3).map((cap) => (
                <Badge key={cap} variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                  {cap}
                </Badge>
              ))}
              {tool.estimatedDuration && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                  {tool.estimatedDuration}m
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Tool Recommendation Card
 */
function ToolRecommendationCard({
  suggestion,
  onClick,
}: {
  suggestion: ToolSuggestion;
  onClick: () => void;
}) {
  const iconModule = require('lucide-react') as Record<string, LucideIcon>;
  const Icon = iconModule[suggestion.tool.icon] || Sparkles;

  return (
    <Card
      className="group cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-primary/20"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary-gradient p-2.5 rounded-xl shadow-md group-hover:scale-110 transition-transform">
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">{suggestion.tool.displayName}</h3>
              {suggestion.priority === 'high' && (
                <Badge className="text-[9px] bg-primary/10 text-primary border-primary/20 px-1.5 py-0 h-4">
                  High Priority
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1">
              <TrendingUp className="h-3 w-3" />
              <span>Score: {suggestion.score}/100</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Agent Grid
 */
function AgentGrid({
  userRole,
  userDisciplines,
  onAgentSelect,
}: {
  userRole: UserRole;
  userDisciplines?: EngineeringDiscipline[];
  onAgentSelect: (agentId: string) => void;
}) {
  const agents = getToolsByCategory('agent');

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {agents.map((agent) => {
        const iconModule = require('lucide-react') as Record<string, LucideIcon>;
        const Icon = iconModule[agent.icon] || Zap;
        const hasAccess = canAccessTool(agent, userRole, userDisciplines);

        return (
          <Card
            key={agent.id}
            className={`group cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${
              !hasAccess ? 'opacity-60' : ''
            }`}
            onClick={hasAccess ? () => onAgentSelect(agent.id) : undefined}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="bg-primary-gradient h-12 w-12 rounded-xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-semibold">{agent.displayName}</h3>
                    {!hasAccess && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {agent.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 4).map((cap) => (
                      <Badge key={cap} variant="outline" className="text-[9px] px-1.5 py-0">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Session History
 */
function SessionHistory() {
  const session = useSessionStore((state) => state.activeSession);
  const summary = useSessionSummary();

  if (!session || session.interactions.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No activity yet"
        description="Your tool usage history will appear here"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-muted/30 via-muted/20 to-background">
        <CardHeader className="p-4">
          <CardTitle className="text-sm font-bold">Session Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Tools Used</p>
              <p className="text-xl font-bold tracking-tight">{summary.toolCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Actions</p>
              <p className="text-xl font-bold tracking-tight">{summary.interactionCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Cost</p>
              <p className="text-xl font-bold tracking-tight">${summary.totalCost.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interaction List */}
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-sm font-bold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {session.interactions.slice().reverse().map((interaction) => (
                <InteractionItem key={interaction.id} interaction={interaction} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Interaction Item
 */
function InteractionItem({ interaction }: { interaction: ToolInteraction }) {
  const tool = getTool(interaction.toolId);
  if (!tool) return null;

  const iconModule = require('lucide-react') as Record<string, LucideIcon>;
  const Icon = iconModule[tool.icon] || Clock;

  return (
    <div className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg hover:shadow-md transition-shadow">
      <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
        <Icon className="h-3 w-3 text-primary" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium">{tool.displayName}</p>
          <Badge
            variant={interaction.success ? 'default' : 'destructive'}
            className="text-[9px] px-1.5 py-0 h-4"
          >
            {interaction.success ? 'Success' : 'Failed'}
          </Badge>
        </div>
        <p className="text-[10px] text-muted-foreground">
          {new Date(interaction.timestamp).toLocaleString()}
        </p>
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
          <span>{interaction.duration}ms</span>
          <span>•</span>
          <span>{interaction.tokensUsed} tokens</span>
          <span>•</span>
          <span>${interaction.costUSD.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Empty State
 */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <p className="text-xs text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}

/**
 * Compact Tool Panel (for sidebars)
 */
function CompactToolPanel({
  userRole,
  userDisciplines,
  projectPhase,
  onToolSelect,
}: {
  userRole: UserRole;
  userDisciplines?: EngineeringDiscipline[];
  projectPhase?: string;
  onToolSelect?: (toolId: string) => void;
}) {
  const session = useSessionStore((state) => state.activeSession);
  const [recommendations, setRecommendations] = useState<ToolSuggestion[]>([]);

  useEffect(() => {
    const suggestions = generateSuggestions(
      {
        currentToolId: session?.activeTool || undefined,
        projectPhase: projectPhase as any,
        userRole,
        recentToolIds: session?.toolChain || [],
        session: session || undefined,
      },
      3
    );
    setRecommendations(suggestions);
  }, [session, projectPhase, userRole]);

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium">Quick Access</span>
      </div>
      
      <div className="space-y-2">
        {recommendations.map((suggestion) => {
          const iconModule = require('lucide-react') as Record<string, LucideIcon>;
          const Icon = iconModule[suggestion.tool.icon] || Sparkles;
          return (
            <Button
              key={suggestion.tool.id}
              variant="outline"
              size="sm"
              className="w-full justify-start h-8 text-xs gap-2"
              onClick={() => onToolSelect?.(suggestion.tool.id)}
            >
              <Icon className="h-3 w-3" />
              <span className="truncate">{suggestion.tool.displayName}</span>
              <ChevronRight className="h-3 w-3 ml-auto" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Export
 */
export { CompactToolPanel };

