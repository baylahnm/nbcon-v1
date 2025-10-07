import React from 'react';
import { Phone, Award, MapPin, Home, Briefcase, MessageSquare, BarChart3, Users, MessageCircle, Clock } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <section className="py-16 px-6 md:py-[200px] md:px-0">
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Interactive Dashboard Demo */}
          <div className="relative">
            <div className="relative rounded-2xl p-[2px] h-[500px] overflow-hidden">
              {/* Laser Flow animated border (theme-aware, circular flow) */}
              <div className="pointer-events-none absolute inset-0 z-0 animate-[spin_8s_linear_infinite] bg-[conic-gradient(hsl(var(--primary))_0%,hsl(var(--accent))_25%,hsl(var(--secondary))_50%,hsl(var(--destructive))_75%,hsl(var(--primary))_100%)] opacity-60" />
              {/* Full Dashboard Preview */}
              <div className="relative z-10 w-full h-full bg-card rounded-2xl shadow-2xl flex">
                {/* Sidebar */}
                <div className="w-16 bg-sidebar-background border-r border-sidebar-border flex flex-col items-center py-4 space-y-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xs">nb</span>
                  </div>
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Home className="w-4 h-4 text-primary" />
                  </div>
                  <div className="w-8 h-8 bg-sidebar-background rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-sidebar-foreground" />
                  </div>
                  <div className="w-8 h-8 bg-sidebar-background rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-sidebar-foreground" />
                  </div>
                  <div className="w-8 h-8 bg-sidebar-background rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-sidebar-foreground" />
                  </div>
                  <div className="w-8 h-8 bg-sidebar-background rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-sidebar-foreground" />
                  </div>
                  <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4 text-sidebar-accent-foreground" />
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                  {/* Header */}
                  <div className="border-b border-sidebar-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-foreground">24/7 Customer Support</h3>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-500 font-medium">Online</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="flex-1 p-4 space-y-4 overflow-hidden">
                    {/* Support Stats */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-primary/10 rounded-lg p-3 text-center">
                        <div className="text-xs text-muted-foreground">Avg Response Time</div>
                        <div className="text-lg font-bold text-primary">2.3 min</div>
                      </div>
                      <div className="bg-accent/10 rounded-lg p-3 text-center">
                        <div className="text-xs text-muted-foreground">Support Agents</div>
                        <div className="text-lg font-bold text-accent-foreground">15 Online</div>
                      </div>
                      <div className="bg-secondary/20 rounded-lg p-3 text-center">
                        <div className="text-xs text-muted-foreground">Satisfaction</div>
                        <div className="text-lg font-bold text-secondary-foreground">98.5%</div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-muted-foreground">Issues Resolved</div>
                        <div className="text-lg font-bold text-foreground">24/7</div>
                      </div>
                    </div>
                    
                    {/* Live Chat */}
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-foreground">Live Chat</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-card/50 rounded p-2 text-xs">
                          <span className="text-primary font-medium">Sarah (Support):</span>
                          <span className="text-muted-foreground"> How can I help you today?</span>
                        </div>
                        <div className="bg-primary/20 rounded p-2 text-xs ml-4">
                          <span className="text-primary font-medium">You:</span>
                          <span className="text-muted-foreground"> Need help with project milestones</span>
                        </div>
                        <div className="bg-card/50 rounded p-2 text-xs">
                          <span className="text-primary font-medium">Sarah:</span>
                          <span className="text-muted-foreground"> I'll connect you with our project specialist...</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Support Channels */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <MessageSquare className="w-3 h-3 text-primary" />
                        <span className="text-foreground">Live Chat (Instant)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <Phone className="w-3 h-3 text-accent-foreground" />
                        <span className="text-foreground">Phone Support</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <MessageCircle className="w-3 h-3 text-secondary-foreground" />
                        <span className="text-foreground">Email Support</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-foreground">Available 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose nbcon?</h2>
              <p className="text-xl text-muted-foreground">
                A high-performing web-based engineering marketplace for any project size and complexity
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">24/7 Customer Support</h3>
                  <p className="text-muted-foreground">
                    Get instant help whenever you need it. Our dedicated support team is available around the clock to assist with any questions or issues.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Best Price Guaranteed</h3>
                  <p className="text-muted-foreground">
                    We ensure competitive pricing for all engineering services. If you find a better price elsewhere, we'll match it.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Nationwide Coverage</h3>
                  <p className="text-muted-foreground">
                    Access verified engineers across all major cities in Saudi Arabia. From Riyadh to Jeddah, we've got you covered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { WhyChooseUs };
