import type { MessageKind } from "../store/useMessagingStore";

type JsonMap = Record<string, unknown>;

type CreateThreadRequest = {
  subject?: string;
  participantIds: string[];
  metadata?: JsonMap;
};

type CreateThreadResponse = {
  id: string;
};

type SendMessageRequest = {
  threadId: string;
  kind: MessageKind;
  body?: string;
  attachments?: { name: string; url?: string; size?: number }[];
  audioBlob?: Blob;
  metadata?: JsonMap;
};

type BasicOkResponse = {
  ok: boolean;
};

type SearchMessagesRequest = {
  threadId?: string;
  query?: string;
  page?: number;
  pageSize?: number;
};

type SearchMessagesResponse = {
  items: JsonMap[];
  next: boolean;
};

type TranslateRequest = {
  threadId: string;
  messageId: string;
  targetLang: "en" | "ar";
};

type TranslateResponse = {
  translatedText: string;
  translatedFrom: "en" | "ar";
};

type TranscribeRequest = {
  threadId: string;
  recordingUrl: string;
  mimeType?: string;
};

type TranscribeResponse = {
  text: string;
  lang: string;
  confidence: number;
};

type SecureFileUrlRequest = {
  path: string;
  expiresIn?: number;
};

type SecureFileUrlResponse = {
  url: string;
  ttl: number;
};

export const messagesClient = {
  createThread: async (_args: CreateThreadRequest): Promise<CreateThreadResponse> => ({ id: "" }),
  send: async (_args: SendMessageRequest): Promise<BasicOkResponse> => ({ ok: true }),
  markRead: async (_args: { threadId: string; lastMessageId: string }): Promise<BasicOkResponse> => ({ ok: true }),
  search: async (_args: SearchMessagesRequest): Promise<SearchMessagesResponse> => ({ items: [], next: false }),
  translate: async (_args: TranslateRequest): Promise<TranslateResponse> => ({ translatedText: "", translatedFrom: "en" }),
  transcribe: async (_args: TranscribeRequest): Promise<TranscribeResponse> => ({ text: "", lang: "en", confidence: 0.9 }),
  secureFileUrl: async (_args: SecureFileUrlRequest): Promise<SecureFileUrlResponse> => ({ url: "#", ttl: 60 })
};