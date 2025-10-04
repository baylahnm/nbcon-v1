"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Brain,
  DollarSign,
  Users,
  Shield,
  FileBarChart,
  Wrench,
  Clock,
  CheckCircle,
} from "lucide-react";

const tasks = [
  {
    title: "Smart Engineer Matching",
    subtitle: "AI finds the perfect engineers for your project",
    icon: <Brain className="w-4 h-4" />,
  },
  {
    title: "Real-time Cost Estimation",
    subtitle: "Accurate project pricing with market data",
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    title: "Project Management",
    subtitle: "Track progress and milestones automatically",
    icon: <Users className="w-4 h-4" />,
  },
  {
    title: "SCE Compliance",
    subtitle: "Automated regulatory compliance checks",
    icon: <Shield className="w-4 h-4" />,
  },
  {
    title: "Timeline Optimization",
    subtitle: "AI suggests optimal project schedules",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    title: "Quality Assurance",
    subtitle: "Automated quality checks and verification",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    title: "Equipment Management",
    subtitle: "Track and manage engineering equipment",
    icon: <Wrench className="w-4 h-4" />,
  },
  {
    title: "Performance Analytics",
    subtitle: "Comprehensive project insights and reports",
    icon: <FileBarChart className="w-4 h-4" />,
  },
];

export default function FeatureSection() {
  return (
    <section className="relative w-full py-20 px-4 bg-background text-foreground rounded-[10px]">
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* LEFT SIDE - Task Loop with Vertical Bar */}
        <div className="relative w-full max-w-sm">
          <Card className="overflow-hidden bg-muted/30 backdrop-blur-md shadow-xl rounded-xl">
            <CardContent className="relative h-[320px] p-0 overflow-hidden">
              {/* Scrollable Container */}
              <div className="relative h-full overflow-hidden">
                {/* Motion list */}
                <motion.div
                  className="flex flex-col gap-2 absolute w-full"
                  animate={{ y: ["0%", "-50%"] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 14,
                    ease: "linear",
                  }}
                >
                  {[...tasks, ...tasks].map((task, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 border-b border-border relative"
                    >
                      {/* Icon + Content */}
                      <div className="flex items-center justify-between flex-1">
                        <div className="flex items-center gap-2">
                                <div className="bg-muted w-10 h-10 rounded-xl shadow-md flex items-center justify-center">
                                  {task.icon}
                                </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Fade effect only inside card */}
                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background via-background/70 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE - Content */}
        <div className="space-y-6">
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            Engineering Automation
          </Badge>
          <h3 className="text-lg sm:text-md lg:text-2xl font-normal text-foreground leading-relaxed">
            Streamline engineering projects {" "}
            <span className="text-muted-foreground text-sm sm:text-base lg:text-2xl">with AI-powered automation — from smart engineer matching and real-time cost estimation to project management and SCE compliance. Our solutions reduce project delays, ensure quality, and scale effortlessly with your engineering needs in Saudi Arabia.</span>
          </h3>

          <div className="flex gap-3 flex-wrap">
            <Badge className="px-4 py-2 text-sm">AI Matching</Badge>
            <Badge className="px-4 py-2 text-sm">SCE Verified</Badge>
            <Badge className="px-4 py-2 text-sm">ZATCA Ready</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
