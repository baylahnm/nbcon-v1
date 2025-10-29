/**
 * AIChatPanel - Enhanced AI Chat with Quick Actions Carousel
 * 
 * Features:
 * - 10 scrollable quick action prompts
 * - XScroll navigation arrows
 * - Message history with MessageBubble
 * - ChatComposer integration
 * - Empty state with bot icon
 * 
 * @module components/dashboard/advanced
 * @version 1.0.0
 * @created January 28, 2025
 */

import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import { 
  Bot, 
  ChevronRight, 
  Plus, 
  Search, 
  FileText, 
  DollarSign, 
  Target, 
  Users,
  Calendar,
  TrendingUp,
  MessageSquare,
  ChevronLeft,
  Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/pages/1-HomePage/others/lib/utils';

interface QuickActionConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIChatPanelProps {
  role: string;
  quickActions: QuickActionConfig[];
  messages?: Message[];
  welcomeMessage: string;
  onSendMessage?: (message: string) => void;
  className?: string;
}

/**
 * AIChatPanel Component
 * 
 * AI chat interface with quick action carousel and message history
 */
export function AIChatPanel({
  role,
  quickActions,
  messages = [],
  welcomeMessage,
  onSendMessage,
  className,
}: AIChatPanelProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [inputValue, setInputValue] = useState('');

  // Update arrow visibility
  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    
    scrollEl.addEventListener('scroll', handleScroll);
    // Trigger initial check after short delay to ensure rendering is complete
    const timer = setTimeout(handleScroll, 100);
    
    return () => {
      scrollEl.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [quickActions]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    scrollRef.current.scrollBy({
      left: direction === 'right' ? 250 : -250,
      behavior: 'smooth',
    });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    onSendMessage?.(inputValue);
    setInputValue('');
  };

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      {/* Chat Header */}
      <CardHeader className="flex-shrink-0 flex items-center justify-between px-3 sm:px-4 py-3 border-b border-border bg-muted">
        <div className="flex items-center justify-between w-full">
          {/* Left: Bot icon + Title + Badge */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-sm font-semibold truncate">AI Assistant</h2>
            <Badge variant="outline" className="text-foreground text-[9px] px-1.5 py-0 capitalize">chat</Badge>
          </div>
          {/* Right: Full Chat link */}
          <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-3" onClick={() => navigate(`/${role}/ai`)}>
            <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
            <span className="hidden sm:inline">Full Chat</span>
            <span className="sm:hidden">Chat</span>
          </Button>
        </div>
      </CardHeader>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Quick Action Toolbar with Carousel */}
        <div className="relative flex-shrink-0 border-b border-border/40 bg-background/98 backdrop-blur-xl shadow-inner">
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-background/98 to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-background/98 to-transparent pointer-events-none z-10" />

          <div className="flex items-center gap-2 px-3 sm:px-4 py-2">
            {showLeftArrow && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full border border-border/50 bg-background/95 backdrop-blur-sm shadow-md"
                onClick={() => scroll('left')}
                aria-label="Scroll quick actions left"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            <div className="flex-1 overflow-hidden">
              <div
                ref={scrollRef}
                className="flex space-x-2 sm:space-x-3 pb-2 sm:pb-3 pt-1 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={action.onClick}
                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 bg-background border border-border rounded-full hover:bg-accent transition-colors text-foreground whitespace-nowrap shadow-sm flex-shrink-0"
                  >
                    <action.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {showRightArrow && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full border border-border/50 bg-background/95 backdrop-blur-sm shadow-md"
                onClick={() => scroll('right')}
                aria-label="Scroll quick actions right"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Message History / Empty State */}
        <div className="flex-1 overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="bg-primary-gradient h-24 w-24 flex items-center justify-center rounded-2xl mb-6 shadow-lg">
                <Bot className="h-12 w-12 text-primary-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-2">Welcome to AI Assistant</h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-6">
                {welcomeMessage}
              </p>
              <p className="text-xs text-muted-foreground">
                Try one of the quick actions above or type your question below.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5",
                        message.role === 'user'
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted rounded-bl-sm"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-[10px] opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Chat Composer */}
        <div className="flex-shrink-0 p-4 border-t border-border/40">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 flex-shrink-0"
            >
              <Bot className="h-4 w-4" />
            </Button>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 h-10 px-4 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                size="icon"
                className="h-10 w-10 flex-shrink-0"
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

