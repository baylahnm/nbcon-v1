import { useState, useEffect } from 'react';
import { 
  Bot, 
  MessageSquare, 
  ArrowRight, 
  X, 
  Plus,
  Settings,
  Star,
  Archive,
  Trash2,
  Clock,
  Search as SearchIcon,
  Image as ImageIcon,
  Cog,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import { Separator } from '@/pages/1-HomePage/others/components/ui/separator';
import { useAiStore } from './store/useAiStore';
import { ChatComposer } from './components/ChatComposer';
import { MessageBubble } from './components/MessageBubble';
import { HijriBadge } from './components/HijriBadge';
import { aiClient } from './api/aiClient';

interface AiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFull?: () => void;
}

export function AiDrawer({ isOpen, onClose, onOpenFull }: AiDrawerProps) {
  const {
    threads,
    activeThreadId,
    messagesByThread,
    mode,
    isGenerating,
    settings,
    getActiveThread,
    getActiveMessages,
    newThread,
    setActiveThread,
    stopGeneration,
    switchMode,
    drawerOpen,
    setDrawerOpen
  } = useAiStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const activeThread = getActiveThread();
  const activeMessages = getActiveMessages();
  const lastMessages = activeMessages.slice(-10); // Show last 10 messages

  // Track drawer open
  useEffect(() => {
    if (isOpen) {
      aiClient.trackDashboardWidgetClicked('ai_drawer');
    }
  }, [isOpen]);

  // Handle thread selection
  const handleThreadSelect = (thread: any) => {
    setActiveThread(thread.id);
  };

  // Handle new thread
  const handleNewThread = () => {
    newThread();
  };

  // Handle open full AI
  const handleOpenFull = () => {
    onOpenFull?.();
    onClose();
  };

  // Get mode info
  const getModeInfo = () => {
    const modes = {
      chat: { 
        icon: MessageSquare, 
        label: settings.rtl ? 'Ã™â€¦Ã˜Â­Ã˜Â§Ã˜Â¯Ã˜Â«Ã˜Â©' : 'Chat',
        color: 'text-blue-600'
      },
      research: { 
        icon: SearchIcon, 
        label: settings.rtl ? 'Ã˜Â¨Ã˜Â­Ã˜Â«' : 'Research',
        color: 'text-green-600'
      },
      image: { 
        icon: ImageIcon, 
        label: settings.rtl ? 'Ã˜ÂµÃ™Ë†Ã˜Â±Ã˜Â©' : 'Image',
        color: 'text-purple-600'
      },
      agent: { 
        icon: Cog, 
        label: settings.rtl ? 'Ã™Ë†Ã™Æ’Ã™Å Ã™â€ž' : 'Agent',
        color: 'text-orange-600'
      },
      connectors: { 
        icon: LinkIcon, 
        label: settings.rtl ? 'Ã™â€¦Ã™Ë†Ã˜ÂµÃ™â€žÃ˜Â§Ã˜Âª' : 'Connectors',
        color: 'text-gray-600'
      }
    };
    return modes[mode] || modes.chat;
  };

  const modeInfo = getModeInfo();
  const ModeIcon = modeInfo.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l border-sidebar-border shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold text-sm">
              {settings.rtl ? 'Ã˜Â§Ã™â€žÃ˜Â°Ã™Æ’Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â§Ã˜ÂµÃ˜Â·Ã™â€ Ã˜Â§Ã˜Â¹Ã™Å ' : 'AI Assistant'}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              <ArrowRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Mode Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <ModeIcon className={`w-3 h-3 mr-1 ${modeInfo.color}`} />
            {modeInfo.label}
          </Badge>
          {settings.hijri && activeThread && (
            <HijriBadge date={activeThread.updatedAt} isCompact />
          )}
        </div>

      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {isExpanded ? (
          /* Expanded View - Show Threads */
          <div className="flex-1 p-4">
            <div className="space-y-3">
              {/* New Thread Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewThread}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                {settings.rtl ? 'Ã™â€¦Ã˜Â­Ã˜Â§Ã˜Â¯Ã˜Â«Ã˜Â© Ã˜Â¬Ã˜Â¯Ã™Å Ã˜Â¯Ã˜Â©' : 'New Chat'}
              </Button>

              {/* Recent Threads */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {settings.rtl ? 'Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â­Ã˜Â§Ã˜Â¯Ã˜Â«Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â£Ã˜Â®Ã™Å Ã˜Â±Ã˜Â©' : 'Recent Chats'}
                </h3>
                <ScrollArea className="h-64 overflow-y-auto">
                  <div className="space-y-1">
                    {threads.slice(0, 5).map((thread) => (
                      <Card
                        key={thread.id}
                        className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                          activeThreadId === thread.id ? 'bg-muted border-sidebar-border' : ''
                        }`}
                        onClick={() => handleThreadSelect(thread)}
                      >
                        <CardContent className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                              <MessageSquare className="w-3 h-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">
                                {thread.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {thread.messageCount} messages
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {thread.isStarred && (
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              )}
                              <Clock className="w-3 h-3 text-muted-foreground" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        ) : (
          /* Compact View - Show Messages */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 overflow-y-auto">
              {lastMessages.length === 0 ? (
                <div className="space-y-6">
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <ModeIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start a new conversation or choose a guided workflow below.
                    </p>
                  </div>
                  <ServiceModeSelector />
                </div>
              ) : (
                <div className="space-y-3">
                  {lastMessages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isRTL={settings.rtl}
                      showHijri={settings.hijri}
                      isCompact
                    />
                  ))}
                </div>
              )}
            </ScrollArea>


            {/* Composer */}
            <div className="p-4 border-t border-sidebar-border bg-background">
              <ChatComposer />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border bg-muted/30">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenFull}
              className="flex-1"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              {settings.rtl ? 'Ã™ÂÃ˜ÂªÃ˜Â­ Ã™ÂÃ™Å  Ã˜Â§Ã™â€žÃ˜Â°Ã™Æ’Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â§Ã˜ÂµÃ˜Â·Ã™â€ Ã˜Â§Ã˜Â¹Ã™Å ' : 'Open in AI'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
