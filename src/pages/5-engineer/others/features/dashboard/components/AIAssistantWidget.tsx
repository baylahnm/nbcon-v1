import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback } from '../../../../../1-HomePage/others/components/ui/avatar';
import { ChatComposer } from '../../ai/components/ChatComposer';
import { useAiStore } from '../../ai/store/useAiStore';
import { MessageSquare, Sparkles, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { R } from '../../../../../1-HomePage/others/lib/routes';

interface AIAssistantWidgetProps {
  userRole?: string;
}

export function AIAssistantWidget({ userRole = 'engineer' }: AIAssistantWidgetProps) {
  const { getActiveMessages } = useAiStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const activeMessages = getActiveMessages();
  const lastMessages = activeMessages.slice(-3);

  // Quick action prompts based on role
  const quickPrompts = [
    { label: 'Estimate Cost', icon: '💰', prompt: 'Help me estimate project costs' },
    { label: 'Find Jobs', icon: '🔍', prompt: 'Find relevant engineering jobs for me' },
    { label: 'Review Document', icon: '📄', prompt: 'Help me review a technical document' },
    { label: 'Calculate', icon: '🧮', prompt: 'Perform engineering calculations' },
  ];

  const getAIRoute = () => {
    switch (userRole) {
      case 'engineer':
        return R.engineer.ai;
      case 'client':
        return R.client.ai;
      case 'enterprise':
        return R.enterprise.ai;
      default:
        return '/ai';
    }
  };

  return (
    <Card 
      className="relative overflow-hidden transition-all duration-300"
      style={{
        border: '2px solid transparent',
        borderRadius: '0.75rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
    >
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                AI Assistant
                <Badge variant="outline" className="text-xs font-normal">
                  <Zap className="h-3 w-3 mr-1" />
                  Powered
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your intelligent engineering companion
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link to={getAIRoute()}>
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Full Chat
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="p-5 pt-0 space-y-4">
          {/* Quick Prompts */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick Actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-auto py-2 px-3 flex items-start gap-2 text-left hover:border-primary/30 transition-all"
                >
                  <span className="text-base">{prompt.icon}</span>
                  <span className="text-xs flex-1">{prompt.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Conversation Preview */}
          {lastMessages.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Recent Conversation:</p>
              <div className="bg-muted/30 rounded-lg p-3 space-y-2 max-h-24 overflow-y-auto scrollbar-hide">
                {lastMessages.map((message, index) => (
                  <div key={message.id} className="flex items-start gap-2 text-xs">
                    <Avatar className="h-5 w-5 flex-shrink-0">
                      <AvatarFallback className={message.role === 'user' ? 'bg-primary/10' : 'bg-purple-500/10'}>
                        {message.role === 'user' ? 'U' : 'AI'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-muted-foreground text-[10px] mb-0.5">
                        {message.role === 'user' ? 'You' : 'AI Assistant'}
                      </div>
                      <div className="text-foreground line-clamp-2">{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lastMessages.length === 0 && (
            <div className="text-center py-6 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">No conversation yet</p>
              <p className="text-xs text-muted-foreground">
                Ask me anything or use a quick action above
              </p>
            </div>
          )}

          {/* Chat Composer */}
          <div>
            <ChatComposer isCompact />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

