/**
 * Agent Selector Component
 * Phase 2: Specialized AI Engineering Agents
 * 
 * Displays grid of 9 specialized engineering agents
 * Allows users to select and launch agent-specific workflows
 */

import { useState, useEffect } from 'react';
import { Building2, Zap, Hammer, Wind, MapPin, Shield, Plane, Wrench, Mountain, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import { Skeleton } from '@/pages/1-HomePage/others/components/ui/skeleton';
import { getAvailableAgents } from '@/shared/services/agentService';
import type { AIAgent, AgentDiscipline } from '@/shared/types/ai-agents';

// Icon mapping
const AGENT_ICONS: Record<string, any> = {
  Building2,
  Zap,
  Hammer,
  Wind,
  MapPin,
  Shield,
  Plane,
  Wrench,
  Mountain,
};

interface AgentSelectorProps {
  onSelectAgent: (agent: AIAgent) => void;
  selectedDiscipline?: AgentDiscipline;
  showStats?: boolean;
}

export function AgentSelector({ onSelectAgent, selectedDiscipline, showStats = true }: AgentSelectorProps) {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      const data = await getAvailableAgents();
      setAgents(data);
      setError(null);
    } catch (err) {
      console.error('[AgentSelector] Error loading agents:', err);
      setError('Failed to load AI agents');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="p-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-5 w-32 mt-3" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-destructive mb-4">{error}</p>
          <Button onClick={loadAgents} size="sm" className="h-8 text-xs">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {showStats && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight">Specialized AI Engineering Agents</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select an agent for discipline-specific assistance
            </p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {agents.length} Agents Available
          </Badge>
        </div>
      )}

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const Icon = AGENT_ICONS[agent.icon_name] || Building2;
          const isSelected = selectedDiscipline === agent.discipline;
          
          return (
            <Card
              key={agent.id}
              className={`group border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${
                isSelected ? 'ring-2 ring-primary shadow-md' : ''
              }`}
              onClick={() => onSelectAgent(agent)}
            >
              <CardHeader className="p-4 border-b border-border/40">
                <div className="flex items-start gap-3">
                  {/* Agent Icon */}
                  <div className={`${agent.color_scheme} h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-bold tracking-tight line-clamp-1">
                      {agent.display_name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {agent.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                {/* Capabilities */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Key Capabilities ({agent.capabilities.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map((capability, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline"
                        className="text-[9px] px-1.5 py-0 h-4 bg-primary/5 border-primary/20"
                      >
                        {capability.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                        +{agent.capabilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tool Stack */}
                <div className="pt-2 border-t border-border/40">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>{agent.tool_stack.length} Tools</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{agent.workflows.length} Workflows</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full h-8 text-xs mt-2"
                  variant={isSelected ? 'default' : 'outline'}
                >
                  {isSelected ? 'Selected' : 'Select Agent'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats (Optional) */}
      {showStats && agents.length > 0 && (
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-xl font-bold">{agents.length}</p>
                </div>
                <p className="text-xs text-muted-foreground">AI Agents</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <p className="text-xl font-bold">
                    {agents.reduce((sum, a) => sum + a.capabilities.length, 0)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Total Capabilities</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-blue-600" />
                  <p className="text-xl font-bold">
                    {agents.reduce((sum, a) => sum + a.workflows.length, 0)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Compact Agent List (for sidebars)
 */
export function AgentList({ onSelectAgent, selectedDiscipline }: AgentSelectorProps) {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await getAvailableAgents();
      setAgents(data);
    } catch (err) {
      console.error('[AgentList] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {agents.map((agent) => {
          const Icon = AGENT_ICONS[agent.icon_name] || Building2;
          const isSelected = selectedDiscipline === agent.discipline;
          
          return (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border/50 hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className={`${agent.color_scheme} h-8 w-8 flex items-center justify-center rounded-lg shadow-sm`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">{agent.display_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {agent.capabilities.length} capabilities
                </p>
              </div>
              {isSelected && (
                <Badge className="bg-primary/10 text-primary border-0 text-[9px]">
                  Active
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

