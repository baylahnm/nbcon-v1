import { useState } from "react";
import { 
  Brain,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Filter,
  ChevronRight,
  Building,
  Calendar,
  Users,
  Zap,
  TrendingUp,
  Target,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Sliders,
  CheckCircle,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface AIJobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "site-inspection" | "design" | "consultation" | "full-project";
  matchScore: number;
  salary: string;
  duration: string;
  urgency: "low" | "medium" | "high";
  skills: string[];
  description: string;
  postedTime: string;
  aiReason: string;
  projectSize: "small" | "medium" | "large";
  isBookmarked: boolean;
  isApplied: boolean;
}

const sampleRecommendations: AIJobRecommendation[] = [
  {
    id: "1",
    title: "NEOM Smart City Infrastructure Assessment",
    company: "NEOM Development",
    location: "NEOM, Tabuk Province",
    type: "site-inspection",
    matchScore: 98,
    salary: "85,000 SAR",
    duration: "2 weeks",
    urgency: "high",
    skills: ["Smart Infrastructure", "IoT Systems", "Urban Planning"],
    description: "Comprehensive assessment of smart city infrastructure components including IoT networks, automated systems, and sustainable energy integration for NEOM's first phase development.",
    postedTime: "2 hours ago",
    aiReason: "Perfect match for your smart city expertise and previous IoT project experience with 98% skill alignment.",
    projectSize: "large",
    isBookmarked: false,
    isApplied: false
  },
  {
    id: "2", 
    title: "Aramco Refinery Mechanical Systems Design",
    company: "Saudi Aramco",
    location: "Ras Tanura, Eastern Province",
    type: "design",
    matchScore: 94,
    salary: "120,000 SAR",
    duration: "3 months",
    urgency: "medium",
    skills: ["Mechanical Design", "Process Engineering", "AutoCAD"],
    description: "Design and optimize mechanical systems for new refinery expansion including heat exchangers, pumps, and piping systems with focus on efficiency and safety standards.",
    postedTime: "5 hours ago",
    aiReason: "Strong match based on your mechanical engineering background and previous Aramco project success.",
    projectSize: "large",
    isBookmarked: true,
    isApplied: false
  },
  {
    id: "3",
    title: "Red Sea Development Marine Engineering Consultation",
    company: "Red Sea Global",
    location: "Red Sea Coast, Tabuk",
    type: "consultation",
    matchScore: 89,
    salary: "45,000 SAR",
    duration: "3 weeks",
    urgency: "medium",
    skills: ["Marine Engineering", "Environmental Impact", "Coastal Design"],
    description: "Provide expert consultation on marine infrastructure development including port facilities, underwater structures, and environmental protection measures.",
    postedTime: "1 day ago",
    aiReason: "Matches your coastal engineering specialization and environmental assessment experience.",
    projectSize: "medium",
    isBookmarked: false,
    isApplied: true
  },
  {
    id: "4",
    title: "AlUla Heritage Site Structural Preservation",
    company: "Royal Commission for AlUla",
    location: "AlUla, Medina Province",
    type: "full-project",
    matchScore: 91,
    salary: "95,000 SAR",
    duration: "4 months",
    urgency: "low",
    skills: ["Structural Engineering", "Heritage Preservation", "Materials Science"],
    description: "Lead structural preservation project for ancient stone structures while implementing modern reinforcement techniques that respect historical authenticity.",
    postedTime: "3 days ago",
    aiReason: "Excellent fit for your structural expertise combined with cultural heritage project experience.",
    projectSize: "large",
    isBookmarked: true,
    isApplied: false
  },
  {
    id: "5",
    title: "SABIC Chemical Plant Safety Systems Upgrade",
    company: "SABIC",
    location: "Jubail Industrial City",
    type: "design",
    matchScore: 87,
    salary: "75,000 SAR",
    duration: "6 weeks",
    urgency: "high",
    skills: ["Safety Systems", "Chemical Engineering", "Process Control"],
    description: "Upgrade and modernize safety systems for chemical processing plant including emergency shutdown systems, gas detection networks, and automated safety protocols.",
    postedTime: "4 hours ago",
    aiReason: "Aligns with your chemical safety expertise and previous SABIC collaboration history.",
    projectSize: "medium",
    isBookmarked: false,
    isApplied: false
  },
  {
    id: "6",
    title: "Riyadh Metro Extension Electrical Systems",
    company: "Riyadh Development Authority",
    location: "Riyadh, Riyadh Province",
    type: "site-inspection",
    matchScore: 92,
    salary: "55,000 SAR",
    duration: "4 weeks",
    urgency: "medium",
    skills: ["Electrical Systems", "Railway Engineering", "Power Distribution"],
    description: "Inspect and validate electrical infrastructure for metro line extension including power distribution, signaling systems, and station electrical installations.",
    postedTime: "6 hours ago",
    aiReason: "Perfect match for your electrical engineering background and public transportation project experience.",
    projectSize: "large",
    isBookmarked: false,
    isApplied: false
  }
];

export function AIJobRecommendationsContent() {
  const [recommendations, setRecommendations] = useState<AIJobRecommendation[]>(sampleRecommendations);
  const [filters, setFilters] = useState({
    searchTerm: "",
    jobType: "all",
    location: "all",
    urgency: "all",
    matchScore: [80],
    projectSize: "all",
    showOnlyBookmarked: false
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground border-sidebar-border";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "site-inspection": return <CheckCircle className="w-4 h-4" />;
      case "design": return <Target className="w-4 h-4" />;
      case "consultation": return <Users className="w-4 h-4" />;
      case "full-project": return <Building className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const toggleBookmark = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, isBookmarked: !rec.isBookmarked } : rec
      )
    );
  };

  const applyToJob = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, isApplied: true } : rec
      )
    );
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filters.searchTerm && !rec.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !rec.company.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    if (filters.jobType !== "all" && rec.type !== filters.jobType) return false;
    if (filters.location !== "all" && !rec.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.urgency !== "all" && rec.urgency !== filters.urgency) return false;
    if (rec.matchScore < filters.matchScore[0]) return false;
    if (filters.projectSize !== "all" && rec.projectSize !== filters.projectSize) return false;
    if (filters.showOnlyBookmarked && !rec.isBookmarked) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            AI Job Recommendations
          </h2>
          <p className="text-muted-foreground text-sm">
            Personalized job matches powered by AI based on your skills, experience, and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Sliders className="w-4 h-4 mr-2" />
            AI Preferences
          </Button>
        </div>
      </div>

      {/* AI Insights Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">98%</div>
              <p className="text-sm text-muted-foreground">Top Match Score</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">6</div>
              <p className="text-sm text-muted-foreground">New Matches Today</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-sm text-muted-foreground">Urgent Opportunities</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <p className="text-sm text-muted-foreground">Profile Completeness</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters & Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search jobs..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>

            <div>
              <Label>Job Type</Label>
              <Select value={filters.jobType} onValueChange={(value) => setFilters(prev => ({ ...prev, jobType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="site-inspection">Site Inspection</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="full-project">Full Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Location</Label>
              <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="riyadh">Riyadh</SelectItem>
                  <SelectItem value="jeddah">Jeddah</SelectItem>
                  <SelectItem value="dammam">Dammam</SelectItem>
                  <SelectItem value="neom">NEOM</SelectItem>
                  <SelectItem value="red sea">Red Sea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Urgency</Label>
              <Select value={filters.urgency} onValueChange={(value) => setFilters(prev => ({ ...prev, urgency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Project Size</Label>
              <Select value={filters.projectSize} onValueChange={(value) => setFilters(prev => ({ ...prev, projectSize: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Min Match Score: {filters.matchScore[0]}%</Label>
              <Slider
                value={filters.matchScore}
                onValueChange={(value) => setFilters(prev => ({ ...prev, matchScore: value }))}
                max={100}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  id="bookmarked"
                  checked={filters.showOnlyBookmarked}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showOnlyBookmarked: checked }))}
                />
                <Label htmlFor="bookmarked" className="text-sm">Show only bookmarked</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recommended Jobs</h3>
          <p className="text-muted-foreground text-sm">{filteredRecommendations.length} personalized matches found</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Sorted by AI Match Score
          </Badge>
        </div>
      </div>

      {/* Job Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations
          .sort((a, b) => b.matchScore - a.matchScore)
          .map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(job.type)}
                      <h4 className="text-lg font-semibold">{job.title}</h4>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getUrgencyColor(job.urgency)} border`}
                    >
                      {job.urgency} urgency
                    </Badge>
                    {job.isApplied && (
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        Applied
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {job.postedTime}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-lg font-bold text-green-600">{job.matchScore}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">AI Match</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(job.id)}
                    className="p-2"
                  >
                    {job.isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{job.description}</p>

              <div className="bg-info/10 p-3 rounded-lg mb-4 border border-info/20">
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-info mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-info">AI Recommendation Insight</p>
                    <p className="text-sm text-info/80">{job.aiReason}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  {!job.isApplied ? (
                    <Button 
                      size="sm"
                      onClick={() => applyToJob(job.id)}
                      variant="default"
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" disabled>
                      Applied
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No matching recommendations</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or update your profile to get better AI recommendations.
            </p>
            <Button variant="outline">
              Update AI Preferences
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
