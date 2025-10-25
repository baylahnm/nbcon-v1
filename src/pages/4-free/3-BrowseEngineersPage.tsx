import { useState, useEffect, useRef, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../1-HomePage/others/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../1-HomePage/others/components/ui/avatar';
import { Progress } from '../1-HomePage/others/components/ui/progress';
import { useOutsideClick } from '../1-HomePage/others/hooks/use-outside-click';
import { useEngineersStore } from './others/features/browse/stores/useEngineersStore';
import XScroll from '@/pages/1-HomePage/others/components/ui/x-scroll';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  MessageSquare, 
  Eye,
  CheckCircle2,
  Award,
  Briefcase,
  DollarSign,
  Bookmark,
  TrendingUp,
  Building2,
  Zap,
  Target,
  Calculator,
  Map as MapIcon,
  List,
  X,
  Phone,
  Mail,
  GraduationCap,
  FileText,
  Loader2
} from 'lucide-react';

interface Engineer {
  id: string;
  name: string;
  title: string;
  company?: string;
  location: string;
  specialty: string;
  experience: number; // years
  rating: number;
  reviews: number;
  avatar?: string;
  verified: boolean;
  sceLicense?: string;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'offline';
  completedProjects: number;
  responseTime: string;
  skills: string[];
  bio: string;
  isBookmarked: boolean;
  matchScore?: number; // 0-100
  phone?: string;
  email?: string;
  certifications?: string[];
  education?: string;
  languages?: string[];
}

// Mock data removed - now using real database via useEngineersStore
// This page has been migrated to use the centralized engineers store

export default function BrowseEngineersPage() {
  const navigate = useNavigate();
  
  // Connect to real engineers database
  const { engineers: dbEngineers, isLoading: engineersLoading, loadEngineers, error: engineersError } = useEngineersStore();
  
  // Load engineers on mount
  useEffect(() => {
    loadEngineers();
  }, [loadEngineers]);
  
  // Transform database engineers to UI interface
  const engineers: Engineer[] = dbEngineers.map(eng => ({
    id: eng.id,
    name: `${eng.first_name} ${eng.last_name}`,
    title: eng.title,
    location: eng.location_city || 'Saudi Arabia',
    specialty: eng.specialty,
    experience: eng.experience_years,
    rating: 4.5, // TODO: Calculate from ratings table
    reviews: 0, // TODO: Count from ratings table
    avatar: eng.avatar_url,
    verified: eng.is_verified,
    sceLicense: eng.sce_license,
    hourlyRate: eng.hourly_rate,
    availability: 'available', // TODO: Check from availability table
    completedProjects: 0, // TODO: Count from projects
    responseTime: '< 2 hours',
    skills: [], // TODO: Join with skills table
    bio: eng.bio || '',
    isBookmarked: false,
    matchScore: 85
  }));
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [expandedEngineer, setExpandedEngineer] = useState<Engineer | null>(null);
  
  const expandedRef = useRef<HTMLDivElement>(null);
  const id = useId();
  
  // Refs for animated gradient cards
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const stat3Ref = useRef<HTMLDivElement>(null);
  const stat4Ref = useRef<HTMLDivElement>(null);

  // Handle expandable card interactions
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setExpandedEngineer(null);
      }
    }

    if (expandedEngineer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expandedEngineer]);

  useOutsideClick(expandedRef, () => setExpandedEngineer(null));

  // Add mouse tracking for animated gradient on all stat cards
  useEffect(() => {
    const statRefs = [stat1Ref, stat2Ref, stat3Ref, stat4Ref];
    
    const handlers = statRefs.map(ref => {
      const card = ref.current;
      if (!card) return null;

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
      return { card, handleMouseMove };
    });

    return () => {
      handlers.forEach(handler => {
        if (handler) {
          handler.card.removeEventListener('mousemove', handler.handleMouseMove);
        }
      });
    };
  }, []);

  // Filter engineers
  const filteredEngineers = engineers.filter(engineer => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || engineer.specialty.includes(selectedSpecialty);
    const matchesLocation = selectedLocation === 'All' || engineer.location.includes(selectedLocation);
    
    // Filter by tab
    if (activeTab === 'verified') return matchesSearch && matchesSpecialty && matchesLocation && engineer.verified;
    if (activeTab === 'available') return matchesSearch && matchesSpecialty && matchesLocation && engineer.availability === 'available';
    if (activeTab === 'bookmarked') return matchesSearch && matchesSpecialty && matchesLocation && engineer.isBookmarked;
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  // Sort engineers by match score
  const sortedEngineers = [...filteredEngineers].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  // Bookmark feature TODO: Implement with database
  const handleBookmark = (engineerId: string) => {
    console.log('[Engineers] Bookmark clicked for:', engineerId);
    // TODO: Implement bookmark toggle in useEngineersStore
    // For now, just log the action
  };

  return (
    <>
      {/* Expanded Engineer Modal */}
      <AnimatePresence>
        {expandedEngineer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Expanded Card */}
            <div className="fixed inset-0 grid place-items-center z-[60] p-4">
              <motion.div
                layoutId={`engineer-card-${expandedEngineer.id}-${id}`}
                ref={expandedRef}
                className="w-full max-w-4xl max-h-[95vh] flex flex-col bg-card border-2 border-primary/30 rounded-2xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Close Button */}
                <motion.button
                  className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur-sm border-2 border-border/50 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-xl"
                  onClick={() => setExpandedEngineer(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Header with Avatar and Basic Info */}
                <div className="p-8 border-b border-border/40 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
                  <div className="flex items-start gap-6">
                    <motion.div layoutId={`engineer-avatar-${expandedEngineer.id}-${id}`}>
                      <Avatar className="h-24 w-24 ring-4 ring-primary/20 shadow-xl">
                        <AvatarImage src={expandedEngineer.avatar || '/placeholder.svg'} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                          {expandedEngineer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <motion.h2
                            layoutId={`engineer-name-${expandedEngineer.id}-${id}`}
                            className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2"
                          >
                            {expandedEngineer.name}
                            {expandedEngineer.verified && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                          </motion.h2>
                          <p className="text-base text-muted-foreground mb-2">{expandedEngineer.title}</p>
                          {expandedEngineer.company && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              <span>{expandedEngineer.company}</span>
                            </div>
                          )}
                        </div>
                        {expandedEngineer.matchScore && (
                          <Badge className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1">
                            <Target className="h-4 w-4 mr-1.5" />
                            {expandedEngineer.matchScore}% Match
                          </Badge>
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                          <div className="flex items-center gap-2 text-xs text-yellow-600 font-medium mb-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>Rating</span>
                          </div>
                          <p className="text-base font-bold">{expandedEngineer.rating} ({expandedEngineer.reviews})</p>
                        </div>
                        <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                          <div className="flex items-center gap-2 text-xs text-primary font-medium mb-1">
                            <Briefcase className="h-3 w-3" />
                            <span>Projects</span>
                          </div>
                          <p className="text-base font-bold">{expandedEngineer.completedProjects}</p>
                        </div>
                        <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                          <div className="flex items-center gap-2 text-xs text-purple-600 font-medium mb-1">
                            <Award className="h-3 w-3" />
                            <span>Experience</span>
                          </div>
                          <p className="text-base font-bold">{expandedEngineer.experience} years</p>
                        </div>
                        <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 border border-border/40">
                          <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium mb-1">
                            <DollarSign className="h-3 w-3" />
                            <span>Rate</span>
                          </div>
                          <p className="text-base font-bold">{expandedEngineer.hourlyRate} SAR/hr</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* About */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      About
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {expandedEngineer.bio}
                    </p>
                  </div>

                  {/* Contact Information */}
                  {(expandedEngineer.phone || expandedEngineer.email) && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold tracking-tight">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {expandedEngineer.phone && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Phone className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Phone</p>
                              <p className="text-sm font-medium">{expandedEngineer.phone}</p>
                            </div>
                          </div>
                        )}
                        {expandedEngineer.email && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
                            <div className="bg-cyan-500/10 p-2 rounded-lg">
                              <Mail className="h-4 w-4 text-cyan-600" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p className="text-sm font-medium line-clamp-1">{expandedEngineer.email}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* All Skills */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold tracking-tight">All Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {expandedEngineer.skills.map((skill, idx) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Badge className="text-xs bg-primary/10 text-primary border-primary/30">
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  {expandedEngineer.certifications && expandedEngineer.certifications.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        Certifications & Licenses
                      </h3>
                      <div className="space-y-2">
                        {expandedEngineer.certifications.map((cert, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">{cert}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {expandedEngineer.education && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        Education
                      </h3>
                      <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                        <p className="text-sm font-medium">{expandedEngineer.education}</p>
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {expandedEngineer.languages && expandedEngineer.languages.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold tracking-tight">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {expandedEngineer.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-xs text-primary font-medium mb-2">
                      <Clock className="h-3 w-3" />
                      <span>AVAILABILITY</span>
                    </div>
                    <p className="text-sm font-bold capitalize">{expandedEngineer.availability}</p>
                    <p className="text-xs text-muted-foreground mt-1">Responds in {expandedEngineer.responseTime}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border/40 bg-muted/30 flex gap-3">
                  <Button className="flex-1 h-10 text-xs shadow-lg">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="flex-1 h-10 text-xs">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 w-10 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(expandedEngineer.id);
                    }}
                  >
                    <Bookmark className={`h-4 w-4 ${expandedEngineer.isBookmarked ? 'fill-current text-primary' : ''}`} />
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="p-4 space-y-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-xl shadow-md flex-shrink-0">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[18px] font-bold tracking-tight">Browse Engineers</h1>
              <p className="text-[14px] text-muted-foreground mt-0.5">
                Find the perfect engineer for your project
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              className={`h-8 text-xs transition-all ${viewMode === 'grid' ? 'shadow-sm shadow-primary/50' : ''}`}
              onClick={() => {
                console.log('List View clicked, setting viewMode to grid');
                setViewMode('grid');
              }}
            >
              <List className="h-3.5 w-3.5 mr-1.5" />
              List View
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              className={`h-8 text-xs transition-all ${viewMode === 'map' ? 'shadow-sm shadow-primary/50' : ''}`}
              onClick={() => {
                console.log('Map View clicked, setting viewMode to map');
                setViewMode('map');
              }}
            >
              <MapIcon className="h-3.5 w-3.5 mr-1.5" />
              Map View
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            ref={stat1Ref}
            className="relative overflow-hidden transition-all duration-300"
            style={{
              '--rotation': '4.2rad',
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            } as React.CSSProperties}
          >
            <Card className="bg-transparent border border-border/50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-primary-gradient h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Total Engineers</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{engineers.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">In your area</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            ref={stat2Ref}
            className="relative overflow-hidden transition-all duration-300"
            style={{
              '--rotation': '4.2rad',
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            } as React.CSSProperties}
          >
            <Card className="bg-transparent border border-border/50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-primary-gradient h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">SCE Verified</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{engineers.filter(e => e.verified).length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Certified engineers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            ref={stat3Ref}
            className="relative overflow-hidden transition-all duration-300"
            style={{
              '--rotation': '4.2rad',
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            } as React.CSSProperties}
          >
            <Card className="bg-transparent border border-border/50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-primary-gradient h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Available Now</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{engineers.filter(e => e.availability === 'available').length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Ready to start</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            ref={stat4Ref}
            className="relative overflow-hidden transition-all duration-300"
            style={{
              '--rotation': '4.2rad',
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(calc(var(--rotation, 4.2rad)), hsl(var(--primary)) 0%, hsl(var(--card)) 30%, transparent 80%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            } as React.CSSProperties}
          >
            <Card className="bg-transparent border border-border/50">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-primary-gradient h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Avg Rating</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold tracking-tight">4.8</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search engineers by name, specialty, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Specialties</SelectItem>
                <SelectItem value="Structural">Structural Engineering</SelectItem>
                <SelectItem value="Project">Project Management</SelectItem>
                <SelectItem value="Electrical">Electrical Engineering</SelectItem>
                <SelectItem value="Mechanical">Mechanical Engineering</SelectItem>
                <SelectItem value="Civil">Civil Engineering</SelectItem>
                <SelectItem value="Environmental">Environmental Engineering</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="h-10 text-xs">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Locations</SelectItem>
                <SelectItem value="Riyadh">Riyadh</SelectItem>
                <SelectItem value="Jeddah">Jeddah</SelectItem>
                <SelectItem value="Dammam">Dammam</SelectItem>
                <SelectItem value="Mecca">Mecca</SelectItem>
                <SelectItem value="Jubail">Jubail</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-10 text-xs">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="relative z-10 flex w-full rounded-xl bg-card border border-border pt-1 pr-1 pb-1 pl-1 gap-1 shadow-lg shadow-inner shadow-top">
            <TabsTrigger value="all" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">
              All Engineers ({engineers.length})
            </TabsTrigger>
            <TabsTrigger value="verified" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              SCE Verified ({engineers.filter(e => e.verified).length})
            </TabsTrigger>
            <TabsTrigger value="available" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Available ({engineers.filter(e => e.availability === 'available').length})
            </TabsTrigger>
            <TabsTrigger value="bookmarked" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground text-xs">
              <Bookmark className="h-3.5 w-3.5 mr-1.5" />
              Saved ({engineers.filter(e => e.isBookmarked).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found <span className="font-semibold text-foreground">{sortedEngineers.length}</span> engineers
              </p>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Sort by Match
              </Button>
            </div>

            {/* Engineer Cards */}
            <div className="browse-engineers-scroll">
              <XScroll>
                <div className="flex space-x-4 p-1 pb-4">
                  {sortedEngineers.map((engineer) => (
                    <motion.div
                      key={engineer.id}
                      layoutId={`engineer-card-${engineer.id}-${id}`}
                      onClick={() => setExpandedEngineer(engineer)}
                      className="cursor-pointer flex-shrink-0"
                      style={{ width: '350px' }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-border/50 hover:border-primary/30 overflow-hidden gap-0">
                    {/* Header with Match Score */}
                    <div className="relative bg-gradient-to-br from-muted to-muted/50 p-4">
                      {engineer.matchScore && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary text-primary-foreground text-xs font-bold">
                            <Target className="h-3 w-3 mr-1" />
                            {engineer.matchScore}% Match
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4">
                        <motion.div layoutId={`engineer-avatar-${engineer.id}-${id}`}>
                          <Avatar className="h-16 w-16 ring-4 ring-background">
                            <AvatarImage src={engineer.avatar || '/placeholder.svg'} />
                            <AvatarFallback className="bg-muted">
                              <img src="/placeholder.svg" alt="Engineer" className="w-full h-full object-cover" />
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <motion.h3 
                              layoutId={`engineer-name-${engineer.id}-${id}`}
                              className="font-bold text-base line-clamp-1"
                            >
                              {engineer.name}
                            </motion.h3>
                            {engineer.verified && (
                              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{engineer.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${
                              engineer.availability === 'available' ? 'bg-green-500' :
                              engineer.availability === 'busy' ? 'bg-amber-500' :
                              'bg-gray-500'
                            }`} />
                            <span className="text-xs text-muted-foreground">{engineer.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/40">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-0.5 mb-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-sm">{engineer.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{engineer.reviews} reviews</p>
                      </div>
                      <div className="text-center border-x border-border/40">
                        <div className="font-bold text-sm mb-1">{engineer.completedProjects}</div>
                        <p className="text-xs text-muted-foreground">Projects</p>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm mb-1">{engineer.experience}y</div>
                        <p className="text-xs text-muted-foreground">Experience</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Top Skills</p>
                      <div className="flex flex-wrap gap-4">
                        {engineer.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                            {skill}
                          </Badge>
                        ))}
                        {engineer.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{engineer.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">
                      {engineer.bio}
                    </p>

                    {/* Rate and Response Time */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div>
                        <p className="font-bold text-sm text-primary">{engineer.hourlyRate} SAR/hr</p>
                        <p className="text-xs text-muted-foreground">Responds in {engineer.responseTime}</p>
                      </div>
                      <Badge className={`text-xs ${
                        engineer.availability === 'available' 
                          ? 'bg-green-500/10 text-green-600 border-0' 
                          : 'bg-amber-500/10 text-amber-600 border-0'
                      }`}>
                        {engineer.availability === 'available' ? 'Available' : 'Busy'}
                      </Badge>
                    </div>

                    {/* Quick Insights Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs border-primary/20 bg-primary/5 hover:bg-primary/10"
                      >
                        <Calculator className="h-3 w-3 mr-1" />
                        Cost Estimate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10"
                      >
                        <Briefcase className="h-3 w-3 mr-1" />
                        Portfolio
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle contact
                        }}
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                        Contact
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(engineer.id);
                        }}
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${engineer.isBookmarked ? 'fill-current text-primary' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/free/engineer/${engineer.id}`);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Click to Expand Hint */}
                    <div className="pt-2 text-center border-t border-border/40">
                      <p className="text-[10px] text-muted-foreground">
                        Click card to view full profile
                      </p>
                    </div>
                  </CardContent>
                </Card>
                    </motion.div>
                  ))}
                </div>
              </XScroll>
            </div>

            {/* Empty State */}
            {sortedEngineers.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">No engineers found</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSpecialty('All');
                    setSelectedLocation('All');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
    </>
  );
}
