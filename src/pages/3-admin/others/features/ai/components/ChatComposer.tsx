import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  X, 
  Plus,
  Loader2,
  FileText,
  Image,
  File,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Textarea } from '@/pages/1-HomePage/others/components/ui/textarea';
import { Card } from '@/pages/1-HomePage/others/components/ui/card';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Progress } from '@/pages/1-HomePage/others/components/ui/progress';
import { useAiStore } from '../store/useAiStore';
import { aiClient } from '../api/aiClient';
import { AttachmentStrip } from './AttachmentStrip';
import { ToolMenu } from './ToolMenu';

interface ChatComposerProps {
  isCompact?: boolean;
  onSend?: () => void;
}

export function ChatComposer({ isCompact = false, onSend }: ChatComposerProps) {
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
  } = useAiStore();
  
  // Type guard for mode display
  const getCoreMode = (aiMode: typeof mode): 'chat' | 'research' | 'image' | 'agent' | 'connectors' => {
    const coreModesset = new Set(['chat', 'research', 'image', 'agent', 'connectors']);
    return coreModesset.has(aiMode) ? aiMode as any : 'chat';
  };

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showToolMenu, setShowToolMenu] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [composer.text]);

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        try {
          const result = await aiClient.transcribeAudio(audioBlob);
          setVoiceTranscript(result.transcript);
        } catch (error) {
          console.error('Transcription failed:', error);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      startVoiceRecording();

      // Start duration counter
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopVoiceRecording();
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
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

      setIsProcessingFile(true);
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
      } finally {
        setIsProcessingFile(false);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle send message
  const handleSend = async () => {
    if (!composer.text.trim() && composer.files.length === 0) return;

    try {
      await sendMessage(composer.text, composer.files);
      onSend?.();
    } catch (error) {
      console.error('Failed to send message:', error);
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
    ? 'اسأل أي شيء...' 
    : 'Ask anything...';

  return (
    <div className={`w-full ${isCompact ? 'space-y-2' : 'space-y-4'}`}>
      {/* Tool Menu */}
      {showToolMenu && (
        <ToolMenu
          currentMode={getCoreMode(mode)}
          onModeChange={switchMode}
          onClose={() => setShowToolMenu(false)}
        />
      )}

      {/* Composer */}
      <Card className={`p-4 ${isCompact ? 'p-2' : ''}`}>
        <div className="space-y-3">
          {/* Attachments */}
          {composer.files.length > 0 && (
            <AttachmentStrip
              attachments={composer.files}
              onRemove={removeAttachment}
              isCompact={isCompact}
            />
          )}

          {/* Voice Recording Indicator */}
          {isRecording && (
            <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-destructive">
                Recording... {formatDuration(recordingDuration)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={stopRecording}
                className="ml-auto"
              >
                <MicOff className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Main Input Area */}
          <div className="flex items-end gap-2">
            {/* File Upload Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingFile || composer.files.length >= 5}
              className="flex-shrink-0"
            >
              {isProcessingFile ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Paperclip className="w-4 h-4" />
              )}
            </Button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={composer.text}
                onChange={(e) => setComposerText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="min-h-[44px] max-h-32 resize-none pr-12"
                disabled={isGenerating}
              />
              
              {/* Voice Recording Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isGenerating}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={(!composer.text.trim() && composer.files.length === 0) || isGenerating}
              className="flex-shrink-0"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Tool Menu Button */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowToolMenu(!showToolMenu)}
              className="text-muted-foreground"
            >
              <Plus className="w-4 h-4 mr-1" />
              {composer.lang === 'ar' ? 'أدوات' : 'Tools'}
            </Button>

            {/* Mode Badge */}
            <Badge variant="outline" className="text-xs">
              {['chat', 'research', 'image', 'agent', 'connectors'].includes(mode) ? (
                <>
                  {mode === 'chat' && (composer.lang === 'ar' ? 'محادثة' : 'Chat')}
                  {mode === 'research' && (composer.lang === 'ar' ? 'بحث عميق' : 'Research')}
                  {mode === 'image' && (composer.lang === 'ar' ? 'صورة' : 'Image')}
                  {mode === 'agent' && (composer.lang === 'ar' ? 'وكيل' : 'Agent')}
                  {mode === 'connectors' && (composer.lang === 'ar' ? 'موصلات' : 'Connectors')}
                </>
              ) : (
                <span>{mode}</span>
              )}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}

