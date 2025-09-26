import { useCallback, useEffect, useState } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

type ProfileRow = {
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
};

type JobRow = {
  title: string;
};

type ConversationRow = {
  id: string;
  client_id: string;
  engineer_id: string;
  job_id?: string | null;
  created_at: string;
  updated_at: string;
};

type MessageSummaryRow = {
  content: string;
  created_at: string;
  sender_id: string;
};

export interface Reaction {
  emoji: string;
  count?: number;
  users?: string[];
}

export interface Conversation {
  id: string;
  client_id: string;
  engineer_id: string;
  job_id?: string;
  created_at: string;
  updated_at: string;
  client_profile?: ProfileRow;
  engineer_profile?: ProfileRow;
  job?: JobRow | null;
  latest_message?: MessageSummaryRow | null;
  unreadCount?: number;
  isPinned?: boolean;
  isArchived?: boolean;
  type?: "direct" | "group" | "project";
}

type MessageBase = {
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
  reactions?: Reaction[] | null;
};

type MessageRow = MessageBase;

export interface Message extends MessageBase {
  sender_profile?: ProfileRow;
  fileName?: string;
  fileSize?: number;
}

const mapNullable = <T,>(value: T | null | undefined): T | undefined => (value ?? undefined);

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data: rawConversations, error: convError } = await supabase
        .from<ConversationRow>("conversations")
        .select("*")
        .or(`client_id.eq.${user.id},engineer_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (convError) throw convError;

      const enrichedConversations: Conversation[] = await Promise.all(
        (rawConversations ?? []).map(async (conv) => {
          const [clientProfile, engineerProfile, job, latestMessage] = await Promise.all([
            supabase
              .from<ProfileRow>("profiles")
              .select("first_name, last_name, avatar_url")
              .eq("user_id", conv.client_id)
              .single()
              .then(({ data }) => mapNullable(data)),
            supabase
              .from<ProfileRow>("profiles")
              .select("first_name, last_name, avatar_url")
              .eq("user_id", conv.engineer_id)
              .single()
              .then(({ data }) => mapNullable(data)),
            conv.job_id
              ? supabase
                  .from<JobRow>("jobs")
                  .select("title")
                  .eq("id", conv.job_id)
                  .single()
                  .then(({ data }) => mapNullable(data))
              : Promise.resolve<JobRow | undefined>(undefined),
            supabase
              .from<MessageSummaryRow>("messages")
              .select("content, created_at, sender_id")
              .eq("conversation_id", conv.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .then(({ data }) => mapNullable(data?.[0]))
          ]);

          return {
            ...conv,
            job: job ?? null,
            client_profile: clientProfile,
            engineer_profile: engineerProfile,
            latest_message: latestMessage ?? null
          };
        })
      );

      setConversations(enrichedConversations);
    } catch (error) {
      toast.error("Failed to load conversations");
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations"
        },
        (payload: RealtimePostgresChangesPayload<ConversationRow>) => {
          const conversation = (payload.new ?? payload.old) as ConversationRow | null;
          if (conversation && (conversation.client_id === user.id || conversation.engineer_id === user.id)) {
            void fetchConversations();
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchConversations, user]);

  return { conversations, isLoading, refetch: fetchConversations };
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data: messageRows, error } = await supabase
        .from<MessageRow>("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const enrichedMessages: Message[] = await Promise.all(
        (messageRows ?? []).map(async (row) => {
          const { data: profile } = await supabase
            .from<ProfileRow>("profiles")
            .select("first_name, last_name, avatar_url")
            .eq("user_id", row.sender_id)
            .single();

          const fileName = row.file_name ?? row.file_url?.split("/").pop();

          return {
            ...row,
            sender_profile: mapNullable(profile),
            fileName,
            fileSize: typeof row.file_size === "number" ? row.file_size : undefined,
            reactions: row.reactions ?? undefined
          };
        })
      );

      setMessages(enrichedMessages);
    } catch (error) {
      toast.error("Failed to load messages");
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) return;

      try {
        const { user } = useAuthStore.getState();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
          .from("messages")
          .insert([
            {
              conversation_id: conversationId,
              sender_id: user.id,
              content: content.trim(),
              message_type: "text"
            }
          ]);

        if (error) throw error;
      } catch (error) {
        toast.error("Failed to send message");
        console.error("Error sending message:", error);
      }
    },
    [conversationId]
  );

  useEffect(() => {
    void fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          void fetchMessages();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  return { messages, isLoading, sendMessage, refetch: fetchMessages };
}

export function useCreateConversation() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const createConversation = useCallback(
    async (engineerId: string, jobId?: string) => {
      setIsLoading(true);
      try {
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("conversations")
          .insert([
            {
              client_id: user.id,
              engineer_id: engineerId,
              job_id: jobId ?? null
            }
          ])
          .select()
          .single();

        if (error) throw error;
        return data as ConversationRow;
      } catch (error) {
        toast.error("Failed to create conversation");
        console.error("Error creating conversation:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return { createConversation, isLoading };
}