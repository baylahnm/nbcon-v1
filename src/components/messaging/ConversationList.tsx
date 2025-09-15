import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversations, type Conversation } from '@/hooks/useMessaging';
import { useAuthStore } from '@/stores/auth';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Briefcase } from 'lucide-react';

interface ConversationListProps {
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ConversationList({ selectedConversationId, onSelectConversation }: ConversationListProps) {
  const { conversations, isLoading } = useConversations();
  const { user, profile } = useAuthStore();

  const getOtherParticipant = (conversation: Conversation) => {
    const isClient = profile?.role === 'client';
    return isClient ? conversation.engineer_profile : conversation.client_profile;
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
          <p className="text-sm text-muted-foreground">
            Start a conversation by browsing {profile?.role === 'client' ? 'engineers' : 'jobs'} and contacting someone.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-3">
        {conversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          const isSelected = selectedConversationId === conversation.id;
          const isFromMe = conversation.latest_message?.sender_id === user?.id;

          return (
            <Card 
              key={conversation.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-primary shadow-medium' 
                  : 'hover:shadow-soft'
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={otherParticipant?.avatar_url} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {getInitials(otherParticipant?.first_name, otherParticipant?.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium truncate">
                        {otherParticipant?.first_name} {otherParticipant?.last_name}
                      </h4>
                      {conversation.latest_message && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.latest_message.created_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    {conversation.job && (
                      <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <Briefcase className="h-3 w-3 mr-1" />
                        <span className="truncate">{conversation.job.title}</span>
                      </div>
                    )}
                    
                    {conversation.latest_message && (
                      <p className="text-sm text-muted-foreground truncate">
                        {isFromMe && (
                          <span className="text-primary">You: </span>
                        )}
                        {conversation.latest_message.content}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}