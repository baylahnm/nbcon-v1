import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAiStore } from '../../ai/store/useAiStore';

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    description: string;
    fullPrompt: string;
    category: string;
  };
  index: number;
}

export function PromptCard({ prompt, index }: PromptCardProps) {
  const navigate = useNavigate();
  const { setComposerText } = useAiStore();

  const handleUsePrompt = () => {
    // Set the prompt in AI composer
    setComposerText(prompt.fullPrompt);
    
    // Navigate to AI Assistant page
    navigate('/free/ai');
  };

  return (
    <div className="p-4 hover:bg-muted/30 transition-colors group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-primary shrink-0">#{index}</span>
            <h4 className="text-sm font-semibold">{prompt.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {prompt.description}
          </p>
        </div>
        <Button 
          size="sm" 
          className="h-8 text-xs whitespace-nowrap shrink-0 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
          onClick={handleUsePrompt}
        >
          Use This Prompt
          <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}

