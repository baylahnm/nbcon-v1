import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageInput } from '@/components/messaging/MessageInput';
import { useMessages, type Conversation } from '@/hooks/useMessaging';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showMobileList, setShowMobileList] = useState(true);
  const { sendMessage } = useMessages(selectedConversation?.id || null);
  const { profile } = useAuthStore();

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowMobileList(false);
  };

  const handleBackToList = () => {
    setShowMobileList(true);
    setSelectedConversation(null);
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const isClient = profile?.role === 'client';
    return isClient ? conversation.engineer_profile : conversation.client_profile;
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Messages
          </h1>
          <p className="text-muted-foreground">
            Communicate with {profile?.role === 'client' ? 'engineers' : 'clients'} and manage your projects
          </p>
        </div>
        <MessageCircle className="h-8 w-8 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100%-120px)]">
        {/* Conversation List */}
        <div className={`lg:col-span-4 ${showMobileList ? 'block' : 'hidden lg:block'}`}>
          <Card className="h-full">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="p-4">
              <ConversationList
                selectedConversationId={selectedConversation?.id}
                onSelectConversation={handleSelectConversation}
              />
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className={`lg:col-span-8 ${showMobileList ? 'hidden lg:flex' : 'flex'} flex-col`}>
          <Card className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={handleBackToList}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={getOtherParticipant(selectedConversation)?.avatar_url} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {getInitials(
                          getOtherParticipant(selectedConversation)?.first_name,
                          getOtherParticipant(selectedConversation)?.last_name
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold">
                        {getOtherParticipant(selectedConversation)?.first_name}{' '}
                        {getOtherParticipant(selectedConversation)?.last_name}
                      </h3>
                      {selectedConversation.job && (
                        <p className="text-sm text-muted-foreground">
                          Project: {selectedConversation.job.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <MessageList conversationId={selectedConversation.id} />

                {/* Message Input */}
                <MessageInput onSendMessage={sendMessage} />
              </>
            ) : (
              <MessageList conversationId={null} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}