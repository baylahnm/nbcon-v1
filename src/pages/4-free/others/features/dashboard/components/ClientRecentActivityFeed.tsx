import { useState, useRef, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../1-HomePage/others/components/ui/card';
import { Button } from '../../../../../1-HomePage/others/components/ui/button';
import { Badge } from '../../../../../1-HomePage/others/components/ui/badge';
import { Activity, CheckCircle2, FileText, Briefcase, Users, DollarSign, MessageSquare, ChevronUp, ChevronDown, Clock, AlertCircle, Eye, X, ExternalLink, User, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutsideClick } from '../../../../../1-HomePage/others/hooks/use-outside-click';

interface ActivityItem {
  id: string;
  type: 'quote' | 'payment' | 'project' | 'engineer' | 'message' | 'deadline';
  title: string;
  description: string;
  relativeTime: string;
  link?: string;
  // Additional details for expanded view
  details?: {
    fullDescription?: string;
    amount?: string;
    location?: string;
    engineer?: string;
    status?: string;
    deadline?: string;
    progress?: number;
  };
}

interface ClientRecentActivityFeedProps {
  activities?: ActivityItem[];
  maxItems?: number;
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'quote',
    title: 'New Quote Received',
    description: 'Ahmed Al-Rashid submitted quote for Al-Khobar project',
    relativeTime: '30 min ago',
    link: '/free/quotes',
    details: {
      fullDescription: 'Comprehensive structural engineering services including design review, calculations, and technical specifications for the Al-Khobar Commercial Center development.',
      amount: '285,000 SAR',
      engineer: 'Ahmed Al-Rashid - Senior Structural Engineer',
      location: 'Al-Khobar, Eastern Province',
      deadline: 'Valid until Jan 30, 2025',
      status: 'Pending Review'
    }
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Released',
    description: 'Milestone payment released: 125,000 SAR for NEOM project',
    relativeTime: '2 hours ago',
    link: '/free/finance',
    details: {
      fullDescription: 'Payment for Phase 2 completion: Soil investigation and geotechnical report submitted and approved by project consultant.',
      amount: '125,000 SAR',
      engineer: 'Geotechnical Solutions LLC',
      location: 'NEOM, Tabuk Province',
      status: 'Payment Released',
      progress: 40
    }
  },
  {
    id: '3',
    type: 'project',
    title: 'Milestone Completed',
    description: 'Foundation Review completed for Riyadh Metro Extension',
    relativeTime: '4 hours ago',
    link: '/free/myprojects',
    details: {
      fullDescription: 'Foundation design review and approval completed. All structural calculations verified and approved by SCE licensed consultant.',
      engineer: 'Dr. Khalid Al-Mutairi, P.E.',
      location: 'Riyadh Metro - Line 4 Extension',
      status: 'Approved',
      progress: 65
    }
  },
  {
    id: '4',
    type: 'engineer',
    title: 'Engineer Applications',
    description: '3 new engineers applied for Al-Khobar Commercial Center',
    relativeTime: '6 hours ago',
    link: '/free/browse',
    details: {
      fullDescription: 'Three qualified structural engineers submitted applications: 2 Senior Engineers (15+ years exp) and 1 Lead Engineer (20+ years exp). All SCE certified.',
      location: 'Al-Khobar Commercial Center',
      status: '3 Applications Received',
      deadline: 'Applications close in 5 days'
    }
  },
  {
    id: '5',
    type: 'message',
    title: 'New Message',
    description: 'From Eng. Mohammed regarding structural revisions',
    relativeTime: '1 day ago',
    link: '/free/messages',
    details: {
      fullDescription: 'Structural revision request for columns C-12 through C-18 based on updated architectural plans. Proposed steel reinforcement modifications attached.',
      engineer: 'Eng. Mohammed Al-Shahrani',
      status: 'Awaiting Response',
      location: 'King Abdullah Financial District'
    }
  },
  {
    id: '6',
    type: 'deadline',
    title: 'Upcoming Deadline',
    description: 'NEOM Phase 2 - Site Survey due in 3 days',
    relativeTime: '1 day ago',
    link: '/free/myprojects',
    details: {
      fullDescription: 'Complete topographic survey and geospatial mapping for development area. Deliverables include CAD drawings, point cloud data, and survey report.',
      engineer: 'Survey & Mapping Specialists',
      location: 'NEOM Bay Area, Sector 7',
      deadline: 'January 18, 2025',
      status: 'In Progress',
      progress: 75
    }
  },
];

export const ClientRecentActivityFeed = memo(function ClientRecentActivityFeed({ 
  activities = defaultActivities, 
  maxItems = 10 
}: ClientRecentActivityFeedProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);
  const expandedCardRef = useRef<HTMLDivElement>(null);

  // Dismissed activities (persisted in localStorage)
  const [dismissedActivityIds, setDismissedActivityIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('dismissedActivities');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Filter out dismissed activities
  const visibleActivities = activities.filter(a => !dismissedActivityIds.has(a.id));
  const displayedActivities = visibleActivities.slice(0, maxItems);

  useOutsideClick(expandedCardRef, () => {
    if (expandedActivityId) {
      setExpandedActivityId(null);
    }
  });

  // Handle dismiss activity
  const handleDismissActivity = (activityId: string) => {
    const newDismissed = new Set(dismissedActivityIds);
    newDismissed.add(activityId);
    setDismissedActivityIds(newDismissed);
    
    // Persist to localStorage
    try {
      localStorage.setItem('dismissedActivities', JSON.stringify(Array.from(newDismissed)));
    } catch (error) {
      console.error('Failed to persist dismissed activities:', error);
    }

    // Close expanded view if dismissing expanded activity
    if (expandedActivityId === activityId) {
      setExpandedActivityId(null);
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'quote':
        return { Icon: FileText, color: 'text-success', bgColor: 'bg-success/10', ringColor: 'ring-success/20' };
      case 'payment':
        return { Icon: DollarSign, color: 'text-success', bgColor: 'bg-success/10', ringColor: 'ring-success/20' };
      case 'project':
        return { Icon: Briefcase, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20' };
      case 'engineer':
        return { Icon: Users, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20' };
      case 'message':
        return { Icon: MessageSquare, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20' };
      case 'deadline':
        return { Icon: AlertCircle, color: 'text-warning', bgColor: 'bg-warning/10', ringColor: 'ring-warning/20' };
      default:
        return { Icon: Activity, color: 'text-primary', bgColor: 'bg-primary/10', ringColor: 'ring-primary/20' };
    }
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 border-border/50 gap-0"
      style={{
        border: '2px solid transparent',
        borderRadius: '0.75rem',
        backgroundImage: `
          linear-gradient(hsl(var(--card)), hsl(var(--card))),
          linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
        `,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
      }}
    >
      <CardHeader className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary-gradient h-[40px] w-[40px] flex items-center justify-center rounded-xl shadow-sm shadow-primary/50">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">Recent Activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click any activity to expand details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-primary-gradient text-primary-foreground border-0 shadow-sm shadow-primary/50 h-5 min-w-5 rounded-full px-2 font-mono tabular-nums text-xs">
              {visibleActivities.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <>
          <CardContent className="p-4 space-y-4 bg-background relative">
            {/* Backdrop Overlay - Aceternity Style */}
            <AnimatePresence>
              {expandedActivityId && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                  onClick={() => setExpandedActivityId(null)}
                />
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {displayedActivities.map((activity) => {
                const { Icon, color, bgColor, ringColor } = getActivityIcon(activity.type);
                const isExpanded = expandedActivityId === activity.id;
                
                return (
                  <motion.div
                    key={activity.id}
                    layoutId={`card-${activity.id}`}
                    className={`relative ${isExpanded ? 'z-50' : 'z-0'}`}
                  >
                    {/* Collapsed View - Aceternity Card Style */}
                    {!isExpanded && (
                      <motion.div
                        layoutId={`card-content-${activity.id}`}
                        onClick={() => setExpandedActivityId(activity.id)}
                        className="flex items-start gap-4 p-4 bg-gradient-to-br from-card to-card/80 rounded-xl border border-border/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:scale-[1.02] group/item"
                      >
                        <motion.div
                          layoutId={`icon-${activity.id}`}
                          className={`${bgColor} p-4 rounded-lg ring-1 ${ringColor} shrink-0`}
                        >
                          <Icon className={`h-4 w-4 ${color}`} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <motion.p
                            layoutId={`title-${activity.id}`}
                            className="text-sm font-medium leading-relaxed line-clamp-1"
                          >
                            {activity.description}
                          </motion.p>
                          <motion.div
                            layoutId={`time-${activity.id}`}
                            className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"
                          >
                            <Clock className="h-3 w-3" />
                            <span>{activity.relativeTime}</span>
                          </motion.div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {activity.link && (
                            <Button 
                              asChild
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Link to={activity.link}>
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDismissActivity(activity.id);
                            }}
                            aria-label="Dismiss activity"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Expanded View - Aceternity Overlay Style */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          ref={expandedCardRef}
                          layoutId={`card-content-${activity.id}`}
                          className="fixed inset-4 md:inset-8 lg:inset-16 z-50 m-auto max-h-[90vh] overflow-y-auto"
                          style={{
                            width: "auto",
                            height: "fit-content",
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ 
                              duration: 0.4, 
                              ease: "easeOut",
                              opacity: { duration: 0.3 }
                            }}
                            className="bg-card rounded-2xl border-2 border-primary/30 shadow-2xl overflow-hidden"
                          >
                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-primary via-primary-dark to-primary p-4 border-b border-primary/20 shadow-sm shadow-primary/50">
                              <div className="flex items-start gap-4">
                                <motion.div
                                  layoutId={`icon-${activity.id}`}
                                  className="bg-primary-foreground/20 p-4 rounded-2xl ring-2 ring-primary-foreground/30 shrink-0"
                                >
                                  <Icon className="h-7 w-7 text-primary-foreground" />
                                </motion.div>
                                <div className="flex-1">
                                  <motion.h3
                                    layoutId={`title-${activity.id}`}
                                    className="text-xl font-bold tracking-tight mb-2 text-primary-foreground"
                                  >
                                    {activity.description}
                                  </motion.h3>
                                  <motion.div
                                    layoutId={`time-${activity.id}`}
                                    className="flex items-center gap-4 text-sm text-primary-foreground/80"
                                  >
                                    <Clock className="h-4 w-4" />
                                    <span>{activity.relativeTime}</span>
                                  </motion.div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-10 w-10 p-0 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                                  onClick={() => setExpandedActivityId(null)}
                                >
                                  <X className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-4">
                              {/* Full Description */}
                              {activity.details?.fullDescription && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                                >
                                  <h4 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">Full Details</h4>
                                  <p className="text-sm leading-relaxed text-muted-foreground">
                                    {activity.details.fullDescription}
                                  </p>
                                </motion.div>
                              )}

                              {/* Details Grid - Aceternity Style */}
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3, delay: 0.15, ease: "easeOut" }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                              >
                                {activity.details?.amount && (
                                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border border-emerald-500/20">
                                    <div className="bg-emerald-500/10 p-4 rounded-lg">
                                      <DollarSign className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-emerald-600 mb-1">Amount</p>
                                      <p className="text-base font-bold">{activity.details.amount}</p>
                                    </div>
                                  </div>
                                )}

                                {activity.details?.engineer && (
                                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                                    <div className="bg-primary/10 p-4 rounded-lg">
                                      <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-primary mb-1">Engineer</p>
                                      <p className="text-sm font-bold line-clamp-2">{activity.details.engineer}</p>
                                    </div>
                                  </div>
                                )}

                                {activity.details?.location && (
                                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/20">
                                    <div className="bg-purple-500/10 p-4 rounded-lg">
                                      <MapPin className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-purple-600 mb-1">Location</p>
                                      <p className="text-sm font-bold line-clamp-2">{activity.details.location}</p>
                                    </div>
                                  </div>
                                )}

                                {activity.details?.deadline && (
                                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-amber-500/20">
                                    <div className="bg-amber-500/10 p-4 rounded-lg">
                                      <Calendar className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-amber-600 mb-1">Deadline</p>
                                      <p className="text-sm font-bold">{activity.details.deadline}</p>
                                    </div>
                                  </div>
                                )}
                              </motion.div>

                              {/* Status Badge */}
                              {activity.details?.status && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                                  <Badge className={`text-xs px-3 py-1 ${
                                    activity.details.status.includes('Approved') || activity.details.status.includes('Released')
                                      ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                                      : activity.details.status.includes('Pending')
                                      ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                                      : 'bg-primary/10 text-primary border border-primary/30'
                                  }`}>
                                    {activity.details.status}
                                  </Badge>
                                </motion.div>
                              )}

                              {/* Progress Bar - Aceternity Style */}
                              {activity.details?.progress !== undefined && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.3, delay: 0.25, ease: "easeOut" }}
                                  className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Project Progress</span>
                                    <span className="text-lg font-bold text-primary">{activity.details.progress}%</span>
                                  </div>
                                  <div className="h-3 bg-muted/50 rounded-full overflow-hidden relative">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${activity.details.progress}%` }}
                                      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                      className="h-full bg-gradient-to-r from-primary via-primary to-primary/70 rounded-full relative overflow-hidden"
                                    >
                                      {/* Shimmer effect */}
                                      <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "200%" }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                      />
                                    </motion.div>
                                  </div>
                                </motion.div>
                              )}

                              {/* Action Buttons - Aceternity Style */}
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, delay: 0.3, ease: "easeOut" }}
                                className="flex gap-3 pt-4"
                              >
                                {activity.link && (
                                  <Button asChild className="flex-1 h-11 text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
                                    <Link to={activity.link}>
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View Full Details
                                    </Link>
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  className="h-11 px-6 text-sm font-semibold"
                                  onClick={() => {
                                    handleDismissActivity(activity.id);
                                  }}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Dismiss
                                </Button>
                                <Button
                                  variant="outline"
                                  className="h-11 px-6 text-sm font-semibold"
                                  onClick={() => setExpandedActivityId(null)}
                                >
                                  Close
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
          
          {/* Laser Flow Animation */}
          <div className="relative h-[3px] overflow-hidden rounded-b-xl">
            <div 
              className="absolute inset-0 animate-laser-flow"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.6) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        </>
      )}
    </Card>
  );
});

export default ClientRecentActivityFeed;

