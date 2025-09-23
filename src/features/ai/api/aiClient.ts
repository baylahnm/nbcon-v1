import { supabase } from '@/integrations/supabase/client';
import { useAuthStore, getStoredUser } from '@/stores/auth';
import { Message, Attachment, Citation, GeneratedImage } from '../store/useAiStore';

export interface ChatRequest {
  message: string;
  threadId: string;
  mode: 'chat' | 'research' | 'image' | 'agent' | 'connectors';
  attachments?: Attachment[];
  temperature?: number;
  lang?: 'en' | 'ar';
  translate?: boolean;
}

export interface ResearchRequest {
  query: string;
  threadId: string;
  sources?: string[];
  depth?: 'shallow' | 'medium' | 'deep';
}

export interface ImageRequest {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024';
  style?: 'realistic' | 'artistic' | 'technical';
  count?: number;
}

export interface HijriDate {
  hijri: string;
  gregorian: string;
  day: number;
  month: number;
  year: number;
  monthName: string;
}

class AiClient {
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://api.nbcon.sa/ai' 
    : 'http://localhost:54321/functions/v1';

  // Chat streaming
  async streamChat(request: ChatRequest): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Chat request failed: ${response.statusText}`);
    }

    return response.body!;
  }

  // Deep research
  async startResearch(request: ResearchRequest): Promise<{ researchId: string; steps: string[] }> {
    const response = await fetch(`${this.baseUrl}/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Research request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getResearchResults(researchId: string): Promise<{
    status: 'running' | 'completed' | 'failed';
    results?: {
      summary: string;
      citations: Citation[];
      sources: string[];
    };
    error?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/research/${researchId}`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Research status request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Image generation
  async generateImage(request: ImageRequest): Promise<GeneratedImage[]> {
    const response = await fetch(`${this.baseUrl}/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Image generation failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Agent tools
  async getAgentTools(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    category: 'communication' | 'analysis' | 'generation' | 'automation';
    icon: string;
  }>> {
    const response = await fetch(`${this.baseUrl}/agent/tools`, {
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Agent tools request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async executeAgentTool(toolId: string, params: Record<string, any>): Promise<{
    result: any;
    success: boolean;
    error?: string;
  }> {
    const response = await fetch(`${this.baseUrl}/agent/tools/${toolId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Agent tool execution failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Voice transcription
  async transcribeAudio(audioBlob: Blob): Promise<{
    transcript: string;
    confidence: number;
    language: string;
  }> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await fetch(`${this.baseUrl}/transcribe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    return response.json();
  }

  // File processing
  async processFile(file: File): Promise<{
    content: string;
    metadata: {
      type: string;
      size: number;
      pages?: number;
      extractedText?: string;
    };
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/process-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File processing failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Hijri date conversion
  async convertToHijri(isoDate: string): Promise<HijriDate> {
    const response = await fetch(`${this.baseUrl}/hijri-convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: JSON.stringify({ isoDate }),
    });

    if (!response.ok) {
      throw new Error(`Hijri conversion failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Supabase operations
  async saveThread(thread: {
    id: string;
    title: string;
    mode: string;
    userId: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('ai_threads')
      .insert(thread);

    if (error) {
      throw new Error(`Failed to save thread: ${error.message}`);
    }
  }

  async saveMessage(message: {
    id: string;
    threadId: string;
    role: string;
    content: string;
    mode: string;
    attachments?: any;
    citations?: any;
    images?: any;
    userId: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('ai_messages')
      .insert(message);

    if (error) {
      throw new Error(`Failed to save message: ${error.message}`);
    }
  }

  async getThreads(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('ai_threads')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch threads: ${error.message}`);
    }

    return data || [];
  }

  async getMessages(threadId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data || [];
  }

  async logEvent(event: {
    type: string;
    data: any;
    userId: string | null;
    sessionId?: string;
  }): Promise<void> {
    if (!event.userId) {
      return;
    }
    const { error } = await supabase
      .from('ai_events')
      .insert({
        ...event,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to log event:', error);
    }
  }

  // Analytics events
  async trackAiChatView(route: string, role: string): Promise<void> {
    await this.logEvent({
      type: 'ai_chat_view',
      data: { route, role },
      userId: await this.getCurrentUserId(),
    });
  }

  async trackAiSend(mode: string, hasFiles: boolean, lang: string): Promise<void> {
    await this.logEvent({
      type: 'ai_send',
      data: { mode, hasFiles, lang },
      userId: await this.getCurrentUserId(),
    });
  }

  async trackAiStreamStop(): Promise<void> {
    await this.logEvent({
      type: 'ai_stream_stop',
      data: {},
      userId: await this.getCurrentUserId(),
    });
  }

  async trackAiResearchClickedSource(sourceId: string): Promise<void> {
    await this.logEvent({
      type: 'ai_research_clicked_source',
      data: { sourceId },
      userId: await this.getCurrentUserId(),
    });
  }

  async trackAiImageGenerated(prompt: string, count: number): Promise<void> {
    await this.logEvent({
      type: 'ai_image_generated',
      data: { prompt, count },
      userId: await this.getCurrentUserId(),
    });
  }

  async trackAiThreadSaved(threadId: string): Promise<void> {
    await this.logEvent({
      type: 'ai_thread_saved',
      data: { threadId },
      userId: await this.getCurrentUserId(),
    });
  }

  async trackAiError(code: string, message: string): Promise<void> {
    await this.logEvent({
      type: 'ai_error',
      data: { code, message },
      userId: await this.getCurrentUserId(),
    });
  }

  async trackDashboardWidgetClicked(widget: string): Promise<void> {
    await this.logEvent({
      type: 'dashboard_widget_clicked',
      data: { widget },
      userId: await this.getCurrentUserId(),
    });
  }

  // Utility methods
  private async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    return session.access_token;
  }

    private async getCurrentUserId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      return user.id;
    }

    const localUser = useAuthStore.getState().user ?? getStoredUser();
    if (localUser?.source === 'mock') {
      return null;
    }

    return localUser?.id ?? null;
  }

  // File validation
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 50MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported file type' };
    }

    return { valid: true };
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const aiClient = new AiClient();
