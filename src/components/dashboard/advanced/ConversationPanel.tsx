/**
 * ConversationPanel - Enhanced Conversation List with Search & Tabs
 *
 * Features:
 * - Search conversations
 * - All/Starred tabs
 * - Live useAiStore sync
 * - Delete on hover
 * - Click to select conversation
 *
 * @module components/dashboard/advanced
 * @version 1.0.0
 * @created January 28, 2025
 */

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Input } from '@/pages/1-HomePage/others/components/ui/input';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { ScrollArea } from '@/pages/1-HomePage/others/components/ui/scroll-area';
import { MessageSquare, Search, Star, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/pages/1-HomePage/others/lib/utils';

interface ConversationConfig {
  id: string;
  title: string;
  date: string;
  isStarred: boolean;
  preview?: string;
  unreadCount?: number;
}

interface ConversationPanelProps {
  conversations: ConversationConfig[];
  activeConversationId?: string;
  onConversationSelect?: (id: string) => void;
  onNewConversation?: () => void;
  onDeleteConversation?: (id: string) => void;
  onToggleStar?: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ConversationPanel({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  onToggleStar,
  isLoading = false,
  className,
}: ConversationPanelProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'starred'>('all');

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    if (activeTab === 'starred') {
      filtered = filtered.filter((conversation) => conversation.isStarred);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (conversation) =>
          conversation.title.toLowerCase().includes(query) ||
          conversation.preview?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [activeTab, conversations, searchQuery]);

  const starredCount = useMemo(
    () => conversations.filter((conversation) => conversation.isStarred).length,
    [conversations],
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'starred');
  };

  const handleSelect = (conversationId: string) => {
    if (onConversationSelect) {
      onConversationSelect(conversationId);
      return;
    }

    navigate(`/free/ai/thread/${conversationId}`);
  };

  const handleCreateConversation = () => {
    if (onNewConversation) {
      onNewConversation();
      return;
    }

    navigate('/free/ai');
  };

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-bold">Conversations</CardTitle>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={handleCreateConversation}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search conversations..."
            className="h-9 pl-9 text-xs bg-muted/50"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            disabled={isLoading}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3 animate-pulse">
            {[1, 2, 3].map((placeholder) => (
              <div key={placeholder} className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b border-border/40 bg-transparent justify-start px-4 h-10">
              <TabsTrigger value="all" className="text-xs">
                All
                <Badge variant="secondary" className="ml-2 h-4 px-1.5 text-[10px]">
                  {conversations.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="starred" className="text-xs">
                <Star className="h-3 w-3 mr-1.5" />
                Starred
                {starredCount > 0 ? (
                  <Badge variant="secondary" className="ml-2 h-4 px-1.5 text-[10px]">
                    {starredCount}
                  </Badge>
                ) : null}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {filteredConversations.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        {searchQuery
                          ? 'No conversations found'
                          : activeTab === 'starred'
                            ? 'No starred conversations'
                            : 'No conversations yet'}
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => {
                      const isActive = conversation.id === activeConversationId;

                      return (
                        <div
                          key={conversation.id}
                          className={cn(
                            'group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer',
                            isActive
                              ? 'bg-primary/5 border-primary/30 shadow-sm'
                              : 'bg-background border-border/50 hover:bg-muted/50 hover:border-border',
                          )}
                          onClick={() => handleSelect(conversation.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{conversation.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {conversation.preview || conversation.date}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onToggleStar?.(conversation.id);
                                }}
                              >
                                <Star
                                  className={cn(
                                    'h-3.5 w-3.5',
                                    conversation.isStarred
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground',
                                  )}
                                />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 hover:text-destructive"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  if (confirm('Delete this conversation?')) {
                                    onDeleteConversation?.(conversation.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

