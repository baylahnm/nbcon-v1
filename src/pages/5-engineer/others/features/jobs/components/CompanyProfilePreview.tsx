import { useEffect, useRef } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "../../../../../1-HomePage/others/components/ui/dialog";
import { Card } from "../../../../../1-HomePage/others/components/ui/card";
import { Badge } from "../../../../../1-HomePage/others/components/ui/badge";
import { Button } from "../../../../../1-HomePage/others/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../1-HomePage/others/components/ui/tabs";
import { 
  Building, 
  MapPin, 
  Users,
  Star,
  Briefcase,
  DollarSign,
  Award,
  ExternalLink,
  Globe
} from "lucide-react";

interface CompanyProfile {
  name: string;
  logo?: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
  rating: number;
  reviewCount: number;
  activeJobs: number;
  avgSalary: { min: number; max: number };
  benefits: string[];
  culture: string[];
  recentProjects: Array<{ name: string; value: string }>;
}

interface CompanyProfilePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
}

export function CompanyProfilePreview({ 
  open, 
  onOpenChange,
  companyName 
}: CompanyProfilePreviewProps) {
  // Mock company data
  const companyProfile: CompanyProfile = {
    name: companyName,
    industry: "Oil & Gas / Energy",
    size: "10,000+ employees",
    location: "Riyadh, Saudi Arabia",
    website: "www.aramco.com",
    description: "Saudi Aramco is one of the world's leading integrated energy and chemicals companies. We create value across the hydrocarbon chain, and deliver societal and economic benefits to people and communities around the globe.",
    rating: 4.8,
    reviewCount: 1247,
    activeJobs: 23,
    avgSalary: { min: 18000, max: 35000 },
    benefits: [
      "Health Insurance",
      "Annual Bonus",
      "Housing Allowance",
      "Transportation",
      "Professional Development",
      "Paid Vacation"
    ],
    culture: [
      "Innovation-Driven",
      "Safety-First",
      "Collaborative",
      "Growth Opportunities"
    ],
    recentProjects: [
      { name: "Jafurah Gas Field Development", value: "Advanced gas processing" },
      { name: "Ras Tanura Refinery Expansion", value: "Capacity increase project" },
      { name: "NEOM Renewable Energy", value: "Green hydrogen initiative" }
    ]
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold">{companyProfile.name}</div>
              <div className="text-sm font-normal text-muted-foreground">{companyProfile.industry}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({companyProfile.activeJobs})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({companyProfile.reviewCount})</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Company Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold">{companyProfile.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>

              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-lg font-bold">{companyProfile.size}</div>
                <p className="text-xs text-muted-foreground">Employees</p>
              </div>

              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-lg font-bold">{companyProfile.activeJobs}</div>
                <p className="text-xs text-muted-foreground">Active Jobs</p>
              </div>

              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-lg font-bold">{companyProfile.reviewCount}</div>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </div>

            {/* About */}
            <div>
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-sm text-muted-foreground">{companyProfile.description}</p>
            </div>

            {/* Salary Range */}
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-sm">Average Salary Range</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {companyProfile.avgSalary.min.toLocaleString()} - {companyProfile.avgSalary.max.toLocaleString()} SAR
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per month for engineering roles</p>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Benefits & Perks
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {companyProfile.benefits.map((benefit) => (
                  <Badge key={benefit} variant="secondary" className="justify-center py-2">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Company Culture */}
            <div>
              <h4 className="font-semibold mb-3">Company Culture</h4>
              <div className="flex flex-wrap gap-2">
                {companyProfile.culture.map((trait) => (
                  <Badge key={trait} variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div>
              <h4 className="font-semibold mb-3">Recent Projects</h4>
              <div className="space-y-2">
                {companyProfile.recentProjects.map((project, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="font-medium text-sm">{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <a href={`https://${companyProfile.website}`} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Website
                </a>
              </Button>
              <Button className="flex-1">
                <Briefcase className="w-4 h-4 mr-2" />
                View All Jobs
              </Button>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Showing {companyProfile.activeJobs} active job openings from {companyProfile.name}
            </p>
            {/* Job listings would go here */}
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="font-medium text-sm">Engineering Role {i}</div>
                  <div className="text-xs text-muted-foreground mt-1">Riyadh, Saudi Arabia • Full-time</div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-3">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{companyProfile.rating}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${star <= Math.floor(companyProfile.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{companyProfile.reviewCount} reviews</p>
              </div>
            </div>

            {/* Sample reviews */}
            <div className="space-y-3">
              {[
                { rating: 5, title: "Great place to work", author: "Current Engineer", date: "2 weeks ago" },
                { rating: 4, title: "Good growth opportunities", author: "Former Engineer", date: "1 month ago" },
                { rating: 5, title: "Excellent benefits", author: "Current Project Manager", date: "2 months ago" }
              ].map((review, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">• {review.date}</span>
                  </div>
                  <h5 className="font-medium text-sm mb-1">{review.title}</h5>
                  <p className="text-xs text-muted-foreground">{review.author}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

