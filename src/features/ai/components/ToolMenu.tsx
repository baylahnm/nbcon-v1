import { 
  MessageSquare, 
  Search, 
  Image as ImageIcon, 
  Cog, 
  Link as LinkIcon,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ToolMenuProps {
  currentMode: 'chat' | 'research' | 'image' | 'agent' | 'connectors';
  onModeChange: (mode: 'chat' | 'research' | 'image' | 'agent' | 'connectors') => void;
  onClose: () => void;
  isRTL?: boolean;
}

const tools = [
  {
    id: 'chat' as const,
    name: { en: 'Chat', ar: 'محادثة' },
    description: { 
      en: 'General conversation and Q&A', 
      ar: 'محادثة عامة وأسئلة وأجوبة' 
    },
    icon: MessageSquare,
    color: 'bg-blue-100 text-blue-700',
    available: true
  },
  {
    id: 'research' as const,
    name: { en: 'Deep Research', ar: 'بحث عميق' },
    description: { 
      en: 'Comprehensive research with citations', 
      ar: 'بحث شامل مع المراجع' 
    },
    icon: Search,
    color: 'bg-green-100 text-green-700',
    available: true
  },
  {
    id: 'image' as const,
    name: { en: 'Create Image', ar: 'إنشاء صورة' },
    description: { 
      en: 'Generate images from text prompts', 
      ar: 'إنشاء صور من النصوص' 
    },
    icon: ImageIcon,
    color: 'bg-purple-100 text-purple-700',
    available: true
  },
  {
    id: 'agent' as const,
    name: { en: 'Agent Mode', ar: 'وضع الوكيل' },
    description: { 
      en: 'AI agent with specialized tools', 
      ar: 'وكيل ذكي مع أدوات متخصصة' 
    },
    icon: Cog,
    color: 'bg-orange-100 text-orange-700',
    available: true
  },
  {
    id: 'connectors' as const,
    name: { en: 'Use Connectors', ar: 'استخدام الموصلات' },
    description: { 
      en: 'Connect to external services', 
      ar: 'الاتصال بالخدمات الخارجية' 
    },
    icon: LinkIcon,
    color: 'bg-gray-100 text-gray-700',
    available: false
  }
];

export function ToolMenu({ currentMode, onModeChange, onClose, isRTL = false }: ToolMenuProps) {
  const handleModeSelect = (mode: 'chat' | 'research' | 'image' | 'agent' | 'connectors') => {
    onModeChange(mode);
    onClose();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">
            {isRTL ? 'أدوات الذكاء الاصطناعي' : 'AI Tools'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isSelected = currentMode === tool.id;
          const isAvailable = tool.available;
          
          return (
            <Button
              key={tool.id}
              variant="ghost"
              className={`w-full justify-start h-auto p-3 ${
                isSelected ? 'bg-muted' : 'hover:bg-muted/50'
              } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isAvailable && handleModeSelect(tool.id)}
              disabled={!isAvailable}
            >
              <div className="flex items-start gap-3 w-full">
                {/* Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected ? tool.color : 'bg-muted'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {isRTL ? tool.name.ar : tool.name.en}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                    {!isAvailable && (
                      <Badge variant="outline" className="text-xs">
                        {isRTL ? 'قريباً' : 'Coming Soon'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isRTL ? tool.description.ar : tool.description.en}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
