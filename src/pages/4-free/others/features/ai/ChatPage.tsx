import { useEffect, useRef, useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Search, 
  Image as ImageIcon, 
  Cog, 
  Link as LinkIcon,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings,
  Star,
  Archive,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Separator } from '@/pages/1-HomePage/others/components/ui/separator';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import { useAiStore } from './store/useAiStore';
import { ChatComposer } from './components/ChatComposer';
import { MessageBubble } from './components/MessageBubble';
import { ThreadList } from './components/ThreadList';
import { HijriBadge } from './components/HijriBadge';
import { aiClient } from './api/aiClient';

interface ChatPageProps {
  onBack?: () => void;
}

export function ChatPage({ onBack }: ChatPageProps) {
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
    switchMode
  } = useAiStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeThread = getActiveThread();
  const activeMessages = getActiveMessages();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  // Track page view
  useEffect(() => {
    aiClient.trackAiChatView('/ai', 'user');
  }, []);

  // Handle thread selection
  const handleThreadSelect = (thread: any) => {
    setActiveThread(thread.id);
  };

  // Handle new thread
  const handleNewThread = () => {
    newThread();
  };

  // Handle citation click
  const handleCitationClick = (citation: any) => {
    window.open(citation.url, '_blank');
    aiClient.trackAiResearchClickedSource(citation.id);
  };

  // Handle image download
  const handleImageDownload = (image: any) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `ai-generated-${image.id}.png`;
    link.click();
  };

  // Handle message regeneration
  const handleRegenerate = (messageId: string) => {
    // Implementation for regenerating message
    console.log('Regenerate message:', messageId);
  };

  // Handle feedback
  const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
    // Implementation for feedback
    console.log('Feedback:', messageId, type);
  };

  // Get mode info
  const getModeInfo = () => {
    const modes = {
      chat: { 
        icon: MessageSquare, 
        label: settings.rtl ? 'محادثة' : 'Chat',
        description: settings.rtl ? 'محادثة عامة' : 'General conversation'
      },
      research: { 
        icon: Search, 
        label: settings.rtl ? 'بحث عميق' : 'Deep Research',
        description: settings.rtl ? 'بحث شامل مع المراجع' : 'Comprehensive research with citations'
      },
      image: { 
        icon: ImageIcon, 
        label: settings.rtl ? 'إنشاء صورة' : 'Create Image',
        description: settings.rtl ? 'إنشاء صور من النصوص' : 'Generate images from text'
      },
      agent: { 
        icon: Cog, 
        label: settings.rtl ? 'وضع الوكيل' : 'Agent Mode',
        description: settings.rtl ? 'وكيل ذكي مع أدوات متخصصة' : 'AI agent with specialized tools'
      },
      connectors: { 
        icon: LinkIcon, 
        label: settings.rtl ? 'الموصلات' : 'Connectors',
        description: settings.rtl ? 'الاتصال بالخدمات الخارجية' : 'Connect to external services'
      }
    };
    return modes[mode] || modes.chat;
  };

  const modeInfo = getModeInfo();
  const ModeIcon = modeInfo.icon;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-20' : 'w-80'} border-r border-sidebar-border bg-muted/30 flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed ? (
              <h1 className="text-lg font-semibold flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                {settings.rtl ? 'الذكاء الاصطناعي' : 'AI Assistant'}
              </h1>
            ) : (
              <div className="flex justify-center w-full">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex items-center gap-2">
              {onBack && !isCollapsed && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {!isCollapsed && (
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ModeIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{modeInfo.label}</div>
                    <div className="text-xs text-muted-foreground">{modeInfo.description}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => switchMode(mode === 'chat' ? 'research' : 'chat')}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Threads List */}
        <div className={`${isCollapsed ? 'p-2' : 'p-4'} flex-1`}>
          <ThreadList onThreadSelect={handleThreadSelect} isCompact={isCollapsed} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="font-medium">
                  {activeThread?.title || (settings.rtl ? 'محادثة جديدة' : 'New Conversation')}
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {modeInfo.label}
                  </Badge>
                  {settings.hijri && activeThread && (
                    <HijriBadge date={activeThread.updatedAt} isCompact />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isGenerating && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopGeneration}
                >
                  {settings.rtl ? 'إيقاف' : 'Stop'}
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 h-0">
          <div className="space-y-4">
            {activeMessages.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ModeIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {settings.rtl ? 'مرحباً! كيف يمكنني مساعدتك؟' : 'Ready when you are.'}
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  {settings.rtl 
                    ? 'ابدأ محادثة جديدة أو اختر من المحادثات السابقة'
                    : 'Start a new conversation or choose from your previous chats'
                  }
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleNewThread}>
                    {settings.rtl ? 'بدء محادثة جديدة' : 'Start New Chat'}
                  </Button>
                </div>
              </div>
            ) : (
              /* Messages */
              activeMessages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isRTL={settings.rtl}
                  showHijri={settings.hijri}
                  onCitationClick={handleCitationClick}
                  onImageDownload={handleImageDownload}
                  onRegenerate={handleRegenerate}
                  onFeedback={handleFeedback}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Composer */}
        <div className="p-4 border-t border-sidebar-border bg-background">
          <ChatComposer />
        </div>
      </div>
    </div>
  );
}

