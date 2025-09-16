import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Briefcase,
  Plus,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  MessageSquare,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  job_type: string;
  budget_min: number;
  budget_max?: number;
  currency: string;
  location_city: string;
  location_region: string;
  priority: string;
  status: string;
  created_at: string;
  start_date?: string;
  end_date?: string;
  estimated_duration?: number;
  skills_required: string[];
}

const statusFilters = [
  { value: 'all', label: 'All Jobs' },
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function JobsList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuthStore();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('my-jobs');

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user, statusFilter]);

  const fetchJobs = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      let query = supabase
        .from('jobs')
        .select('*');

      if (profile?.role === 'client') {
        // Clients see their own jobs
        query = query.eq('client_id', user.id);
      } else if (profile?.role === 'engineer') {
        // Engineers see available jobs and their assigned jobs
        if (activeTab === 'my-jobs') {
          query = query.eq('assigned_engineer_id', user.id);
        } else {
          query = query.in('status', ['open', 'quoted']);
        }
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setJobs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    !searchTerm || 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      open: { variant: 'default' as const, label: 'Open', className: 'bg-success text-success-foreground' },
      quoted: { variant: 'default' as const, label: 'Quoted', className: 'bg-info text-info-foreground' },
      in_progress: { variant: 'default' as const, label: 'In Progress', className: 'bg-warning text-warning-foreground' },
      completed: { variant: 'outline' as const, label: 'Completed' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
      disputed: { variant: 'destructive' as const, label: 'Disputed' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant} className={('className' in config) ? config.className : ''}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'emergency') {
      return <AlertTriangle className="h-3 w-3 text-destructive" />;
    }
    return null;
  };

  const formatBudget = (min: number, max?: number, currency: string = 'SAR') => {
    if (max && max !== min) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
    return `${currency} ${min.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SA');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Jobs</h1>
            <p className="text-muted-foreground">Manage your engineering projects</p>
          </div>
        </div>
        
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            {profile?.role === 'client' ? 'My Jobs' : 'Available Jobs'}
          </h1>
          <p className="text-muted-foreground">
            {profile?.role === 'client' 
              ? 'Manage your posted engineering projects' 
              : 'Find and apply for engineering opportunities'
            }
          </p>
        </div>
        
        {profile?.role === 'client' && (
          <Button onClick={() => navigate('/client/jobs/create')} className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        )}
      </div>

      {/* Tabs for Engineers */}
      {profile?.role === 'engineer' && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="available" onClick={() => setActiveTab('available')}>
              Available Jobs
            </TabsTrigger>
            <TabsTrigger value="my-jobs" onClick={() => setActiveTab('my-jobs')}>
              My Projects
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6 shadow-md">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    {getPriorityIcon(job.priority)}
                    {getStatusBadge(job.status)}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location_city}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatBudget(job.budget_min, job.budget_max, job.currency)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Posted {formatDate(job.created_at)}
                    </span>
                    {job.estimated_duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.estimated_duration} days
                      </span>
                    )}
                  </div>

                  {job.skills_required.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.skills_required.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills_required.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills_required.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  
                  {profile?.role === 'engineer' && job.status === 'open' && (
                    <Button size="sm" className="bg-gradient-primary">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Submit Quote
                    </Button>
                  )}

                  {profile?.role === 'client' && job.status === 'draft' && (
                    <Button size="sm" variant="secondary">
                      Publish Job
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {profile?.role === 'client' ? 'No jobs posted yet' : 'No jobs available'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {profile?.role === 'client' 
                ? 'Start by creating your first job posting to connect with engineers.'
                : 'Check back later for new job opportunities that match your skills.'
              }
            </p>
            {profile?.role === 'client' && (
              <Button onClick={() => navigate('/client/jobs/create')} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}