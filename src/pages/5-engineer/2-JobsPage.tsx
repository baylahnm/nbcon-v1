import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../1-HomePage/others/components/ui/select';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Search, 
  Filter,
  Star,
  Users,
  Calendar,
  Bookmark,
  Eye,
  Send,
  CheckCircle2,
  X,
  AlertCircle,
  Map as MapIcon,
  List,
  Zap,
  Building,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Calculator,
  Target,
  TrendingUp
} from 'lucide-react';

// Import enhancement components
import { JobInfoPopover } from './others/features/jobs/components/JobInfoPopover';
import { MiniAIMatchScore } from './others/features/jobs/components/mini-cards/MiniAIMatchScore';
import { MiniEarningsCalculator } from './others/features/jobs/components/mini-cards/MiniEarningsCalculator';
import { MiniSkillsGap } from './others/features/jobs/components/mini-cards/MiniSkillsGap';
import { MiniSimilarJobs } from './others/features/jobs/components/mini-cards/MiniSimilarJobs';
import { SavedSearchFilters } from './others/features/jobs/components/SavedSearchFilters';
import { ApplicationStatusTracker } from './others/features/jobs/components/ApplicationStatusTracker';
import { CompanyProfilePreview } from './others/features/jobs/components/CompanyProfilePreview';
import { JobsMapView } from './others/features/jobs/components/JobsMapView';
import { QuickApply } from './others/features/jobs/components/QuickApply';
import JobDetailsPopover from './others/features/jobs/components/JobDetailsPopover';
import XScroll from '../1-HomePage/others/components/ui/x-scroll';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
  status: 'open' | 'applied' | 'shortlisted' | 'rejected' | 'closed';
  category: string;
  experience: string;
  isBookmarked: boolean;
  companyLogo?: string;
  skills: string[];
  clientRating?: number;
  budget?: number;
}

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Structural Engineer',
    company: 'Saudi Aramco',
    location: 'Riyadh, Saudi Arabia',
    type: 'full-time',
    salary: {
      min: 15000,
      max: 25000,
      currency: 'SAR'
    },
    description: 'Lead structural analysis and design for major infrastructure projects in the Kingdom.',
    requirements: [
      'Bachelor\'s degree in Civil/Structural Engineering',
      'Minimum 8 years experience',
      'SCE license required',
      'Proficiency in STAAD.Pro, ETABS'
    ],
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    status: 'applied',
    category: 'Structural Engineering',
    experience: '8+ years',
    isBookmarked: true,
    skills: ['STAAD.Pro', 'ETABS', 'AutoCAD', 'Revit'],
    clientRating: 4.8
  },
  {
    id: '2',
    title: 'Project Manager - Renewable Energy',
    company: 'ACWA Power',
    location: 'Jeddah, Saudi Arabia',
    type: 'full-time',
    salary: {
      min: 12000,
      max: 20000,
      currency: 'SAR'
    },
    description: 'Manage large-scale renewable energy projects across the region. Lead multidisciplinary teams in delivering solar and wind energy projects from conception to completion. Coordinate with stakeholders, manage budgets exceeding $100M, and ensure compliance with Saudi Vision 2030 sustainability goals. Drive project excellence through agile methodologies and innovative solutions.',
    requirements: [
      'PMP certification preferred',
      '5+ years project management experience',
      'Renewable energy background',
      'Strong leadership skills'
    ],
    postedDate: '2024-01-20',
    deadline: '2024-02-20',
    status: 'open',
    category: 'Project Management',
    experience: '5+ years',
    isBookmarked: false,
    skills: ['Project Management', 'Renewable Energy', 'Leadership', 'Agile'],
    clientRating: 4.6
  },
  {
    id: '3',
    title: 'Electrical Design Engineer',
    company: 'NEOM',
    location: 'Tabuk, Saudi Arabia',
    type: 'contract',
    budget: 8000,
    description: 'Design electrical systems for smart city infrastructure.',
    requirements: [
      'Electrical Engineering degree',
      '3+ years design experience',
      'AutoCAD Electrical proficiency',
      'Smart grid knowledge preferred'
    ],
    postedDate: '2024-01-25',
    deadline: '2024-02-25',
    status: 'shortlisted',
    category: 'Electrical Engineering',
    experience: '3+ years',
    isBookmarked: true,
    skills: ['AutoCAD Electrical', 'Smart Grid', 'Power Systems', 'Design'],
    clientRating: 4.9
  }
];

const jobCategories = ['All', 'Structural Engineering', 'Project Management', 'Electrical Engineering', 'Mechanical Engineering'];

export default function JobsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showQuickApply, setShowQuickApply] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [showJobDetailsPopover, setShowJobDetailsPopover] = useState(false);
  
  // Scroll state for arrow visibility
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update arrow visibility based on scroll position
  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateArrowVisibility();
    container.addEventListener('scroll', updateArrowVisibility);

    return () => {
      container.removeEventListener('scroll', updateArrowVisibility);
    };
  }, []);

  // Scroll to next/previous card
  const scrollToCard = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = 400 + 16; // card width + gap
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-primary/10 text-primary';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Send className="h-3 w-3" />;
      case 'shortlisted': return <CheckCircle2 className="h-3 w-3" />;
      case 'rejected': return <X className="h-3 w-3" />;
      case 'closed': return <AlertCircle className="h-3 w-3" />;
      default: return <Eye className="h-3 w-3" />;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-xl shadow-md flex-shrink-0">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[18px] font-bold tracking-tight">Engineering Jobs</h1>
              <p className="text-[14px] text-muted-foreground">
                Find your next engineering opportunity in Saudi Arabia
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 text-xs shadow-sm hover:shadow-md transition-all"
            >
              <List className="h-3.5 w-3.5 mr-1.5" />
              List
            </Button>
            <Button 
              variant={viewMode === 'map' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('map')}
              className="h-8 text-xs shadow-sm hover:shadow-md transition-all"
            >
              <MapIcon className="h-3.5 w-3.5 mr-1.5" />
              Map
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs shadow-sm hover:shadow-md transition-all">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Advanced Filters
            </Button>
            <Button size="sm" className="h-8 text-xs hover:shadow-lg transition-all">
              <Briefcase className="h-3.5 w-3.5 mr-1.5" />
              Job Alerts
            </Button>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: 'Available Jobs', count: mockJobs.filter(j => j.status === 'open').length },
          { icon: Send, label: 'Applied', count: mockJobs.filter(j => j.status === 'applied').length },
          { icon: CheckCircle2, label: 'Shortlisted', count: mockJobs.filter(j => j.status === 'shortlisted').length },
          { icon: Bookmark, label: 'Bookmarked', count: mockJobs.filter(j => j.isBookmarked).length }
        ].map((stat, index) => {
          const cardRef = useRef<HTMLDivElement>(null);

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

          return (
            <div
            key={index}
              ref={cardRef}
            className="relative overflow-hidden transition-all duration-300 cursor-pointer"
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="bg-gradient-to-t from-primary to-primary-dark h-[32px] w-[32px] flex items-center justify-center rounded-lg shadow-sm shadow-primary/50">
                        <stat.icon className="h-5 w-5 text-white" />
                </div>
                      <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold">{stat.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
          );
        })}
      </div>

      {/* Saved Searches - Now below stats */}
      <SavedSearchFilters />

      {/* Main Content - Full Width */}
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="relative z-10 flex w-full rounded-xl bg-card border border-border pt-1 pr-1 pb-1 pl-1 gap-1 shadow-lg shadow-inner shadow-top">
              <TabsTrigger value="available" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">Available Jobs ({mockJobs.filter(j => j.status === 'open').length})</TabsTrigger>
              <TabsTrigger value="applied" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">Applied ({mockJobs.filter(j => j.status === 'applied').length})</TabsTrigger>
              <TabsTrigger value="shortlisted" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">Shortlisted ({mockJobs.filter(j => j.status === 'shortlisted').length})</TabsTrigger>
              <TabsTrigger value="bookmarked" className="relative z-10 flex-1 h-[36px] rounded-lg px-3 py-1 font-medium transition-all duration-200 text-muted-foreground data-[state=active]:bg-gradient-to-t data-[state=active]:from-primary data-[state=active]:to-primary-dark data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:shadow-primary/50 data-[state=active]:border-2 data-[state=active]:border-primary hover:text-foreground">Bookmarked ({mockJobs.filter(j => j.isBookmarked).length})</TabsTrigger>
            </TabsList>

        {/* Available Jobs Tab */}
        <TabsContent value="available" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, company, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Map View */}
          {viewMode === 'map' && (
            <JobsMapView 
              jobs={filteredJobs.filter(job => job.status === 'open')}
              onJobSelect={(jobId) => {
                const job = filteredJobs.find(j => j.id === jobId);
                setSelectedJob(job || null);
              }}
            />
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredJobs.filter(job => job.status === 'open').map((job) => (
                <div key={job.id} className="space-y-4">
                  {/* NEW ENHANCED DESIGN - Product Card Inspired */}
                  <Card className="gap-0 w-full max-w-full overflow-hidden group bg-background text-foreground shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-border/50 hover:border-primary/30">
                      {/* Image Section with Badges Overlay */}
                      <div className="relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                        <motion.img
                          src={`/e-jobs/Available Jobs/${job.title}.jpg`}
                          alt={job.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          <Badge className="bg-gradient-to-t from-primary to-primary-dark text-white border-0 shadow-sm shadow-primary/50">
                            New
                          </Badge>
                          <Badge className="bg-gradient-to-t from-primary to-primary-dark text-white border-0 shadow-sm shadow-primary/50">
                            Recommended
                          </Badge>
                          {job.clientRating && (
                            <Badge className="bg-gradient-to-t from-primary to-primary-dark text-white border-0 shadow-sm shadow-primary/50 flex items-center gap-1">
                              <Star className="h-3 w-3 fill-white" />
                              {job.clientRating}
                            </Badge>
                          )}
                            </div>
                        
                        {/* Bookmark Heart */}
                        <Button
                          variant="secondary"
                          size="icon"
                          className={`absolute top-4 right-4 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all ${
                            job.isBookmarked ? 'text-rose-500' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Bookmark
                            className={`h-5 w-5 ${job.isBookmarked ? 'fill-rose-500' : ''}`}
                          />
                        </Button>
                        
                        {/* Job Title Overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-bold text-2xl text-white drop-shadow-lg line-clamp-1">
                            {job.title}
                          </h3>
                            <button
                            className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors mt-1"
                              onClick={() => {
                                setSelectedCompany(job.company);
                                setShowCompanyProfile(true);
                              }}
                            >
                              <Building className="h-4 w-4" />
                              {job.company}
                            </button>
                          </div>
                        </div>

                      {/* Content */}
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Job Type & Metadata */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold px-4 py-1.5 text-xs uppercase tracking-wider">
                                {job.type.replace('-', ' ')}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                Posted {job.postedDate}
                            </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                              <Clock className="h-3.5 w-3.5 text-amber-600" />
                              <span className="text-xs font-medium text-amber-900 dark:text-amber-100">
                                Deadline: {job.deadline}
                              </span>
                              <Badge className="bg-gradient-to-t from-primary to-primary-dark text-white border-0 text-[10px] px-2 py-0.5 shadow-sm shadow-primary/50">
                                Apply Soon
                              </Badge>
                            </div>
                          </div>

                          {/* Key Info Grid */}
                          <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/40">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>Location</span>
                              </div>
                              <div className="font-medium text-sm">{job.location}</div>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Experience</span>
                              </div>
                              <div className="font-medium text-sm">{job.experience}</div>
                            </div>
                            
                            {job.salary && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                  <DollarSign className="h-3.5 w-3.5" />
                                  <span>Salary</span>
                                </div>
                                <div className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                                {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
                              </div>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">
                          {job.description}
                        </p>

                          {/* Skills - Product Card Style */}
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground font-medium">Required Skills</div>
                        <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill) => (
                                <button
                                  key={skill}
                                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                                >
                              {skill}
                                </button>
                              ))}
                            </div>
                        </div>

                          {/* Quick Info Icons - Horizontal */}
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground font-medium">Quick Insights</div>
                            <div className="flex items-center justify-between gap-2">
                              <JobInfoPopover
                                type="match"
                                trigger={
                                  <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 transition-all border border-primary/20 group/icon">
                                    <Sparkles className="h-5 w-5 text-primary group-hover/icon:scale-110 transition-transform" />
                                    <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-primary transition-colors">AI Match</span>
                                  </button>
                                }
                                content={<MiniAIMatchScore score={85} />}
                              />
                              
                              <JobInfoPopover
                                type="earnings"
                                trigger={
                                  <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-500/5 transition-all border border-green-500/20 group/icon">
                                    <Calculator className="h-5 w-5 text-green-600 group-hover/icon:scale-110 transition-transform" />
                                    <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-green-600 transition-colors">Earnings</span>
                                  </button>
                                }
                                content={<MiniEarningsCalculator />}
                              />
                              
                              <JobInfoPopover
                                type="skills"
                                trigger={
                                  <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-orange-500/5 transition-all border border-orange-500/20 group/icon">
                                    <Target className="h-5 w-5 text-orange-600 group-hover/icon:scale-110 transition-transform" />
                                    <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-orange-600 transition-colors">Skills Gap</span>
                                  </button>
                                }
                                content={<MiniSkillsGap matchPercentage={0} />}
                              />
                              
                              <JobInfoPopover
                                type="similar"
                                trigger={
                                  <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-purple-500/5 transition-all border border-purple-500/20 group/icon">
                                    <TrendingUp className="h-5 w-5 text-purple-600 group-hover/icon:scale-110 transition-transform" />
                                    <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-purple-600 transition-colors">Similar Jobs</span>
                                  </button>
                                }
                                content={<MiniSimilarJobs />}
                              />
                          </div>
                          </div>
                        </div>
                      </CardContent>

                      {/* Footer with Actions */}
                      <CardFooter className="p-5 pt-0 flex gap-3">
                          <Button 
                            variant="outline"
                          onClick={() => {
                            setSelectedJob(job);
                            setShowJobDetailsPopover(true);
                          }}
                          className="flex-1 font-semibold border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            onClick={() => {
                              setSelectedJob(job);
                              setShowQuickApply(true);
                            }}
                          className="flex-1 font-semibold bg-primary hover:bg-primary/90 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Quick Apply
                          </Button>
                      </CardFooter>
                  </Card>

                        </div>
              ))}
                        </div>
          )}
        </TabsContent>

        {/* Applied Jobs Tab */}
        <TabsContent value="applied" className="space-y-4">
          <div className="space-y-4">
            {mockJobs.filter(job => job.status === 'applied').map((job) => (
              <div key={job.id} className="space-y-4">
                {/* NEW ENHANCED DESIGN - Product Card Inspired */}
                <Card className="gap-0 w-full max-w-full overflow-hidden group bg-background text-foreground shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-border/50 hover:border-primary/30">
                    {/* Image Section with Badges Overlay */}
                    <div className="relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                      <motion.img
                        src={`/e-jobs/Applied/${job.title}.jpg`}
                        alt={job.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Badges - Applied Status */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <Badge className={`${getStatusColor(job.status)} hover:opacity-90 border-0 shadow-lg flex items-center gap-1`}>
                          {getStatusIcon(job.status)}
                          <span className="capitalize">{job.status}</span>
                      </Badge>
                        {job.clientRating && (
                          <Badge className="bg-gradient-to-t from-primary to-primary-dark text-white border-0 shadow-sm shadow-primary/50 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-white" />
                            {job.clientRating}
                          </Badge>
                        )}
                    </div>

                      {/* Bookmark Heart */}
                        <Button
                        variant="secondary"
                          size="icon"
                        className={`absolute top-4 right-4 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all ${
                          job.isBookmarked ? 'text-rose-500' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Bookmark
                          className={`h-5 w-5 ${job.isBookmarked ? 'fill-rose-500' : ''}`}
                        />
                        </Button>
                      
                      {/* Job Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-2xl text-white drop-shadow-lg line-clamp-1">
                          {job.title}
                        </h3>
                        <button
                          className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors mt-1"
                          onClick={() => {
                            setSelectedCompany(job.company);
                            setShowCompanyProfile(true);
                          }}
                        >
                          <Building className="h-4 w-4" />
                          {job.company}
                        </button>
                        </div>
                        </div>

                    {/* Content */}
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        {/* Job Type & Metadata */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold px-4 py-1.5 text-xs uppercase tracking-wider">
                              {job.type.replace('-', ' ')}
                            </Badge>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Applied {job.postedDate}
                        </div>
                        </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                            <span className="text-xs font-medium text-amber-900 dark:text-amber-100">
                              Deadline: {job.deadline}
                            </span>
                            <Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-0 text-[10px] px-2 py-0.5">
                              Apply Soon
                            </Badge>
                      </div>
                    </div>

                        {/* Key Info Grid */}
                        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/40">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>Location</span>
                  </div>
                            <div className="font-medium text-sm">{job.location}</div>
                </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Experience</span>
            </div>
                            <div className="font-medium text-sm">{job.experience}</div>
                          </div>
                          
                          {job.salary && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                <DollarSign className="h-3.5 w-3.5" />
                                <span>Salary</span>
                        </div>
                              <div className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                                {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
                          </div>
                          </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Skills - Product Card Style */}
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Required Skills</div>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <button
                                key={skill}
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                              >
                                {skill}
                              </button>
                            ))}
                      </div>
                    </div>

                        {/* Quick Info Icons - Horizontal */}
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Quick Insights</div>
                          <div className="flex items-center justify-between gap-2">
                            <JobInfoPopover
                              type="match"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 transition-all border border-primary/20 group/icon">
                                  <Sparkles className="h-5 w-5 text-primary group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-primary transition-colors">AI Match</span>
                                </button>
                              }
                              content={<MiniAIMatchScore score={85} />}
                            />
                            
                            <JobInfoPopover
                              type="earnings"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-500/5 transition-all border border-green-500/20 group/icon">
                                  <Calculator className="h-5 w-5 text-green-600 group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-green-600 transition-colors">Earnings</span>
                                </button>
                              }
                              content={<MiniEarningsCalculator />}
                            />
                            
                            <JobInfoPopover
                              type="skills"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-orange-500/5 transition-all border border-orange-500/20 group/icon">
                                  <Target className="h-5 w-5 text-orange-600 group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-orange-600 transition-colors">Skills Gap</span>
                                </button>
                              }
                              content={<MiniSkillsGap matchPercentage={0} />}
                            />
                            
                            <JobInfoPopover
                              type="similar"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-purple-500/5 transition-all border border-purple-500/20 group/icon">
                                  <TrendingUp className="h-5 w-5 text-purple-600 group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-purple-600 transition-colors">Similar Jobs</span>
                                </button>
                              }
                              content={<MiniSimilarJobs />}
                            />
                    </div>
                  </div>
                  
                  {/* Application Status Tracker */}
                        <div className="border-t pt-4 mt-4">
                    <ApplicationStatusTracker
                      jobTitle={job.title}
                      company={job.company}
                      applicationDate={job.postedDate}
                      currentStage={2}
                    />
                        </div>
                  </div>
                </CardContent>

                    {/* Footer with Actions */}
                    <CardFooter className="p-5 pt-0 flex gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowJobDetailsPopover(true);
                        }}
                        className="flex-1 font-semibold border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline"
                        size="default"
                        className="flex-1 font-semibold border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        View Application
                      </Button>
                    </CardFooter>
              </Card>

              </div>
            ))}
          </div>
        </TabsContent>

        {/* Shortlisted Jobs Tab */}
        <TabsContent value="shortlisted" className="space-y-4">
          <div className="space-y-4">
            {mockJobs.filter(job => job.status === 'shortlisted').map((job) => (
              <div key={job.id} className="space-y-4">
                {/* NEW ENHANCED DESIGN - Product Card Inspired */}
                <Card className="gap-0 w-full max-w-full overflow-hidden group bg-background text-foreground shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-border/50 hover:border-primary/30">
                    {/* Image Section with Badges Overlay */}
                    <div className="relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                      <motion.img
                        src={`/e-jobs/Shortlisted/${job.title}.jpg`}
                        alt={job.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Badges - Shortlisted Status */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <Badge className={`${getStatusColor(job.status)} hover:opacity-90 border-0 shadow-lg flex items-center gap-1`}>
                              {getStatusIcon(job.status)}
                          <span className="capitalize">{job.status}</span>
                            </Badge>
                        {job.clientRating && (
                          <Badge className="bg-gradient-to-t from-primary to-primary-dark text-white border-0 shadow-sm shadow-primary/50 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-white" />
                            {job.clientRating}
                          </Badge>
                        )}
                          </div>
                      
                      {/* Bookmark Heart */}
                      <Button
                        variant="secondary"
                        size="icon"
                        className={`absolute top-4 right-4 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all ${
                          job.isBookmarked ? 'text-rose-500' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Bookmark
                          className={`h-5 w-5 ${job.isBookmarked ? 'fill-rose-500' : ''}`}
                        />
                      </Button>
                      
                      {/* Job Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-2xl text-white drop-shadow-lg line-clamp-1">
                          {job.title}
                        </h3>
                        <button
                          className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors mt-1"
                          onClick={() => {
                            setSelectedCompany(job.company);
                            setShowCompanyProfile(true);
                          }}
                        >
                          <Building className="h-4 w-4" />
                          {job.company}
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        {/* Job Type & Metadata */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold px-4 py-1.5 text-xs uppercase tracking-wider">
                              {job.type.replace('-', ' ')}
                            </Badge>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                              Shortlisted {job.postedDate}
                          </div>
                        </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                            <span className="text-xs font-medium text-amber-900 dark:text-amber-100">
                              Deadline: {job.deadline}
                            </span>
                            <Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-0 text-[10px] px-2 py-0.5">
                              Apply Soon
                            </Badge>
                      </div>
                    </div>

                        {/* Key Info Grid */}
                        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/40">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>Location</span>
                            </div>
                            <div className="font-medium text-sm">{job.location}</div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Experience</span>
                            </div>
                            <div className="font-medium text-sm">{job.experience}</div>
                          </div>
                          
                          {job.salary && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                <DollarSign className="h-3.5 w-3.5" />
                                <span>Salary</span>
                              </div>
                              <div className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                                {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Skills - Product Card Style */}
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Required Skills</div>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <button
                                key={skill}
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                              >
                                {skill}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quick Info Icons - Horizontal */}
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Quick Insights</div>
                          <div className="flex items-center justify-between gap-2">
                            <JobInfoPopover
                              type="match"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 transition-all border border-primary/20 group/icon">
                                  <Sparkles className="h-5 w-5 text-primary group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-primary transition-colors">AI Match</span>
                                </button>
                              }
                              content={<MiniAIMatchScore score={85} />}
                            />
                            
                            <JobInfoPopover
                              type="earnings"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-500/5 transition-all border border-green-500/20 group/icon">
                                  <Calculator className="h-5 w-5 text-green-600 group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-green-600 transition-colors">Earnings</span>
                                </button>
                              }
                              content={<MiniEarningsCalculator />}
                            />
                            
                            <JobInfoPopover
                              type="skills"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-orange-500/5 transition-all border border-orange-500/20 group/icon">
                                  <Target className="h-5 w-5 text-orange-600 group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-orange-600 transition-colors">Skills Gap</span>
                                </button>
                              }
                              content={<MiniSkillsGap matchPercentage={0} />}
                            />
                            
                            <JobInfoPopover
                              type="similar"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-purple-500/5 transition-all border border-purple-500/20 group/icon">
                                  <TrendingUp className="h-5 w-5 text-purple-600 group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-purple-600 transition-colors">Similar Jobs</span>
                                </button>
                              }
                              content={<MiniSimilarJobs />}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    {/* Footer with Actions */}
                    <CardFooter className="p-5 pt-0 flex gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowJobDetailsPopover(true);
                        }}
                        className="flex-1 font-semibold border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        size="default"
                        className="flex-1 font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Contact Client
                      </Button>
                    </CardFooter>
              </Card>

              </div>
            ))}
          </div>
        </TabsContent>

        {/* Bookmarked Jobs Tab */}
        <TabsContent value="bookmarked" className="space-y-4">
          <div className="space-y-4">
            {mockJobs.filter(job => job.isBookmarked).map((job) => (
              <div key={job.id} className="space-y-4">
                {/* NEW ENHANCED DESIGN - Product Card Inspired */}
                <Card className="gap-0 w-full max-w-full overflow-hidden group bg-background text-foreground shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl border-2 border-border/50 hover:border-primary/30">
                    {/* Image Section with Badges Overlay */}
                    <div className="relative aspect-[21/9] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                      <motion.img
                        src={`/e-jobs/Bookmarked/${job.title}.jpg`}
                        alt={job.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Badges - Bookmarked */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <Badge className="bg-gradient-to-t from-primary to-primary-dark text-white border-0 shadow-sm shadow-primary/50 flex items-center gap-1">
                          <Bookmark className="h-3 w-3 fill-white" />
                              Bookmarked
                            </Badge>
                        {job.clientRating && (
                          <Badge className="bg-gradient-to-t from-primary to-primary-dark text-white border-0 shadow-sm shadow-primary/50 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-white" />
                            {job.clientRating}
                          </Badge>
                        )}
                          </div>
                      
                      {/* Bookmark Heart - Always filled for bookmarked tab */}
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-all text-rose-500"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Bookmark className="h-5 w-5 fill-rose-500" />
                      </Button>
                      
                      {/* Job Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-2xl text-white drop-shadow-lg line-clamp-1">
                          {job.title}
                        </h3>
                        <button
                          className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors mt-1"
                          onClick={() => {
                            setSelectedCompany(job.company);
                            setShowCompanyProfile(true);
                          }}
                        >
                          <Building className="h-4 w-4" />
                          {job.company}
                        </button>
                          </div>
                        </div>

                    {/* Content */}
                    <CardContent className="p-5">
                      <div className="space-y-4">
                        {/* Job Type & Metadata */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold px-4 py-1.5 text-xs uppercase tracking-wider">
                              {job.type.replace('-', ' ')}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Posted {job.postedDate}
                      </div>
                    </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                            <span className="text-xs font-medium text-amber-900 dark:text-amber-100">
                              Deadline: {job.deadline}
                            </span>
                            <Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-0 text-[10px] px-2 py-0.5">
                              Apply Soon
                            </Badge>
                          </div>
                        </div>

                        {/* Key Info Grid */}
                        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/40">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>Location</span>
                            </div>
                            <div className="font-medium text-sm">{job.location}</div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Experience</span>
                            </div>
                            <div className="font-medium text-sm">{job.experience}</div>
                          </div>
                          
                          {job.salary && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                <DollarSign className="h-3.5 w-3.5" />
                                <span>Salary</span>
                              </div>
                              <div className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                                {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Skills - Product Card Style */}
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Required Skills</div>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <button
                                key={skill}
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                              >
                                {skill}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quick Info Icons - Horizontal */}
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground font-medium">Quick Insights</div>
                          <div className="flex items-center justify-between gap-2">
                            <JobInfoPopover
                              type="match"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-primary/5 transition-all border border-primary/20 group/icon">
                                  <Sparkles className="h-5 w-5 text-primary group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-primary transition-colors">AI Match</span>
                                </button>
                              }
                              content={<MiniAIMatchScore score={85} />}
                            />
                            
                            <JobInfoPopover
                              type="earnings"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-green-500/5 transition-all border border-green-500/20 group/icon">
                                  <Calculator className="h-5 w-5 text-green-600 group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-green-600 transition-colors">Earnings</span>
                                </button>
                              }
                              content={<MiniEarningsCalculator />}
                            />
                            
                            <JobInfoPopover
                              type="skills"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-orange-500/5 transition-all border border-orange-500/20 group/icon">
                                  <Target className="h-5 w-5 text-orange-600 group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-orange-600 transition-colors">Skills Gap</span>
                                </button>
                              }
                              content={<MiniSkillsGap matchPercentage={0} />}
                            />
                            
                            <JobInfoPopover
                              type="similar"
                              trigger={
                                <button className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-purple-500/5 transition-all border border-purple-500/20 group/icon">
                                  <TrendingUp className="h-5 w-5 text-purple-600 group-hover/icon:scale-110 transition-transform" />
                                  <span className="text-[10px] font-semibold text-foreground/70 group-hover/icon:text-purple-600 transition-colors">Similar Jobs</span>
                                </button>
                              }
                              content={<MiniSimilarJobs />}
                            />
                          </div>
                    </div>
                  </div>
                </CardContent>

                    {/* Footer with Actions */}
                    <CardFooter className="p-5 pt-0 flex gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowJobDetailsPopover(true);
                        }}
                        className="flex-1 font-semibold border-2 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        onClick={() => {
                          setSelectedJob(job);
                          setShowQuickApply(true);
                        }}
                        className="flex-1 font-semibold bg-primary hover:bg-primary/90 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Quick Apply
                      </Button>
                    </CardFooter>
              </Card>

              </div>
            ))}
          </div>
        </TabsContent>
          </Tabs>
      </div>
      </div>

      {/* Dialogs */}
      {selectedJob && (
        <>
          <QuickApply
            open={showQuickApply}
            onOpenChange={setShowQuickApply}
            jobTitle={selectedJob.title}
            company={selectedJob.company}
            matchScore={selectedJob.id === '1' ? 92 : selectedJob.id === '2' ? 85 : 78}
          />
          
          <CompanyProfilePreview
            open={showCompanyProfile}
            onOpenChange={setShowCompanyProfile}
            companyName={selectedCompany || selectedJob?.company || ''}
          />
          
          <JobDetailsPopover
            isOpen={showJobDetailsPopover}
            onClose={() => setShowJobDetailsPopover(false)}
            job={selectedJob}
          />
        </>
      )}
    </div>
  );
}
