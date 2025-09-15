import { KPICard } from '@/components/dashboard/KPICard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth';
import { 
  Briefcase, 
  MessageSquare, 
  DollarSign, 
  Users,
  Plus,
  Star,
  MapPin,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function ClientDashboard() {
  const { profile } = useAuthStore();

  // Mock data - will be replaced with real data later
  const kpis = [
    {
      title: "Active Jobs",
      value: 4,
      subtitle: "In progress",
      icon: <Briefcase className="h-4 w-4" />,
      variant: "primary" as const,
    },
    {
      title: "Awaiting Quotes",
      value: 2,
      subtitle: "Posted today",
      icon: <MessageSquare className="h-4 w-4" />,
      variant: "accent" as const,
    },
    {
      title: "Total Spent",
      value: "SAR 15,230",
      trend: { value: 8, isPositive: false },
      icon: <DollarSign className="h-4 w-4" />,
      variant: "success" as const,
    },
    {
      title: "Trusted Engineers",
      value: 7,
      subtitle: "In your network",
      icon: <Users className="h-4 w-4" />,
      variant: "warning" as const,
    },
  ];

  const activeJobs = [
    {
      id: 1,
      title: "Foundation Inspection - New Villa",
      engineer: {
        name: "Ahmed Al-Rashid",
        avatar: "AR",
        rating: 4.9,
        specialization: "Structural Engineer"
      },
      status: "in_progress" as const,
      progress: 65,
      nextMilestone: "Site Visit - Dec 18",
      amount: "SAR 3,500",
      location: "Al Nakheel, Riyadh"
    },
    {
      id: 2,
      title: "Electrical System Upgrade Design",
      engineer: {
        name: "Fatima Al-Zahra",
        avatar: "FZ",
        rating: 4.8,
        specialization: "Electrical Engineer"
      },
      status: "quoted" as const,
      progress: 0,
      nextMilestone: "Quote Review",
      amount: "SAR 2,200",
      location: "King Fahd District, Riyadh"
    },
  ];

  const awaitingQuotes = [
    {
      id: 1,
      title: "HVAC System Assessment",
      category: "Mechanical Engineering",
      location: "Olaya, Riyadh",
      postedDate: "2 hours ago",
      budget: "SAR 1,500 - SAR 2,500",
      responses: 3,
    },
    {
      id: 2,
      title: "Plumbing System Review",
      category: "Civil Engineering",
      location: "Al Malaz, Riyadh",
      postedDate: "5 hours ago",
      budget: "SAR 800 - SAR 1,200",
      responses: 1,
    },
  ];

  const recommendedEngineers = [
    {
      id: 1,
      name: "Omar Al-Saudi",
      specialization: "Civil Engineer",
      rating: 4.9,
      reviews: 127,
      hourlyRate: "SAR 150/hr",
      location: "Riyadh",
      avatar: "OS",
      verified: true,
    },
    {
      id: 2,
      name: "Nadia Al-Mahmoud",
      specialization: "Mechanical Engineer",
      rating: 4.8,
      reviews: 89,
      hourlyRate: "SAR 120/hr",
      location: "Riyadh",
      avatar: "NM",
      verified: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-warning text-warning-foreground">In Progress</Badge>;
      case 'quoted':
        return <Badge variant="outline">Quoted</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.first_name || 'Client'}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your projects and find qualified engineers for your needs.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Jobs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Active Jobs
                </CardTitle>
                <CardDescription>
                  Track progress on your ongoing projects
                </CardDescription>
              </div>
              <Button size="sm" className="bg-gradient-primary">
                <Plus className="h-3 w-3 mr-1" />
                New Job
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 space-y-4 hover:shadow-soft transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{job.location}</p>
                      
                      {/* Engineer Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                            {job.engineer.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{job.engineer.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{job.engineer.specialization}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-accent" />
                              <span>{job.engineer.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      {job.status === 'in_progress' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{job.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Next: </span>
                      <span className="font-medium">{job.nextMilestone}</span>
                    </div>
                    <span className="text-sm font-medium text-primary">{job.amount}</span>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              ))}

              {/* Awaiting Quotes Section */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-accent" />
                  Awaiting Quotes
                </h4>
                <div className="space-y-3">
                  {awaitingQuotes.map((job) => (
                    <div key={job.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium">{job.title}</h5>
                        <Badge variant="outline" className="text-xs">
                          {job.responses} quotes
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{job.category}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-primary">{job.budget}</span>
                        <span className="text-xs text-muted-foreground">{job.postedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Engineers */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Recommended Engineers
              </CardTitle>
              <CardDescription>
                Top-rated professionals in your area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedEngineers.map((engineer) => (
                <div key={engineer.id} className="border rounded-lg p-3 space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {engineer.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium">{engineer.name}</h4>
                        {engineer.verified && (
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{engineer.specialization}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-accent" />
                          <span>{engineer.rating} ({engineer.reviews})</span>
                        </div>
                        <span className="text-muted-foreground">{engineer.location}</span>
                      </div>
                      <p className="text-xs font-medium text-primary mt-1">{engineer.hourlyRate}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Profile
                  </Button>
                </div>
              ))}

              <Button variant="ghost" className="w-full mt-4">
                Browse All Engineers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}