import { 
  FileText, 
  Image as ImageIcon, 
  File, 
  X, 
  Download,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Progress } from '../../../../../1-HomePage/others/components/ui/progress';
import { Attachment } from '../store/useAiStore';
import { aiClient } from '../api/aiClient';

interface AttachmentStripProps {
  attachments: Attachment[];
  onRemove: (attachmentId: string) => void;
  isCompact?: boolean;
  onDownload?: (attachment: Attachment) => void;
  onToggleConfidential?: (attachment: Attachment) => void;
}

export function AttachmentStrip({ 
  attachments, 
  onRemove, 
  isCompact = false,
  onDownload,
  onToggleConfidential
}: AttachmentStripProps) {
  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (type.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  // Get file type label
  const getFileTypeLabel = (type: string) => {
    if (type.startsWith('image/')) return 'Image';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word')) return 'Word';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel';
    if (type.includes('csv')) return 'CSV';
    return 'File';
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    return aiClient.formatFileSize(bytes);
  };

  if (attachments.length === 0) return null;

  return (
    <div className={`space-y-2 ${isCompact ? 'space-y-1' : ''}`}>
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className={`flex items-center gap-2 p-2 bg-muted rounded-lg ${
            isCompact ? 'p-1.5' : ''
          }`}
        >
          {/* File Icon */}
          <div className="flex-shrink-0">
            {getFileIcon(attachment.type)}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-medium truncate ${
                isCompact ? 'text-xs' : 'text-sm'
              }`}>
                {attachment.name}
              </span>
              
              {/* File Type Badge */}
              <Badge variant="outline" className="text-xs">
                {getFileTypeLabel(attachment.type)}
              </Badge>

              {/* Confidential Badge */}
              {attachment.isConfidential && (
                <Badge variant="destructive" className="text-xs">
                  Confidential
                </Badge>
              )}
            </div>

            {/* File Size */}
            <div className={`text-muted-foreground ${
              isCompact ? 'text-xs' : 'text-xs'
            }`}>
              {formatFileSize(attachment.size)}
            </div>

            {/* Progress Bar */}
            {attachment.progress !== undefined && (
              <div className="mt-1">
                <Progress value={attachment.progress} className="h-1" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Download Button */}
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(attachment)}
                className="h-6 w-6 p-0"
              >
                <Download className="w-3 h-3" />
              </Button>
            )}

            {/* Confidential Toggle */}
            {onToggleConfidential && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleConfidential(attachment)}
                className="h-6 w-6 p-0"
              >
                {attachment.isConfidential ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </Button>
            )}

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(attachment.id)}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}

      {/* Upload Limit Warning */}
      {attachments.length >= 5 && (
        <div className="flex items-center gap-2 p-2 bg-warning/10 border border-warning/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-warning" />
          <span className="text-xs text-warning">
            Maximum 5 files allowed
          </span>
        </div>
      )}
    </div>
  );
}
