import { useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  Archive, 
  Trash2, 
  Search,
  Plus,
  MoreHorizontal,
  Clock,
  Bot,
  Search as SearchIcon,
  Image as ImageIcon,
  Cog,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Input } from '../../../../../1-HomePage/others/components/ui/input';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Avatar, AvatarFallback } from '../../../../../1-HomePage/others/components/ui/avatar';
import { Separator } from '../../../../../1-HomePage/others/components/ui/separator';
import { ScrollArea } from '../../../../../1-HomePage/others/components/ui/scroll-area';
import { useAiStore, Thread } from '../store/useAiStore';
import { HijriBadge } from './HijriBadge';

interface ThreadListProps {
  onThreadSelect?: (thread: Thread) => void;
  isCompact?: boolean;
  showArchived?: boolean;
  searchQuery?: string;
  filter?: 'all' | 'starred' | 'archived';
}

export function ThreadList({ onThreadSelect, isCompact = false, showArchived = false, searchQuery: externalSearchQuery, filter: externalFilter }: ThreadListProps) {
  const {
    threads,
    activeThreadId,
    setActiveThread,
    newThread,
    starThread,
    archiveThread,
    deleteThread,
    settings
  } = useAiStore();

  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [internalFilterMode, setInternalFilterMode] = useState<'all' | 'starred' | 'archived'>('all');

  // Use external or internal state
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const filterMode = externalFilter !== undefined ? externalFilter : internalFilterMode;

  // Filter threads
  const filteredThreads = threads.filter(thread => {
    // Search filter
    if (searchQuery && !thread.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !thread.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filterMode === 'starred' && !thread.isStarred) return false;
    if (filterMode === 'archived' && !thread.isArchived) return false;
    if (filterMode === 'all' && thread.isArchived && !showArchived) return false;

    return true;
  });

  // Get mode icon
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'research': return <SearchIcon className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'agent': return <Cog className="w-4 h-4" />;
      case 'connectors': return <LinkIcon className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Get mode label
  const getModeLabel = (mode: string) => {
    const labels = {
      chat: settings.rtl ? 'محادثة' : 'Chat',
      research: settings.rtl ? 'بحث' : 'Research',
      image: settings.rtl ? 'صورة' : 'Image',
      agent: settings.rtl ? 'وكيل' : 'Agent',
      connectors: settings.rtl ? 'موصلات' : 'Connectors',
    };
    return labels[mode as keyof typeof labels] || mode;
  };

  // Format relative time (matches Messages pattern)
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return settings.rtl ? 'الآن' : 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} ${settings.rtl ? 'دقيقة' : 'min ago'}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${settings.rtl ? 'ساعة' : 'hour ago'}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return settings.rtl ? 'أمس' : 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} ${settings.rtl ? 'أيام' : 'days ago'}`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Handle thread selection
  const handleThreadSelect = (thread: Thread) => {
    setActiveThread(thread.id);
    onThreadSelect?.(thread);
  };

  // Handle new thread
  const handleNewThread = () => {
    newThread();
  };

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="space-y-1">
        {filteredThreads.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {searchQuery 
                ? (settings.rtl ? 'لا توجد نتائج' : 'No conversations found')
                : (settings.rtl ? 'لا توجد محادثات' : 'No conversations yet')
              }
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {settings.rtl ? 'ابدأ محادثة جديدة للبدء' : 'Start a new conversation to begin'}
            </p>
          </div>
        ) : (
          filteredThreads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => handleThreadSelect(thread)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                activeThreadId === thread.id
                  ? 'bg-primary/10 ring-1 ring-primary/20'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Mode Icon Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                    {getModeIcon(thread.mode)}
                  </div>
                  {thread.isStarred && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                    </div>
                  )}
                </div>
                
                {!isCompact && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="font-semibold text-sm truncate">{thread.title}</h4>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatRelativeTime(thread.updatedAt)}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-1">
                      {getModeLabel(thread.mode)} • {thread.messageCount} {settings.rtl ? 'رسالة' : 'messages'}
                    </p>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 mb-1">
                      {settings.hijri ? <HijriBadge date={thread.updatedAt} /> : new Date(thread.updatedAt).toLocaleDateString()}
                    </Badge>
                    {thread.lastMessage && (
                      <p className="text-xs text-foreground/80 line-clamp-1">{thread.lastMessage}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
}
