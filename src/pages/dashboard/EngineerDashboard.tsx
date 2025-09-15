import { KPICard } from '@/components/dashboard/KPICard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth';
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function EngineerDashboard() {
  const { profile } = useAuthStore();

  // Mock data - will be replaced with real data later
  const kpis = [
    {
      title: "Jobs Nearby",
      value: 12,
      subtitle: "Within 25km",
      icon: <MapPin className="h-4 w-4" />,
      variant: "primary" as const,
    },
    {
      title: "Pending Quotes",
      value: 3,
      subtitle: "Awaiting response",
      icon: <Briefcase className="h-4 w-4" />,
      variant: "accent" as const,
    },
    {
      title: "This Month's Earnings",
      value: "SAR 8,450",
      trend: { value: 12, isPositive: true },
      icon: <DollarSign className="h-4 w-4" />,
      variant: "success" as const,
    },
    {
      title: "Active Projects",
      value: 2,
      subtitle: "In progress",
      icon: <Clock className="h-4 w-4" />,
      variant: "warning" as const,
    },
  ];

  const nearbyJobs = [
    {
      id: 1,
      title: "Structural Assessment - Residential Building",
      location: "Al Malaz, Riyadh",
      budget: "SAR 2,500 - SAR 4,000",
      category: "Structural Engineering",
      priority: "high" as const,
      distance: "3.2 km",
      postedDate: "2 hours ago",
    },
    {
      id: 2,
      title: "HVAC System Design Review",
      location: "King Fahd District, Riyadh",
      budget: "SAR 1,200 - SAR 2,000",
      category: "Mechanical Engineering",
      priority: "normal" as const,
      distance: "8.5 km",
      postedDate: "5 hours ago",
    },
    {
      id: 3,
      title: "Electrical Safety Inspection",
      location: "Olaya, Riyadh",
      budget: "SAR 800 - SAR 1,200",
      category: "Electrical Engineering",
      priority: "emergency" as const,
      distance: "12.1 km",
      postedDate: "1 day ago",
    },
  ];

  const upcomingMilestones = [
    {
      id: 1,
      project: "Villa Foundation Assessment",
      milestone: "Site Visit & Initial Report",
      dueDate: "Tomorrow, 2:00 PM",
      amount: "SAR 1,500",
      status: "pending" as const,
    },
    {
      id: 2,
      project: "Commercial Building Inspection",
      milestone: "Final Report Delivery",
      dueDate: "Dec 20, 2024",
      amount: "SAR 2,000",
      status: "in_progress" as const,
    },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return <Badge variant="destructive" className="text-xs">Emergency</Badge>;
      case 'high':
        return <Badge variant="secondary" className="text-xs bg-warning/20 text-warning-foreground">High</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Normal</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.first_name || 'Engineer'}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your engineering practice today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Jobs Near You */}
      <div className="w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Jobs Near You
              </CardTitle>
              <CardDescription>
                New opportunities in your service area
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 space-y-3 hover:shadow-soft transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{job.title}</h3>
                      {getPriorityBadge(job.priority)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{job.category}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span>{job.distance} away</span>
                      <span>{job.postedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{job.budget}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="bg-gradient-primary">
                      <Plus className="h-3 w-3 mr-1" />
                      Quote
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Milestones */}
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Upcoming Milestones
            </CardTitle>
            <CardDescription>
              Track your project progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMilestones.map((milestone) => (
              <div key={milestone.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(milestone.status)}
                  <h4 className="text-sm font-medium">{milestone.project}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{milestone.milestone}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{milestone.dueDate}</span>
                  <span className="font-medium text-primary">{milestone.amount}</span>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            ))}

            <Button variant="ghost" className="w-full mt-4">
              View All Milestones
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}