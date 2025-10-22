import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/pages/1-HomePage/others/components/ui/card';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { PromptCard } from './PromptCard';

interface CategorySectionProps {
  title: string;
  icon: LucideIcon;
  prompts: Array<{
    id: string;
    title: string;
    description: string;
    fullPrompt: string;
    category: string;
  }>;
  defaultExpanded?: boolean;
  color?: string;
}

export function CategorySection({ 
  title, 
  icon: Icon, 
  prompts, 
  defaultExpanded = true,
  color = 'primary'
}: CategorySectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    primary: { bg: 'bg-primary/10', text: 'text-primary', ring: 'ring-primary/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', ring: 'ring-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', ring: 'ring-purple-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-600', ring: 'ring-green-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', ring: 'ring-amber-500/20' },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
      <CardHeader 
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/40"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${colors.bg} p-2.5 rounded-xl ring-1 ${colors.ring} shadow-md group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {prompts.length} AI-powered prompts available
              </p>
            </div>
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </CardHeader>
      
      <CardContent className={`p-0 ${expanded ? 'block' : 'hidden'}`}>
        <div className="divide-y divide-border/40">
          {prompts.map((prompt, idx) => (
            <PromptCard key={prompt.id} prompt={prompt} index={idx + 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

