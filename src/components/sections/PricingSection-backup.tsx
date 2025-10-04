import React, { useState } from 'react';
import { CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PricingSection = () => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="py-16 md:py-[200px]">
      <div className="container mx-auto p-0">
        <div className="max-w mx-auto text-center mb-6">
          <h2 className="text-3xl font-bold mb-3">Pricing</h2>
          <p className="text-muted-foreground">
            Get started with <strong>nbcon</strong>—the Saudi-first engineering marketplace—for fast hiring, secure payments, and compliant operations.
          </p>
        </div>

          <div className="flex items-center justify-center gap-3 mb-8 pb-8">
          <button
            type="button"
            role="switch"
            aria-checked={billing === 'annual'}
            data-state={billing === 'annual' ? 'checked' : 'unchecked'}
            onClick={() => setBilling((b)=> b === 'monthly' ? 'annual' : 'monthly')}
            className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Toggle billing period"
          >
            <span
              data-state={billing === 'annual' ? 'checked' : 'unchecked'}
              className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
            />
          </button>
          <span className="text-sm text-muted-foreground">{billing === 'annual' ? 'Annually' : 'Monthly'}</span>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl transition-all duration-300 ${billing === 'annual' ? 'bg-[var(--primary)]' : 'bg-transparent'}`}>
          <div className="relative p-4 border border-border shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-card flex flex-col h-full clients-card">
            <div className="text-center mb-0 pt-6">
              <h3 className="text-2xl mb-2 text-foreground font-bold">For Clients</h3>
              <p className="text-base text-muted-foreground mb-4 border-b border-border pb-6">Perfect for owners, contractors, and SMBs needing verified engineers fast</p>
            </div>
            <div className="space-y-2 pt-3 pb-6">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Unlimited Job Posting - Quick, advanced, and emergency projects</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Smart Quote Management - Compare & accept with one tap</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Secure Escrow System - Milestone-based payments with full audit trail</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">ZATCA Compliance - Automated e-invoices (PDF + XML) & receipts</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Project Tracking - Budget & milestone monitoring with approvals</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Rich Communication - Messages, files (100MB), & voice notes</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Geo-Verified Check-ins - Real-time site attendance tracking</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Bilingual Support - English/Arabic with RTL & Hijri dates</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Performance Analytics - Track spending, vendors & delivery metrics</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">24/7 Support - Email & chat assistance</span>
              </div>
            </div>
            
            <div className="mt-auto pt-3 border-t border-border">
              {billing === 'annual' && <div className="text-xs mb-2 text-primary font-medium text-center">(2 months free)</div>}
              
              <div className="text-center mb-0 pb-2">
                <span className="text-2xl text-foreground font-bold">{billing === 'annual' ? 'SAR 450' : 'SAR 45'}</span>
                <span className="text-sm text-muted-foreground">/{billing === 'annual' ? 'year' : 'month'}</span>
              </div>
              
              <Button 
                className="w-full py-2 text-sm transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 shadow-xl hover:shadow-2xl"
              >
                Select Plan
              </Button>
            </div>
          </div>

          <div className="relative p-4 border-2 border-primary shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-card flex flex-col h-full engineers-card">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 py-2 px-4">
              <Star className="w-4 h-4 mr-1" />
              Most Popular
            </Badge>
            
            <div className="text-center mb-0 pt-6">
              <h3 className="text-2xl mb-2 text-foreground font-bold">For Engineers</h3>
              <p className="text-base text-muted-foreground mb-4 border-b border-border pb-6">Perfect for certified engineers and small firms building a steady pipeline</p>
            </div>
            
            <div className="space-y-2 pt-3 pb-6">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Smart Job Matching - Find nearby jobs in your specialty</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Quote Management - Templates, reminders & bid tracking</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Geofenced Check-ins - Automated site visit tracking</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Deliverables Hub - Version control & approval workflows</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Instant Payouts - Direct IBAN transfers + monthly statements</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Tax Invoice Generation - PDF/XML downloads when enabled</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Portfolio & Reviews - Public profile with ratings system</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Earnings Dashboard - MTD/YTD tracking & escrow status</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Bilingual Communication - AR↔EN translation support</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">24/7 Support - Email & chat assistance</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Mobile App Access - Full platform on iOS & Android</span>
              </div>
            </div>
            
            <div className="mt-auto pt-3 border-t border-border">
              {billing === 'annual' && <div className="text-xs mb-2 text-primary font-medium text-center">(2 months free)</div>}

              <div className="text-center mb-0 pb-2">
                <span className="text-2xl text-foreground font-bold">{billing === 'annual' ? 'SAR 600' : 'SAR 60'}</span>
                <span className="text-sm text-muted-foreground">/{billing === 'annual' ? 'year' : 'month'}</span>
              </div>

              <Button
                className="w-full py-2 text-sm transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 shadow-xl hover:shadow-2xl"
              >
                Select Plan
              </Button>
            </div>
          </div>

          <div className="relative p-4 border border-border shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-card flex flex-col h-full enterprise-card">
            <div className="text-center mb-0 pt-6">
              <h3 className="text-2xl mb-2 text-foreground font-bold">Enterprise</h3>
              <p className="text-base text-muted-foreground mb-4 border-b border-border pb-6">Perfect for large developers, enterprises, and government entities</p>
            </div>
            
            <div className="space-y-2 pt-3 pb-6">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Advanced RFP Management - Multi-stage approvals & custom workflows</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Team Management - Role-based access & seat allocation</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Portfolio Analytics - Utilization, SLA, risk & compliance tracking</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Enterprise Security - SSO/SAML & policy controls</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Custom Integrations - ERP, HR, storage system connections</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Priority Support - Dedicated onboarding & assistance</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Consolidated Billing - Cost centers & chargeback management</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Advanced Reporting - Data export & scheduled reports</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">Vendor Management - Scorecards & audit-ready documentation</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">White-Label Solutions - Custom branding & domain options</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mr-2 flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">API Access - Full platform integration capabilities</span>
              </div>
            </div>
            
            <div className="mt-auto pt-3 border-t border-border">
              {billing === 'annual' && <div className="text-xs mb-2 text-primary font-medium text-center">(2 months free)</div>}
              
              <div className="text-center mb-0 pb-2">
                <span className="text-2xl text-foreground font-bold">{billing === 'annual' ? 'SAR 1200' : 'SAR 120'}</span>
                <span className="text-sm text-muted-foreground">/{billing === 'annual' ? 'year' : 'month'}</span>
              </div>
              
              <Button 
                className="w-full py-2 text-sm transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 shadow-xl hover:shadow-2xl"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PricingSection };
