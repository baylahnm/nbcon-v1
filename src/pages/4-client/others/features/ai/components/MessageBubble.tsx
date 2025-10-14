import { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Eye,
  EyeOff,
  Star,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  AlertCircle,
  Bot,
  User,
  Search,
  Image as ImageIcon,
  Cog,
  Link as LinkIcon,
  FileText
} from 'lucide-react';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Badge } from '@/pages/1-HomePage/others/components/ui/badge';
import { Card } from '@/pages/1-HomePage/others/components/ui/card';
import { Avatar, AvatarFallback } from '@/pages/1-HomePage/others/components/ui/avatar';
import { Message, Citation, GeneratedImage } from '../store/useAiStore';
import { HijriBadge } from './HijriBadge';

interface MessageBubbleProps {
  message: Message;
  isRTL?: boolean;
  showHijri?: boolean;
  isCompact?: boolean;
  onCitationClick?: (citation: Citation) => void;
  onImageDownload?: (image: GeneratedImage) => void;
  onRegenerate?: (messageId: string) => void;
  onFeedback?: (messageId: string, type: 'positive' | 'negative') => void;
}

export function MessageBubble({ 
  message, 
  isRTL = false,
  showHijri = false,
  isCompact = false,
  onCitationClick,
  onImageDownload,
  onRegenerate,
  onFeedback
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [showConfidential, setShowConfidential] = useState(false);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Get mode icon
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'research': return <Search className="w-3 h-3" />;
      case 'image': return <ImageIcon className="w-3 h-3" />;
      case 'agent': return <Cog className="w-3 h-3" />;
      case 'connectors': return <LinkIcon className="w-3 h-3" />;
      default: return null;
    }
  };

  // Get mode label
  const getModeLabel = (mode: string, lang: 'en' | 'ar' = 'en') => {
    const labels = {
      chat: { en: 'Chat', ar: 'محادثة' },
      research: { en: 'Research', ar: 'بحث' },
      image: { en: 'Image', ar: 'صورة' },
      agent: { en: 'Agent', ar: 'وكيل' },
      connectors: { en: 'Connectors', ar: 'موصلات' },
    };
    return labels[mode as keyof typeof labels]?.[lang] || mode;
  };

  // Render code blocks
  const renderCodeBlock = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2]
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts.map((part, index) => {
      if (part.type === 'code') {
        return (
          <div key={index} className="my-2">
            <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-t-lg">
              <span className="text-xs text-gray-600 font-mono">{part.language}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(part.content)}
                className="h-6 px-2"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
              <code>{part.content}</code>
            </pre>
          </div>
        );
      }

      return (
        <span key={index} className="whitespace-pre-wrap">
          {part.content}
        </span>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'} ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar */}
      {!isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[80%] ${isRTL ? 'items-end' : 'items-start'}`}>
        {/* Message Card */}
        <Card className={`p-4 ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        } ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Mode Badge */}
          {isAssistant && message.mode !== 'chat' && (
            <div className="flex items-center gap-1 mb-2">
              <Badge variant="outline" className="text-xs">
                {getModeIcon(message.mode)}
                <span className="ml-1">{getModeLabel(message.mode)}</span>
              </Badge>
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            {/* Text Content */}
            {message.content && (
              <div className="prose prose-sm max-w-none">
                {renderCodeBlock(message.content)}
              </div>
            )}

            {/* Error State */}
            {message.error && (
              <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{message.error}</span>
              </div>
            )}

            {/* Streaming Indicator */}
            {message.isStreaming && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-xs">Generating...</span>
              </div>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="space-y-2">
                {message.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm truncate">{attachment.name}</span>
                    {attachment.isConfidential && (
                      <Badge variant="destructive" className="text-xs">
                        Confidential
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Generated Images */}
            {message.images && message.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {message.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onImageDownload?.(image)}
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Citations */}
            {message.citations && message.citations.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Sources:</div>
                {message.citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="p-2 border rounded cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onCitationClick?.(citation)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{citation.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{citation.source}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {citation.snippet}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Message Footer */}
        <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Timestamp */}
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(message.timestamp)}
            {showHijri && <HijriBadge date={message.timestamp} />}
          </span>

          {/* Actions */}
          {isAssistant && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 w-6 p-0"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>

              {onRegenerate && !message.isStreaming && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRegenerate(message.id)}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              )}

              {onFeedback && !message.isStreaming && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFeedback(message.id, 'positive')}
                    className="h-6 w-6 p-0"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFeedback(message.id, 'negative')}
                    className="h-6 w-6 p-0"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

