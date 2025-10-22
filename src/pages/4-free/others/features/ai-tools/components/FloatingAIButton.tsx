import { Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FloatingAIButton() {
  const navigate = useNavigate();

  return (
    <button
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-2xl hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
      onClick={() => navigate('/free/ai')}
      aria-label="Open AI Assistant"
    >
      <Bot className="h-6 w-6" />
      
      {/* Online indicator */}
      <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-foreground text-background text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
          Ask AI Anything
        </div>
      </div>
    </button>
  );
}

