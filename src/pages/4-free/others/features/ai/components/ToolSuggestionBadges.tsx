/**
 * Tool Suggestion Badges
 * 
 * Displays recommended AI tools as clickable badges based on
 * conversation context and orchestration engine suggestions.
 * 
 * @version 1.0.0
 * @created January 27, 2025
 */

import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { generateSuggestions, type ToolSuggestion } from '@/shared/ai/orchestration/suggestionEngine';
import { getTool } from '@/shared/ai/orchestration/toolRegistry';
import { useSessionStore } from '@/shared/ai/orchestration/sessionStore';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logSuggestion } from '@/shared/observability/aiToolTelemetry';
import type { ProjectPhase } from '@/shared/ai/orchestration/toolRegistry';

interface ToolSuggestionBadgesProps {
  currentToolId?: string;
  projectPhase?: ProjectPhase;
  userRole?: string;
  recentToolIds?: string[];
  onToolSelect?: (toolId: string) => void;
  maxSuggestions?: number;
}

export function ToolSuggestionBadges({
  currentToolId,
  projectPhase,
  userRole,
  recentToolIds = [],
  onToolSelect,
  maxSuggestions = 5,
}: ToolSuggestionBadgesProps) {
  const [suggestions, setSuggestions] = useState<ToolSuggestion[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const session = useSessionStore((state) => state.activeSession);
  const navigate = useNavigate();

  useEffect(() => {
    const newSuggestions = generateSuggestions(
      {
        currentToolId,
        projectPhase,
        userRole: userRole as any,
        recentToolIds,
        session: session || undefined,
      },
      maxSuggestions
    );
    
    // Filter out dismissed suggestions
    const filtered = newSuggestions.filter((s) => !dismissed.has(s.tool.id));
    setSuggestions(filtered);
  }, [currentToolId, projectPhase, userRole, recentToolIds, session, maxSuggestions, dismissed]);

  if (suggestions.length === 0) {
    return null;
  }

  const handleToolClick = async (suggestion: ToolSuggestion) => {
    // Log acceptance
    await logSuggestion(
      suggestion.tool.id,
      true,
      suggestion.reason,
      session?.id
    );
    
    if (onToolSelect) {
      onToolSelect(suggestion.tool.id);
    } else {
      // Navigate to tool
      navigate(suggestion.tool.endpoint);
    }
  };

  const handleDismiss = async (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Log dismissal
    const suggestion = suggestions.find((s) => s.tool.id === toolId);
    if (suggestion) {
      await logSuggestion(
        toolId,
        false,
        suggestion.reason,
        session?.id
      );
    }
    
    setDismissed(new Set(dismissed).add(toolId));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-2 px-2">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">
          Recommended Tools
        </span>
      </div>

      {/* Suggestion badges */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => {
          const Icon = require('lucide-react')[suggestion.tool.icon] || Sparkles;
          
          return (
            <Badge
              key={suggestion.tool.id}
              variant="outline"
              className="group relative cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors pr-8"
              onClick={() => handleToolClick(suggestion)}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="h-3 w-3" />
                <span className="text-xs font-medium">{suggestion.tool.displayName}</span>
                {suggestion.priority === 'high' && (
                  <span className="ml-1 text-[9px] bg-primary/20 text-primary px-1 py-0 rounded">
                    High Priority
                  </span>
                )}
              </div>
              
              {/* Dismiss button */}
              <button
                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDismiss(suggestion.tool.id, e)}
                aria-label="Dismiss suggestion"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          );
        })}
      </div>

      {/* Optional: Show reason for top suggestion */}
      {suggestions.length > 0 && suggestions[0].priority === 'high' && (
        <p className="text-[10px] text-muted-foreground px-2">
          💡 {suggestions[0].reason}
        </p>
      )}
    </div>
  );
}

/**
 * Compact version for inline display
 */
export function ToolSuggestionInline({
  suggestions,
  onSelect,
}: {
  suggestions: ToolSuggestion[];
  onSelect: (toolId: string) => void;
}) {
  if (suggestions.length === 0) return null;

  const topSuggestion = suggestions[0];
  const tool = topSuggestion.tool;
  const Icon = require('lucide-react')[tool.icon] || Sparkles;

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-xs gap-1.5 border-primary/20 hover:bg-primary/10"
      onClick={() => onSelect(tool.id)}
    >
      <Icon className="h-3 w-3" />
      <span>Try {tool.displayName}</span>
      <ArrowRight className="h-3 w-3 ml-1" />
    </Button>
  );
}

