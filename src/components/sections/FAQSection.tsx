import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const FAQSection = () => {
  return (
    <section className="py-16 px-6 md:pt-[100px] md:pb-[200px] md:px-0 bg-background">
      <div className="container mx-auto px-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about nbcon and our engineering platform
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">How does nbcon verify engineers?</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  nbcon verifies all engineers through SCE (Saudi Council of Engineers) credential checks, 
                  professional insurance validation, and background verification. We also conduct ongoing 
                  compliance monitoring to ensure all engineers maintain their professional standards.
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">What payment methods are accepted?</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  We accept all major payment methods including credit cards, bank transfers, and digital wallets. 
                  All payments are processed securely with escrow protection until project milestones are completed 
                  and verified.
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">How does the milestone tracking work?</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  Projects are broken down into clear milestones with defined deliverables. Engineers upload 
                  their work and provide progress updates. Clients review and approve milestones before 
                  payments are released from escrow, ensuring quality and transparency.
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">Is there a mobile app available?</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  Yes! nbcon is fully responsive and works seamlessly on mobile devices. We also offer 
                  progressive web app (PWA) functionality, allowing you to install the app on your phone 
                  for quick access to projects, messages, and check-ins.
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">How do I get started as a client?</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  Getting started is easy! Simply create your account, complete your profile, and post your 
                  first project. Our AI will help match you with qualified engineers based on your specific 
                  requirements and location preferences.
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">What types of engineering projects are supported?</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  nbcon supports all major engineering disciplines including Civil, Electrical, Mechanical, 
                  Structural, HVAC, and Environmental Engineering. We cover projects from residential to 
                  large-scale industrial and infrastructure developments.
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">How does the AI assistant help with projects?</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  Our AI assistant provides real-time cost estimation, timeline optimization, compliance 
                  guidance, and smart project matching. It analyzes project requirements and suggests 
                  the best engineers based on expertise, location, and availability.
                </p>
              </div>
            </details>
          </Card>

          <Card className="p-0">
            <details className="group">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                <h3 className="text-lg font-semibold text-left">What support is available for enterprise clients?</h3>
                <div className="ml-4 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground">
                  Enterprise clients receive dedicated account management, custom integrations, advanced 
                  analytics and reporting, priority support, and tailored compliance solutions. We also 
                  offer on-site training and implementation support.
                </p>
              </div>
            </details>
          </Card>
        </div>
      </div>
    </section>
  );
};

export { FAQSection };
