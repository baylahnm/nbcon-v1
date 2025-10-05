import React, { useState, useEffect } from 'react';
import { Bot, BarChart3, Clock, Shield, MessageSquare, ArrowRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomersTableCard } from '@/components/ui/customers-table-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import FeatureSection from '@/components/ui/feature-section';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export const AIChatAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'projects' | 'analytics'>('chat');
  const [typedPlaceholder, setTypedPlaceholder] = useState('');

  useEffect(() => {
    const placeholderText = "Ask about engineering projects, costs, or find engineers...";
    let index = 0;
    
    const typeText = () => {
      if (index < placeholderText.length) {
        setTypedPlaceholder(placeholderText.slice(0, index + 1));
        index++;
        setTimeout(typeText, 100);
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
                  nbcon AI Assistant
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto pb-4">
                  Your intelligent engineering project partner powered by advanced AI technology. 
                  Automate your tasks and workflows with smart matching, real-time cost estimation, and compliance guidance.
                </p>
              </div>
            }
          >
            <div className="relative rounded-2xl p-[2px] h-[600px] overflow-hidden bg-card shadow-2xl">
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
                      <h3 className="text-xl font-bold text-foreground">nbcon AI Assistant</h3>
                      <p className="text-sm text-muted-foreground">Intelligent engineering project management</p>
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
                      AI Chat
                    </ToggleGroupItem>
                    <ToggleGroupItem value="projects" className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Projects
                    </ToggleGroupItem>
                    <ToggleGroupItem value="analytics" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Analytics
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 p-6 overflow-hidden">
                {activeTab === 'chat' && (
                  <div className="h-full flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {/* AI Welcome Message */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg p-3 max-w-md">
                          <p className="text-sm text-foreground">
                            Hello! I'm your nbcon AI assistant. I can help you find the right engineers for your project, estimate costs, suggest timelines, and answer questions about engineering services in Saudi Arabia.
                          </p>
                          <span className="text-xs text-muted-foreground">Just now</span>
                        </div>
                      </div>
                        
                      {/* Sample User Message */}
                      <div className="flex items-start space-x-3 justify-end">
                        <div className="bg-primary rounded-lg p-3 max-w-md">
                          <p className="text-sm text-primary-foreground">
                            I need an electrical engineer for a residential project in Riyadh. Budget is around SAR 15,000.
                          </p>
                          <span className="text-xs text-primary-foreground/70">Just now</span>
                        </div>
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-muted-foreground text-xs font-bold">You</span>
                        </div>
                      </div>
                        
                      {/* AI Response */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg p-3 max-w-md">
                          <p className="text-sm text-foreground">
                            Perfect! I found 12 qualified electrical engineers in Riyadh. Here are my top recommendations:
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
                          <span className="text-xs text-muted-foreground">Just now</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chat Input */}
                    <div className="border-t border-sidebar-border pt-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder={typedPlaceholder}
                            className="w-full p-3 pr-12 border border-sidebar-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                        <Button className="px-6">
                          <span className="hidden sm:inline">Send</span>
                          <ArrowRight className="w-4 h-4 sm:ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div className="h-full">
                    <CustomersTableCard 
                      title="Engineering Projects"
                      subtitle="Active projects managed by nbcon AI Assistant"
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
                      <h4 className="font-semibold mb-2">Project Success Rate</h4>
                      <div className="text-3xl font-bold text-primary mb-1">94.2%</div>
                      <p className="text-sm text-muted-foreground">+2.1% from last month</p>
                    </Card>
                    <Card className="p-4 bg-background">
                      <h4 className="font-semibold mb-2">Average Response Time</h4>
                      <div className="text-3xl font-bold text-primary mb-1">2.3h</div>
                      <p className="text-sm text-muted-foreground">-15min from last month</p>
                    </Card>
                    <Card className="p-4 bg-background">
                      <h4 className="font-semibold mb-2">Total Projects</h4>
                      <div className="text-3xl font-bold text-primary mb-1">1,247</div>
                      <p className="text-sm text-muted-foreground">+89 this month</p>
                    </Card>
                    <Card className="p-4 bg-background">
                      <h4 className="font-semibold mb-2">Customer Satisfaction</h4>
                      <div className="text-3xl font-bold text-primary mb-1">4.8★</div>
                      <p className="text-sm text-muted-foreground">Based on 342 reviews</p>
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
