import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'sonner';

export interface Conversation {
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
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image' | 'audio' | 'system';
  file_url?: string;
  read_at?: string;
  created_at: string;
  sender_profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // First get conversations
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      // Then get profiles and jobs for each conversation
      const enrichedConversations = await Promise.all(
        (conversations || []).map(async (conv) => {
          const [clientProfile, engineerProfile, job, messages] = await Promise.all([
            supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('user_id', conv.client_id)
              .single()
              .then(({ data }) => data),
            supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('user_id', conv.engineer_id)
              .single()
              .then(({ data }) => data),
            conv.job_id
              ? supabase
                  .from('jobs')
                  .select('title')
                  .eq('id', conv.job_id)
                  .single()
                  .then(({ data }) => data)
              : null,
            supabase
              .from('messages')
              .select('content, created_at, sender_id')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .then(({ data }) => data?.[0])
          ]);

          return {
            ...conv,
            client_profile: clientProfile,
            engineer_profile: engineerProfile,
            job: job,
            latest_message: messages
          };
        })
      );

      setConversations(enrichedConversations as Conversation[]);
    } catch (error: any) {
      toast.error('Failed to load conversations');
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `client_id=eq.${user.id},engineer_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { conversations, isLoading, refetch: fetchConversations };
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Enrich messages with sender profiles
      const enrichedMessages = await Promise.all(
        (messages || []).map(async (message) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('user_id', message.sender_id)
            .single();

          return {
            ...message,
            sender_profile: profile
          };
        })
      );

      setMessages(enrichedMessages as Message[]);
    } catch (error: any) {
      toast.error('Failed to load messages');
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: user.id,
            content: content.trim(),
            message_type: 'text'
          }
        ]);

      if (error) throw error;
    } catch (error: any) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return { messages, isLoading, sendMessage, refetch: fetchMessages };
}

export function useCreateConversation() {
  const [isLoading, setIsLoading] = useState(false);

  const createConversation = async (engineerId: string, jobId?: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('conversations')
        .insert([
          {
            client_id: user.id,
            engineer_id: engineerId,
            job_id: jobId
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error('Failed to create conversation');
      console.error('Error creating conversation:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createConversation, isLoading };
}