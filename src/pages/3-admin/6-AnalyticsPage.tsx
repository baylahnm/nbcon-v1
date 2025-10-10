import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/pages/1-HomePage/others/components/ui/card';
import { Button } from '@/pages/1-HomePage/others/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/pages/1-HomePage/others/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FolderOpen, 
  DollarSign, 
  MessageSquare,
  Download,
  Calendar,
  Target,
  Activity
} from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const mockStats = {
    totalUsers: 1250,
    activeUsers: 890,
    totalProjects: 340,
    completedProjects: 280,
    totalRevenue: 2500000,
    monthlyRevenue: 180000,
    totalMessages: 5600,
    responseTime: '2.5 hours'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Platform performance and user analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.totalProjects.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">{mockStats.totalRevenue.toLocaleString()} SAR</p>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Growth</CardTitle>
                <CardDescription>Monthly user registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p>User Growth Chart</p>
                    <p className="text-sm">+15% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Completion Rate</CardTitle>
                <CardDescription>Success rate of platform projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Target className="h-12 w-12 mx-auto mb-2" />
                    <p>Completion Rate: 82%</p>
                    <p className="text-sm">Above industry average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Engineers</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Clients</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Enterprises</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Today</span>
                    <span className="text-sm font-medium">245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="text-sm font-medium">890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="text-sm font-medium">1,250</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg. Session</span>
                    <span className="text-sm font-medium">12 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pages/Session</span>
                    <span className="text-sm font-medium">8.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bounce Rate</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Structural Engineering</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Civil Engineering</span>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Electrical Engineering</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mechanical Engineering</span>
                    <span className="text-sm font-medium">17%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Progress</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cancelled</span>
                    <span className="text-sm font-medium">4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Disputed</span>
                    <span className="text-sm font-medium">2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p>Revenue Growth</p>
                    <p className="text-sm">+25% this quarter</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Platform Fees</span>
                    <span className="text-sm font-medium">125,000 SAR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Premium Subscriptions</span>
                    <span className="text-sm font-medium">45,000 SAR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Advertising</span>
                    <span className="text-sm font-medium">10,000 SAR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Other</span>
                    <span className="text-sm font-medium">5,000 SAR</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

