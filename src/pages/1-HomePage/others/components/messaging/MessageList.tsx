import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { useAuthStore } from '../../stores/auth';
import { formatDistanceToNow, format } from 'date-fns';
import { MessageCircle } from 'lucide-react';

// Message type definition (since useMessaging was deleted)
type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "file" | "image" | "audio" | "system";
  file_url?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  read_at?: string | null;
  created_at: string;
  metadata?: Record<string, unknown> | null;
  reactions?: Array<{ emoji: string; count: number; users: string[] }> | null;
  sender_profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  fileName?: string;
  fileSize?: number;
};

// Mock useMessages hook (since the original was deleted)
const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  return { messages, isLoading };
};

interface MessageListProps {
  conversationId: string | null;
}

export function MessageList({ conversationId }: MessageListProps) {
  const { messages, isLoading } = useMessages(conversationId);
  const { user } = useAuthStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = format(new Date(message.created_at), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-sm text-muted-foreground">
            Choose a conversation from the list to start messaging.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className="flex items-start space-x-2">
                  {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-64 rounded-lg" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  {i % 2 === 1 && <Skeleton className="h-8 w-8 rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No messages yet</h3>
          <p className="text-sm text-muted-foreground">
            Send your first message to start the conversation.
          </p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {Object.entries(messageGroups).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <Badge variant="secondary" className="text-xs">
                  {format(new Date(date), 'MMMM d, yyyy')}
                </Badge>
              </div>

              {/* Messages for this date */}
              <div className="space-y-4">
                {dayMessages.map((message) => {
                  const isFromMe = message.sender_id === user?.id;
                  const messageTime = format(new Date(message.created_at), 'HH:mm');

                  return (
                    <div 
                      key={message.id}
                      className={`flex items-end space-x-2 ${isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isFromMe && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender_profile?.avatar_url} />
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                            {getInitials(message.sender_profile?.first_name, message.sender_profile?.last_name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-[70%] ${isFromMe ? 'order-1' : 'order-2'}`}>
                        <div 
                          className={`rounded-lg px-4 py-2 ${
                            isFromMe 
                              ? 'bg-gradient-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center mt-1 text-xs text-muted-foreground ${
                          isFromMe ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{messageTime}</span>
                          {message.read_at && isFromMe && (
                            <span className="ml-2">✓✓</span>
                          )}
                        </div>
                      </div>

                      {isFromMe && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender_profile?.avatar_url} />
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                            {getInitials(message.sender_profile?.first_name, message.sender_profile?.last_name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
