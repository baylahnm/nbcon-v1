import { useState } from "react";
import { 
  MessageSquare,
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Pin,
  Building,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ConversationType = "direct" | "group" | "project";
type ConversationFilter = "all" | "unread" | "pinned" | "projects";

interface Conversation {
  id: string;
  client_id: string;
  engineer_id: string;
  job_id?: string;
  created_at: string;
  updated_at: string;
  client_profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  engineer_profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  job?: {
    title: string;
  };
  latest_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unreadCount?: number;
  isPinned?: boolean;
  isArchived?: boolean;
  type?: ConversationType;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: (name: string, type: ConversationType) => Promise<void>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isLoading?: boolean;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  isCollapsed,
  onToggleCollapse,
  isLoading = false
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ConversationFilter>("all");
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const [newConversationName, setNewConversationName] = useState("");
  const [newConversationType, setNewConversationType] = useState<ConversationType>("direct");
  const [isCreating, setIsCreating] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-SA");
  };

  const filteredConversations = conversations.filter(conv => {
    const displayName = conv.job?.title || `${conv.client_profile?.first_name ?? ''} ${conv.client_profile?.last_name ?? ''}`.trim() || `${conv.engineer_profile?.first_name ?? ''} ${conv.engineer_profile?.last_name ?? ''}`.trim();
    const matchesSearch = displayName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = (() => {
      switch (filterType) {
        case "unread": return (conv.unreadCount || 0) > 0;
        case "pinned": return conv.isPinned || false;
        case "projects": return Boolean(conv.job);
        default: return true;
      }
    })();

    return matchesSearch && matchesFilter && !conv.isArchived;
  });

  const handleCreateConversation = async () => {
    if (!newConversationName.trim()) return;
    
    setIsCreating(true);
    try {
      await onNewConversation(newConversationName, newConversationType);
      setShowNewConversationDialog(false);
      setNewConversationName("");
      setNewConversationType("direct");
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* New Conversation Dialog */}
      <Dialog open={showNewConversationDialog} onOpenChange={setShowNewConversationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Create a new conversation with colleagues or project teams.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Conversation Name</label>
              <Input
                placeholder="Enter conversation name..."
                value={newConversationName}
                onChange={(e) => setNewConversationName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={newConversationType} onValueChange={(value) => setNewConversationType(value as ConversationType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Direct Message</SelectItem>
                  <SelectItem value="group">Group Chat</SelectItem>
                  <SelectItem value="project">Project Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewConversationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateConversation} disabled={!newConversationName.trim() || isCreating}>
              {isCreating ? "Creating..." : "Create Conversation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Conversations Sidebar */}
      <div className={`${isCollapsed ? 'w-20' : 'w-80'} bg-background flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed && (
              <h1 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Messages
              </h1>
            )}
            {isCollapsed && (
              <div className="flex justify-center w-full">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex items-center gap-2">
              {!isCollapsed && (
                <Button size="sm" variant="outline" onClick={() => setShowNewConversationDialog(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={onToggleCollapse}
                className="mr-2"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            {!isCollapsed ? (
              <>
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </>
            ) : (
              <div className="flex justify-center">
                <Button size="sm" variant="outline" className="p-2">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Filters */}
            {!isCollapsed && (
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={(value) => setFilterType(value as ConversationFilter)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conversations</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="pinned">Pinned</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          {isCollapsed && (
            <div className="flex justify-center">
              <Button size="sm" variant="outline" className="p-2">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className={`${isCollapsed ? 'p-1' : 'p-6'} space-y-1`}>
            {isLoading ? (
              <div className="text-center text-muted-foreground py-10">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No conversations found
                <br />
                <span className="text-xs">Total: {conversations.length}</span>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`${isCollapsed ? 'p-2' : 'p-3'} rounded-lg cursor-pointer transition-colors ${
                    selectedConversationId === conversation.id
                      ? 'bg-primary/10 border border-sidebar-border'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  {!isCollapsed ? (
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {conversation.job?.title ? (
                              <Building className="w-5 h-5" />
                            ) : conversation.type === "group" ? (
                              <Users className="w-5 h-5" />
                            ) : (
                              (conversation.client_profile?.first_name || conversation.engineer_profile?.first_name || '?').charAt(0)
                            )}
                          </AvatarFallback>
                        </Avatar>
                        {(conversation.unreadCount || 0) > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs min-w-4 h-4 rounded-full flex items-center justify-center p-0">
                            {conversation.unreadCount! > 9 ? '9+' : conversation.unreadCount}
                          </Badge>
                        )}
                        {conversation.isPinned && (
                          <Pin className="absolute -top-1 -left-1 w-3 h-3 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <h4 className="font-medium truncate">
                              {conversation.job?.title || 
                               `${conversation.client_profile?.first_name ?? ''} ${conversation.client_profile?.last_name ?? ''}`.trim() || 
                               `${conversation.engineer_profile?.first_name ?? ''} ${conversation.engineer_profile?.last_name ?? ''}`.trim()}
                            </h4>
                            {conversation.isPinned && <Pin className="w-3 h-3 text-muted-foreground" />}
                          </div>
                          <div className="flex items-center gap-1">
                            {conversation.latest_message && (
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.latest_message.created_at)}
                              </span>
                            )}
                          </div>
                        </div>

                        {conversation.job?.title && (
                          <div className="text-xs text-muted-foreground mb-1">{conversation.job.title}</div>
                        )}

                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground truncate flex-1">
                            {conversation.latest_message ? conversation.latest_message.content : 'No messages yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {conversation.job?.title ? (
                            <Building className="w-5 h-5" />
                          ) : conversation.type === "group" ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            (conversation.client_profile?.first_name || conversation.engineer_profile?.first_name || '?').charAt(0)
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {(conversation.unreadCount || 0) > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs min-w-4 h-4 rounded-full flex items-center justify-center p-0">
                          {conversation.unreadCount! > 9 ? '9+' : conversation.unreadCount}
                        </Badge>
                      )}
                      {conversation.isPinned && (
                        <Pin className="absolute -top-1 -left-1 w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}


