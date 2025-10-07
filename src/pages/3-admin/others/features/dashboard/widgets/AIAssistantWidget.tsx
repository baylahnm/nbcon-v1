import React from 'react';
import { Bot, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Widget } from '../types/widget';
import { ChatComposer } from '@/features/ai/components/ChatComposer';
import BaseWidget from './BaseWidget';

interface AIAssistantWidgetProps {
  widget: Widget;
  isEditMode?: boolean;
  onConfigClick?: () => void;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  widget,
  isEditMode = false,
  onConfigClick
}) => {
  const config = widget.config;
  const isCompact = config.isCompact || false;
  const maxHeight = config.maxHeight || 400;

  return (
    <BaseWidget
      widget={widget}
      isEditMode={isEditMode}
      onConfigClick={onConfigClick}
      className="h-full"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Ask me anything</p>
          </div>
        </div>

        {/* Chat Area */}
        <div 
          className="flex-1 flex flex-col"
          style={{ maxHeight: isCompact ? 200 : maxHeight }}
        >
          {isCompact ? (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground text-center py-4">
                Start a conversation with AI
              </div>
              <ChatComposer isCompact />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Messages Area */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground text-center py-4">
                    No messages yet. Start a conversation below.
                  </div>
                </div>
              </div>
              
              {/* Composer */}
              <div className="border-t border-sidebar-border pt-3">
                <ChatComposer />
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!isCompact && (
          <div className="mt-3 pt-3 border-t border-sidebar-border">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-3 h-3 mr-1" />
                New Chat
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Bot className="w-3 h-3 mr-1" />
                AI Help
              </Button>
            </div>
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

export default AIAssistantWidget;
