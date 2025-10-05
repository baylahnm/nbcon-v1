"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import {VerticalCutReveal} from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const plans = [
  {
    name: "For Clients",
    description:
      "Perfect for owners, contractors, and SMBs needing verified engineers fast",
    price: 45,
    yearlyPrice: 450,
    buttonText: "Select Plan",
    buttonVariant: "outline" as const,
    includes: [
      "Key Features:",
      "Unlimited Job Posting - Quick, advanced, and emergency projects",
      "Smart Quote Management - Compare & accept with one tap",
      "Secure Escrow System - Milestone-based payments with full audit trail",
      "ZATCA Compliance - Automated e-invoices (PDF + XML) & receipts",
      "Project Tracking - Budget & milestone monitoring with approvals",
      "Rich Communication - Messages, files (100MB), & voice notes",
      "Geo-Verified Check-ins - Real-time site attendance tracking",
      "Bilingual Support - English/Arabic with RTL & Hijri dates",
      "Performance Analytics - Track spending, vendors & delivery metrics",
      "24/7 Support - Email & chat assistance",
    ],
  },
  {
    name: "For Engineers",
    description:
      "Perfect for certified engineers and small firms building a steady pipeline",
    price: 60,
    yearlyPrice: 600,
    buttonText: "Select Plan",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Key Features:",
      "Smart Job Matching - Find nearby jobs in your specialty",
      "Quote Management - Templates, reminders & bid tracking",
      "Geofenced Check-ins - Automated site visit tracking",
      "Deliverables Hub - Version control & approval workflows",
      "Instant Payouts - Direct IBAN transfers + monthly statements",
      "Tax Invoice Generation - PDF/XML downloads when enabled",
      "Portfolio & Reviews - Public profile with ratings system",
      "Earnings Dashboard - MTD/YTD tracking & escrow status",
      "Bilingual Communication - AR↔EN translation support",
      "24/7 Support - Email & chat assistance",
      "Mobile App Access - Full platform on iOS & Android",
    ],
  },
  {
    name: "Enterprise",
    description:
      "Perfect for large developers, enterprises, and government entities",
    price: 120,
    yearlyPrice: 1200,
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    includes: [
      "Advanced Features:",
      "Advanced RFP Management - Multi-stage approvals & custom workflows",
      "Team Management - Role-based access & seat allocation",
      "Portfolio Analytics - Utilization, SLA, risk & compliance tracking",
      "Enterprise Security - SSO/SAML & policy controls",
      "Custom Integrations - ERP, HR, storage system connections",
      "Priority Support - Dedicated onboarding & assistance",
      "Consolidated Billing - Cost centers & chargeback management",
      "Advanced Reporting - Data export & scheduled reports",
      "Vendor Management - Scorecards & audit-ready documentation",
      "White-Label Solutions - Custom branding & domain options",
      "API Access - Full platform integration capabilities",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center" style={{ marginTop: '16px' }}>
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-card border border-border p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10  rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0" ? "text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-primary/50 border-primary bg-gradient-to-t from-primary to-primary-dark"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1" ? "text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full  rounded-full border-4 shadow-sm shadow-primary/50 border-primary bg-gradient-to-t from-primary to-primary-dark"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">Yearly</span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection6() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className=" min-h-screen  mx-auto relative bg-background overflow-hidden"
      style={{ paddingBottom: '130px' }}
      ref={pricingRef}
    >

      <article className="text-center mb-6 pt-32 max-w-3xl mx-auto space-y-2 relative z-50">
        <h2 className="text-4xl font-medium text-foreground">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center "
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0, // First element
            }}
          >
            Plans that work best for your
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-muted-foreground"
        >
          Get started with nbcon Pro—the Saudi-first engineering marketplace—for fast hiring, secure payments, and compliant operations.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>


      <div className="grid md:grid-cols-3 max-w-7xl gap-4 py-6 mx-auto items-stretch">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="h-full relative z-30"
          >
            <Card
              className={`relative text-card-foreground border-border h-full min-h-[600px] flex flex-col ${
                plan.popular
                  ? "bg-gradient-to-r from-card via-accent to-card z-20"
                  : "bg-gradient-to-r from-card via-muted to-card z-10"
              }`}
            >
              <CardHeader className="text-left ">
                <div className="flex justify-between">
                  <h3 className="text-3xl mb-2">{plan.name}</h3>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-semibold ">
                    SAR 
                    <NumberFlow
                      format={{
                        currency: "SAR",
                      }}
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-4xl font-semibold"
                    />
                  </span>
                  <span className="text-muted-foreground ml-1">
                    /{isYearly ? "year" : "month"}
                  </span>
                  {isYearly && (
                    <span className="text-sm text-primary ml-2 font-medium">
                      (2 months free)
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0 mt-auto">
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="font-medium text-base mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                              <li
                                key={featureIndex}
                                className="flex items-center gap-4"
                              >
                        <span className="h-2.5 w-2.5 bg-primary rounded-full grid place-content-center"></span>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                 <div className="pt-6 border-t border-border mt-6 mb-6" style={{ marginTop: '24px' }}>
                  <button
                    className={`w-full py-2 px-4 text-xl rounded-xl ${
                      plan.popular
                        ? "bg-gradient-to-t from-primary to-primary-dark shadow-lg shadow-primary/50 border border-primary text-primary-foreground hover:shadow-primary/70 hover:scale-[1.02] transform transition-all duration-200"
                        : plan.buttonVariant === "outline"
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 border border-primary hover:bg-primary/90 hover:shadow-primary/70 hover:scale-[1.02] transform transition-all duration-200"
                          : ""
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>

      {/* Bottom blur effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
    </div>
  );
}
