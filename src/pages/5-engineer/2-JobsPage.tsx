import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../1-HomePage/others/components/ui/card';
import { Button } from '../1-HomePage/others/components/ui/button';
import { Input } from '../1-HomePage/others/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../1-HomePage/others/components/ui/tabs';
import { Badge } from '../1-HomePage/others/components/ui/badge';
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
  ChevronRight
} from 'lucide-react';

// Import enhancement components
import { AIJobMatchScore } from './others/features/jobs/components/AIJobMatchScore';
import { EarningsCalculator } from './others/features/jobs/components/EarningsCalculator';
import { SimilarJobsRecommendations } from './others/features/jobs/components/SimilarJobsRecommendations';
import { SavedSearchFilters } from './others/features/jobs/components/SavedSearchFilters';
import { ApplicationStatusTracker } from './others/features/jobs/components/ApplicationStatusTracker';
import { CompanyProfilePreview } from './others/features/jobs/components/CompanyProfilePreview';
import { SkillsGapAnalysis } from './others/features/jobs/components/SkillsGapAnalysis';
import { JobsMapView } from './others/features/jobs/components/JobsMapView';
import { QuickApply } from './others/features/jobs/components/QuickApply';
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
    description: 'Manage large-scale renewable energy projects across the region.',
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
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showQuickApply, setShowQuickApply] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  
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
      case 'applied': return 'bg-blue-100 text-blue-800';
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
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header - Enhanced */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-1.5">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
                <Briefcase className="h-7 w-7 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Engineering Jobs
              </span>
            </h1>
            <p className="text-muted-foreground text-base ml-14">Find your next engineering opportunity in Saudi Arabia</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="default"
              onClick={() => setViewMode('list')}
              className="shadow-sm hover:shadow-md transition-all"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewMode === 'map' ? 'default' : 'outline'} 
              size="default"
              onClick={() => setViewMode('map')}
              className="shadow-sm hover:shadow-md transition-all"
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Map
            </Button>
            <Button variant="outline" size="default" className="shadow-sm hover:shadow-md transition-all">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
            <Button size="default" className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
              <Briefcase className="h-4 w-4 mr-2" />
              Job Alerts
            </Button>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: 'Available Jobs', count: mockJobs.filter(j => j.status === 'open').length, color: 'text-primary' },
          { icon: Send, label: 'Applied', count: mockJobs.filter(j => j.status === 'applied').length, color: 'text-primary' },
          { icon: CheckCircle2, label: 'Shortlisted', count: mockJobs.filter(j => j.status === 'shortlisted').length, color: 'text-primary' },
          { icon: Bookmark, label: 'Bookmarked', count: mockJobs.filter(j => j.isBookmarked).length, color: 'text-primary' }
        ].map((stat, index) => (
          <Card 
            key={index}
            className="relative overflow-hidden transition-all duration-300 cursor-pointer"
            style={{
              border: '2px solid transparent',
              borderRadius: '0.5rem',
              backgroundImage: `
                linear-gradient(hsl(var(--card)), hsl(var(--card))),
                linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, transparent 60%)
              `,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15), 0 0 15px hsl(var(--primary) / 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-xl ring-1 ring-primary/20">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold tracking-tight">{stat.count}</p>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Saved Searches - Now below stats */}
      <SavedSearchFilters />

      {/* Main Content - Full Width */}
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="available">Available Jobs ({mockJobs.filter(j => j.status === 'open').length})</TabsTrigger>
              <TabsTrigger value="applied">Applied ({mockJobs.filter(j => j.status === 'applied').length})</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted ({mockJobs.filter(j => j.status === 'shortlisted').length})</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked ({mockJobs.filter(j => j.isBookmarked).length})</TabsTrigger>
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
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {jobCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
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
                  {/* Job Card - Full Width */}
                  <Card className="relative overflow-hidden transition-all duration-300"
                    style={{
                      border: '2px solid transparent',
                      borderRadius: '0.5rem',
                      backgroundImage: `
                        linear-gradient(hsl(var(--card)), hsl(var(--card))),
                        linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, transparent 50%)
                      `,
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <CardContent className="p-7">
                      {/* Job Details - Enhanced Layout */}
                      <div className="space-y-4">
                        {/* Title Row */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2.5">
                              <Briefcase className="h-5 w-5 text-primary" />
                              <h3 className="font-bold text-xl tracking-tight">{job.title}</h3>
                              <Badge variant="outline" className="ml-1 font-medium">{job.type.replace('-', ' ')}</Badge>
                            </div>
                            <button
                              className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5 transition-colors"
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

                        {/* Metadata Row - Better Spacing */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground py-3 border-y border-border/30">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {job.experience}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}
                              </div>
                            )}
                            {job.budget && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {job.budget.toLocaleString()} {job.salary?.currency || 'SAR'}
                              </div>
                            )}
                            {job.clientRating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {job.clientRating}
                              </div>
                            )}
                          </div>

                        {/* Description - Better Typography */}
                        <p className="text-sm leading-relaxed text-foreground/80 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Skills - Enhanced */}
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs font-medium px-3 py-1.5 rounded-md">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 4 && (
                            <Badge variant="secondary" className="text-xs font-medium px-3 py-1.5 rounded-md bg-primary/10 text-primary border-primary/20">
                              +{job.skills.length - 4} more
                            </Badge>
                          )}
                        </div>

                        {/* Dates - Enhanced */}
                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Posted {job.postedDate}</span>
                          </div>
                          <span className="text-border">•</span>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                            <span>Deadline {job.deadline}</span>
                          </div>
                        </div>

                        {/* Actions - Enhanced */}
                        <div className="flex gap-3 pt-2">
                          <Button 
                            size="default"
                            variant="outline"
                            onClick={() => setSelectedJob(job)}
                            className="flex-1 sm:flex-none shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            size="default"
                            onClick={() => {
                              setSelectedJob(job);
                              setShowQuickApply(true);
                            }}
                            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Quick Apply
                          </Button>
                          <Button
                            size="default"
                            variant="ghost"
                            onClick={() => {/* toggle bookmark */}}
                            className="hover:bg-primary/10 transition-colors"
                          >
                            <Bookmark className={`h-5 w-5 ${job.isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Tools Section - Enhanced Layout */}
                  <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-muted/30 via-muted/20 to-background border border-border/40 shadow-sm">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg ring-1 ring-primary/20">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">AI-Powered Job Insights</h3>
                          <p className="text-xs text-muted-foreground">Swipe to explore intelligent analysis</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-medium">
                        4 Tools Available
                      </Badge>
                    </div>

                    {/* Scrollable Container with Arrows */}
                    <div className="relative">
                      {/* Left Arrow - Enhanced */}
                      {showLeftArrow && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/98 backdrop-blur-md shadow-xl border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                          onClick={() => scrollToCard('left')}
                        >
                          <ChevronLeft className="h-6 w-6 text-primary" />
                        </Button>
                      )}

                      {/* Right Arrow - Enhanced */}
                      {showRightArrow && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/98 backdrop-blur-md shadow-xl border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                          onClick={() => scrollToCard('right')}
                        >
                          <ChevronRight className="h-6 w-6 text-primary" />
                        </Button>
                      )}

                      {/* Cards Container */}
                      <XScroll>
                        <div 
                          ref={scrollContainerRef}
                          className="flex gap-5 px-2 py-6 ai-tools-scroll"
                          style={{
                            scrollSnapType: 'x mandatory',
                            scrollBehavior: 'smooth',
                          }}
                        >
                        <div className="min-w-[400px] w-[400px] shrink-0 snap-start min-h-[520px]">
                          <AIJobMatchScore 
                            jobId={job.id}
                            jobSkills={job.skills}
                            overallMatch={job.id === '1' ? 92 : job.id === '2' ? 85 : 78}
                          />
                        </div>
                        
                        <div className="min-w-[400px] w-[400px] shrink-0 snap-start min-h-[520px]">
                          <EarningsCalculator
                            jobSalary={job.salary}
                            jobBudget={job.budget}
                            jobType={job.type}
                          />
                        </div>

                        <div className="min-w-[400px] w-[400px] shrink-0 snap-start min-h-[520px]">
                          <SkillsGapAnalysis 
                            jobSkills={job.skills}
                          />
                        </div>

                        <div className="min-w-[400px] w-[400px] shrink-0 snap-start min-h-[520px]">
                          <SimilarJobsRecommendations
                            currentJobId={job.id}
                            currentJobSkills={job.skills}
                            currentJobCategory={job.category}
                          />
                        </div>
                      </div>
                      </XScroll>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Applied Jobs Tab */}
        <TabsContent value="applied" className="space-y-4">
          <div className="space-y-4">
            {mockJobs.filter(job => job.status === 'applied').map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <Badge className={getStatusColor(job.status)}>
                              {getStatusIcon(job.status)}
                              <span className="ml-1 capitalize">{job.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                          <p className="text-sm text-muted-foreground mb-3">{job.location}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Applied on {job.postedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        View Application
                      </Button>
                    </div>
                  </div>
                  
                  {/* Application Status Tracker */}
                  <div className="mt-4 border-t pt-4">
                    <ApplicationStatusTracker
                      jobTitle={job.title}
                      company={job.company}
                      applicationDate={job.postedDate}
                      currentStage={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shortlisted Jobs Tab */}
        <TabsContent value="shortlisted" className="space-y-4">
          <div className="space-y-4">
            {mockJobs.filter(job => job.status === 'shortlisted').map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <Badge className={getStatusColor(job.status)}>
                              {getStatusIcon(job.status)}
                              <span className="ml-1 capitalize">{job.status}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                          <p className="text-sm text-muted-foreground mb-3">{job.location}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Shortlisted on {job.postedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm">
                        Contact Client
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bookmarked Jobs Tab */}
        <TabsContent value="bookmarked" className="space-y-4">
          <div className="space-y-4">
            {mockJobs.filter(job => job.isBookmarked).map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <Badge variant="outline">
                              <Bookmark className="h-3 w-3 mr-1" />
                              Bookmarked
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                          <p className="text-sm text-muted-foreground mb-3">{job.location}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Posted {job.postedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Bookmark className="h-3 w-3 fill-current" />
                      </Button>
                      <Button size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
        </>
      )}
    </div>
  );
}
