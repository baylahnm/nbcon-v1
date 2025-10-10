import { Languages, RotateCcw } from 'lucide-react';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { useAiStore } from '../store/useAiStore';

interface RTLDirectionToggleProps {
  isCompact?: boolean;
  showLabel?: boolean;
}

export function RTLDirectionToggle({ isCompact = false, showLabel = true }: RTLDirectionToggleProps) {
  const { 
    composer, 
    settings, 
    setLanguage, 
    toggleRTL 
  } = useAiStore();

  const handleLanguageToggle = () => {
    const newLang = composer.lang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    
    // Auto-enable RTL for Arabic
    if (newLang === 'ar' && !settings.rtl) {
      toggleRTL();
    }
  };

  const handleRTLToggle = () => {
    toggleRTL();
  };

  return (
    <div className={`flex items-center gap-2 ${isCompact ? 'gap-1' : 'gap-2'}`}>
      {/* Language Toggle */}
      <Button
        variant="outline"
        size={isCompact ? 'sm' : 'default'}
        onClick={handleLanguageToggle}
        className="flex items-center gap-2"
      >
        <Languages className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
        {showLabel && (
          <span className={isCompact ? 'text-xs' : 'text-sm'}>
            {composer.lang === 'en' ? 'العربية' : 'English'}
          </span>
        )}
      </Button>

      {/* RTL Toggle */}
      <Button
        variant={settings.rtl ? 'default' : 'outline'}
        size={isCompact ? 'sm' : 'default'}
        onClick={handleRTLToggle}
        className="flex items-center gap-2"
      >
        <RotateCcw className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
        {showLabel && (
          <span className={isCompact ? 'text-xs' : 'text-sm'}>
            RTL
          </span>
        )}
      </Button>

      {/* Status Badge */}
      {settings.rtl && (
        <Badge variant="secondary" className="text-xs">
          RTL
        </Badge>
      )}
    </div>
  );
}
