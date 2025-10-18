import { useRef, useEffect, useState, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { useOutsideClick } from '../../../../../1-HomePage/others/hooks/use-outside-click';
import { 
  Briefcase, 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  X,
  Eye,
  BarChart3,
  Calendar,
  MapPin,
  CheckCircle2
} from 'lucide-react';

// Visual3 Component - Aceternity UI Animated Chart
interface Visual3Props {
  mainColor?: string;
  secondaryColor?: string;
  gridColor?: string;
  trendValue?: number;
}

function Visual3({
  mainColor = "hsl(var(--primary))",
  secondaryColor = "hsl(var(--accent))",
  gridColor = "hsl(var(--muted-foreground) / 0.1)",
  trendValue,
}: Visual3Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        className="absolute inset-0 z-20"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={
          {
            "--color": mainColor,
            "--secondary-color": secondaryColor,
          } as React.CSSProperties
        }
      />

      <div className="relative h-full w-full overflow-hidden">
        <Layer4 color={mainColor} secondaryColor={secondaryColor} hovered={hovered} />
        <Layer3 color={mainColor} />
        <Layer2 color={mainColor} />
        <Layer1 color={mainColor} secondaryColor={secondaryColor} trendValue={trendValue} />
        <EllipseGradient color={mainColor} />
        <GridLayer color={gridColor} />
      </div>
    </>
  );
}

interface LayerProps {
  color: string;
  secondaryColor?: string;
  hovered?: boolean;
  trendValue?: number;
}

const GridLayer: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div
      style={{ "--grid-color": color } as React.CSSProperties}
      className="pointer-events-none absolute inset-0 z-[4] h-full w-full bg-transparent bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:20px_20px] bg-center opacity-70 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
    />
  );
};

const EllipseGradient: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="absolute inset-0 z-[5] flex h-full w-full items-center justify-center">
      <svg
        width="356"
        height="180"
        viewBox="0 0 356 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="356" height="180" fill="url(#paint0_radial_12_207)" />
        <defs>
          <radialGradient
            id="paint0_radial_12_207"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(178 98) rotate(90) scale(98 178)"
          >
            <stop stopColor={color} stopOpacity="0.25" />
            <stop offset="0.34" stopColor={color} stopOpacity="0.15" />
            <stop offset="1" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

const Layer1: React.FC<LayerProps> = ({ color, trendValue }) => {
  return (
    <div
      className="absolute top-4 left-4 z-[8] flex items-center gap-1"
      style={
        {
          "--color": color,
        } as React.CSSProperties
      }
    >
      {trendValue !== undefined && (
        <div className="flex shrink-0 items-center rounded-full border border-border bg-card/25 px-1.5 py-0.5 backdrop-blur-sm transition-opacity duration-300 ease-in-out group-hover/animated-card:opacity-0">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color)]" />
          <span className="ml-1 text-[10px] text-card-foreground">+{trendValue}%</span>
        </div>
      )}
    </div>
  );
};

const Layer2: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div
      className="group relative h-full w-full"
      style={{ "--color": color } as React.CSSProperties}
    >
      <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-0 z-[7] flex w-full translate-y-full items-start justify-center bg-transparent p-4 transition-transform duration-500 group-hover/animated-card:translate-y-0">
        <div className="ease-[cubic-bezier(0.6, 0, 1)] rounded-md border border-border bg-card/25 p-1.5 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover/animated-card:opacity-100">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--color)]" />
            <p className="text-xs text-card-foreground">Live Stats</p>
          </div>
          <p className="text-xs text-muted-foreground">Real-time updates</p>
        </div>
      </div>
    </div>
  );
};

const Layer3: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-0 z-[6] flex translate-y-full items-center justify-center opacity-0 transition-all duration-500 group-hover/animated-card:translate-y-0 group-hover/animated-card:opacity-100">
      <svg
        width="356"
        height="180"
        viewBox="0 0 356 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="356" height="180" fill="url(#paint0_linear_29_3)" />
        <defs>
          <linearGradient
            id="paint0_linear_29_3"
            x1="178"
            y1="0"
            x2="178"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.35" stopColor={color} stopOpacity="0" />
            <stop offset="1" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const Layer4: React.FC<LayerProps> = ({ color, secondaryColor, hovered }) => {
  const rectsData: any[] = [];

  return (
    <div className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] absolute inset-0 z-[8] flex h-full w-full items-center justify-center text-muted-foreground/10 transition-transform duration-500 group-hover/animated-card:scale-150">
      <svg width="356" height="180" xmlns="http://www.w3.org/2000/svg">
        {rectsData.map((rect, index) => (
          <rect
            key={index}
            width={rect.width}
            height={hovered ? rect.hoverHeight : rect.height}
            x={rect.x}
            y={hovered ? rect.hoverY : rect.y}
            fill={hovered ? rect.hoverFill : rect.fill}
            rx="2"
            ry="2"
            className="ease-[cubic-bezier(0.6, 0.6, 0, 1)] transition-all duration-500"
          />
        ))}
      </svg>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'amber' | 'green' | 'purple';
  onClick?: () => void;
  layoutId?: string;
}

function StatCard({ icon: Icon, label, value, trend, color = 'blue', onClick, layoutId }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Add mouse tracking for animated gradient
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angle = Math.atan2(y - centerY, x - centerX);
      card.style.setProperty('--rotation', `${angle}rad`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const colors = {
    blue: { 
      bg: 'bg-primary', 
      icon: 'text-primary-foreground', 
      gradient: 'from-primary/10 to-transparent'
    },
    amber: { 
      bg: 'bg-primary', 
      icon: 'text-primary-foreground', 
      gradient: 'from-primary/10 to-transparent'
    },
    green: { 
      bg: 'bg-primary', 
      icon: 'text-primary-foreground', 
      gradient: 'from-primary/10 to-transparent'
    },
    purple: { 
      bg: 'bg-primary', 
      icon: 'text-primary-foreground', 
      gradient: 'from-primary/10 to-transparent'
    },
  };

  return (
    <motion.div
      layoutId={layoutId}
      ref={cardRef}
      className="relative overflow-hidden transition-all duration-300 group cursor-pointer"
      style={{
        '--rotation': '4.2rad',
        border: '2px solid transparent',
        borderRadius: '0.5rem',
        backgroundImage: `linear-gradient(hsl(var(--card)), hsl(var(--card))), 
                         linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      } as React.CSSProperties}
      onClick={onClick}
    >
      {/* Animated Chart Visualization */}
      <div className="h-[180px] w-full overflow-hidden">
        <Visual3 
          mainColor="hsl(var(--primary))"
          secondaryColor="hsl(var(--accent))"
          gridColor="hsl(var(--muted-foreground) / 0.1)"
          trendValue={trend?.value}
        />
      </div>

      {/* Card Content */}
      <Card className="cursor-pointer bg-transparent border-0">
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`${colors[color].bg} h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className={`h-5 w-5 ${colors[color].icon}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ClientOverviewStatsProps {
  activeProjects?: number;
  totalEngineers?: number;
  pendingQuotes?: number;
  totalSpent?: string;
  onStatClick?: (stat: string) => void;
}

export function ClientOverviewStats({
  activeProjects = 6,
  totalEngineers = 24,
  pendingQuotes = 8,
  totalSpent = '1,245,000 SAR',
  onStatClick
}: ClientOverviewStatsProps) {
  const [expandedStat, setExpandedStat] = useState<string | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Handle expanded stat interactions
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setExpandedStat(null);
      }
    }

    if (expandedStat) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expandedStat]);

  useOutsideClick(expandedRef, () => {
    setExpandedStat(null);
  });

  const handleStatClick = (stat: string) => {
    setExpandedStat(stat);
    onStatClick?.(stat);
  };

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Active Projects"
          value={activeProjects}
          trend={{ value: 15, isPositive: true }}
          color="blue"
          onClick={() => handleStatClick('projects')}
          layoutId={`stat-projects-${id}`}
        />
        
        <StatCard
          icon={Users}
          label="Total Engineers"
          value={totalEngineers}
          trend={{ value: 8, isPositive: true }}
          color="blue"
          onClick={() => handleStatClick('engineers')}
          layoutId={`stat-engineers-${id}`}
        />
        
        <StatCard
          icon={Clock}
          label="Pending Quotes"
          value={pendingQuotes}
          color="amber"
          onClick={() => handleStatClick('quotes')}
          layoutId={`stat-quotes-${id}`}
        />
        
        <StatCard
          icon={DollarSign}
          label="Total Spent (YTD)"
          value={totalSpent}
          trend={{ value: 22, isPositive: true }}
          color="green"
          onClick={() => handleStatClick('finance')}
          layoutId={`stat-finance-${id}`}
        />
      </div>

      {/* Expanded Stat Modals */}
      <AnimatePresence>
        {expandedStat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                ref={expandedRef}
                layoutId={`stat-${expandedStat}-${id}`}
                className="w-full max-w-3xl bg-card rounded-xl shadow-2xl overflow-hidden"
              >
                {/* Projects Modal */}
                {expandedStat === 'projects' && (
                  <>
                    <div className="bg-gradient-to-r from-blue-500/90 via-blue-600/90 to-cyan-500/90 px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-white/20 p-2.5 rounded-xl">
                              <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-white">Active Projects</h2>
                              <p className="text-sm text-white/80">Your ongoing engineering projects</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedStat(null)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                          aria-label="Close"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 bg-background/60 max-h-[70vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Total Projects</p>
                          <p className="text-3xl font-bold">{activeProjects}</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Growth</p>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <p className="text-3xl font-bold text-green-600">+15%</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-bold text-base">Project Breakdown</h3>
                        {[
                          { name: 'Al-Khobar Commercial Center', progress: 68, engineers: 5, budget: '850,000 SAR' },
                          { name: 'Riyadh Metro Extension', progress: 25, engineers: 3, budget: '2,100,000 SAR' },
                          { name: 'NEOM Infrastructure Phase 2', progress: 42, engineers: 8, budget: '3,500,000 SAR' },
                        ].map((project, idx) => (
                          <div key={idx} className="p-4 border border-border/50 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{project.name}</h4>
                                <p className="text-xs text-muted-foreground">{project.engineers} Engineers • {project.budget}</p>
                              </div>
                              <Badge className="bg-primary/10 text-primary border-0 text-xs">
                                {project.progress}% Complete
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full" onClick={() => setExpandedStat(null)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View All Projects
                      </Button>
                    </div>
                  </>
                )}

                {/* Engineers Modal */}
                {expandedStat === 'engineers' && (
                  <>
                    <div className="bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-white/20 p-2.5 rounded-xl">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-white">Total Engineers</h2>
                              <p className="text-sm text-white/80">Engineers working on your projects</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedStat(null)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                          aria-label="Close"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 bg-background/60 max-h-[70vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Total Engineers</p>
                          <p className="text-3xl font-bold">{totalEngineers}</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Growth</p>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <p className="text-3xl font-bold text-green-600">+8%</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-bold text-base">Engineer Distribution</h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <p className="text-2xl font-bold">12</p>
                            <p className="text-xs text-muted-foreground">Structural</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <p className="text-2xl font-bold">8</p>
                            <p className="text-xs text-muted-foreground">Electrical</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <p className="text-2xl font-bold">4</p>
                            <p className="text-xs text-muted-foreground">Mechanical</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-bold text-base">Top Performers</h3>
                        {[
                          { name: 'Ahmed Al-Rashid', specialty: 'Structural', projects: 3, rating: 4.9 },
                          { name: 'Fatima Al-Zahra', specialty: 'Electrical', projects: 2, rating: 4.7 },
                          { name: 'Mohammed Al-Zahrani', specialty: 'Mechanical', projects: 1, rating: 4.8 },
                        ].map((engineer, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                            <div>
                              <p className="font-semibold text-sm">{engineer.name}</p>
                              <p className="text-xs text-muted-foreground">{engineer.specialty} • {engineer.projects} projects</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">{engineer.rating}★</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full" onClick={() => setExpandedStat(null)}>
                        <Users className="h-4 w-4 mr-2" />
                        Browse All Engineers
                      </Button>
                    </div>
                  </>
                )}

                {/* Quotes Modal */}
                {expandedStat === 'quotes' && (
                  <>
                    <div className="bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-yellow-500/90 px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-white/20 p-2.5 rounded-xl">
                              <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-white">Pending Quotes</h2>
                              <p className="text-sm text-white/80">Awaiting your review and approval</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedStat(null)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                          aria-label="Close"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 bg-background/60 max-h-[70vh] overflow-y-auto">
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          <strong>{pendingQuotes} quotes</strong> are waiting for your response. Review and accept to start projects.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-bold text-base">Recent Quotes</h3>
                        {[
                          { project: 'Jeddah Waterfront Development', engineer: 'Hassan Al-Qahtani', amount: '45,000 SAR', date: '2024-01-20' },
                          { project: 'Riyadh Smart City Hub', engineer: 'Laila Al-Harbi', amount: '62,000 SAR', date: '2024-01-19' },
                          { project: 'Dammam Industrial Park', engineer: 'Khalid Al-Mansouri', amount: '38,000 SAR', date: '2024-01-18' },
                        ].map((quote, idx) => (
                          <div key={idx} className="p-4 border border-border/50 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{quote.project}</h4>
                                <p className="text-xs text-muted-foreground">by {quote.engineer}</p>
                                <p className="text-xs text-muted-foreground mt-1">Submitted: {quote.date}</p>
                              </div>
                              <p className="font-bold text-base text-primary">{quote.amount}</p>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" className="flex-1" onClick={(e) => e.stopPropagation()}>
                                Accept
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1" onClick={(e) => e.stopPropagation()}>
                                Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button variant="outline" className="w-full" onClick={() => setExpandedStat(null)}>
                        View All Quotes
                      </Button>
                    </div>
                  </>
                )}

                {/* Finance Modal */}
                {expandedStat === 'finance' && (
                  <>
                    <div className="bg-gradient-to-r from-emerald-500/90 via-green-500/90 to-teal-500/90 px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-white/20 p-2.5 rounded-xl">
                              <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-white">Total Spent (YTD)</h2>
                              <p className="text-sm text-white/80">Year-to-date investment summary</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedStat(null)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                          aria-label="Close"
                        >
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 bg-background/60 max-h-[70vh] overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                          <p className="text-3xl font-bold">{totalSpent}</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Growth</p>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <p className="text-3xl font-bold text-green-600">+22%</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-bold text-base">Spending Breakdown</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Completed Payments</span>
                            </div>
                            <span className="font-bold text-sm">850,000 SAR</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-amber-600" />
                              <span className="text-sm">In Progress</span>
                            </div>
                            <span className="font-bold text-sm">295,000 SAR</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">Platform Fees</span>
                            </div>
                            <span className="font-bold text-sm">100,000 SAR</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-bold text-base">Monthly Trend</h3>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-foreground/80">
                            Your spending has increased by <strong className="text-green-600">22%</strong> compared to last year. 
                            This growth reflects your expanding project portfolio and increased engineering capacity.
                          </p>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full" onClick={() => setExpandedStat(null)}>
                        <DollarSign className="h-4 w-4 mr-2" />
                        View Financial Dashboard
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ClientOverviewStats;

