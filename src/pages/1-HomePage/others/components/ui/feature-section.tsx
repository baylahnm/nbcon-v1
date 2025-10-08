"use client";

import * as React from "react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
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

export default function FeatureSection() {
  const { t } = useTranslation('homepage');
  
  const tasks = [
    {
      title: t('aiAssistant.featuresList.items.smartMatching.title'),
      subtitle: t('aiAssistant.featuresList.items.smartMatching.subtitle'),
      icon: <Brain className="w-4 h-4" />,
    },
    {
      title: t('aiAssistant.featuresList.items.costEstimation.title'),
      subtitle: t('aiAssistant.featuresList.items.costEstimation.subtitle'),
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: t('aiAssistant.featuresList.items.projectManagement.title'),
      subtitle: t('aiAssistant.featuresList.items.projectManagement.subtitle'),
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: t('aiAssistant.featuresList.items.sceCompliance.title'),
      subtitle: t('aiAssistant.featuresList.items.sceCompliance.subtitle'),
      icon: <Shield className="w-4 h-4" />,
    },
    {
      title: t('aiAssistant.featuresList.items.timeline.title'),
      subtitle: t('aiAssistant.featuresList.items.timeline.subtitle'),
      icon: <Clock className="w-4 h-4" />,
    },
    {
      title: t('aiAssistant.featuresList.items.quality.title'),
      subtitle: t('aiAssistant.featuresList.items.quality.subtitle'),
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      title: t('aiAssistant.featuresList.items.equipment.title'),
      subtitle: t('aiAssistant.featuresList.items.equipment.subtitle'),
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      title: t('aiAssistant.featuresList.items.analytics.title'),
      subtitle: t('aiAssistant.featuresList.items.analytics.subtitle'),
      icon: <FileBarChart className="w-4 h-4" />,
    },
  ];

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
            {t('aiAssistant.featuresList.badge')}
          </Badge>
          <h3 className="text-lg sm:text-md lg:text-2xl font-normal text-foreground leading-relaxed">
            {t('aiAssistant.featuresList.title')} {" "}
            <span className="text-muted-foreground text-sm sm:text-base lg:text-2xl">{t('aiAssistant.featuresList.description')}</span>
          </h3>

          <div className="flex gap-3 flex-wrap">
            <Badge className="px-4 py-2 text-sm">{t('aiAssistant.featuresList.badges.aiMatching')}</Badge>
            <Badge className="px-4 py-2 text-sm">{t('aiAssistant.featuresList.badges.sceVerified')}</Badge>
            <Badge className="px-4 py-2 text-sm">{t('aiAssistant.featuresList.badges.zatcaReady')}</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

