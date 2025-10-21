import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, MessageSquare, Bot, Sparkles, Target, TrendingUp, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import FeatureSection from '../ui/feature-section';
import { PromptBox } from '../ui/chatgpt-prompt-input';

export const AIChatAssistant: React.FC = () => {
  const { t } = useTranslation('homepage');
  const [activeTab, setActiveTab] = useState<'chat' | 'projects' | 'analytics'>('chat');
  const [typedPlaceholder, setTypedPlaceholder] = useState('');

  useEffect(() => {
    const placeholderText = 'Ask about engineering projects, costs, or find engineers...';
    let index = 0;
    let timeoutId: NodeJS.Timeout | null = null;
    let isActive = true;
    
    const typeText = () => {
      if (!isActive) return;
      
      if (index < placeholderText.length) {
        setTypedPlaceholder(placeholderText.slice(0, index + 1));
        index++;
        timeoutId = setTimeout(typeText, 50);
      } else {
        // Reset after a delay
        timeoutId = setTimeout(() => {
          if (!isActive) return;
          index = 0;
          setTypedPlaceholder('');
          timeoutId = setTimeout(typeText, 1000);
        }, 3000);
      }
    };

    typeText();

    // Cleanup function
    return () => {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="py-16 md:py-24 lg:py-32 px-6 md:px-8 lg:px-12 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t('aiAssistant.title')}
                </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  {t('aiAssistant.subtitle')}
                </p>
              </div>

          {/* Main Dashboard Card */}
          <div className="relative rounded-2xl p-[2px] h-[600px] overflow-hidden bg-background shadow-2xl">
            {/* Animated gradient border */}
              <div className="pointer-events-none absolute inset-0 z-0 animate-[spin_8s_linear_infinite] bg-[conic-gradient(hsl(var(--primary))_0%,hsl(var(--accent))_25%,hsl(var(--secondary))_50%,hsl(var(--destructive))_75%,hsl(var(--primary))_100%)] opacity-60" />
              
              <div className="relative z-10 w-full h-full bg-card rounded-2xl overflow-hidden flex flex-col">
                {/* Dashboard Header */}
              <div className="bg-primary/10 border-b border-sidebar-border p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{t('aiAssistant.title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('aiAssistant.dashboardSubtitle')}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="mt-4">
                  <ToggleGroup type="single" value={activeTab} onValueChange={(value) => setActiveTab(value as 'chat' | 'projects' | 'analytics')}>
                    <ToggleGroupItem value="chat" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {t('aiAssistant.tabs.chat')}
                    </ToggleGroupItem>
                    <ToggleGroupItem value="projects" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      {t('aiAssistant.tabs.projects')}
                    </ToggleGroupItem>
                    <ToggleGroupItem value="analytics" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t('aiAssistant.tabs.analytics')}
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 p-0 overflow-hidden bg-background">
                {activeTab === 'chat' && (
                  <div className="h-full flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 p-4">
                      {/* AI Welcome Message */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg p-3 max-w-md">
                          <p className="text-sm text-foreground">
                            {t('aiAssistant.chat.welcome')}
                          </p>
                          <span className="text-xs text-muted-foreground">{t('aiAssistant.chat.justNow')}</span>
                        </div>
                      </div>
                        
                      {/* Sample User Message */}
                      <div className="flex items-start space-x-3 justify-end">
                        <div className="bg-primary-gradient rounded-lg p-3 max-w-md">
                          <p className="text-sm text-primary-foreground">
                            {t('aiAssistant.chat.userMessage')}
                          </p>
                          <span className="text-xs text-primary-foreground/70">{t('aiAssistant.chat.justNow')}</span>
                        </div>
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-muted-foreground text-xs font-bold">{t('aiAssistant.chat.you')}</span>
                        </div>
                      </div>
                        
                      {/* AI Response */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg p-3 max-w-md">
                          <p className="text-sm text-foreground">
                            {t('aiAssistant.chat.aiResponse')}
                          </p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Ahmed Al-Rashid</span>
                              <span className="text-primary font-medium">SAR 12,500</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Fatima Al-Zahra</span>
                              <span className="text-primary font-medium">SAR 14,000</span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{t('aiAssistant.chat.justNow')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chat Input - Enhanced PromptBox Component */}
                    <div className="p-4 pb-[17px] border-t border-sidebar-border bg-card">
                      <div className="w-full">
                        <form onSubmit={(e) => e.preventDefault()}>
                          <PromptBox placeholder={typedPlaceholder || "Ask anything..."} />
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="h-full overflow-y-auto p-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-bold">AI-Recommended Projects</h4>
                      <Badge className="bg-primary/10 text-primary border-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Smart Match
                      </Badge>
                    </div>

                    {/* AI Project Recommendations */}
                    <Card className="border-border/50 hover:shadow-md transition-all">
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-bold text-sm mb-1">Residential HVAC System Design</h5>
                            <p className="text-xs text-muted-foreground">Riyadh, Saudi Arabia • Posted 2 hours ago</p>
                          </div>
                          <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
                            <Target className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-medium text-green-600">96% Match</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] bg-primary/5">HVAC Design</Badge>
                          <Badge variant="outline" className="text-[10px] bg-primary/5">AutoCAD</Badge>
                          <Badge variant="outline" className="text-[10px] bg-primary/5">Energy Efficiency</Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-primary">SAR 18,000 - 25,000</span>
                          <span className="text-muted-foreground">Est. 3-4 weeks</span>
                        </div>

                        <div className="pt-2 border-t border-border/40">
                          <p className="text-xs text-muted-foreground flex items-start gap-2">
                            <Bot className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            AI suggests this project matches your expertise in HVAC systems and your availability in Riyadh area.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="border-border/50 hover:shadow-md transition-all">
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-bold text-sm mb-1">Commercial Building Electrical Review</h5>
                            <p className="text-xs text-muted-foreground">Jeddah, Saudi Arabia • Posted 5 hours ago</p>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-full">
                            <Target className="h-3 w-3 text-amber-600" />
                            <span className="text-xs font-medium text-amber-600">82% Match</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] bg-primary/5">Electrical</Badge>
                          <Badge variant="outline" className="text-[10px] bg-primary/5">Code Review</Badge>
                          <Badge variant="outline" className="text-[10px] bg-primary/5">SCE Compliance</Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-primary">SAR 12,000 - 15,000</span>
                          <span className="text-muted-foreground">Est. 2 weeks</span>
                        </div>

                        <div className="pt-2 border-t border-border/40">
                          <p className="text-xs text-muted-foreground flex items-start gap-2">
                            <Bot className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            Your SCE certification and electrical background make you ideal for this compliance review project.
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="border-border/50 hover:shadow-md transition-all">
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-bold text-sm mb-1">Solar Panel Installation Planning</h5>
                            <p className="text-xs text-muted-foreground">Dammam, Saudi Arabia • Posted 1 day ago</p>
                          </div>
                          <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-full">
                            <Target className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">75% Match</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] bg-primary/5">Renewable Energy</Badge>
                          <Badge variant="outline" className="text-[10px] bg-primary/5">Solar Design</Badge>
                          <Badge variant="outline" className="text-[10px] bg-primary/5">Site Planning</Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-primary">SAR 22,000 - 30,000</span>
                          <span className="text-muted-foreground">Est. 4-6 weeks</span>
                        </div>

                        <div className="pt-2 border-t border-border/40">
                          <p className="text-xs text-muted-foreground flex items-start gap-2">
                            <Bot className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            Expanding to renewable energy could increase your profile visibility by 35% based on market trends.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="h-full overflow-y-auto p-4 space-y-4">
                    <h4 className="text-base font-bold mb-4">AI Performance Insights</h4>
                    
                    {/* AI Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="border-border/50">
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-green-500/10 p-2 rounded-lg">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-xs text-muted-foreground">Match Accuracy</span>
                          </div>
                          <div className="text-2xl font-bold tracking-tight">94.8%</div>
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+2.4%</span>
                          </div>
                        </div>
                      </Card>

                      <Card className="border-border/50">
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-500/10 p-2 rounded-lg">
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-xs text-muted-foreground">Conversations</span>
                          </div>
                          <div className="text-2xl font-bold tracking-tight">1,247</div>
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+156 this month</span>
                          </div>
                        </div>
                      </Card>

                      <Card className="border-border/50">
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-purple-500/10 p-2 rounded-lg">
                              <Zap className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="text-xs text-muted-foreground">Avg Response</span>
                          </div>
                          <div className="text-2xl font-bold tracking-tight">1.8s</div>
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>15% faster</span>
                          </div>
                        </div>
                    </Card>

                      <Card className="border-border/50">
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-amber-500/10 p-2 rounded-lg">
                              <Target className="h-4 w-4 text-amber-600" />
                            </div>
                            <span className="text-xs text-muted-foreground">Success Rate</span>
                          </div>
                          <div className="text-2xl font-bold tracking-tight">87.3%</div>
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+5.1%</span>
                          </div>
                        </div>
                    </Card>
                    </div>

                    {/* AI Learning Progress */}
                    <Card className="border-border/50">
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-bold text-sm">AI Learning Progress</h5>
                              <p className="text-xs text-muted-foreground">Continuous improvement from interactions</p>
                            </div>
                          </div>
                          <Badge className="bg-primary/10 text-primary border-0 text-[10px]">Active</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Engineer Matching</span>
                              <span className="font-medium text-primary">96%</span>
                            </div>
                            <Progress value={96} className="h-1.5" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Cost Estimation</span>
                              <span className="font-medium text-primary">92%</span>
                            </div>
                            <Progress value={92} className="h-1.5" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Timeline Prediction</span>
                              <span className="font-medium text-primary">88%</span>
                            </div>
                            <Progress value={88} className="h-1.5" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">SCE Compliance Check</span>
                              <span className="font-medium text-primary">94%</span>
                            </div>
                            <Progress value={94} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Recent AI Activities */}
                    <Card className="border-border/50">
                      <div className="p-4">
                        <h5 className="font-bold text-sm mb-3">Recent AI Activities</h5>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-foreground">Matched 3 engineers for HVAC project in Riyadh</p>
                              <p className="text-muted-foreground">2 minutes ago</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-foreground">Estimated project cost: SAR 18,000-25,000</p>
                              <p className="text-muted-foreground">5 minutes ago</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-foreground">Verified SCE compliance for 2 candidates</p>
                              <p className="text-muted-foreground">12 minutes ago</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-foreground">Recommended expanding skills to renewable energy</p>
                              <p className="text-muted-foreground">18 minutes ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
                </div>
              </div>
            </div>

          {/* Feature Section */}
          <div className="mt-[100px]">
            <FeatureSection />
          </div>
        </div>
      </div>
    </section>
  );
};

