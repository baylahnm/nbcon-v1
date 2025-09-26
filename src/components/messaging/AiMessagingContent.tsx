import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  Phone, 
  Video, 
  MoreVertical,
  Bot,
  Sparkles,
  Languages,
  Volume2,
  VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuthStore } from "@/stores/auth";
import { useAiStore } from "@/features/ai/store/useAiStore";
import { aiClient } from "@/features/ai/api/aiClient";
import { getUserDisplayName, getUserInitials } from "@/lib/userUtils";

interface AiMessagingContentProps {
  conversationId?: string;
  onBack?: () => void;
}

export function AiMessagingContent({ conversationId, onBack }: AiMessagingContentProps) {
  const { profile, user } = useAuthStore();
  const {
    composer,
    isGenerating,
    mode,
    setComposerText,
    attachFile,
    removeAttachment,
    startVoiceRecording,
    stopVoiceRecording,
    setVoiceTranscript,
    sendMessage,
    clearComposer,
    switchMode,
    settings,
    toggleTranslate,
    setLanguage
  } = useAiStore();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAiTools, setShowAiTools] = useState(false);
  const [aiMode, setAiMode] = useState<'chat' | 'research' | 'image' | 'agent'>('chat');
  
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current user data
  const currentUserName = getUserDisplayName(profile);
  const currentUserInitials = getUserInitials(profile);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [composer.text]);

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          // Here you would typically send the audio to a speech-to-text service
          // For now, we'll simulate a transcript
          const simulatedTranscript = "This is a simulated voice message transcript";
          setVoiceTranscript(simulatedTranscript);
          setComposerText(composer.text + simulatedTranscript);
        } catch (err) {
          console.error('Failed to process voice message', err);
        } finally {
          stream.getTracks().forEach(t => t.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone permission denied or unavailable', err);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const validation = aiClient.validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        continue;
      }

      try {
        const result = await aiClient.processFile(file);
        const attachment = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          isConfidential: false,
        };
        attachFile(attachment);
      } catch (error) {
        console.error('File processing failed:', error);
        alert('Failed to process file');
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle send message with AI enhancement
  const handleSend = async () => {
    if (!composer.text.trim() && composer.files.length === 0) return;

    try {
      // Switch to AI mode if not already
      if (mode !== aiMode) {
        switchMode(aiMode);
      }

      // Send message through AI system
      await sendMessage(composer.text, composer.files);
      
      // Track AI messaging usage
      aiClient.trackAiChatView('/ai-messaging', 'user');
    } catch (error) {
      console.error('Failed to send AI message:', error);
    }
  };

  // Handle key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Format recording duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const placeholder = composer.lang === 'ar' 
    ? 'اكتب رسالة مع مساعدة الذكاء الاصطناعي...' 
    : 'Type a message with AI assistance...';

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                AI Assistant
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {aiMode}
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground">
                Powered by advanced AI for intelligent conversations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Popover open={showAiTools} onOpenChange={setShowAiTools}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium">AI Tools</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={aiMode === 'chat' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAiMode('chat')}
                    >
                      Chat
                    </Button>
                    <Button
                      variant={aiMode === 'research' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAiMode('research')}
                    >
                      Research
                    </Button>
                    <Button
                      variant={aiMode === 'image' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAiMode('image')}
                    >
                      Image
                    </Button>
                    <Button
                      variant={aiMode === 'agent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAiMode('agent')}
                    >
                      Agent
                    </Button>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTranslate}
                      className="w-full justify-start"
                    >
                      <Languages className="w-4 h-4 mr-2" />
                      {settings.autoTranslate ? 'Disable' : 'Enable'} Translation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLanguage(composer.lang === 'en' ? 'ar' : 'en')}
                      className="w-full justify-start"
                    >
                      <Languages className="w-4 h-4 mr-2" />
                      Switch to {composer.lang === 'en' ? 'Arabic' : 'English'}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                Back
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {/* Welcome Message */}
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm">
                  👋 Hello! I'm your AI assistant. I can help you with:
                </p>
                <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                  <li>• Answering questions and providing information</li>
                  <li>• Research and analysis</li>
                  <li>• Image generation and editing</li>
                  <li>• Task automation and workflow assistance</li>
                  <li>• Translation between English and Arabic</li>
                </ul>
                <p className="text-sm mt-2">
                  How can I assist you today?
                </p>
              </div>
            </div>
          </div>

          {/* AI Mode Indicator */}
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Mode: {aiMode.charAt(0).toUpperCase() + aiMode.slice(1)}
            </Badge>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* AI Composer */}
      <div className="p-6 border-t border-sidebar-border bg-background">
        <div className="space-y-4">
          {/* Attachments */}
          {composer.files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {composer.files.map((file) => (
                <div key={file.id} className="flex items-center gap-2 bg-muted rounded-lg p-2">
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(file.id)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Composer */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                ref={fileInputRef}
                placeholder={placeholder}
                value={composer.text}
                onChange={(e) => setComposerText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isGenerating}
                className="min-h-[44px] resize-none"
                dir={composer.lang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
            
            <div className="flex items-center gap-2">
              {/* File Upload */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating}
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              {/* Voice Recording */}
              <Button
                variant="outline"
                size="sm"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                disabled={isGenerating}
                className={isRecording ? 'bg-red-100 text-red-600' : ''}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span className="ml-1 text-xs">{formatDuration(recordingTime)}</span>
                  </>
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={(!composer.text.trim() && composer.files.length === 0) || isGenerating}
                size="sm"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* AI Features Indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Bot className="w-3 h-3" />
                AI Enhanced
              </span>
              {settings.autoTranslate && (
                <span className="flex items-center gap-1">
                  <Languages className="w-3 h-3" />
                  Auto Translate
                </span>
              )}
            </div>
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
