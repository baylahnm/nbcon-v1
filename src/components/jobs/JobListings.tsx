import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Bookmark,
  Briefcase,
  Clock,
  Filter
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  location: string;
  salary: string;
  type: string;
  skills: string[];
  description: string;
  postedDate: string;
  status: string;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Structural Engineer - High-rise Building Assessment',
    company: 'Saudi Binladin Group',
    companyInitials: 'SB',
    location: 'Riyadh, Saudi Arabia',
    salary: '25,000 - 35,000 SAR',
    type: 'Contract',
    skills: ['Structural Analysis', 'AutoCAD', 'SAP2000', 'ETABS', 'Steel Design'],
    description: 'Conduct structural integrity assessment for 40-story commercial tower. Requires SCE certification and 8+ years experience in high-rise structures. Project duration: 3 months.',
    postedDate: '2 days ago',
    status: 'open'
  },
  {
    id: '2',
    title: 'Civil Engineer - NEOM Infrastructure',
    company: 'NEOM Development Authority',
    companyInitials: 'ND',
    location: 'NEOM, Saudi Arabia',
    salary: '18,000 - 28,000 SAR',
    type: 'Full-time',
    skills: ['Infrastructure Design', 'Smart Cities', 'BIM', 'Project Management', 'Urban Planning'],
    description: 'Join the NEOM megaproject team for infrastructure development. Work on roads, utilities, and smart city infrastructure. Innovative project with cutting-edge technology.',
    postedDate: '1 week ago',
    status: 'open'
  },
  {
    id: '3',
    title: 'Electrical Engineer - Solar Farm Inspection',
    company: 'ACWA Power',
    companyInitials: 'AC',
    location: 'Sakaka, Saudi Arabia',
    salary: '300 - 450 SAR/day',
    type: 'Contract',
    skills: ['Electrical Systems', 'Solar Power', 'Power Systems', 'Grid Integration', 'Renewable Energy'],
    description: '2-week inspection contract for 300MW solar power plant. Evaluate electrical systems, inverters, and grid connections. Transportation and accommodation provided.',
    postedDate: '3 days ago',
    status: 'open'
  },
  {
    id: '4',
    title: 'Mechanical Engineer - HVAC System Design',
    company: 'Al-Rashid Trading & Contracting',
    companyInitials: 'AR',
    location: 'Jeddah, Saudi Arabia',
    salary: '15,000 - 22,000 SAR',
    type: 'Full-time',
    skills: ['HVAC Design', 'Energy Efficiency', 'Building Codes', 'Load Calculations', 'System Integration'],
    description: 'Design and optimize HVAC systems for large commercial buildings. Focus on energy efficiency and compliance with Saudi building codes.',
    postedDate: '5 days ago',
    status: 'open'
  },
  {
    id: '5',
    title: 'Geotechnical Engineer - Foundation Analysis',
    company: 'Dar Al-Handasah',
    companyInitials: 'DH',
    location: 'Dammam, Saudi Arabia',
    salary: '20,000 - 30,000 SAR',
    type: 'Contract',
    skills: ['Soil Mechanics', 'Foundation Design', 'Geotechnical Investigation', 'Pile Design', 'Slope Stability'],
    description: 'Soil investigation and foundation design for petrochemical facility expansion. Requires experience with industrial foundations and Saudi geological conditions.',
    postedDate: '1 day ago',
    status: 'open'
  },
  {
    id: '6',
    title: 'Environmental Engineer - Water Treatment',
    company: 'National Water Company',
    companyInitials: 'NW',
    location: 'Mecca, Saudi Arabia',
    salary: '16,000 - 24,000 SAR',
    type: 'Full-time',
    skills: ['Water Treatment', 'Environmental Compliance', 'Process Design', 'Waste Management', 'Quality Control'],
    description: 'Design and monitor water treatment processes for municipal water supply. Ensure compliance with environmental regulations and water quality standards.',
    postedDate: '4 days ago',
    status: 'open'
  },
  {
    id: '7',
    title: 'Site Inspection Engineer - Residential Complex',
    company: 'Emaar The Economic City',
    companyInitials: 'EM',
    location: 'King Abdullah Economic City',
    salary: '250 - 350 SAR/day',
    type: 'Part-time',
    skills: ['Site Inspection', 'Quality Control', 'Construction Management', 'Safety Protocols', 'Documentation'],
    description: 'Part-time site inspection for residential villa development. Flexible schedule, perfect for experienced engineers seeking additional income. Weekly site visits required.',
    postedDate: '6 days ago',
    status: 'open'
  },
  {
    id: '8',
    title: 'Industrial Engineer - Manufacturing Process Optimization',
    company: 'SABIC',
    companyInitials: 'SB',
    location: 'Jubail, Saudi Arabia',
    salary: '22,000 - 32,000 SAR',
    type: 'Contract',
    skills: ['Process Optimization', 'Lean Manufacturing', 'Industrial Safety', 'Six Sigma', 'Automation'],
    description: '6-month contract to optimize manufacturing processes in petrochemical plant. Focus on efficiency improvement and waste reduction. Experience with lean manufacturing required.',
    postedDate: '2 days ago',
    status: 'open'
  }
];

const jobTypes = [
  { value: 'all', label: 'All Jobs' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'part-time', label: 'Part-time' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'salary-high', label: 'Salary: High to Low' },
  { value: 'salary-low', label: 'Salary: Low to High' }
];

export default function JobListings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = jobTypeFilter === 'all' || job.type.toLowerCase() === jobTypeFilter;
    
    return matchesSearch && matchesType;
  });

  const getJobTypeColor = (type: string) => {
    const colors = {
      'Full-time': 'bg-blue-100 text-blue-800',
      'Contract': 'bg-green-100 text-green-800',
      'Part-time': 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search engineering projects by discipline, location, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select 
                value={jobTypeFilter} 
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="px-3 py-2 border border-sidebar-border rounded-md text-sm h-10 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {jobTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-sidebar-border rounded-md text-sm h-10 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Button variant="outline" size="sm" className="h-10 px-3">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} jobs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {job.companyInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {job.postedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm" className="bg-gradient-primary">
                    Submit Proposal
                  </Button>
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
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setJobTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
