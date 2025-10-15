import React, { useState, useEffect } from 'react';
import { Bot, BarChart3, Clock, Shield, MessageSquare, ArrowRight, Brain, Plus, Settings2, Mic, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CustomersTableCard } from '../ui/customers-table-card';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import FeatureSection from '../ui/feature-section';
import { ContainerScroll } from '../ui/container-scroll-animation';

export const AIChatAssistant: React.FC = () => {
  const { t } = useTranslation('homepage');
  const [activeTab, setActiveTab] = useState<'chat' | 'projects' | 'analytics'>('chat');
  const [typedPlaceholder, setTypedPlaceholder] = useState('');

  useEffect(() => {
    const placeholderText = 'Ask about engineering projects, costs, or find engineers...';
    let index = 0;
    
    const typeText = () => {
      if (index < placeholderText.length) {
        setTypedPlaceholder(placeholderText.slice(0, index + 1));
        index++;
        setTimeout(typeText, 50);
      } else {
        // Reset after a delay
        setTimeout(() => {
          index = 0;
          setTypedPlaceholder('');
          setTimeout(typeText, 1000);
        }, 3000);
      }
    };

    typeText();
  }, []);

  return (
    <section className="py-[100px] px-6 md:py-[100px] md:px-0 bg-muted/30">
      <div className="container mx-auto px-0">
        <div className="max-w-7xl mx-auto">
          {/* Main Dashboard with Scroll Animation */}
          <ContainerScroll
            titleComponent={
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t('aiAssistant.title')}
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto pb-4">
                  {t('aiAssistant.subtitle')}
                </p>
              </div>
            }
          >
            <div className="relative rounded-2xl p-[2px] pb-[17px] h-[600px] overflow-hidden bg-background shadow-2xl backdrop-blur-xl">
              {/* Laser Flow animated border */}
              <div className="pointer-events-none absolute inset-0 z-0 animate-[spin_8s_linear_infinite] bg-[conic-gradient(hsl(var(--primary))_0%,hsl(var(--accent))_25%,hsl(var(--secondary))_50%,hsl(var(--destructive))_75%,hsl(var(--primary))_100%)] opacity-60" />
              
              <div className="relative z-10 w-full h-full bg-card rounded-2xl overflow-hidden flex flex-col">
                {/* Dashboard Header */}
              <div className="bg-primary/10 border-b border-sidebar-border p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary-foreground" />
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
                    <div className="flex-1 overflow-y-auto space-y-4 pt-4 pl-4">
                      {/* AI Welcome Message */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg p-3 max-w-md">
                          <p className="text-sm text-foreground">
                            {t('aiAssistant.chat.welcome')}
                          </p>
                          <span className="text-xs text-muted-foreground">{t('aiAssistant.chat.justNow')}</span>
                        </div>
                      </div>
                        
                      {/* Sample User Message */}
                      <div className="flex items-start space-x-3 justify-end pr-4">
                        <div className="bg-primary rounded-lg p-3 max-w-md">
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
                          <Brain className="w-4 h-4 text-primary" />
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
                    
                    {/* Chat Input - Modern Design */}
                    <div className="p-4 pb-[17px] border-t border-sidebar-border bg-card">
                      <div className="w-full">
                        <form onSubmit={(e) => e.preventDefault()}>
                          <div className="flex flex-col rounded-[28px] p-2 shadow-sm transition-colors bg-background border border-border cursor-text">
                                <input type="file" className="hidden" accept="image/*" />
                                <textarea
                                  rows={1}
                                  placeholder={typedPlaceholder}
                                  className="custom-scrollbar w-full resize-none border-0 bg-transparent p-3 text-foreground placeholder:text-muted-foreground focus:ring-0 focus-visible:outline-none min-h-12"
                                  style={{ height: '48px' }}
                                />
                                <div className="mt-0.5 p-1 pt-0">
                                  <div className="flex items-center gap-2">
                                    {/* Attach Image Button */}
                                    <button
                                      type="button"
                                      className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none"
                                    >
                                      <Plus className="h-6 w-6" />
                                      <span className="sr-only">Attach image</span>
                                    </button>
                                    
                                    {/* Tools Button */}
                                    <button
                                      type="button"
                                      className="flex h-8 items-center gap-2 rounded-full p-2 text-sm text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-ring"
                                    >
                                      <Settings2 className="h-4 w-4" />
                                      Tools
                                    </button>

                                    <div className="ml-auto flex items-center gap-2">
                                      {/* Voice Record Button */}
                                      <button
                                        type="button"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none"
                                      >
                                        <Mic className="h-5 w-5" />
                                        <span className="sr-only">Record voice</span>
                                      </button>
                                      
                                      {/* Send Button */}
                                      <button
                                        type="submit"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/40"
                                      >
                                        <ArrowUp className="h-6 w-6" />
                                        <span className="sr-only">Send message</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="h-full">
                    <CustomersTableCard 
                      title={t('aiAssistant.projectsTab.title')}
                      subtitle={t('aiAssistant.projectsTab.subtitle')}
                      customers={[
                        {
                          id: 1,
                          date: '11/15/2024',
                          status: 'Paid',
                          statusVariant: 'success',
                          name: 'Ahmed Al-Rashid',
                          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                          revenue: 'SAR 15,000',
                        },
                        {
                          id: 2,
                          date: '11/14/2024',
                          status: 'Paid',
                          statusVariant: 'success',
                          name: 'Fatima Al-Zahra',
                          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                          revenue: 'SAR 22,500',
                        },
                        {
                          id: 3,
                          date: '11/13/2024',
                          status: 'Ref',
                          statusVariant: 'warning',
                          name: 'Mohammed Al-Sayed',
                          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                          revenue: 'SAR 8,500',
                        },
                        {
                          id: 4,
                          date: '11/12/2024',
                          status: 'Cancelled',
                          statusVariant: 'danger',
                          name: 'Sara Al-Mansouri',
                          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                          revenue: 'SAR 12,000',
                        },
                      ]}
                    />
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-background">
                      <h4 className="font-semibold mb-2">{t('aiAssistant.analytics.successRate')}</h4>
                      <div className="text-3xl font-bold text-primary mb-1">94.2%</div>
                      <p className="text-sm text-muted-foreground">{t('aiAssistant.analytics.successRateChange')}</p>
                    </Card>
                    <Card className="p-4 bg-background">
                      <h4 className="font-semibold mb-2">{t('aiAssistant.analytics.responseTime')}</h4>
                      <div className="text-3xl font-bold text-primary mb-1">2.3h</div>
                      <p className="text-sm text-muted-foreground">{t('aiAssistant.analytics.responseTimeChange')}</p>
                    </Card>
                    <Card className="p-4 bg-background">
                      <h4 className="font-semibold mb-2">{t('aiAssistant.analytics.totalProjects')}</h4>
                      <div className="text-3xl font-bold text-primary mb-1">1,247</div>
                      <p className="text-sm text-muted-foreground">{t('aiAssistant.analytics.totalProjectsChange')}</p>
                    </Card>
                    <Card className="p-4 bg-background">
                      <h4 className="font-semibold mb-2">{t('aiAssistant.analytics.satisfaction')}</h4>
                      <div className="text-3xl font-bold text-primary mb-1">4.8★</div>
                      <p className="text-sm text-muted-foreground">{t('aiAssistant.analytics.satisfactionChange')}</p>
                    </Card>
                  </div>
                )}
                </div>
              </div>
            </div>
          </ContainerScroll>

          {/* Feature Section */}
          <div className="mt-[100px]">
            <FeatureSection />
          </div>
        </div>
      </div>
    </section>
  );
};

