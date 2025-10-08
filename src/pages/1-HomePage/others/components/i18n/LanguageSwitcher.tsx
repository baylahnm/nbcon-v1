import i18n from '@/pages/1-HomePage/others/lib/i18n/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/pages/1-HomePage/others/components/ui/select';
import { Globe } from 'lucide-react';

/**
 * Language switcher component for toggling between supported languages
 * Supports English (LTR) and Arabic (RTL) with automatic direction switching
 */
export function LanguageSwitcher() {
  const currentLanguage = i18n.language;

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Select defaultValue={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-32 gap-2">
        <Globe className="h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">العربية</SelectItem>
      </SelectContent>
    </Select>
  );
}

