import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Camera, Upload, Loader2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
  currentImage?: string;
  firstName: string;
  lastName: string;
  onImageUpload: (file: File) => Promise<string | null>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUploadButton?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ProfileImageUpload({
  currentImage,
  firstName,
  lastName,
  onImageUpload,
  size = 'md',
  showUploadButton = true,
  disabled = false,
  className = ''
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const buttonSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-8 h-8',
    xl: 'w-8 h-8'
  };

  const getInitials = () => {
    const firstInitial = firstName?.[0]?.toUpperCase() || '';
    const lastInitial = lastName?.[0]?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}` || 'U';
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate image dimensions (optional)
    const img = new Image();
    img.onload = async () => {
      if (img.width < 100 || img.height < 100) {
        toast.error('Image must be at least 100x100 pixels');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        const imageUrl = await onImageUpload(file);
        
        clearInterval(progressInterval);
        setUploadProgress(100);

        if (imageUrl) {
          toast.success('Profile image updated successfully');
        } else {
          toast.error('Failed to upload profile image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload profile image');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    img.src = URL.createObjectURL(file);
  };

  const handleRemoveImage = async () => {
    if (disabled) return;
    
    try {
      await onImageUpload(new File([], 'remove', { type: 'image/png' }));
      toast.success('Profile image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove profile image');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Avatar className={`${sizeClasses[size]} relative group`}>
        <AvatarImage 
          src={currentImage} 
          alt={`${firstName} ${lastName}`}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
          {isUploading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            getInitials()
          )}
        </AvatarFallback>
        
        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <div className="relative">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                {uploadProgress}%
              </span>
            </div>
          </div>
        )}
      </Avatar>

      {/* Upload Button */}
      {showUploadButton && !disabled && (
        <Button
          size="sm"
          variant="outline"
          className={`absolute -bottom-2 -right-2 ${buttonSizeClasses[size]} p-0 rounded-full bg-background border-2 hover:bg-accent`}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Camera className="w-3 h-3" />
          )}
        </Button>
      )}

      {/* Remove Button */}
      {currentImage && showUploadButton && !disabled && (
        <Button
          size="sm"
          variant="destructive"
          className={`absolute -top-1 -right-1 w-5 h-5 p-0 rounded-full`}
          onClick={handleRemoveImage}
          disabled={isUploading}
        >
          <X className="w-3 h-3" />
        </Button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload Status Indicator */}
      {isUploading && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
            <Upload className="w-3 h-3" />
            <span>Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
