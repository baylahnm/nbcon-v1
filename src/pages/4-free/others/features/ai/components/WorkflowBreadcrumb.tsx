/**
 * Workflow Breadcrumb
 * 
 * Displays active workflow chain showing tool sequence and current position.
 * Allows quick navigation and resume functionality.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { ChevronRight, Play, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { getTool } from '@/shared/ai/orchestration/toolRegistry';
import { useSessionStore, useSessionSummary } from '@/shared/ai/orchestration/sessionStore';
import { useNavigate } from 'react-router-dom';

export function WorkflowBreadcrumb() {
  const session = useSessionStore((state) => state.activeSession);
  const summary = useSessionSummary();
  const navigate = useNavigate();

  if (!session || session.toolChain.length === 0) {
    return null;
  }

  const handleToolClick = (toolId: string) => {
    const tool = getTool(toolId);
    if (tool) {
      navigate(tool.endpoint);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">Active Workflow</span>
          {session.activeWorkflow && (
            <Badge variant="outline" className="text-[9px] px-1.5 py-0">
              {session.activeWorkflow.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span>{summary.toolCount} tools</span>
          <span>•</span>
          <span>{summary.interactionCount} actions</span>
          <span>•</span>
          <span>${summary.totalCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Tool chain breadcrumb */}
      <div className="flex items-center gap-1 flex-wrap">
        {session.toolChain.map((toolId, index) => {
          const tool = getTool(toolId);
          if (!tool) return null;

          const isActive = toolId === session.activeTool;
          const isCompleted = index < session.toolChain.indexOf(session.activeTool || '');
          const Icon = require('lucide-react')[tool.icon] || Clock;

          return (
            <div key={toolId} className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 px-2 text-xs gap-1.5 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : isCompleted
                    ? 'text-muted-foreground'
                    : 'text-foreground'
                }`}
                onClick={() => handleToolClick(toolId)}
              >
                <Icon className="h-3 w-3" />
                <span>{tool.displayName}</span>
                {isCompleted && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                {isActive && <Clock className="h-3 w-3 animate-pulse" />}
              </Button>
              
              {index < session.toolChain.length - 1 && (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>

      {/* Pending inputs indicator */}
      {session.pendingInputs && Object.keys(session.pendingInputs).length > 0 && (
        <div className="flex items-center gap-2 text-[10px] text-amber-600">
          <Clock className="h-3 w-3" />
          <span>
            {Object.keys(session.pendingInputs).length} pending inputs from previous tool
          </span>
        </div>
      )}
    </div>
  );
}

