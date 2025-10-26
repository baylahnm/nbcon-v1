"use client"

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from '@/pages/1-HomePage/others/hooks/use-outside-click';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from '../../../../../1-HomePage/others/components/ui/line-chart';
import { Briefcase, Users, Clock, DollarSign, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../stores/auth';
import { fetchOverviewMetrics, type OverviewMetrics } from '../api/overviewStatsClient';

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black dark:text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export function ClientOverviewStats() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<any | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  // Fetch live metrics on mount
  useEffect(() => {
    async function loadMetrics() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchOverviewMetrics(user.id);
        setMetrics(data);
      } catch (err) {
        console.error('Error loading overview metrics:', err);
        setError('Failed to load metrics');
      } finally {
        setIsLoading(false);
      }
    }

    loadMetrics();
  }, [user?.id]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  // Build stats cards from live metrics
  const statsCards = metrics ? [
    {
      id: "active-projects",
      title: "Active Projects",
      value: String(metrics.activeProjects.count),
      icon: Briefcase,
      trend: `${metrics.activeProjects.trend > 0 ? '+' : ''}${metrics.activeProjects.trend}%`,
      trendDirection: metrics.activeProjects.trend >= 0 ? "up" : "down",
      description: "Last 6 months trend",
      chartData: metrics.activeProjects.chartData,
      expandedContent: () => (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            You currently have <strong>{metrics.activeProjects.count} active projects</strong> in progress across Saudi Arabia. 
            This represents a <strong>{Math.abs(metrics.activeProjects.trend)}% {metrics.activeProjects.trend >= 0 ? 'increase' : 'decrease'}</strong> from last month.
          </p>
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">In Progress</p>
              <p className="text-xl font-bold">{metrics.activeProjects.breakdown.inProgress}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Planning</p>
              <p className="text-xl font-bold">{metrics.activeProjects.breakdown.planning}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Duration</p>
              <p className="text-xl font-bold">{metrics.activeProjects.breakdown.avgDuration} months</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="text-xl font-bold">{metrics.activeProjects.breakdown.successRate}%</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "total-engineers",
      title: "Total Engineers",
      value: String(metrics.totalEngineers.count),
      icon: Users,
      trend: `${metrics.totalEngineers.trend > 0 ? '+' : ''}${metrics.totalEngineers.trend}%`,
      trendDirection: metrics.totalEngineers.trend >= 0 ? "up" : "down",
      description: "Last 6 months trend",
      chartData: metrics.totalEngineers.chartData,
      expandedContent: () => (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your network includes <strong>{metrics.totalEngineers.count} professional engineers</strong> with diverse specializations.
          </p>
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Structural</p>
              <p className="text-xl font-bold">{metrics.totalEngineers.breakdown.structural}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Civil</p>
              <p className="text-xl font-bold">{metrics.totalEngineers.breakdown.civil}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mechanical</p>
              <p className="text-xl font-bold">{metrics.totalEngineers.breakdown.mechanical}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Electrical</p>
              <p className="text-xl font-bold">{metrics.totalEngineers.breakdown.electrical}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Average rating: {metrics.totalEngineers.breakdown.avgRating}/5.0 | Avg. hourly rate: {metrics.totalEngineers.breakdown.avgHourlyRate} SAR
          </p>
        </div>
      ),
    },
    {
      id: "pending-quotes",
      title: "Pending Quotes",
      value: String(metrics.pendingQuotes.count),
      icon: Clock,
      trend: `${metrics.pendingQuotes.trend > 0 ? '+' : ''}${Math.round(metrics.pendingQuotes.trend)}%`,
      trendDirection: metrics.pendingQuotes.trend >= 0 ? "up" : "down",
      description: "Last 6 months trend",
      chartData: metrics.pendingQuotes.chartData,
      expandedContent: () => (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            You have <strong>{metrics.pendingQuotes.count} quotes pending review</strong> from engineers. 
            This represents a <strong>{Math.abs(Math.round(metrics.pendingQuotes.trend))}% {metrics.pendingQuotes.trend >= 0 ? 'increase' : 'decrease'}</strong> from last month.
          </p>
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Awaiting Review</p>
              <p className="text-xl font-bold">{metrics.pendingQuotes.breakdown.awaitingReview}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Under Negotiation</p>
              <p className="text-xl font-bold">{metrics.pendingQuotes.breakdown.underNegotiation}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Response</p>
              <p className="text-xl font-bold">{metrics.pendingQuotes.breakdown.avgResponseDays} days</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Quote</p>
              <p className="text-xl font-bold">{Math.round(metrics.pendingQuotes.breakdown.avgQuoteAmount / 1000)}K SAR</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "total-spent",
      title: "Total Spent (YTD)",
      value: `${metrics.totalSpent.amount.toLocaleString()} SAR`,
      icon: DollarSign,
      trend: `${metrics.totalSpent.trend > 0 ? '+' : ''}${metrics.totalSpent.trend}%`,
      trendDirection: metrics.totalSpent.trend >= 0 ? "up" : "down",
      description: "Last 6 months trend",
      chartData: metrics.totalSpent.chartData,
      expandedContent: () => (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Total spending this year reached <strong>{metrics.totalSpent.amount.toLocaleString()} SAR</strong>.
          </p>
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Q1 2025</p>
              <p className="text-xl font-bold">{metrics.totalSpent.breakdown.q1}K</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Q2 2025</p>
              <p className="text-xl font-bold">{metrics.totalSpent.breakdown.q2}K</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Q3 2025</p>
              <p className="text-xl font-bold">{metrics.totalSpent.breakdown.q3}K</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Projected Q4</p>
              <p className="text-xl font-bold">{metrics.totalSpent.breakdown.q4Projected}K</p>
            </div>
          </div>
        </div>
      ),
    },
  ] : [];

  // Loading state
  if (isLoading) {
    return (
      <section aria-label="Overview Statistics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-4">
                  <div className="bg-muted h-[32px] w-[32px] rounded-lg" />
                  <div className="h-4 bg-muted rounded w-24" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-[60px] bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section aria-label="Overview Statistics">
        <Card className="border-destructive/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">Please refresh the page to try again.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  // No data state
  if (!metrics || statsCards.length === 0) {
    return (
      <section aria-label="Overview Statistics">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No metrics available</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section aria-label="Overview Statistics">
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Card Modal */}
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white dark:bg-neutral-900 rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full max-w-[600px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
              <motion.div
                      layoutId={`icon-${active.id}-${id}`}
                      className="bg-primary-gradient h-[48px] w-[48px] flex items-center justify-center rounded-xl shadow-md"
                    >
                      <active.icon className="h-6 w-6 text-primary-foreground" />
                    </motion.div>
                            <div>
                      <motion.h3
                        layoutId={`title-${active.id}-${id}`}
                        className="font-bold text-xl tracking-tight"
                      >
                        {active.title}
                      </motion.h3>
                      <motion.p
                        layoutId={`value-${active.id}-${id}`}
                        className="text-xl font-bold tracking-tight text-primary mt-1"
                      >
                        {active.value}
                      </motion.p>
                          </div>
                        </div>
                        <button
                    onClick={() => setActive(null)}
                    className="hidden lg:flex items-center justify-center bg-muted hover:bg-muted/80 rounded-full h-8 w-8 transition-colors"
                        >
                    <CloseIcon />
                        </button>
                      </div>
                    </div>

              {/* Modal Content */}
              <div className="p-6 overflow-auto flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Trend Badge */}
                          <div className="flex items-center gap-2">
                    <Badge className={`${
                      active.trendDirection === 'up' 
                        ? 'text-green-500 bg-green-500/10' 
                        : 'text-red-500 bg-red-500/10'
                    } border-none text-sm px-3 py-1.5`}>
                      {active.trendDirection === 'up' ? (
                        <TrendingUp className="h-4 w-4 mr-1.5" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1.5" />
                      )}
                      <span>{active.trend}</span>
                              </Badge>
                    <span className="text-sm text-muted-foreground">{active.description}</span>
                      </div>

                  {/* Expanded Chart */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">6-Month Performance</h4>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                      <LineChart
                        accessibilityLayer
                        data={active.chartData}
                        margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                      >
                        <CartesianGrid 
                          vertical={true} 
                          strokeDasharray="3 3" 
                          stroke="hsl(var(--muted-foreground) / 0.2)" 
                        />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <ChartTooltip 
                          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }} 
                          content={<ChartTooltipContent />} 
                        />
                        <Line
                          dataKey="value"
                          type="monotone"
                          stroke="var(--color-value)"
                          strokeWidth={3}
                          dot={{ fill: 'var(--color-value)', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ChartContainer>
                      </div>

                  {/* Detailed Content */}
                            <div>
                    <h4 className="text-sm font-semibold mb-3">Detailed Breakdown</h4>
                    {active.expandedContent()}
                            </div>
                </motion.div>
                            </div>
            </motion.div>
                          </div>
        ) : null}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          const isTrendUp = card.trendDirection === 'up';
          
          return (
            <motion.div
              key={card.id}
              layoutId={`card-${card.id}-${id}`}
              onClick={() => setActive(card)}
              className="cursor-pointer"
            >
              <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        layoutId={`icon-${card.id}-${id}`}
                        className="bg-primary-gradient h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md"
                      >
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </motion.div>
                      <motion.div layoutId={`title-${card.id}-${id}`}>
                        <CardTitle className="text-base font-bold">{card.title}</CardTitle>
                      </motion.div>
                    </div>
                      </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <motion.p 
                        layoutId={`value-${card.id}-${id}`}
                        className="text-xl font-bold tracking-tight"
                      >
                        {card.value}
                      </motion.p>
                      <Badge className={`${
                        isTrendUp 
                          ? 'text-green-500 bg-green-500/10' 
                          : 'text-red-500 bg-red-500/10'
                      } border-none`}>
                        {isTrendUp ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        <span>{card.trend}</span>
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{card.description}</CardDescription>
                    <ChartContainer config={chartConfig} className="h-[60px] w-full">
                      <LineChart
                        accessibilityLayer
                        data={card.chartData}
                        margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
                      >
                        <CartesianGrid 
                          vertical={true} 
                          strokeDasharray="3 3" 
                          stroke="hsl(var(--muted-foreground) / 0.2)" 
                        />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line
                          dataKey="value"
                          type="monotone"
                          stroke="var(--color-value)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ChartContainer>
                      </div>
                </CardContent>
              </Card>
              </motion.div>
          );
        })}
            </div>
    </section>
  );
}
