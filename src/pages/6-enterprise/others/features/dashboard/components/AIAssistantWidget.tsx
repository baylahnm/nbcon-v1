import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { 
  Bot, MessageSquare, Sparkles, TrendingUp, BarChart3, 
  Users, Briefcase, DollarSign, MoreHorizontal, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIAssistantWidgetProps {
  userRole?: string;
}

export function AIAssistantWidget({ userRole = 'enterprise' }: AIAssistantWidgetProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Add mouse tracking for animated gradient
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angle = Math.atan2(y - centerY, x - centerX);
      card.style.setProperty('--rotation', `${angle}rad`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getAIRoute = () => {
    switch (userRole) {
      case 'enterprise':
        return '/enterprise/ai';
      case 'engineer':
        return '/engineer/ai';
      case 'client':
        return '/client/ai';
      default:
        return '/ai';
    }
  };

  const aiSuggestions = [
    {
      id: '1',
      title: 'Analyze Q1 Performance',
      description: 'Get insights on team productivity and project outcomes',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      id: '2',
      title: 'Optimize Resource Allocation',
      description: 'Review team utilization and suggest improvements',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: '3',
      title: 'Financial Forecast',
      description: 'Predict revenue trends and budget requirements',
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      id: '4',
      title: 'Project Risk Assessment',
      description: 'Identify potential delays and mitigation strategies',
      icon: Briefcase,
      color: 'text-amber-600'
    }
  ];

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-0.5"
      style={{
        '--rotation': '4.2rad',
        border: '2px solid transparent',
        borderRadius: '0.5rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      } as React.CSSProperties}
    >
      <Card className="bg-transparent border-0 h-full">
        <CardHeader className="p-5 pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/10 h-[40px] w-[40px] flex items-center justify-center rounded-xl ring-1 ring-purple-500/20 group-hover:scale-110 transition-transform">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base font-bold tracking-tight">AI Assistant</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Get intelligent insights and recommendations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                AI
              </Badge>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <div className="space-y-4">
            {/* AI Status */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-foreground">AI Assistant Online</p>
                  <p className="text-xs text-muted-foreground">Ready to help with enterprise insights</p>
                </div>
              </div>
              <Button asChild size="sm" className="text-xs">
                <Link to={getAIRoute()}>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Link>
              </Button>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Suggested Actions</h4>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiSuggestions.map((suggestion) => {
                  const IconComponent = suggestion.icon;
                  return (
                    <div key={suggestion.id} className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <IconComponent className={`h-4 w-4 ${suggestion.color} mt-0.5 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-foreground">{suggestion.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent AI Interactions */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Recent Insights</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <p className="text-xs text-foreground">Revenue increased 18% this month</p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                  <Users className="h-3 w-3 text-blue-600" />
                  <p className="text-xs text-foreground">Team utilization at 78% - optimal range</p>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                  <Briefcase className="h-3 w-3 text-amber-600" />
                  <p className="text-xs text-foreground">3 projects at risk - review needed</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 text-xs" asChild>
                <Link to={getAIRoute()}>
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Start Chat
                </Link>
              </Button>
              <Button size="sm" variant="outline" className="flex-1 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
