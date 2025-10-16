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
}

export function ThreadList({ onThreadSelect, isCompact = false, showArchived = false }: ThreadListProps) {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'starred' | 'archived'>('all');

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

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return settings.rtl ? 'الآن' : 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
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
    <div className={`flex flex-col h-full ${isCompact ? 'space-y-2' : 'space-y-4'}`}>
      {/* Header */}
      {!isCompact && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {settings.rtl ? 'المحادثات' : 'Conversations'}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewThread}
            >
              <Plus className="w-4 h-4 mr-1" />
              {settings.rtl ? 'جديد' : 'New'}
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={settings.rtl ? 'البحث في المحادثات...' : 'Search conversations...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Button
              variant={filterMode === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMode('all')}
            >
              {settings.rtl ? 'الكل' : 'All'}
            </Button>
            <Button
              variant={filterMode === 'starred' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMode('starred')}
            >
              <Star className="w-4 h-4 mr-1" />
              {settings.rtl ? 'المفضلة' : 'Starred'}
            </Button>
            {showArchived && (
              <Button
                variant={filterMode === 'archived' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('archived')}
              >
                <Archive className="w-4 h-4 mr-1" />
                {settings.rtl ? 'المؤرشف' : 'Archived'}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Threads List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {filteredThreads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">
                {searchQuery 
                  ? (settings.rtl ? 'لا توجد نتائج' : 'No results found')
                  : (settings.rtl ? 'لا توجد محادثات' : 'No conversations yet')
                }
              </p>
              {!searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewThread}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {settings.rtl ? 'بدء محادثة جديدة' : 'Start new conversation'}
                </Button>
              )}
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <Card
                key={thread.id}
                className={`w-full cursor-pointer transition-colors hover:bg-muted/50 ${
                  activeThreadId === thread.id ? 'bg-muted border-sidebar-border' : ''
                } ${isCompact ? 'p-2' : 'p-3'}`}
                onClick={() => handleThreadSelect(thread)}
              >
                <CardContent className="p-0">
                  {isCompact ? (
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      {/* Mode Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getModeIcon(thread.mode)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm">
                              {thread.title.length > 10 
                                ? `${thread.title.substring(0, 10)}...` 
                                : thread.title
                              }
                            </h3>
                            {thread.lastMessage && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {thread.lastMessage}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {getModeLabel(thread.mode)}
                            </Badge>
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  starThread(thread.id);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Star className={`w-3 h-3 ${
                                  thread.isStarred ? 'fill-yellow-400 text-yellow-400' : ''
                                }`} />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  archiveThread(thread.id);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Archive className="w-3 h-3" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteThread(thread.id);
                                }}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatRelativeTime(thread.updatedAt)}</span>
                            {settings.hijri && <HijriBadge date={thread.updatedAt} />}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MessageSquare className="w-3 h-3" />
                            <span>{thread.messageCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
